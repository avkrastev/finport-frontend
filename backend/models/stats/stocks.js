const StocksPrices = require("../prices/stocks");
const AssetStats = require("./asset");
const { exchangeRatesBaseUSD } = require("../../utils/functions");

class StocksAssetStats extends AssetStats {
  constructor(data, totals, creator) {
    super();
    this.data = data;
    this.totals = totals;
    this.category = "stocks";
    this.creator = creator;
  }

  async getPrices() {
    const ids = this.data.map((item) => item._id.symbol);

    const stocksPrices = new StocksPrices(ids, "USD", this.creator);
    this.currentPrices = await stocksPrices.getPricesPerAssets();
    this.exchangeRatesList = await exchangeRatesBaseUSD(0, "", "", true);
  }

  getStats() {
    for (let item of this.data) {
      let stats = {};
      stats.name = item._id.name;
      stats.symbol = item._id.symbol;
      stats.totalSum = item.totalSum;
      stats.holdingQuantity = item.totalQuantity;
      if (this.currentPrices[stats.symbol].currency !== "USD") {
        stats.currentPrice =
          this.exchangeRatesList[this.currentPrices[stats.symbol].currency] *
          this.currentPrices[stats.symbol].price;
      } else {
        stats.currentPrice = this.currentPrices[stats.symbol].price;
      }
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
