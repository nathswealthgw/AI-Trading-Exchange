mod api;
mod config;
mod db;
mod models;
mod services;
mod streaming;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use config::Settings;
use tracing_subscriber::EnvFilter;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let settings = Settings::from_env().expect("failed to read settings");
    let pool = db::postgres::connect(&settings.database_url)
        .await
        .expect("failed to connect postgres");

    let state = web::Data::new(api::state::AppState::new(settings.clone(), pool));

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(Cors::permissive())
            .configure(api::routes::config)
    })
    .bind(("0.0.0.0", settings.port))?
    .run()
    .await
}
