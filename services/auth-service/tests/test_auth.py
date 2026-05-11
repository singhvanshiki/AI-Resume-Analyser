import pytest


@pytest.mark.asyncio
async def test_register_and_login(client):
    register_payload = {
        "email": "user@example.com",
        "password": "Passw0rd!",
        "full_name": "User Example",
        "role": "student",
    }
    register_resp = await client.post("/auth/register", json=register_payload)
    assert register_resp.status_code == 201
    tokens = register_resp.json()
    assert tokens["access_token"]
    assert tokens["refresh_token"]

    login_payload = {"email": "user@example.com", "password": "Passw0rd!"}
    login_resp = await client.post("/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    body = login_resp.json()
    assert body["access_token"]
    assert body["user"]["email"] == "user@example.com"
