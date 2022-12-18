import { GlassPanel } from './GlassPanel';
import { useMarketStore } from 'hooks/useMarketStore';

export const TradesPanel = () => {
  const trades = useMarketStore((s) => s.trades);
  return (
    <GlassPanel>
      <h3>Trades</h3>
      <ul className="trade-list">
        {trades.length === 0 ? <li>No trades yet</li> : trades.map((t) => <li key={t.id}>{t.symbol} {t.side} {t.quantity}@{t.price}</li>)}
      </ul>
    </GlassPanel>
  );
};
