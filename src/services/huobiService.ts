import WebSocket from 'ws';
import { CONFIG } from '../config/config';
import zlib from 'zlib';

export async function getHuobiMidPrice(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const ws = new WebSocket(CONFIG.HUOBI_WS_URL);
    ws.on('open', () => {
      ws.send(JSON.stringify({
        sub: `market.${CONFIG.SYMBOLS.HUOBI}.depth.step0`,
        id: 'depth'
      }));
    });
    ws.on('message', (data: WebSocket.MessageEvent) => {
      if (Buffer.isBuffer(data)) {
        zlib.gunzip(data, (err, decompressed) => {
          if (err) {
            console.error('Error decompressing data:', err);
            ws.close();
            reject(err);
            return;
          }
          const message = decompressed.toString();
          try {
            const json = JSON.parse(message);

            if (json.ch === `market.${CONFIG.SYMBOLS.HUOBI}.depth.step0`) {
              const { asks, bids } = json.tick;
              if (asks && bids && asks.length > 0 && bids.length > 0) {
                const bestAsk = parseFloat(asks[0][0]);
                const bestBid = parseFloat(bids[0][0]);

                if (!isNaN(bestAsk) && !isNaN(bestBid)) {
                  ws.close();
                  resolve((bestAsk + bestBid) / 2);
                } else {
                  throw new Error('Invalid data: Best ask or bid price is not a number');
                }
              } else {
                throw new Error('Invalid data: Ask or bid arrays are empty');
              }
            }
          } catch (error) {
            console.error('Error processing message:', error);
            ws.close();
            reject(error);
          }
        });
      } else {
        console.error('Unexpected data format:', data);
        ws.close();
        reject(new Error('Unexpected data format'));
      }
    });

    ws.on('error', (error) => {
      console.error('Error with Huobi WebSocket:', error);
      ws.close();
      reject(error);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    const timeout = setTimeout(() => {
      console.error('Timeout waiting for WebSocket message');
      ws.close();
      reject(new Error('Timeout waiting for WebSocket message'));
    }, 10000); 

    ws.on('message', () => {
      clearTimeout(timeout);
    });
  });
}
