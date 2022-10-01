from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(title="AI Trading Signal Service", version="1.0.0")
app.include_router(router, prefix="/v1")
