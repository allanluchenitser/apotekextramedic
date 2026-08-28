from fastapi import FastAPI

from app.api.routes import router as api_router
from app.config import settings

app = FastAPI(
	title="Apotek Extra Medic API",
	version="0.1.0",
	description=f"Environment: {settings.app_env}",
)
app.include_router(api_router)
