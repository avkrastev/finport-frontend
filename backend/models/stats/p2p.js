const AssetStats = require("./asset");

class P2PAssetStats extends AssetStats {
  constructor(data, totals) {
    super();
    this.data = data;
    this.totals = totals;
    this.category = "p2p";
  }

  setInterestPaid(totalInterestPaid) {
    this.totalInterestPaid = totalInterestPaid;
  }

  getStats() {
    for (let item of this.data) {
      const interestsPaid = this.totalInterestPaid.find(
        (platform) => platform.name === item._id.name
      );
      let stats = {};
      stats.name = item._id.name;
      stats.symbol = item._id.symbol;
      stats.assetId = item._id.assetId;
      stats.currency = item._id.currency;
      stats.totalSum = item.totalSum;
      stats.totalSumInOriginalCurrency =
        item.totalSumInOriginalCurrency + interestsPaid.interest;
      stats.holdingQuantity = item.totalQuantity;
      stats.currentPrice = "N/A";
      stats.holdingValue = item.totalSum + interestsPaid.interest;
      stats.averageNetCost =
        stats.holdingQuantity > 0 ? item.totalSum / stats.holdingQuantity : 0;
      stats.difference = (item.totalSum - stats.holdingValue) * -1;
      stats.differenceInPercents =
        (interestsPaid.interest / interestsPaid.totalInvested) * 100;
      stats.totalInvested = interestsPaid.totalInvested;

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
