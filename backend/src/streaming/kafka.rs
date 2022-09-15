use rdkafka::config::ClientConfig;
use rdkafka::producer::{FutureProducer, FutureRecord};

pub fn producer(brokers: &str) -> FutureProducer {
    ClientConfig::new()
        .set("bootstrap.servers", brokers)
        .create()
        .expect("valid kafka producer")
}

pub async fn publish_market_event(producer: &FutureProducer, topic: &str, payload: &str) {
    let _ = producer
        .send(FutureRecord::to(topic).payload(payload).key("market"), std::time::Duration::from_secs(1))
        .await;
}
