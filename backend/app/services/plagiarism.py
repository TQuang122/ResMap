"""
Plagiarism Checker Service
Ported from: https://github.com/cu-sanjay/Free-Turnitin-Plagiarism-Checker

This module provides plagiarism detection by:
1. Splitting text into sentences
2. Searching DuckDuckGo and CrossRef for each sentence
3. Fetching page content and calculating similarity
"""

import asyncio
import math
import random
import re
from typing import List, Dict, Set, Tuple
from urllib.parse import quote

import httpx
from bs4 import BeautifulSoup

from app.schemas.plagiarism import (
    PlagiarismCheckRequest,
    PlagiarismCheckResponse,
    SentenceResult,
    SourceMatch,
)


# User agents for rotation to avoid blocking
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
]

# Semaphore to limit concurrent requests
MAX_CONCURRENT_REQUESTS = 5


def get_random_user_agent() -> str:
    """Get a random user agent string."""
    return random.choice(USER_AGENTS)


def split_into_sentences(text: str, exclude_citations: bool = False) -> List[str]:
    """
    Split text into sentences for analysis.

    Args:
        text: The input text
        exclude_citations: If True, remove quoted text before splitting

    Returns:
        List of sentences with length > 20 characters
    """
    if exclude_citations:
        # Remove quoted text (both single and double quotes)
        text = re.sub(r'"[^"]*"', "", text)
        text = re.sub(r"'[^']*'", "", text)
        # Remove common citation patterns like (Author, Year)
        text = re.sub(r"\([^)]*\d{4}[^)]*\)", "", text)

    # Split by sentence-ending punctuation
    sentences = re.split(r"[.!?]+", text)

    # Clean and filter sentences
    return [s.strip() for s in sentences if s.strip() and len(s.strip()) > 20]


def calculate_cosine_similarity(text1: str, text2: str) -> float:
    """
    Calculate cosine similarity between two texts using word frequency vectors.

    Returns:
        Similarity score between 0 and 1
    """
    words1 = text1.lower().split()
    words2 = text2.lower().split()

    if not words1 or not words2:
        return 0.0

    # Create vocabulary
    all_words = list(set(words1 + words2))

    # Create frequency vectors
    vector1 = [words1.count(word) for word in all_words]
    vector2 = [words2.count(word) for word in all_words]

    # Calculate dot product and magnitudes
    dot_product = sum(v1 * v2 for v1, v2 in zip(vector1, vector2))
    magnitude1 = math.sqrt(sum(v * v for v in vector1))
    magnitude2 = math.sqrt(sum(v * v for v in vector2))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)


def calculate_ngram_similarity(text1: str, text2: str, n: int = 5) -> float:
    """
    Calculate n-gram similarity (Jaccard-like) between two texts.

    Args:
        text1: First text
        text2: Second text
        n: N-gram size (default 5 words)

    Returns:
        Similarity score between 0 and 1
    """

    def create_ngrams(text: str) -> Set[str]:
        # Clean and split into words
        words = re.sub(r"[^\w\s]", "", text.lower()).split()
        ngrams = set()
        for i in range(len(words) - n + 1):
            ngrams.add(" ".join(words[i : i + n]))
        return ngrams

    ngrams1 = create_ngrams(text1)
    ngrams2 = create_ngrams(text2)

    if not ngrams1 or not ngrams2:
        return 0.0

    # Count matches
    matches = len(ngrams1 & ngrams2)

    return matches / max(len(ngrams1), len(ngrams2))


async def search_duckduckgo(query: str, client: httpx.AsyncClient) -> List[str]:
    """
    Search DuckDuckGo HTML version for URLs matching the query.

    Returns:
        List of URLs found (max 8)
    """
    urls = []
    try:
        search_query = quote(query[:200])
        ddg_url = f"https://html.duckduckgo.com/html/?q={search_query}"

        response = await client.get(
            ddg_url,
            headers={"User-Agent": get_random_user_agent()},
            timeout=10.0,
        )

        if response.status_code == 200:
            html = response.text
            # Extract URLs from DuckDuckGo results
            matches = re.findall(r'uddg=([^"&]+)', html)

            for match in matches[:8]:
                try:
                    from urllib.parse import unquote

                    url = unquote(match)
                    if url.startswith("http") and "duckduckgo.com" not in url:
                        urls.append(url)
                except Exception:
                    continue
    except Exception as e:
        print(f"DuckDuckGo search error: {e}")

    return urls


async def search_crossref(query: str, client: httpx.AsyncClient) -> List[str]:
    """
    Search CrossRef API for academic paper URLs.

    Returns:
        List of DOI URLs found (max 5)
    """
    urls = []
    try:
        search_query = quote(query[:150])
        crossref_url = f"https://api.crossref.org/works?query={search_query}&rows=5"

        response = await client.get(
            crossref_url,
            headers={"User-Agent": get_random_user_agent()},
            timeout=10.0,
        )

        if response.status_code == 200:
            data = response.json()
            items = data.get("message", {}).get("items", [])

            for item in items:
                if item.get("URL"):
                    urls.append(item["URL"])
    except Exception as e:
        print(f"CrossRef search error: {e}")

    return urls


async def search_web(query: str, client: httpx.AsyncClient) -> List[str]:
    """
    Search both DuckDuckGo and CrossRef for URLs.

    Returns:
        Combined list of unique URLs (max 10)
    """
    # Run both searches concurrently
    ddg_urls, crossref_urls = await asyncio.gather(
        search_duckduckgo(query, client),
        search_crossref(query, client),
    )

    # Combine and deduplicate
    all_urls = list(dict.fromkeys(ddg_urls + crossref_urls))
    return all_urls[:10]


async def fetch_page_content(url: str, client: httpx.AsyncClient) -> str:
    """
    Fetch and clean text content from a URL.

    Returns:
        Cleaned text content (max 5000 chars)
    """
    try:
        response = await client.get(
            url,
            headers={
                "User-Agent": get_random_user_agent(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            timeout=8.0,
            follow_redirects=True,
        )

        if response.status_code != 200:
            return ""

        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove unwanted elements
        for element in soup(
            ["script", "style", "nav", "header", "footer", "aside", "noscript"]
        ):
            element.decompose()

        # Extract text
        text = soup.get_text(separator=" ", strip=True)

        # Clean whitespace
        text = re.sub(r"\s+", " ", text).strip()

        return text[:5000]
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""


async def check_sentence(
    sentence: str,
    client: httpx.AsyncClient,
    semaphore: asyncio.Semaphore,
) -> SentenceResult:
    """
    Check a single sentence for plagiarism.

    Returns:
        SentenceResult with similarity scores and sources
    """
    async with semaphore:
        # Add random delay to avoid rate limiting
        await asyncio.sleep(random.uniform(0.5, 1.5))

        urls = await search_web(sentence, client)

        max_similarity = 0.0
        matched_sources: List[SourceMatch] = []

        for url in urls:
            content = await fetch_page_content(url, client)

            if content and len(content) > 100:
                # Calculate both similarity metrics
                cosine_sim = calculate_cosine_similarity(sentence, content)
                ngram_sim = calculate_ngram_similarity(sentence, content, 5)

                similarity = max(cosine_sim, ngram_sim)

                if similarity > max_similarity:
                    max_similarity = similarity

                if similarity > 0.15:
                    matched_sources.append(
                        SourceMatch(
                            url=url,
                            similarity=round(similarity * 100),
                        )
                    )

        # Sort sources by similarity (highest first)
        matched_sources.sort(key=lambda x: x.similarity, reverse=True)

        return SentenceResult(
            sentence=sentence,
            similarity=round(max_similarity * 100),
            sources=matched_sources[:5],  # Keep top 5 sources
            is_plagiarized=max_similarity > 0.5,
        )


async def check_plagiarism(request: PlagiarismCheckRequest) -> PlagiarismCheckResponse:
    """
    Main function to check text for plagiarism.

    Args:
        request: The plagiarism check request

    Returns:
        PlagiarismCheckResponse with overall scores and detailed results
    """
    # Split text into sentences
    sentences = split_into_sentences(request.text, request.exclude_citations)

    if not sentences:
        return PlagiarismCheckResponse(
            overall_score=0,
            plagiarism_percentage=0,
            total_sentences=0,
            plagiarized_sentences=0,
            results=[],
        )

    # Limit number of sentences
    sentences = sentences[: request.max_sentences]

    # Create semaphore for rate limiting
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)

    # Check all sentences concurrently (with rate limiting)
    async with httpx.AsyncClient() as client:
        tasks = [check_sentence(sentence, client, semaphore) for sentence in sentences]
        results = await asyncio.gather(*tasks)

    # Calculate overall statistics
    total_similarity = sum(r.similarity for r in results)
    overall_score = round(total_similarity / len(results)) if results else 0

    plagiarized_count = sum(1 for r in results if r.is_plagiarized)
    plagiarism_percentage = (
        round((plagiarized_count / len(results)) * 100) if results else 0
    )

    return PlagiarismCheckResponse(
        overall_score=overall_score,
        plagiarism_percentage=plagiarism_percentage,
        total_sentences=len(results),
        plagiarized_sentences=plagiarized_count,
        results=results,
    )
