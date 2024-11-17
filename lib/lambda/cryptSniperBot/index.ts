import { Handler } from 'aws-cdk-lib/aws-lambda';
import axios from 'axios';
import { buyOrSell, formatNumber, toCandlestick, volumeChange } from './helper'
import { Candlestick } from './type';



interface KLineResponse {
  data: any[];
}

interface TradingChange {
  volume: number;
  changePercent: string;
  marketWinOperate: string;
  closePrice: number;
}

async function getTradingChanges(symbol: string, interval: string): Promise<TradingChange | null> {
  try {
    const response: KLineResponse = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol: symbol,
        interval: interval,
        limit: 3,
      },
    });

    const candlesticks: Candlestick[] = response.data.map((kline) => (toCandlestick(kline)));


    const lastCandleSticks = candlesticks[1];
    const last2CandleSticks = candlesticks[0];

    const volume = lastCandleSticks.quoteAssetVolume;
    const changePercent = volumeChange(lastCandleSticks, last2CandleSticks);
    const marketWinOperate = buyOrSell(candlesticks[1]);
    const closePrice = lastCandleSticks.close;

    return { volume, changePercent, marketWinOperate, closePrice };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const handler: Handler = async () => {
  const telegramBotToken = process.env.TELEGRAM_CRYPT_SNIPER_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CRYPT_CHAT_GROUP_ID;

  const symbols = ['DYDXUSDT', 'BTCUSDT'];
  let message = "Trading volume in 15m:\n";

  for (const symbol of symbols) {
    const marketStatus = await getTradingChanges(symbol, '15m');

    if (marketStatus !== null) {
      const { volume, changePercent, marketWinOperate, closePrice } = marketStatus;
      console.log(`${symbol}: ${volume} USDT (${marketWinOperate} ${changePercent})`);
      const formattedVolumes = formatNumber(volume);
      const formattedClosePrice = formatNumber(closePrice);

      message += `- ${symbol}: Vol ${formattedVolumes} USDT (${marketWinOperate} ${changePercent}), Closed at: ${formattedClosePrice} USDT \n`;
    }
  }

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message", error);
  }
};
