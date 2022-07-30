use crate::config::Settings;
use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub settings: Settings,
    pub db: PgPool,
}

impl AppState {
    pub fn new(settings: Settings, db: PgPool) -> Self {
        Self { settings, db }
    }
}
