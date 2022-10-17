import hashlib

import numpy as np


def forecast_price(symbol: str) -> tuple[float, float]:
    seed = int(hashlib.sha256(symbol.encode()).hexdigest(), 16) % 10_000
    rng = np.random.default_rng(seed)
    base_price = rng.uniform(80.0, 180.0)
    noise = rng.normal(0, 2)
    forecast = float(base_price + noise)
    confidence = float(np.clip(0.6 + abs(noise) / 10, 0.6, 0.95))
    return round(forecast, 2), round(confidence, 2)
