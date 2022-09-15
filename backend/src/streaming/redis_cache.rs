use redis::AsyncCommands;

pub async fn cache_last_price(redis_url: &str, symbol: &str, price: f64) -> redis::RedisResult<()> {
    let client = redis::Client::open(redis_url)?;
    let mut conn = client.get_multiplexed_async_connection().await?;
    conn.set_ex(format!("price:{}", symbol), price, 10).await
}
