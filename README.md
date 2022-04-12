# AI Trading Exchange

A production-oriented, multi-service AI trading exchange built with React + TypeScript, Rust backend APIs, Rust/WASM chart acceleration, and a Python AI prediction engine.

<a href="https://nathswealthgw.github.io/AI-Trading-Exchange/">
  <img src="/images/app-image.png" width="100%" />
</a>

---

🔗 **[Live Demo](https://nathswealthgw.github.io/AI-Trading-Exchange/)**

</div>

> **Note:** - This dashboard is for demonstration purposes only.

---

## Problem Statement

Retail and institutional traders need low-latency execution, transparent portfolio state, and AI-assisted directional signals in one cohesive platform. Existing stacks frequently split analytics, execution, and model services across disconnected systems, increasing operational and cognitive overhead.

## Solution

This repository provides a full-stack exchange architecture with:
- A responsive trading UI built for real-time workflows.
- A high-performance Rust API layer for order handling and integration orchestration.
- A dedicated AI FastAPI service for transformer-style forecasting outputs and RL policy simulation.
- Kafka + Redis for event streaming and low-latency cache access.
- PostgreSQL persistence for portfolios and executed trades.

## Tech Stack

- Frontend: React, TypeScript, Vite, Zustand, Framer Motion
- Performance Components: Rust + WebAssembly (`wasm-bindgen`)
- Backend: Rust, Actix-Web, SQLx, Redis, Kafka (`rdkafka`)
- AI Module: Python, FastAPI, NumPy, Torch-ready interfaces
- Data Layer: PostgreSQL
- Streaming: Kafka and Redis
- Infra: Docker Compose, GitHub Actions CI

## Architecture Decisions

1. Service decomposition:
   - Frontend, backend, and AI service are isolated for independent scaling and deploy cadence.
2. Rust for core APIs:
   - Memory safety + predictable performance for order and market event handling.
3. AI service isolation:
   - Model lifecycle and experiment velocity stay independent from exchange API deployment.
4. Event-driven distribution:
   - Kafka fans out market events and model signals for extensible consumers.
5. Hot-path caching:
   - Redis stores latest prices/order snapshots for fast UI reads.

## Key Features

### Real-Time Trading Workspace
- Market dashboard, order book, trades, portfolio, AI signals, and trade history in glassmorphism panels.
- Dark mode toggle + responsive layout.

```tsx
<main className={darkMode ? 'theme-dark app-shell' : 'theme-light app-shell'}>
  <Sidebar darkMode={darkMode} onToggleTheme={toggleTheme} />
  <div className="content-grid">
    <MarketDashboard />
    <OrderBook />
    <TradesPanel />
    <PortfolioPanel />
    <AISignalPanel />
    <TradeHistory />
  </div>
</main>
```

### AI Signal Endpoint
- Predictive endpoint returning confidence, action, and horizon.

```python
@router.get("/predict/{symbol}", response_model=PredictionResponse)
def predict(symbol: str) -> PredictionResponse:
    forecast, confidence = forecast_price(symbol)
    action = simulate_policy(forecast)
    return PredictionResponse(
        symbol=symbol.upper(),
        action=action,
        confidence=confidence,
        forecast_price=forecast,
        horizon_minutes=15,
    )
```

### Rust API Orchestration
- Backend consumes AI signals and accepts order placement requests.

```rust
pub async fn get_signal(state: web::Data<AppState>, symbol: web::Path<String>) -> impl Responder {
    match ai_client::fetch_signal(&state.settings.ai_service_url, &symbol).await {
        Ok(signal) => HttpResponse::Ok().json(signal),
        Err(err) => HttpResponse::BadGateway().json(serde_json::json!({"error": err.to_string()})),
    }
}
```

## Results

Target outcomes for this baseline architecture:
- <100ms median API response for non-blocking order acceptance in local docker setup.
- 15-second default observability scrape cadence for service health baselines.
- Horizontal scalability path for independent frontend/backend/AI replicas.
- Event-ready pipeline for high-frequency market feeds via Kafka topics.

## Detailed Setup Instructions

1. Prerequisites
   - Docker + Docker Compose
   - Rust toolchain (for local backend/wasm development)
   - Node.js 20+
   - Python 3.12+

2. Environment
   - Copy environment template:
     - `cp .env.example .env`

3. Start full platform
   - `docker compose up -d --build`

4. Local development (optional)
   - Frontend:
     - `cd frontend && npm install && npm run dev`
   - Backend:
     - `cargo run -p ai-trading-backend`
   - AI service:
     - `cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload`

5. Smoke checks
   - Backend health: `curl http://localhost:8080/api/v1/health`
   - AI health: `curl http://localhost:8000/v1/health`
   - AI prediction: `curl http://localhost:8000/v1/predict/BTCUSD`

## GitHub Pages Live Demo

This repository now includes a standalone animated demo page that can be hosted directly on GitHub Pages.

- Demo source: `docs/live-demo/`
- Entry point: `docs/live-demo/index.html`
- Auto-deploy workflow: `.github/workflows/pages.yml`

### Enable on your repo

1. Push to your default branch (`main` or `master`).
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Trigger the workflow **Deploy Live Demo to GitHub Pages** (or push a change under `docs/live-demo/`).

Once deployed, the site will be available at:

`https://<your-github-username>.github.io/<your-repo-name>/`

### If deployment fails

Use this quick checklist:

1. Open **Actions** and verify both `ci` and `Deploy Live Demo to GitHub Pages` jobs are green.
2. If `ai` CI fails with import issues, ensure CI runs tests from `ai-service` (already configured in `.github/workflows/ci.yml`).
3. If `Deploy Live Demo to GitHub Pages` does not start, confirm your push was on `main` or `master` and changed one of:
   - `docs/live-demo/**`
   - `.github/workflows/pages.yml`
   - `README.md`
4. In **Settings → Pages**, confirm source is still **GitHub Actions**.
5. Re-run the workflow manually from **Actions → Deploy Live Demo to GitHub Pages → Run workflow**.

## Repository Structure
```text
AI-Trading-Exchange/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── pages.yml
│
├── ai-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── core/
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── forecaster.py
│   │   └── simulations/
│   │       ├── __init__.py
│   │       └── rl_agent.py
│   └── tests/
│       └── test_routes.py
│
├── backend/
│   ├── Cargo.toml
│   ├── Dockerfile
│   ├── migrations/
│   │   └── 0001_init.sql
│   └── src/
│       ├── main.rs
│       ├── api/
│       │   ├── mod.rs
│       │   ├── handlers.rs
│       │   ├── routes.rs
│       │   └── state.rs
│       ├── config/
│       │   └── mod.rs
│       ├── db/
│       │   ├── mod.rs
│       │   └── postgres.rs
│       ├── models/
│       │   ├── mod.rs
│       │   ├── ai.rs
│       │   ├── order.rs
│       │   └── trade.rs
│       ├── services/
│       │   ├── mod.rs
│       │   ├── ai_client.rs
│       │   └── orders.rs
│       └── streaming/
│           ├── mod.rs
│           ├── kafka.rs
│           └── redis_cache.rs
│
├── docs/
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/
│       │   ├── AISignalPanel.tsx
│       │   ├── GlassPanel.tsx
│       │   ├── MarketDashboard.tsx
│       │   ├── OrderBook.tsx
│       │   ├── PortfolioPanel.tsx
│       │   ├── Sidebar.tsx
│       │   ├── TradeHistory.tsx
│       │   └── TradesPanel.tsx
│       ├── hooks/
│       │   └── useMarketStore.ts
│       ├── services/
│       │   └── api.ts
│       ├── styles/
│       │   └── global.css
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           └── wasmLoader.ts
│
├── images/
│   └── app-image.png
│
├── infra/
│   ├── grafana/
│   │   └── dashboards.yml
│   ├── kafka/
│   │   └── README.md
│   ├── postgres/
│   │   └── init.sql
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── redis/
│       └── README.md
│
├── scripts/
│   └── bootstrap.sh
│
└── wasm-charts/
│   ├── Cargo.toml
│    └── src/
│        └── lib.rs
│
├── .env.example
├── .gitignore
├── Cargo.toml
├── LICENSE
├── README.md
└── docker-compose.yml
```