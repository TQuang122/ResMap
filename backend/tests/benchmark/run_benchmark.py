"""
Plagiarism Detection Benchmark Runner

Measures precision/recall for:
- Exact copy detection
- Paraphrase detection
- Same-topic false positive rate
- Overall score stability
"""

import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Any

import httpx


BENCHMARK_DATA_PATH = Path(__file__).parent / "plagiarism_benchmark_data.json"
API_BASE_URL = "http://localhost:8000/api/tools"


def load_benchmark_data() -> dict[str, Any]:
    with open(BENCHMARK_DATA_PATH) as f:
        return json.load(f)


async def check_plagiarism(text: str) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{API_BASE_URL}/plagiarism-check",
            json={"text": text, "max_sentences": 10, "use_ai_similarity": False},
        )
        response.raise_for_status()
        return response.json()


async def run_benchmark() -> dict[str, Any]:
    data = load_benchmark_data()
    results = {
        "timestamp": datetime.now().isoformat(),
        "categories": {},
        "summary": {},
    }

    category_metrics = {}

    for category_name, category_info in data["categories"].items():
        print(f"\n{'=' * 60}")
        print(f"Testing category: {category_name}")
        print(f"Description: {category_info['description']}")
        print(f"Expected score range: {category_info['expected_score_range']}")
        print("=" * 60)

        samples = category_info["samples"]
        scores = []

        for sample in samples:
            print(f"\nSample {sample['id']} ({sample['language']})")
            print(f"Text: {sample['text'][:80]}...")

            try:
                result = await check_plagiarism(sample["text"])
                score = result.get("overall_score", 0)
                scores.append(score)

                expected_min, expected_max = category_info["expected_score_range"]
                in_range = expected_min <= score <= expected_max

                print(f"  Score: {score}% (expected: {expected_min}-{expected_max}%)")
                print(f"  In range: {'PASS' if in_range else 'FAIL'}")

                if "results" in result:
                    sources_count = sum(
                        len(r.get("sources", [])) for r in result["results"]
                    )
                    print(f"  Sources found: {sources_count}")

            except Exception as e:
                print(f"  ERROR: {e}")
                scores.append(None)

        valid_scores = [s for s in scores if s is not None]
        if valid_scores:
            avg_score = sum(valid_scores) / len(valid_scores)
            min_score = min(valid_scores)
            max_score = max(valid_scores)

            expected_min, expected_max = category_info["expected_score_range"]
            accuracy = sum(
                1 for s in valid_scores if expected_min <= s <= expected_max
            ) / len(valid_scores)

            category_metrics[category_name] = {
                "avg_score": round(avg_score, 2),
                "min_score": min_score,
                "max_score": max_score,
                "expected_range": category_info["expected_score_range"],
                "accuracy": round(accuracy * 100, 2),
                "sample_count": len(valid_scores),
            }

            print(f"\nCategory Summary:")
            print(f"  Average: {avg_score:.2f}%")
            print(f"  Range: {min_score}-{max_score}%")
            print(f"  Accuracy: {accuracy * 100:.1f}%")

        results["categories"][category_name] = category_metrics.get(category_name, {})

    print("\n" + "=" * 60)
    print("BENCHMARK SUMMARY")
    print("=" * 60)

    print("\nMetrics by Category:")
    for cat, metrics in category_metrics.items():
        print(f"  {cat}: {metrics['avg_score']}% (accuracy: {metrics['accuracy']}%)")

    recall_exact = category_metrics.get("exact_copy", {}).get("accuracy", 0)
    precision_para = 100 - category_metrics.get("same_topic", {}).get("avg_score", 0)
    fp_rate = category_metrics.get("same_topic", {}).get("avg_score", 0)

    results["summary"] = {
        "exact_copy_recall": recall_exact,
        "paraphrase_precision_estimate": precision_para,
        "false_positive_rate": fp_rate,
        "overall_accuracy": sum(m["accuracy"] for m in category_metrics.values())
        / len(category_metrics)
        if category_metrics
        else 0,
    }

    print(f"\nKey Metrics:")
    print(f"  Exact copy recall: {recall_exact:.1f}%")
    print(f"  Paraphrase precision (est): {precision_para:.1f}%")
    print(f"  False positive rate: {fp_rate:.1f}%")
    print(f"  Overall accuracy: {results['summary']['overall_accuracy']:.1f}%")

    output_path = Path(__file__).parent / "benchmark_results.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to: {output_path}")

    return results


if __name__ == "__main__":
    asyncio.run(run_benchmark())
