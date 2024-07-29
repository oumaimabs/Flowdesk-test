import axios from 'axios';
import { CONFIG } from '../config/config';

export async function getKrakenMidPrice(): Promise<number> {
  try {
    const response = await axios.get(CONFIG.KRAKEN_API_URL, {
      params: { pair: CONFIG.SYMBOLS.KRAKEN, count: 5 }
    });
    const { asks, bids } = response.data.result[CONFIG.SYMBOLS.KRAKEN];
    const bestAsk = parseFloat(asks[0][0]);
    const bestBid = parseFloat(bids[0][0]);
    return (bestAsk + bestBid) / 2;
  } catch (error) {
    console.error('Error fetching Kraken order book:', error);
    throw error;
  }
}
