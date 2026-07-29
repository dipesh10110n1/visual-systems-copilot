import json

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.extractor import extractor
from app.core.gemma_client import client
from app.core.storage import store

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str


@router.post("")
async def chat(request: ChatRequest):
    uploaded_files = store.get_latest_files()
    if not uploaded_files:
        return {
            "reply": "Upload engineering documents or diagrams first so I can answer using your uploaded context.",
            "status": "empty",
            "used_context": False,
        }

    extracted_chunks = []
    for item in uploaded_files:
        text = extractor.extract_text(item["path"])
        if text:
            extracted_chunks.append(f"File: {item['filename']}\n{text}\n")

    analysis_context = store.get_latest_analysis() or {}
    combined_text = "\n\n".join(extracted_chunks)
    prompt = f"""
You are an engineering systems assistant.
Use the uploaded files and the latest analysis context below to answer the user's question.
User question: {request.message}

Uploaded files content:
{combined_text}

Latest analysis context:
{json.dumps(analysis_context, indent=2)}

Return valid JSON with a single key named "answer" and a concise but useful explanation.
"""

    reply_text = client.chat_reply(prompt)
    try:
        parsed = json.loads(reply_text)
        answer = parsed.get("answer") or parsed.get("reply") or reply_text
    except (TypeError, ValueError):
        answer = reply_text

    return {
        "reply": answer,
        "status": "ok",
        "used_context": True,
    }
