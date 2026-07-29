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
        # Keep the model selectable: hackathon deployments can point this at their
        # approved Gemma endpoint without changing application code.
        self.model_name = os.getenv("GEMMA_MODEL", "gemma-3-27b-it")
        self.model = genai.GenerativeModel(self.model_name) if api_key else None

    def analyze_payload(self, prompt: str) -> dict[str, Any]:
        if not os.getenv("GEMINI_API_KEY"):
            return {
                "Summary": "Gemma analysis unavailable because GEMINI_API_KEY is not configured.",
                "Components": [],
                "Relationships": [],
                "Risks": [],
                "Recommendations": [],
                "Metadata": {"model": self.model_name, "confidence": 0},
                "Health": {},
            }

        response = self.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
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
