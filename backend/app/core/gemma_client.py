from __future__ import annotations

import json
import os
from typing import Any

import google.generativeai as genai


class GemmaClient:
    def __init__(self) -> None:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    def analyze_payload(self, prompt: str) -> dict[str, Any]:
        if not os.getenv("GEMINI_API_KEY"):
            return {
                "Summary": "Gemma analysis unavailable because GEMINI_API_KEY is not configured.",
                "Components": [],
                "Relationships": [],
                "Risks": [],
                "Recommendations": []
            }

        response = self.model.generate_content(prompt)
        text = getattr(response, "text", "") or ""
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            cleaned = text.strip().strip("```json").strip("```").strip()
            return json.loads(cleaned)

    def chat_reply(self, prompt: str) -> str:
        if not os.getenv("GEMINI_API_KEY"):
            return "Gemma is unavailable because GEMINI_API_KEY is not configured. Please upload engineering assets and configure the API key for live analysis."

        response = self.model.generate_content(prompt)
        return getattr(response, "text", "") or ""


client = GemmaClient()
