import { GlassPanel } from './GlassPanel';

export const TradeHistory = () => (
  <GlassPanel>
    <h3>Trade History</h3>
    <table>
      <thead><tr><th>Time</th><th>Symbol</th><th>Side</th><th>Price</th></tr></thead>
      <tbody><tr><td>12:00</td><td>BTCUSD</td><td className="buy">BUY</td><td>120.10</td></tr></tbody>
    </table>
  </GlassPanel>
);
