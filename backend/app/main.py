from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import upload, analyze, chat, documentation

app = FastAPI(
    title="Visual Systems Copilot API",
    version="1.0.0",
    description="Dummy FastAPI backend for visual systems copilot features",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(chat.router)
app.include_router(documentation.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
