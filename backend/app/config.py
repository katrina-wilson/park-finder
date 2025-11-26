from pydantic_settings import BaseSettings

DATABASE_URL = "postgresql://admin:password@localhost/mydatabase"

class AppSettings(BaseSettings):
    app_name: str = "APP"
    app_version: str = "0.0.1"

def get_settings():
    return AppSettings()