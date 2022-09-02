const StocksPrices = require("../prices/stocks");
const AssetStats = require("./asset");

class StocksAssetStats extends AssetStats {
  constructor(data, totals) {
    super();
    this.data = data;
    this.totals = totals;
    this.category = "stocks";
  }

  async getPrices() {
    const ids = this.data.map((item) => item._id.symbol);

    const cryptoPrices = new StocksPrices(ids, "USD");
    this.currentPrices = await cryptoPrices.getPricesPerAssets();
  }

  getStats() {
    for (let item of this.data) {
      let stats = {};
      stats.name = item._id.name;
      stats.symbol = item._id.symbol;
      stats.totalSum = item.totalSum;
      stats.holdingQuantity = item.totalQuantity;
      stats.currentPrice = this.currentPrices[stats.symbol].price;
      stats.holdingValue =
        this.currentPrices[stats.symbol].price * stats.holdingQuantity;
      stats.averageNetCost =
        stats.holdingQuantity > 0 ? item.totalSum / stats.holdingQuantity : 0;
      stats.difference = (item.totalSum - stats.holdingValue) * -1;
      stats.differenceInPercents =
        stats.averageNetCost > 0
          ? (stats.currentPrice / stats.averageNetCost - 1) * 100
          : 0;

      this.balance += stats.holdingValue;

      this.stats.push(stats);
    }

    this.stats.sort((a, b) => b["holdingValue"] - a["holdingValue"]);
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

module.exports = StocksAssetStats;
