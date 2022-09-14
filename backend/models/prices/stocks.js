const Prices = require("./prices");
const cacheProvider = require("../../utils/cache-provider");

const stocksCacheTTL = 86400;

class StockPrices extends Prices {
  constructor(assets, currency, creator) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "stocks";
    this.creator = creator;
  }

  async getPricesPerAssets(apiKey) {
    let currentPrices;

    if (
      cacheProvider.instance().has(this.category + "_prices_" + this.creator)
    ) {
      currentPrices = cacheProvider
        .instance()
        .get(this.category + "_prices_" + this.creator);
    } else {
      currentPrices = this.fetchStockPrices(apiKey, stocksCacheTTL);
    }

    return currentPrices;
  }
}

module.exports = StockPrices;
