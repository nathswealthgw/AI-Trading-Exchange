use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Candle {
    pub ts: u64,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: f64,
}

#[wasm_bindgen]
pub fn smooth_prices(candles: JsValue, alpha: f64) -> Result<JsValue, JsValue> {
    let points: Vec<Candle> = serde_wasm_bindgen::from_value(candles)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let mut last = 0.0;
    let smoothed: Vec<f64> = points
        .iter()
        .enumerate()
        .map(|(idx, c)| {
            if idx == 0 {
                last = c.close;
                c.close
            } else {
                last = alpha * c.close + (1.0 - alpha) * last;
                last
            }
        })
        .collect();

    serde_wasm_bindgen::to_value(&smoothed).map_err(|e| JsValue::from_str(&e.to_string()))
}
