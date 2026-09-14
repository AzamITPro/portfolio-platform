from fastapi.testclient import TestClient
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token


def test_password_hashing_and_verification():
    raw_pw = "SecureTestPassword123"
    hashed = get_password_hash(raw_pw)
    assert hashed != raw_pw
    assert verify_password(raw_pw, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_token_lifecycle():
    payload = {"sub": "test@example.com", "role": "admin"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    decoded = decode_access_token(token)
    assert decoded["sub"] == "test@example.com"
    assert decoded["role"] == "admin"


def test_unauthorized_access_to_protected_route(client: TestClient):
    # Accessing /auth/me without token must be blocked with 401
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "UNAUTHORIZED"


def test_login_with_invalid_credentials(client: TestClient):
    payload = {
        "email": "nonexistent@example.com",
        "password": "wrong_password_123"
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "UNAUTHORIZED"