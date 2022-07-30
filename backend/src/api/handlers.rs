use actix_web::{web, HttpResponse, Responder};

use crate::{
    api::state::AppState,
    models::order::CreateOrderRequest,
    services::{ai_client, orders},
};

pub async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({"status": "ok"}))
}

pub async fn create_order(payload: web::Json<CreateOrderRequest>) -> impl Responder {
    let order = orders::create_order(payload.into_inner()).await;
    HttpResponse::Accepted().json(order)
}

pub async fn get_signal(state: web::Data<AppState>, symbol: web::Path<String>) -> impl Responder {
    match ai_client::fetch_signal(&state.settings.ai_service_url, &symbol).await {
        Ok(signal) => HttpResponse::Ok().json(signal),
        Err(err) => HttpResponse::BadGateway().json(serde_json::json!({"error": err.to_string()})),
    }
}
