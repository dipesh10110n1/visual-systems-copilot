import json
from fastapi import APIRouter

from app.core.extractor import extractor
from app.core.gemma_client import client
from app.core.storage import store

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("")
async def analyze_data():
    uploaded_files = store.get_latest_files()
    if not uploaded_files:
        return {"Summary": "No files were uploaded.", "Components": [], "Relationships": [], "Risks": [], "Recommendations": []}

    extracted_chunks = []
    for item in uploaded_files:
        text = extractor.extract_text(item["path"])
        if text:
            extracted_chunks.append(f"File: {item['filename']}\n{text}\n")

    combined_text = "\n\n".join(extracted_chunks)
    prompt = f"""
You are analyzing engineering documents and images for a system architecture review.
Use the combined content from all uploaded files below.
Extract the system architecture, components, relationships, risks, and recommendations.
Return valid JSON with exactly these top-level keys:
Summary, Components, Relationships, Risks, Recommendations.

Files content:
{combined_text}
"""

    payload = client.analyze_payload(prompt)
    store.save_analysis(payload)
    return payload
