import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getBinanceMidPrice } from '../src/services/binanceService';
import { CONFIG } from '../src/config/config';

describe('getBinanceMidPrice', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should calculate the mid-price correctly from Binance API response', async () => {
    // Mock the Axios GET request
    mock.onGet(CONFIG.BINANCE_API_URL, { params: { symbol: CONFIG.SYMBOLS.BINANCE, limit: 5 } })
      .reply(200, {
        asks: [['10000', '1']],
        bids: [['9900', '1']],
      });

    const midPrice = await getBinanceMidPrice();
    expect(midPrice).toBe((10000 + 9900) / 2);
  });

  it('should handle errors from the Binance API', async () => {
    mock.onGet(CONFIG.BINANCE_API_URL, { params: { symbol: CONFIG.SYMBOLS.BINANCE, limit: 5 } })
      .reply(500, { error: 'Internal Server Error' });

    await expect(getBinanceMidPrice()).rejects.toThrow('Request failed with status code 500');
  });

  it('should handle missing data in the Binance API response', async () => {
    mock.onGet(CONFIG.BINANCE_API_URL, { params: { symbol: CONFIG.SYMBOLS.BINANCE, limit: 5 } })
      .reply(200, {
        asks: [],
        bids: [],
      });

    await expect(getBinanceMidPrice()).rejects.toThrow('Cannot read properties of undefined (reading \'0\')');
  });
});
