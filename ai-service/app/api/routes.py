from fastapi import APIRouter

from app.models.schemas import PredictionResponse
from app.services.forecaster import forecast_price
from app.simulations.rl_agent import simulate_policy

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/predict/{symbol}", response_model=PredictionResponse)
def predict(symbol: str) -> PredictionResponse:
    forecast, confidence = forecast_price(symbol)
    action = simulate_policy(forecast)
    return PredictionResponse(
        symbol=symbol.upper(),
        action=action,
        confidence=confidence,
        forecast_price=forecast,
        horizon_minutes=15,
    )
