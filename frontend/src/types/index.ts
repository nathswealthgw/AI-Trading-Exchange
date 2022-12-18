export type Side = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  symbol: string;
  side: Side;
  price: number;
  quantity: number;
  timestamp: string;
}

export interface Signal {
  symbol: string;
  action: Side;
  confidence: number;
  forecastPrice: number;
}
