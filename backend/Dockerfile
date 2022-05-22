FROM rust:1.81 as builder
WORKDIR /app
COPY Cargo.toml /app/Cargo.toml
COPY backend /app/backend
COPY wasm-charts /app/wasm-charts
RUN cargo build -p ai-trading-backend --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/ai-trading-backend /usr/local/bin/ai-trading-backend
EXPOSE 8080
CMD ["ai-trading-backend"]
