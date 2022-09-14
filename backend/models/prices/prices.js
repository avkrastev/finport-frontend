const cacheProvider = require("../../utils/cache-provider");
const axios = require("axios");

class Prices {
  constructor(category, creator) {
    this.category = category;
    this.creator = creator;
  }

  async fetchStockPrices(apiKey, ttl) {
    const options = {
      method: "GET",
      url: "https://yfapi.net/v6/finance/quote?symbols=" + this.assets,
      headers: {
        "x-api-key": apiKey,
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
      .set(this.category + "_prices_" + this.creator, prices, ttl);

    return prices;
  }
}

module.exports = Prices;
