import { getMovingAverage } from './indicator';
import { CandleStick } from './type';

export function analyticMovingAverageAndPrice(
  candleSticks: CandleStick[],
  period: number
) {
  const currentStick = candleSticks[candleSticks.length - 2];

  const movingAverage = getMovingAverage(candleSticks, period);

  const currentPrice = currentStick.close;

  const isMABetweenCloseAndOpen =
    (movingAverage > currentStick.open && movingAverage < currentStick.close) ||
    (movingAverage < currentStick.open && movingAverage > currentStick.close);

  let commentsAboutPriceAndMA = '';

  if (isMABetweenCloseAndOpen) {
    const shouldBuySell = movingAverage > currentPrice ? 'BUY' : 'SELL';
    const isLowerThanPrice = movingAverage < currentPrice ? 'lower' : 'higher';
    commentsAboutPriceAndMA = `MA${period}: ${movingAverage.toFixed(4)} - ${shouldBuySell} - ${isLowerThanPrice} than current price`;
  }

  return commentsAboutPriceAndMA;
}
