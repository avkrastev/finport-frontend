const ETFPrices = require("../prices/etf");
const { exchangeRatesBaseUSD } = require("../../utils/functions");
const AssetStats = require("./asset");

class ETFAssetStats extends AssetStats {
  constructor(data, totals) {
    super();
    this.data = data;
    this.totals = totals;
    this.category = "etf";
  }

  async getPrices() {
    const ids = this.data.map((item) => item._id.symbol);

    const stocksPrices = new ETFPrices(ids, "USD");
    this.currentPrices = await stocksPrices.getPricesPerAssets();
    this.exchangeRatesList = await exchangeRatesBaseUSD(0, "", "", true);
  }

  async getAllData() {
    await this.getPrices();
    this.getStats();
    this.getTotals();
    return {
      sums: this.sums,
      stats: this.stats,
    };
  }
}

module.exports = ETFAssetStats;
