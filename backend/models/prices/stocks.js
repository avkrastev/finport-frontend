const Prices = require("./prices");
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

    if (cacheProvider.instance().has(this.category + "_prices")) {
      currentPrices = cacheProvider.instance().get(this.category + "_prices");
    } else {
      currentPrices = this.fetchStockPrices(stocksCacheTTL);
    }

    return currentPrices;
  }
}

module.exports = StockPrices;
