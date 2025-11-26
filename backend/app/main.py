from fastapi import FastAPI
from app import app_factory

app: FastAPI = app_factory()