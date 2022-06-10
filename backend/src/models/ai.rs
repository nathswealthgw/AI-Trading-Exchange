use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiSignal {
    pub symbol: String,
    pub confidence: f64,
    pub action: String,
    pub forecast_price: f64,
    pub horizon_minutes: u32,
}
