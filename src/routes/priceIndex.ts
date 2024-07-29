import express from 'express';
import { getBinanceMidPrice } from '../services/binanceService';
import { getKrakenMidPrice } from '../services/krakenService';
import { getHuobiMidPrice } from '../services/huobiService';

const router = express.Router();

router.get('/price-index', async (req, res) => {
  try {
    const [binancePrice, krakenPrice, huobiPrice] = await Promise.all([
      getBinanceMidPrice(),
      getKrakenMidPrice(),
      getHuobiMidPrice()
    ]);
    const globalMidPrice = (binancePrice + krakenPrice + huobiPrice) / 3;
    res.json({ globalMidPrice });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

export default router;
