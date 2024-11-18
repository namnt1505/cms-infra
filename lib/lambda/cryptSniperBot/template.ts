import { formatNumber } from './helper';
import { TradingChange } from './type';

export const messageTemplate = (symbol: string, marketStatus: TradingChange): string => {
  const { volume, changePercent, marketWinOperate, closePrice, nearestResistances, nearestSupports } = marketStatus;
  const formattedVolumes = formatNumber(volume);
  const formattedClosePrice = formatNumber(closePrice);
  const formattedResistance = nearestResistances.map((resistance) => formatNumber(resistance)).join(', ');
  const formattedSupport = nearestSupports.map((support) => formatNumber(support)).join(', ');

  let message = `● *${symbol}:* \n`;
  message += `  - Vol   : ${formattedVolumes} USDT (${marketWinOperate} ${changePercent}) \n`;
  message += `  - Price: *${formattedClosePrice}* USDT \n`;
  message += `  - Resist: ${formattedResistance} USDT \n`;
  message += `  - Support: ${formattedSupport} USDT \n`;

  return message;
}