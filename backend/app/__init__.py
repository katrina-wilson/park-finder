from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers.parks import router as parks_router

def app_factory() -> FastAPI:
    app_settings = get_settings()

    app = FastAPI(
        title=app_settings.app_name,
        version=app_settings.app_version
    )

    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    app.include_router(parks_router)

    return app