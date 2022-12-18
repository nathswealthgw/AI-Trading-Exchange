import { GlassPanel } from './GlassPanel';

export const OrderBook = () => (
  <GlassPanel>
    <h3>Order Book</h3>
    <div className="order-grid">
      <div>
        <h4 className="buy">Buys</h4>
        <p>120.34 · 2.1</p>
      </div>
      <div>
        <h4 className="sell">Sells</h4>
        <p>120.40 · 1.8</p>
      </div>
    </div>
  </GlassPanel>
);
