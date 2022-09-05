const StockPrices = require("./stocks");

class ETFPrices extends StockPrices {
  constructor(assets, currency) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "etf";
  }

}

module.exports = ETFPrices;
