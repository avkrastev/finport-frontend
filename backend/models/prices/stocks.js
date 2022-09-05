const Prices = require("./prices");
const cacheProvider = require("../../utils/cache-provider");
const axios = require("axios");

const stocksCacheTTL = 86400;

class StockPrices extends Prices {
  constructor(assets, currency) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "stocks";
  }

  async getPricesPerAssets() {
    let currentPrices;

    currentPrices = this.retrieveFromCache();
    if (currentPrices.length === 0) {
      const options = {
        method: "GET",
        url: "https://yfapi.net/v6/finance/quote?symbols=" + this.assets,
        headers: {
          "x-api-key": "cNOtBiw0pQ7jbOOJqcs6J6FDrVRuLKDo5H6fsUg8",
        },
      };
      const prices = await axios
        .request(options)
        .then(function (response) {
          let prices = [];
          for (let asset of response?.data?.quoteResponse?.result) {
            if (asset) {
              prices[asset.symbol] = {
                price: asset.regularMarketPrice,
                currency: asset.currency,
              };
            }
          }
          return prices;
        })
        .catch(function (error) {
          console.error(error);
        });

      cacheProvider
        .instance()
        .set(this.category + "_prices", prices, stocksCacheTTL);
      currentPrices = prices;
    }

    return currentPrices;
  }
}

module.exports = StockPrices;
