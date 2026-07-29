from __future__ import annotations

import json
import os
from typing import Any
from PIL import Image

from google import genai
from google.genai import types

class GemmaClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None
        # Use gemma-4-31b-it (Gemma 4 series) as the default model for the hackathon
        self.model_name = os.getenv("GEMMA_MODEL", "gemma-4-31b-it")

    def analyze_payload(self, prompt: str, images: list[Image.Image] = None) -> dict[str, Any]:
        if not self.api_key or not self.client:
            return {
                "Summary": "Gemma analysis unavailable because GEMINI_API_KEY is not configured.",
                "Components": [],
                "Relationships": [],
                "Risks": [],
                "Recommendations": [],
                "Metadata": {"model": self.model_name, "confidence": 0},
                "Health": {},
            }
            
        contents = [prompt]
        if images:
            contents.extend(images)

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=contents,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        text = response.text or ""
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            cleaned = text.strip().strip("```json").strip("```").strip()
            try:
                return json.loads(cleaned)
            except Exception:
                return {}

    def chat_reply(self, prompt: str) -> str:
        if not self.api_key or not self.client:
            return "Gemma is unavailable because GEMINI_API_KEY is not configured. Please upload engineering assets and configure the API key for live analysis."

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text or ""


client = GemmaClient()
