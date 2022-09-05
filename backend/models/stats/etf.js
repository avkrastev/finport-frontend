const StocksAssetStats = require("./stocks");

class ETFAssetStats extends StocksAssetStats {
  constructor(data, totals) {
    super();
    this.data = data;
    this.totals = totals;
    this.category = "etf";
  }
}

module.exports = ETFAssetStats;
