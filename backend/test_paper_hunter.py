"""
Test script for Paper Hunter API endpoints.
Run with: uv run python test_paper_hunter.py
"""

import asyncio
import httpx
import json
from pprint import pprint

BASE_URL = "http://localhost:8000/api"

# Test data
TEST_TOPIC = "sentiment analysis deep learning"
TEST_RESEARCH_QUESTION = "How can deep learning improve sentiment analysis accuracy on Vietnamese social media data?"


async def test_generate_queries():
    """Test POST /papers/queries endpoint"""
    print("\n" + "=" * 60)
    print("TEST 1: Generate Queries")
    print("=" * 60)

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{BASE_URL}/papers/queries",
            json={
                "topic": TEST_TOPIC,
                "year_start": 2020,
                "year_end": 2024,
                "paper_types": ["survey", "empirical"],
                "domain": "Computer Science",
            },
        )

        if response.status_code == 200:
            data = response.json()
            print(f"Status: OK")
            print(f"Original topic: {data['original_topic']}")
            print(f"Keywords: {data['keywords']}")
            print(f"Synonyms: {data['synonyms']}")
            print(f"\nQueries generated for {len(data['queries'])} sources:")
            for q in data["queries"]:
                print(f"  - {q['source']}: {q['query'][:50]}...")
            return True
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
            return False


async def test_search_papers():
    """Test POST /papers/search endpoint"""
    print("\n" + "=" * 60)
    print("TEST 2: Search Papers (OpenAlex)")
    print("=" * 60)

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{BASE_URL}/papers/search",
            json={
                "query": TEST_TOPIC,
                "year_start": 2020,
                "year_end": 2024,
                "limit": 5,
                "sort_by": "cited_by_count",
            },
        )

        if response.status_code == 200:
            data = response.json()
            print(f"Status: OK")
            print(f"Total count: {data['total_count']}")
            print(f"Papers returned: {len(data['papers'])}")
            print(f"\nTop papers:")
            for i, paper in enumerate(data["papers"][:3], 1):
                print(f"\n  {i}. {paper['title'][:60]}...")
                print(
                    f"     Year: {paper['year']}, Citations: {paper['cited_by_count']}"
                )
                print(
                    f"     Authors: {', '.join([a['name'] for a in paper['authors'][:2]])}"
                )
                if paper["abstract"]:
                    print(f"     Abstract: {paper['abstract'][:100]}...")
            return data["papers"][0] if data["papers"] else None
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
            return None


async def test_score_paper(paper: dict):
    """Test POST /papers/score endpoint"""
    print("\n" + "=" * 60)
    print("TEST 3: Score Paper (Gemini AI)")
    print("=" * 60)

    if not paper:
        print("SKIPPED: No paper to score")
        return False

    print(f"Scoring paper: {paper['title'][:50]}...")
    print("(This may take 10-15 seconds...)")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{BASE_URL}/papers/score",
            json={
                "paper": paper,
                "research_question": TEST_RESEARCH_QUESTION,
                "context": "This is for a capstone project at FPT University",
            },
        )

        if response.status_code == 200:
            data = response.json()
            print(f"\nStatus: OK")
            print(f"Decision: {data['decision'].upper()}")
            print(f"Overall Score: {data['overall_score']}/10")
            print(f"\nScores by criteria:")
            print(
                f"  Relevance:      {data['relevance']['score']}/10 - {data['relevance']['reason'][:50]}..."
            )
            print(
                f"  Novelty:        {data['novelty']['score']}/10 - {data['novelty']['reason'][:50]}..."
            )
            print(
                f"  Methodology:    {data['methodology']['score']}/10 - {data['methodology']['reason'][:50]}..."
            )
            print(
                f"  Reproducibility:{data['reproducibility']['score']}/10 - {data['reproducibility']['reason'][:50]}..."
            )
            print(
                f"  Citation:       {data['citation_context']['score']}/10 - {data['citation_context']['reason'][:50]}..."
            )
            print(
                f"  Dataset Fit:    {data['dataset_fit']['score']}/10 - {data['dataset_fit']['reason'][:50]}..."
            )
            print(f"\nSummary: {data['summary']}")
            return True
        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)
            return False


async def main():
    print("\n" + "#" * 60)
    print("# PAPER HUNTER API TEST SUITE")
    print("#" * 60)

    results = {}

    # Test 1: Generate Queries
    results["queries"] = await test_generate_queries()

    # Test 2: Search Papers
    paper = await test_search_papers()
    results["search"] = paper is not None

    # Test 3: Score Paper
    results["score"] = await test_score_paper(paper)

    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    for test, passed in results.items():
        status = "PASS" if passed else "FAIL"
        print(f"  {test.upper()}: {status}")

    all_passed = all(results.values())
    print(f"\nOverall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    return all_passed


if __name__ == "__main__":
    asyncio.run(main())
