
This project provides a global price index for the BTC/USDT trading pair by fetching order book data from multiple exchanges. It computes the mid-price (average of best bid and best ask) for each exchange and returns the average of these mid-prices through a REST API.

Features

    - Fetches order book data from multiple exchanges using both REST and WebSocket protocols.
    - Computes mid-prices and provides a global price index.
    - Extensible to add new exchanges easily.
    - Reliable and battle-tested implementation.

1- Technologies

    Node.js
    TypeScript
    Express
    Axios
    WebSocket

2- Setup

********Clone the Repository: 

    git clone <repository_url>
    cd TEST-FLOWDESK

********Install Dependencies:

npm install

********Configure Environment Variables:

    Create a .env file and add necessary configurations for exchange APIs.

********Run the Application:

    npm run dev

3- API Endpoints
Get Global Price Index

    URL: /api/price-index
    Method: GET
    Response: json

    {
      "globalPriceIndex": 12345.67
    }

4- Testing

********To run tests, use the following command:

    npm test

