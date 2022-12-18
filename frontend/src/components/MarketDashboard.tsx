import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GlassPanel } from './GlassPanel';

type Candle = {
  ts: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const seedCandles = (): Candle[] => {
  const points: Candle[] = [];
  let price = 62000;

  for (let i = 0; i < 80; i += 1) {
    const drift = (Math.random() - 0.5) * 180;
    const open = price;
    const close = Math.max(1000, open + drift);
    const high = Math.max(open, close) + Math.random() * 110;
    const low = Math.min(open, close) - Math.random() * 110;
    points.push({
      ts: Date.now() - (80 - i) * 1000,
      open,
      high,
      low,
      close
    });
    price = close;
  }

  return points;
};

const smooth = (values: number[], alpha = 0.22) => {
  if (values.length === 0) return values;
  let last = values[0];
  return values.map((v, idx) => {
    if (idx === 0) return v;
    last = alpha * v + (1 - alpha) * last;
    return last;
  });
};

export const MarketDashboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [candles, setCandles] = useState<Candle[]>(() => seedCandles());

  const latest = candles[candles.length - 1];
  const trendUp = latest.close >= latest.open;

  useEffect(() => {
    const timer = setInterval(() => {
      setCandles((prev) => {
        const current = prev[prev.length - 1];
        const open = current.close;
        const close = Math.max(1000, open + (Math.random() - 0.5) * 140);
        const high = Math.max(open, close) + Math.random() * 90;
        const low = Math.min(open, close) - Math.random() * 90;
        const next = { ts: Date.now(), open, high, low, close };
        return [...prev.slice(-79), next];
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const closeSeries = useMemo(() => smooth(candles.map((c) => c.close)), [candles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const minPrice = Math.min(...candles.map((c) => c.low));
    const maxPrice = Math.max(...candles.map((c) => c.high));
    const pad = 24;
    const plotH = height - pad * 2;
    const plotW = width - pad * 2;
    const toY = (v: number) => pad + ((maxPrice - v) / (maxPrice - minPrice || 1)) * plotH;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = pad + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(width - pad, y);
      ctx.stroke();
    }

    const barW = plotW / candles.length;
    candles.forEach((candle, idx) => {
      const x = pad + idx * barW + barW * 0.5;
      const color = candle.close >= candle.open ? '#f0b90b' : '#f6465d';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, toY(candle.low));
      ctx.lineTo(x, toY(candle.high));
      ctx.stroke();

      const bodyTop = toY(Math.max(candle.open, candle.close));
      const bodyBottom = toY(Math.min(candle.open, candle.close));
      const bodyH = Math.max(2, bodyBottom - bodyTop);
      ctx.fillStyle = color;
      ctx.fillRect(x - barW * 0.32, bodyTop, barW * 0.64, bodyH);
    });

    ctx.beginPath();
    ctx.strokeStyle = '#ffdd5b';
    ctx.lineWidth = 2;
    closeSeries.forEach((point, idx) => {
      const x = pad + (idx / (closeSeries.length - 1 || 1)) * plotW;
      const y = toY(point);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [candles, closeSeries]);

  return (
    <GlassPanel>
      <div className="panel-header">
        <h3>BTC/USDT Market Dashboard</h3>
        <span className={trendUp ? 'buy signal-chip' : 'sell signal-chip'}>
          {trendUp ? 'BULLISH FLOW' : 'BEARISH FLOW'}
        </span>
      </div>
      <motion.div className="chart-area" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <canvas ref={canvasRef} className="market-canvas" />
      </motion.div>
      <div className="chart-stats">
        <div><span>Last</span><strong>${latest.close.toFixed(2)}</strong></div>
        <div><span>24h High</span><strong>${Math.max(...candles.map((c) => c.high)).toFixed(2)}</strong></div>
        <div><span>24h Low</span><strong>${Math.min(...candles.map((c) => c.low)).toFixed(2)}</strong></div>
      </div>
    </GlassPanel>
  );
};
