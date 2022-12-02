def simulate_policy(forecast_price: float) -> str:
    return "BUY" if forecast_price >= 120 else "SELL"
