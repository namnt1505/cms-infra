export type MarketOperate = 'BUY' | 'SELL';

export interface CandleStick {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

export interface KLineResponse {
  data: any[];
}

export interface TradingChange {
  volume: number;
  changePercent: string;
  marketWinOperate: string;
  closePrice: number;
  nearestResistances: number[];
  nearestSupports: number[];
}