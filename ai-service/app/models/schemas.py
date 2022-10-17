from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    symbol: str
    action: str = Field(pattern="^(BUY|SELL)$")
    confidence: float
    forecast_price: float
    horizon_minutes: int
