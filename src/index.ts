import express from 'express';

import priceIndexRouter from './routes/priceIndex';
import { CONFIG } from './config/config';

const app = express();
const PORT = CONFIG.PORT;
app.use('/api', priceIndexRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
