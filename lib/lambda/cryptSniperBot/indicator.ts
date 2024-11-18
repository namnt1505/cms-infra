import { CandleStick } from './type';

export function findNearestResistances(candleSticks: CandleStick[]): number[] {
  if (candleSticks.length < 3) return [];

  const currentPrice = candleSticks[candleSticks.length - 1].close;
  const resistances: number[] = [];

  for (let i = candleSticks.length - 2; i > 0; i--) {
    const previousHigh = candleSticks[i - 1].high;
    const currentHigh = candleSticks[i].high;
    const nextHigh = candleSticks[i + 1].high;

    if (currentHigh > previousHigh && currentHigh > nextHigh && currentHigh > currentPrice) {
      if (resistances.length === 0 || currentHigh > resistances[resistances.length - 1]) {
        resistances.push(currentHigh);
      }
      if (resistances.length === 2) {
        break;
      }
    }
  }

  return resistances;
}

export function findNearestSupports(candleSticks: CandleStick[]): number[] {
  if (candleSticks.length < 3) return [];

  const currentPrice = candleSticks[candleSticks.length - 1].close;
  const supports: number[] = [];

  for (let i = candleSticks.length - 2; i > 0; i--) {
    const previousLow = candleSticks[i - 1].low;
    const currentLow = candleSticks[i].low;
    const nextLow = candleSticks[i + 1].low;

    if (currentLow < previousLow && currentLow < nextLow && currentLow < currentPrice) {
      if (supports.length === 0 || currentLow < supports[supports.length - 1]) {
        supports.push(currentLow);
      }
      if (supports.length === 2) {
        break;
      }
    }
  }

  return supports;
}