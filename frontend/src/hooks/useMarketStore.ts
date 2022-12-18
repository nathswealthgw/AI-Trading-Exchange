import { create } from 'zustand';
import { Signal, Trade } from 'types';

interface MarketState {
  darkMode: boolean;
  trades: Trade[];
  signals: Signal[];
  toggleTheme: () => void;
  pushTrade: (trade: Trade) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  darkMode: true,
  trades: [],
  signals: [],
  toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
  pushTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades].slice(0, 40) }))
}));
