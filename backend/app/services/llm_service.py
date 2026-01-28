import random
from typing import List
from app.schemas.topic import TopicSuggestion


class LLMService:
    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    async def suggest_topics(
        self, major: str, keywords: str | None
    ) -> List[TopicSuggestion]:
        """
        Mock implementation for now.
        In the future, this will call OpenAI/Gemini API.
        """
        # Mock logic
        kw = keywords if keywords else "general"

        if "phần mềm" in major.lower() or "software" in major.lower():
            return [
                TopicSuggestion(
                    title=f"Ứng dụng AI trong {kw}",
                    description=f"Nghiên cứu cách áp dụng Generative AI để tối ưu hóa quy trình {kw}.",
                    difficulty="Hard",
                ),
                TopicSuggestion(
                    title=f"Xây dựng hệ thống {kw} dựa trên Microservices",
                    description="Thiết kế và triển khai kiến trúc microservices có khả năng mở rộng cao.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Phát triển ứng dụng Mobile cho {kw}",
                    description="Xây dựng giải pháp di động cross-platform sử dụng Flutter/React Native.",
                    difficulty="Easy",
                ),
            ]

        if "kinh doanh" in major.lower() or "biz" in major.lower():
            return [
                TopicSuggestion(
                    title=f"Tác động của {kw} đến hành vi người tiêu dùng Gen Z",
                    description="Nghiên cứu định lượng về sự thay đổi thói quen mua sắm.",
                    difficulty="Medium",
                ),
                TopicSuggestion(
                    title=f"Chiến lược Digital Marketing cho {kw}",
                    description="Phân tích hiệu quả các kênh social media trong việc quảng bá sản phẩm.",
                    difficulty="Easy",
                ),
            ]

        # Default fallback
        return [
            TopicSuggestion(
                title=f"Nghiên cứu xu hướng {kw} trong năm 2024",
                description="Tổng quan tài liệu và phân tích xu hướng mới nổi.",
                difficulty="Easy",
            ),
            TopicSuggestion(
                title=f"Ứng dụng công nghệ vào {major}",
                description="Đánh giá tác động của chuyển đổi số.",
                difficulty="Medium",
            ),
        ]


llm_service = LLMService()
