import { Handler } from 'aws-cdk-lib/aws-lambda';
import axios from 'axios';
import { buyOrSell, escapeMessage, getLatestCandleSticks, toCandleStick, volumeChange } from './helper'
import { CandleStick, KLineResponse, TradingChange } from './type';
import { findNearestResistances, findNearestSupports } from './indicator';
import { messageTemplate } from './template';


async function getTradingChanges(symbol: string, interval: string): Promise<TradingChange | null> {
  try {
    const response: KLineResponse = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol,
        interval: interval,
        limit: 50,
      },
    });

    const candleSticks: CandleStick[] = response.data.map((kline) => (toCandleStick(kline)));


    const { last2CandleSticks, lastCandleSticks } = getLatestCandleSticks(candleSticks);

    const volume = lastCandleSticks.quoteAssetVolume;
    const changePercent = volumeChange(lastCandleSticks, last2CandleSticks);
    const marketWinOperate = buyOrSell(lastCandleSticks);
    const closePrice = lastCandleSticks.close;
    const nearestResistances = findNearestResistances(candleSticks);
    const nearestSupports = findNearestSupports(candleSticks);

    return { volume, changePercent, marketWinOperate, closePrice, nearestResistances, nearestSupports };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const handler: Handler = async () => {
  const telegramBotToken = process.env.TELEGRAM_CRYPT_SNIPER_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CRYPT_CHAT_GROUP_ID;

  const symbols = ['DYDXUSDT'];
  let message = "Trading volume in 30m:\n";

  const promise = symbols.map(async (symbol) => {
    const marketStatus = await getTradingChanges(symbol, '30m');

    if (marketStatus !== null) {
      const subMessage = messageTemplate(symbol, marketStatus);
      message += `${subMessage} \n`;
    }
    return;
  });

  await Promise.all(promise);

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: escapeMessage(message),
      parse_mode: 'MarkdownV2',
    });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message", error);
  }
};
