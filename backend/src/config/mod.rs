use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Settings {
    pub port: u16,
    pub database_url: String,
    pub ai_service_url: String,
    pub kafka_brokers: String,
    pub redis_url: String,
}

impl Settings {
    pub fn from_env() -> anyhow::Result<Self> {
        let cfg = config::Config::builder()
            .add_source(config::Environment::default().separator("__"))
            .build()?;
        Ok(cfg.try_deserialize()?)
    }
}
