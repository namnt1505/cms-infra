import { Candlestick, MarketOperate } from './type';

export const buyOrSell = (candlestick: Candlestick): MarketOperate => {
  const { open, close } = candlestick;
  if (open < close) {
    return 'BUY';
  }
  return 'SELL';
};

export const toCandlestick = (kline: any[]): Candlestick => ({
  openTime: kline[0],
  open: kline[1],
  high: kline[2],
  low: kline[3],
  close: kline[4],
  volume: kline[5],
  closeTime: kline[6],
  quoteAssetVolume: kline[7],
  numberOfTrades: kline[8],
  takerBuyBaseAssetVolume: kline[9],
  takerBuyQuoteAssetVolume: kline[10],
});

export const volumeChange = (currentStick: Candlestick, lastStick: Candlestick): string => {
  const change = Math.abs((currentStick.quoteAssetVolume - lastStick.quoteAssetVolume) / lastStick.quoteAssetVolume) * 100;
  const sign = currentStick.quoteAssetVolume - lastStick.quoteAssetVolume ? '+' : '-';
  return `${sign}${Math.abs(change).toFixed(2)}%`;
}

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}