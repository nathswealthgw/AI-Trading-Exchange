import { useState } from 'react';
import { AISignalPanel } from 'components/AISignalPanel';
import { MarketDashboard } from 'components/MarketDashboard';
import { OrderBook } from 'components/OrderBook';
import { PortfolioPanel } from 'components/PortfolioPanel';
import { Sidebar } from 'components/Sidebar';
import { TradeHistory } from 'components/TradeHistory';
import { TradesPanel } from 'components/TradesPanel';
import { useMarketStore } from 'hooks/useMarketStore';

export const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const darkMode = useMarketStore((s) => s.darkMode);
  const toggleTheme = useMarketStore((s) => s.toggleTheme);

  return (
    <main className={darkMode ? 'theme-dark app-shell' : 'theme-light app-shell'}>
      <Sidebar
        darkMode={darkMode}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        onToggleTheme={toggleTheme}
      />
      <div className="content-grid">
        <MarketDashboard />
        <OrderBook />
        <TradesPanel />
        <PortfolioPanel />
        <AISignalPanel />
        <TradeHistory />
      </div>
    </main>
  );
};
