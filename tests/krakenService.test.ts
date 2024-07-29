import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getKrakenMidPrice } from '../src/services/krakenService';
import { CONFIG } from '../src/config/config';

describe('getKrakenMidPrice', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should calculate the mid-price correctly from Kraken API response', async () => {
    mock.onGet(CONFIG.KRAKEN_API_URL, { params: { pair: CONFIG.SYMBOLS.KRAKEN, count: 5 } })
      .reply(200, {
        result: {
          [CONFIG.SYMBOLS.KRAKEN]: {
            asks: [['10000', '1']],
            bids: [['9900', '1']],
          }
        }
      });

    const midPrice = await getKrakenMidPrice();
    expect(midPrice).toBe((10000 + 9900) / 2);
  });

  it('should handle errors from the Kraken API', async () => {
    mock.onGet(CONFIG.KRAKEN_API_URL, { params: { pair: CONFIG.SYMBOLS.KRAKEN, count: 5 } })
      .reply(500, { error: 'Internal Server Error' });

    await expect(getKrakenMidPrice()).rejects.toThrow('Request failed with status code 500');
  });

  it('should handle missing data in the Kraken API response', async () => {
    mock.onGet(CONFIG.KRAKEN_API_URL, { params: { pair: CONFIG.SYMBOLS.KRAKEN, count: 5 } })
      .reply(200, {
        result: {
          [CONFIG.SYMBOLS.KRAKEN]: {
            asks: [],
            bids: [],
          }
        }
      });

    await expect(getKrakenMidPrice()).rejects.toThrow('Cannot read properties of undefined (reading \'0\')');
  });
});
