import { Candlestick, MarketOperate, TradingChange } from './type';

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


export const getResistances = (candlesticks: Candlestick[]): number[] => {
  const resistances = candlesticks.map((candlestick) => candlestick.high);
  return resistances;
}

export function escapeMessage(text: string): string {
  return text.replace(/([_[\]()~`<>#+\-=|{}.!\/\\])/g, '\\$1');
}


export const messageTemplate = (symbol: string, marketStatus: TradingChange): string => {
  const { volume, changePercent, marketWinOperate, closePrice } = marketStatus;
  const formattedVolumes = formatNumber(volume);
  const formattedClosePrice = formatNumber(closePrice);

  let message = `● *${symbol}:* \n`;
  message += `  - Vol   : ${formattedVolumes} USDT (${marketWinOperate} ${changePercent}) \n`;
  message += `  - Closed: ${formattedClosePrice} USDT \n`;

  return message;
}