const cacheProvider = require("../../utils/cache-provider");
const Prices = require("./prices");

const etfCacheTTL = 86400;

class ETFPrices extends Prices {
  constructor(assets, currency) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "etf";
  }

  async getPricesPerAssets() {
    let currentPrices;

    if (cacheProvider.instance().has(this.category + "_prices")) {
      currentPrices = cacheProvider.instance().get(this.category + "_prices");
    } else {
      currentPrices = await this.fetchStockPrices(etfCacheTTL);
    }

    return currentPrices;
  }
}

module.exports = ETFPrices;
