CREATE TABLE IF NOT EXISTS market_events (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
