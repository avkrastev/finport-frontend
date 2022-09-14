const cacheProvider = require("../../utils/cache-provider");
const Prices = require("./prices");

const etfCacheTTL = 86400;

class ETFPrices extends Prices {
  constructor(assets, currency, creator) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "etf";
    this.creator = creator;
  }

  async getPricesPerAssets() {
    let currentPrices;

    if (cacheProvider.instance().has(this.category + "_prices_" + this.creator)) {
      currentPrices = cacheProvider
        .instance()
        .get(this.category + "_prices_" + this.creator);
    } else {
      currentPrices = await this.fetchStockPrices(etfCacheTTL);
    }

    return currentPrices;
  }
}

module.exports = ETFPrices;
