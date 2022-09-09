const AssetStats = require("./asset");

class P2PAssetStats extends AssetStats {
  constructor(data, totals, percentages) {
    super();
    this.data = data;
    this.totals = totals;
    this.category = "misc";
    this.percentages = percentages
  }

  getStats() {
    for (let item of this.data) {
      let stats = {};
      stats.name = item._id.name;
      stats.symbol = item._id.symbol;
      stats.assetId = item._id.assetId;
      stats.currency = item._id.currency;
      stats.totalSum = item.totalSum;
      stats.totalSumInOriginalCurrency = item.totalSumInOriginalCurrency;
      stats.holdingQuantity = item.totalQuantity;
      stats.currentPrice = "N/A";
      stats.holdingValue = item.totalSum;
      stats.averageNetCost =
        stats.holdingQuantity > 0 ? item.totalSum / stats.holdingQuantity : 0;
      stats.difference = (item.totalSum - stats.holdingValue) * -1;
      stats.differenceInPercents =
        stats.averageNetCost > 0 && !isNaN(stats.currentPrice)
          ? (stats.currentPrice / stats.averageNetCost - 1) * 100
          : 0;

      this.balance += stats.holdingValue;

      this.stats.push(stats);
    }

    this.stats.sort((a, b) => b["holdingValue"] - a["holdingValue"]);
  }

  async getAllData() {
    this.getStats();
    this.getTotals();

    return {
      sums: this.sums,
      stats: this.stats,
    };
  }
}

module.exports = P2PAssetStats;
