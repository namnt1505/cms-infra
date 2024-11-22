import { formatNumber } from './helper';
import { TradingChange } from './type';

export const report = (symbol: string, marketStatus: TradingChange): string => {
  const {
    volume,
    changePercent,
    marketWinOperate,
    closePrice,
    nearestResistances,
    nearestSupports,
    analyticResult
  } = marketStatus;
  const formattedVolumes = formatNumber(volume);
  const formattedClosePrice = formatNumber(closePrice);
  const formattedResistance = nearestResistances
    .map((resistance) => formatNumber(resistance))
    .join(', ');
  const formattedSupport = nearestSupports
    .map((support) => formatNumber(support))
    .join(', ');

  const analyticComments = analyticResult.commentsAboutPriceAndMA.filter(
    (comment) => comment !== ''
  );

  let message = `● *${symbol}:* \n`;
  message += `  - Vol   : ${formattedVolumes} USDT (${marketWinOperate} ${changePercent}) \n`;
  message += `  - Price: *${formattedClosePrice}* USDT \n`;
  message += `  - Resist: ${formattedResistance} USDT \n`;
  message += `  - Support: ${formattedSupport} USDT \n`;

  if (analyticComments.length > 0) {
    message += `  - Analytic: \n`;
    analyticComments.forEach((comment) => {
      message += `    - ${comment} \n`;
    });
  }

  return message;
};
