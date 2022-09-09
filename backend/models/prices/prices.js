const cacheProvider = require("../../utils/cache-provider");
const axios = require("axios");

class Prices {
  constructor(category) {
    this.category = category;
  }

  retrieveFromCache() {
    let currentPrices = [];
    if (cacheProvider.instance().has(this.category + "_prices")) {
      currentPrices = cacheProvider.instance().get(this.category + "_prices");
    }

    return currentPrices;
  }

  async fetchStockPrices(ttl) {
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
      .set(this.category + "_prices", prices, ttl);

    return prices;
  }
}

module.exports = Prices;
