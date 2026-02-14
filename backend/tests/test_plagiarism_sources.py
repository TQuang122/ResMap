import asyncio
from typing import Any, cast

import pytest
import httpx
from pydantic import ValidationError

from app.services import plagiarism


def test_connector_interface_contract():
    registry = plagiarism.get_source_connector_registry()
    assert all(hasattr(connector, "name") for connector in registry)
    assert all(hasattr(connector, "search") for connector in registry)


def test_normalized_candidate_required_fields():
    candidate = plagiarism.normalize_candidate_payload(
        {
            "source": "duckduckgo",
            "canonical_url": "https://example.org/paper",
            "title": "Example Paper",
            "identifiers": {"doi": "10.1000/example"},
        }
    )

    assert candidate.source == "duckduckgo"
    assert candidate.canonical_url == "https://example.org/paper"
    assert candidate.title == "Example Paper"
    assert candidate.identifiers.doi == "10.1000/example"
    assert candidate.identifiers.pmid is None
    assert candidate.identifiers.arxiv_id is None


def test_normalized_candidate_rejects_invalid_payload():
    with pytest.raises(ValidationError):
        plagiarism.normalize_candidate_payload(
            {
                "source": "crossref",
                "canonical_url": "https://doi.org/10.1000/example",
            }
        )


def test_connector_registry_feature_flags(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(
        plagiarism.settings, "PLAGIARISM_SOURCE_DUCKDUCKGO_ENABLED", True
    )
    monkeypatch.setattr(
        plagiarism.settings, "PLAGIARISM_SOURCE_CROSSREF_ENABLED", False
    )
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_ARXIV_ENABLED", False)
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_PUBMED_ENABLED", False)
    only_ddg = plagiarism.get_source_connector_registry()
    assert [connector.name for connector in only_ddg] == ["duckduckgo"]

    monkeypatch.setattr(
        plagiarism.settings, "PLAGIARISM_SOURCE_DUCKDUCKGO_ENABLED", False
    )
    monkeypatch.setattr(
        plagiarism.settings, "PLAGIARISM_SOURCE_CROSSREF_ENABLED", False
    )
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_ARXIV_ENABLED", True)
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_PUBMED_ENABLED", False)
    only_arxiv = plagiarism.get_source_connector_registry()
    assert [connector.name for connector in only_arxiv] == ["arxiv"]

    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_ARXIV_ENABLED", False)
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_PUBMED_ENABLED", True)
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_CORE_ENABLED", False)
    only_pubmed = plagiarism.get_source_connector_registry()
    assert [connector.name for connector in only_pubmed] == ["pubmed"]

    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_PUBMED_ENABLED", False)
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_CORE_ENABLED", True)
    only_core = plagiarism.get_source_connector_registry()
    assert [connector.name for connector in only_core] == ["core"]

    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_CORE_ENABLED", False)
    monkeypatch.setattr(plagiarism.settings, "PLAGIARISM_SOURCE_ARXIV_ENABLED", False)
    none_enabled = plagiarism.get_source_connector_registry()
    assert none_enabled == []


def test_arxiv_policy_constants_locked():
    assert plagiarism.ARXIV_TIMEOUT_SECONDS == 10.0
    assert plagiarism.ARXIV_MAX_RETRIES == 3
    assert plagiarism.ARXIV_BACKOFF_SECONDS == (2.0, 4.0, 8.0)
    assert plagiarism.ARXIV_POLITENESS_DELAY_SECONDS >= 3.0


def test_pubmed_policy_constants_locked():
    assert plagiarism.PUBMED_MAX_RETRIES == 3
    assert plagiarism.PUBMED_BACKOFF_SECONDS == (1.0, 2.0, 4.0)
    assert plagiarism.PUBMED_NO_KEY_MIN_INTERVAL_SECONDS == 0.4
    assert plagiarism.PUBMED_KEY_MIN_INTERVAL_SECONDS == 0.12
    assert plagiarism.PUBMED_CONNECTOR_CONCURRENCY == 2
    assert plagiarism.PUBMED_RETMAX_UPPER_BOUND == 25


def test_report_v2_source_groups_dedupes_and_orders_deterministically():
    results = [
        plagiarism.SentenceResult(
            sentence="Sentence one has web and DOI matches",
            similarity=72,
            semantic_similarity=0,
            sources=[
                plagiarism.SourceMatch(
                    url="HTTP://DOI.ORG/10.1000/xyz/",
                    similarity=68,
                ),
                plagiarism.SourceMatch(
                    url="https://Example.com/Paper-A/",
                    similarity=61,
                ),
                plagiarism.SourceMatch(
                    url="https://example.com/paper-a",
                    similarity=65,
                ),
            ],
            is_plagiarized=True,
            used_ai=False,
            fallback_used=False,
            analysis_method="keyword",
        ),
        plagiarism.SentenceResult(
            sentence="Sentence two repeats DOI and adds PubMed",
            similarity=80,
            semantic_similarity=0,
            sources=[
                plagiarism.SourceMatch(
                    url="https://doi.org/10.1000/XYZ",
                    similarity=75,
                ),
                plagiarism.SourceMatch(
                    url="https://pubmed.ncbi.nlm.nih.gov/12345/",
                    similarity=58,
                ),
            ],
            is_plagiarized=True,
            used_ai=False,
            fallback_used=False,
            analysis_method="keyword",
        ),
    ]

    groups = plagiarism._build_report_v2_source_groups(results)

    assert [group.source_id for group in groups] == ["src-001", "src-002", "src-003"]
    assert [group.canonical_url for group in groups] == [
        "https://doi.org/10.1000/xyz",
        "https://example.com/paper-a",
        "https://pubmed.ncbi.nlm.nih.gov/12345",
    ]
    assert [group.source_type for group in groups] == ["doi", "web", "pubmed"]

    doi_group = groups[0]
    assert len(doi_group.spans) == 2
    assert doi_group.spans[0].sentence_index == 0
    assert doi_group.spans[0].start_char == 0
    assert doi_group.spans[0].end_char == len(results[0].sentence)
    assert doi_group.spans[0].similarity == 68
    assert doi_group.spans[1].sentence_index == 1
    assert doi_group.spans[1].similarity == 75

    web_group = groups[1]
    assert len(web_group.spans) == 1
    assert web_group.spans[0].sentence_index == 0
    assert web_group.spans[0].similarity == 65


@pytest.mark.asyncio
async def test_arxiv_connector_success_normalization():
    feed_xml = """<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<feed xmlns=\"http://www.w3.org/2005/Atom\">
  <entry>
    <id>http://arxiv.org/abs/2401.12345v2</id>
    <published>2024-01-25T12:00:00Z</published>
    <title>  A Strong Baseline for Testing  </title>
    <summary>  Metadata-only snippet from arXiv abstract.  </summary>
    <author><name>Alice Nguyen</name></author>
    <author><name>Bob Tran</name></author>
  </entry>
</feed>
"""

    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(200, text=feed_xml)

    transport = httpx.MockTransport(handler)
    connector = plagiarism.ArxivConnector()

    async with httpx.AsyncClient(transport=transport) as client:
        candidates = await connector.search("baseline", client, limit=5)

    assert len(candidates) == 1
    candidate = candidates[0]
    assert candidate.source == "arxiv"
    assert candidate.canonical_url == "https://arxiv.org/abs/2401.12345v2"
    assert candidate.identifiers.arxiv_id == "2401.12345v2"
    assert candidate.title == "A Strong Baseline for Testing"
    assert candidate.snippet == "Metadata-only snippet from arXiv abstract."
    assert candidate.year == 2024
    assert candidate.authors == ["Alice Nguyen", "Bob Tran"]


@pytest.mark.asyncio
async def test_arxiv_connector_no_pdf_and_bounded_results():
    captured_requests: list[httpx.Request] = []
    feed_xml = """<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<feed xmlns=\"http://www.w3.org/2005/Atom\">
  <entry>
    <id>http://arxiv.org/pdf/2402.00001v1</id>
    <published>2024-02-01T00:00:00Z</published>
    <title>Bounded Query Test</title>
    <summary>Snippet.</summary>
  </entry>
</feed>
"""

    def handler(request: httpx.Request) -> httpx.Response:
        captured_requests.append(request)
        return httpx.Response(200, text=feed_xml)

    transport = httpx.MockTransport(handler)
    connector = plagiarism.ArxivConnector()

    async with httpx.AsyncClient(transport=transport) as client:
        candidates = await connector.search("q", client, limit=10_000)

    assert len(candidates) == 1
    assert candidates[0].canonical_url == "https://arxiv.org/abs/2402.00001v1"

    request = captured_requests[0]
    query = str(request.url)
    assert "max_results=25" in query
    assert "start=0" in query


@pytest.mark.asyncio
async def test_arxiv_policy_envelope_timeout_retry_backoff(
    monkeypatch: pytest.MonkeyPatch,
):
    sleep_calls: list[float] = []

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)

    connector = plagiarism.ArxivConnector()
    call_count = 0

    def handler(_: httpx.Request) -> httpx.Response:
        nonlocal call_count
        call_count += 1
        return httpx.Response(503)

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        result = await connector.search("timeout check", client, limit=3)

    assert result == []
    assert call_count == 4
    assert 2.0 in sleep_calls
    assert 4.0 in sleep_calls
    assert 8.0 in sleep_calls


@pytest.mark.asyncio
async def test_arxiv_politeness_delay_enforced(monkeypatch: pytest.MonkeyPatch):
    sleep_calls: list[float] = []

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)

    connector = plagiarism.ArxivConnector()
    connector._last_request_at = asyncio.get_running_loop().time()
    await connector._enforce_politeness_delay()

    assert sleep_calls
    assert sleep_calls[0] >= 2.9


@pytest.mark.asyncio
async def test_global_and_per_source_caps_applied():
    class StubConnector:
        def __init__(self, name: str, urls: list[str]):
            self.name = name
            self._urls = urls

        async def search(self, query, client, limit):
            del query
            del client
            return [
                plagiarism.NormalizedSourceCandidate(
                    source=self.name,
                    canonical_url=url,
                    title=url,
                )
                for url in self._urls[:limit]
            ]

    connectors: list[plagiarism.SourceConnector] = [
        StubConnector("source_a", ["https://a/1", "https://a/2", "https://a/3"]),
        StubConnector("source_b", ["https://b/1", "https://b/2", "https://b/3"]),
    ]

    async with httpx.AsyncClient() as client:
        candidates = await plagiarism.collect_source_candidates(
            query="test query",
            client=client,
            connectors=connectors,
            per_source_caps={"source_a": 2, "source_b": 3},
            global_cap=4,
        )

    assert [candidate.canonical_url for candidate in candidates] == [
        "https://a/1",
        "https://a/2",
        "https://b/1",
        "https://b/2",
    ]


def test_core_policy_constants_locked():
    assert plagiarism.CORE_TIMEOUT_SECONDS == 10.0
    assert plagiarism.CORE_MAX_RETRIES == 3
    assert plagiarism.CORE_BACKOFF_SECONDS == (2.0, 4.0, 8.0)
    assert plagiarism.CORE_CONNECTOR_CONCURRENCY == 1
    assert plagiarism.CORE_MIN_REQUEST_INTERVAL_SECONDS == 2.0
    assert plagiarism.CORE_DEGRADED_WINDOW_SECONDS == 60.0


@pytest.mark.asyncio
async def test_core_auth_policy_prefers_bearer_header(monkeypatch: pytest.MonkeyPatch):
    captured_requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        captured_requests.append(request)
        return httpx.Response(200, json={"results": []})

    connector = plagiarism.CoreConnector()
    monkeypatch.setattr(plagiarism.settings, "CORE_API_KEY", "core-secret")

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        monkeypatch.setattr(
            plagiarism.settings,
            "PLAGIARISM_SOURCE_CORE_AUTH_MODE",
            plagiarism.CORE_AUTH_MODE_BEARER,
        )
        await connector.search("auth query", client, limit=2)

        monkeypatch.setattr(
            plagiarism.settings,
            "PLAGIARISM_SOURCE_CORE_AUTH_MODE",
            plagiarism.CORE_AUTH_MODE_QUERY,
        )
        await connector.search("auth query", client, limit=2)

    assert len(captured_requests) == 2
    bearer_request = captured_requests[0]
    query_request = captured_requests[1]

    assert bearer_request.headers.get("Authorization") == "Bearer core-secret"
    assert "api_key=core-secret" not in str(bearer_request.url)

    assert query_request.headers.get("Authorization") is None
    assert "api_key=core-secret" in str(query_request.url)


@pytest.mark.asyncio
async def test_core_rate_retry_policy_locked(monkeypatch: pytest.MonkeyPatch):
    connector = plagiarism.CoreConnector()
    assert connector._request_semaphore._value == 1

    throttle_sleep_calls: list[float] = []

    async def fake_sleep_for_throttle(seconds: float) -> None:
        throttle_sleep_calls.append(seconds)

    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep_for_throttle)
    connector._last_request_at = asyncio.get_running_loop().time()
    await connector._enforce_throttle()

    assert throttle_sleep_calls
    assert throttle_sleep_calls[0] >= 1.9

    sleep_calls: list[float] = []

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    class StubClient:
        def __init__(self) -> None:
            self.calls = 0
            self.timeouts: list[float] = []

        async def get(
            self,
            url: str,
            params: dict[str, Any] | None = None,
            headers: dict[str, str] | None = None,
            timeout: float | None = None,
        ) -> httpx.Response:
            del url
            del params
            del headers
            self.calls += 1
            self.timeouts.append(float(timeout) if timeout is not None else -1.0)
            if self.calls == 1:
                return httpx.Response(429, headers={"Retry-After": "7"})
            if self.calls == 2:
                return httpx.Response(503)
            if self.calls == 3:
                return httpx.Response(500)
            return httpx.Response(200, json={"results": []})

    async def noop_throttle() -> None:
        return None

    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)
    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)
    monkeypatch.setattr(connector, "_enforce_throttle", noop_throttle)

    stub_client = StubClient()
    response = await connector._request_with_retry(
        client=cast(httpx.AsyncClient, stub_client),
        params={"q": "x", "limit": 1},
        headers={"Authorization": "Bearer key"},
    )

    assert response is not None and response.status_code == 200
    assert stub_client.calls == 4
    assert stub_client.timeouts == [10.0, 10.0, 10.0, 10.0]
    assert sleep_calls == [7.0, 4.0, 8.0]


@pytest.mark.asyncio
async def test_core_retries_timeout_and_network_errors(monkeypatch: pytest.MonkeyPatch):
    connector = plagiarism.CoreConnector()
    sleep_calls: list[float] = []

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    class TimeoutThenSuccessClient:
        def __init__(self) -> None:
            self.calls = 0

        async def get(
            self,
            url: str,
            params: dict[str, Any] | None = None,
            headers: dict[str, str] | None = None,
            timeout: float | None = None,
        ) -> httpx.Response:
            del url
            del params
            del headers
            del timeout
            self.calls += 1
            if self.calls == 1:
                raise httpx.TimeoutException("timeout")
            if self.calls == 2:
                raise httpx.ConnectError(
                    "network", request=httpx.Request("GET", "https://example.com")
                )
            if self.calls == 3:
                raise httpx.ReadError(
                    "network", request=httpx.Request("GET", "https://example.com")
                )
            return httpx.Response(200, json={"results": []})

    async def noop_throttle() -> None:
        return None

    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)
    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)
    monkeypatch.setattr(connector, "_enforce_throttle", noop_throttle)

    client = TimeoutThenSuccessClient()
    response = await connector._request_with_retry(
        client=cast(httpx.AsyncClient, client),
        params={"q": "x", "limit": 1},
        headers={"Authorization": "Bearer key"},
    )

    assert response is not None and response.status_code == 200
    assert client.calls == 4
    assert sleep_calls == [2.0, 4.0, 8.0]


@pytest.mark.asyncio
async def test_pubmed_identity_params_tool_email_required(
    monkeypatch: pytest.MonkeyPatch,
):
    captured_requests: list[httpx.Request] = []

    esearch_payload = {
        "esearchresult": {
            "idlist": ["12345", "67890"],
        }
    }
    esummary_payload = {
        "result": {
            "uids": ["12345", "67890"],
            "12345": {
                "uid": "12345",
                "title": "Clinical Trial Design for Student Projects",
                "pubdate": "2024 Jan",
                "source": "J Med Educ",
                "authors": [{"name": "Alice Nguyen"}, {"name": "Bob Tran"}],
            },
            "67890": {
                "uid": "67890",
                "title": "Evidence Synthesis in Biomedical Informatics",
                "pubdate": "2023",
                "authors": [],
            },
        }
    }

    def handler(request: httpx.Request) -> httpx.Response:
        captured_requests.append(request)
        if "esearch.fcgi" in str(request.url):
            return httpx.Response(200, json=esearch_payload)
        if "esummary.fcgi" in str(request.url):
            return httpx.Response(200, json=esummary_payload)
        return httpx.Response(404)

    monkeypatch.setattr(plagiarism.settings, "NCBI_TOOL", "resmap-tool")
    monkeypatch.setattr(plagiarism.settings, "NCBI_EMAIL", "team@resmap.io.vn")
    monkeypatch.setattr(plagiarism.settings, "NCBI_API_KEY", "")

    transport = httpx.MockTransport(handler)
    connector = plagiarism.PubMedConnector()

    async with httpx.AsyncClient(transport=transport) as client:
        candidates = await connector.search("student biomedical study", client, limit=5)

    assert len(candidates) == 2
    first = candidates[0]
    assert first.source == "pubmed"
    assert first.canonical_url == "https://pubmed.ncbi.nlm.nih.gov/12345/"
    assert first.title == "Clinical Trial Design for Student Projects"
    assert first.snippet == "J Med Educ (2024 Jan)"
    assert first.year == 2024
    assert first.authors == ["Alice Nguyen", "Bob Tran"]
    assert first.identifiers.pmid == "12345"
    assert first.identifiers.doi is None
    assert first.identifiers.arxiv_id is None

    second = candidates[1]
    assert second.snippet is None
    assert second.authors is None
    assert second.year == 2023

    for request in captured_requests:
        query = request.url.params
        assert query.get("tool") == "resmap-tool"
        assert query.get("email") == "team@resmap.io.vn"
        assert query.get("api_key") is None


@pytest.mark.asyncio
async def test_pubmed_connector_includes_api_key_when_configured(
    monkeypatch: pytest.MonkeyPatch,
):
    captured_requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        captured_requests.append(request)
        if "esearch.fcgi" in str(request.url):
            return httpx.Response(200, json={"esearchresult": {"idlist": []}})
        return httpx.Response(200, json={"result": {"uids": []}})

    monkeypatch.setattr(plagiarism.settings, "NCBI_TOOL", "resmap-tool")
    monkeypatch.setattr(plagiarism.settings, "NCBI_EMAIL", "team@resmap.io.vn")
    monkeypatch.setattr(plagiarism.settings, "NCBI_API_KEY", "ncbi-key-123")

    transport = httpx.MockTransport(handler)
    connector = plagiarism.PubMedConnector()

    async with httpx.AsyncClient(transport=transport) as client:
        candidates = await connector.search("query", client, limit=1)

    assert candidates == []
    assert captured_requests
    assert captured_requests[0].url.params.get("api_key") == "ncbi-key-123"


@pytest.mark.asyncio
async def test_pubmed_retry_and_bounded_pagination(
    monkeypatch: pytest.MonkeyPatch,
):
    sleep_calls: list[float] = []
    captured_esearch: list[httpx.Request] = []
    esearch_attempt = 0

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)
    monkeypatch.setattr(plagiarism.settings, "NCBI_API_KEY", "")

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal esearch_attempt
        if "esearch.fcgi" in str(request.url):
            captured_esearch.append(request)
            esearch_attempt += 1
            if esearch_attempt == 1:
                return httpx.Response(429, headers={"Retry-After": "2"})
            return httpx.Response(200, json={"esearchresult": {"idlist": ["10001"]}})

        if "esummary.fcgi" in str(request.url):
            return httpx.Response(
                200,
                json={
                    "result": {
                        "uids": ["10001"],
                        "10001": {
                            "uid": "10001",
                            "title": "Bounded PubMed Search",
                            "pubdate": "2022",
                        },
                    }
                },
            )

        return httpx.Response(404)

    transport = httpx.MockTransport(handler)
    connector = plagiarism.PubMedConnector()

    async with httpx.AsyncClient(transport=transport) as client:
        candidates = await connector.search("bounded", client, limit=10_000)

    assert len(candidates) == 1
    assert esearch_attempt == 2
    assert 2.0 in sleep_calls

    assert captured_esearch
    first_query = captured_esearch[0].url.params
    assert first_query.get("retmax") == "10"
    assert first_query.get("retstart") == "0"


@pytest.mark.asyncio
async def test_pubmed_connector_timeout_and_5xx_retry_budget_locked(
    monkeypatch: pytest.MonkeyPatch,
):
    sleep_calls: list[float] = []
    call_count = 0

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)
    monkeypatch.setattr(plagiarism.random, "uniform", lambda a, b: 0.0)
    monkeypatch.setattr(plagiarism.settings, "NCBI_API_KEY", "")

    def handler(_: httpx.Request) -> httpx.Response:
        nonlocal call_count
        call_count += 1
        return httpx.Response(503)

    transport = httpx.MockTransport(handler)
    connector = plagiarism.PubMedConnector()

    async with httpx.AsyncClient(transport=transport) as client:
        result = await connector.search("retry", client, limit=3)

    assert result == []
    assert call_count == 4
    assert 1.0 in sleep_calls
    assert 2.0 in sleep_calls
    assert 4.0 in sleep_calls


@pytest.mark.asyncio
async def test_pubmed_throttle_modes_key_and_no_key(
    monkeypatch: pytest.MonkeyPatch,
):
    sleep_calls: list[float] = []

    async def fake_sleep(seconds: float) -> None:
        sleep_calls.append(seconds)

    monkeypatch.setattr(plagiarism.asyncio, "sleep", fake_sleep)

    connector = plagiarism.PubMedConnector()
    connector._last_request_at = asyncio.get_running_loop().time()
    monkeypatch.setattr(plagiarism.settings, "NCBI_API_KEY", "")
    await connector._enforce_throttle()

    connector._last_request_at = asyncio.get_running_loop().time()
    monkeypatch.setattr(plagiarism.settings, "NCBI_API_KEY", "with-key")
    await connector._enforce_throttle()

    assert sleep_calls[0] >= 0.39
    assert sleep_calls[1] >= 0.11


@pytest.mark.asyncio
async def test_no_live_network_calls(monkeypatch: pytest.MonkeyPatch):
    async def blocked_get(self, *args, **kwargs):
        del self
        del args
        del kwargs
        raise AssertionError("live network call detected in offline-safe test")

    monkeypatch.setattr(httpx.AsyncClient, "get", blocked_get)

    class StubConnector:
        name = "stub"

        async def search(
            self,
            query: str,
            client: httpx.AsyncClient,
            limit: int,
        ) -> list[plagiarism.NormalizedSourceCandidate]:
            del query
            del client
            if limit <= 0:
                return []
            return [
                plagiarism.NormalizedSourceCandidate(
                    source="stub",
                    canonical_url="https://stub.local/paper-1",
                    title="Offline-safe candidate",
                )
            ]

    async with httpx.AsyncClient() as client:
        candidates = await plagiarism.collect_source_candidates(
            query="offline-safe",
            client=client,
            connectors=[StubConnector()],
            per_source_caps={"stub": 1},
            global_cap=1,
        )

    assert len(candidates) == 1
    assert candidates[0].source == "stub"
