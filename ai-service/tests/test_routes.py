from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/v1/health")
    assert response.status_code == 200


def test_predict() -> None:
    response = client.get("/v1/predict/BTCUSD")
    data = response.json()
    assert response.status_code == 200
    assert data["symbol"] == "BTCUSD"
    assert data["action"] in {"BUY", "SELL"}
