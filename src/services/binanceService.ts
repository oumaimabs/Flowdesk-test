import axios from 'axios';
import { CONFIG } from '../config/config';

export async function getBinanceMidPrice(): Promise<number> {
  try {
    const response = await axios.get(CONFIG.BINANCE_API_URL, {
      params: { symbol: CONFIG.SYMBOLS.BINANCE, limit: 5 }
    });
    const { asks, bids } = response.data;
    const bestAsk = parseFloat(asks[0][0]);
    const bestBid = parseFloat(bids[0][0]);
    return (bestAsk + bestBid) / 2;
  } catch (error) {
    console.error('Error fetching Binance order book:', error);
    throw error;
  }
}
