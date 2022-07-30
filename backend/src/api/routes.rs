use actix_web::web;

use super::handlers;

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .route("/health", web::get().to(handlers::health))
            .route("/orders", web::post().to(handlers::create_order))
            .route("/signals/{symbol}", web::get().to(handlers::get_signal)),
    );
}
