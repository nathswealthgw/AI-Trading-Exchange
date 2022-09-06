use crate::models::ai::AiSignal;

pub async fn fetch_signal(ai_service_url: &str, symbol: &str) -> Result<AiSignal, reqwest::Error> {
    let url = format!("{}/v1/predict/{}", ai_service_url, symbol);
    reqwest::Client::new().get(url).send().await?.json::<AiSignal>().await
}
