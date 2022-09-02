const Prices = require('./prices');
const yahooStockPrices = require("yahoo-stock-prices");
const cacheProvider = require("../../utils/cache-provider");

const stocksCacheTTL = 86400;

class StockPrices extends Prices {
  constructor(assets, currency) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "stocks";
  }

  async getPricesPerAssets() {
    let currentPrices;

    currentPrices = this.retrieveFromCache();
    if (currentPrices.length === 0) {
      let prices = [];
      for (let ticker of this.assets) {
        const data = await yahooStockPrices.getCurrentData(ticker);
        prices[ticker] = data;
      }
      cacheProvider
        .instance()
        .set(this.category + "_prices", prices, stocksCacheTTL);
      currentPrices = prices;
    }

    return currentPrices;
  }
}

module.exports = StockPrices;
