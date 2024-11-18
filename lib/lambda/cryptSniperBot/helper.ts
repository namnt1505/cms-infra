import { CandleStick, MarketOperate } from './type';

export const buyOrSell = (CandleStick: CandleStick): MarketOperate => {
  const { open, close } = CandleStick;
  console.log({
    open,
    close,
  });
  if (open < close) {
    return 'BUY';
  }
  return 'SELL';
};

export const toCandleStick = (kline: any[]): CandleStick => ({
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

export const volumeChange = (currentStick: CandleStick, lastStick: CandleStick): string => {
  const change = Math.abs((currentStick.quoteAssetVolume - lastStick.quoteAssetVolume) / lastStick.quoteAssetVolume) * 100;
  const sign = currentStick.quoteAssetVolume - lastStick.quoteAssetVolume ? '+' : '-';
  return `${sign}${Math.abs(change).toFixed(2)}%`;
}

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(number);
}

export function escapeMessage(text: string): string {
  return text.replace(/([_[\]()~`<>#+\-=|{}.!\/\\])/g, '\\$1');
}

export const getLatestCandleSticks = (candleSticks: CandleStick[]) => {
  const latestSticks = candleSticks.slice(-3);

  return {
    last2CandleSticks: latestSticks[0],
    lastCandleSticks: latestSticks[1],
    currentSticks: latestSticks[2],
  };

}