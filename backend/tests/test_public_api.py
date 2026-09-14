from fastapi.testclient import TestClient


def test_get_public_profile(client: TestClient):
    response = client.get("/api/v1/public/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "full_name" in data["data"]
    assert "professional_title" in data["data"]


def test_get_public_projects_list(client: TestClient):
    response = client.get("/api/v1/public/projects")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_contact_form_validation_failure(client: TestClient):
    # Missing required fields or invalid email must trigger 422
    invalid_payload = {
        "name": "A",
        "email": "invalid-email-format",
        "subject": "",
        "message": ""
    }
    response = client.post("/api/v1/public/contact", json=invalid_payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"