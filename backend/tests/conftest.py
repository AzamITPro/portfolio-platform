import pytest
from typing import Generator
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal


@pytest.fixture(scope="session")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()