use crate::models::order::{CreateOrderRequest, Order};
use chrono::Utc;
use uuid::Uuid;

pub async fn create_order(input: CreateOrderRequest) -> Order {
    Order {
        id: Uuid::new_v4(),
        symbol: input.symbol,
        side: input.side,
        quantity: input.quantity,
        limit_price: input.limit_price,
        status: "accepted".to_string(),
        created_at: Utc::now(),
    }
}
