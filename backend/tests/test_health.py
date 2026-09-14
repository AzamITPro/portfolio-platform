from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "version" in data["data"]


def test_health_check(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"


def test_api_v1_status(client: TestClient):
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["version"] == "1.0.0"