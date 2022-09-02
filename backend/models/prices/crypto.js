const CoinGecko = require("coingecko-api");
const Prices = require('./prices');
const cacheProvider = require("../../utils/cache-provider");

const cryptoCacheTTL = 1000;

class CryptoPrices extends Prices {
  constructor(assets, currency) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "crypto"
  }

  async getPricesPerAssets() {
    let currentPrices;

    currentPrices = this.retrieveFromCache();
    if (currentPrices.length === 0) {
      const CoinGeckoClient = new CoinGecko();
      const result = await CoinGeckoClient.simple.price({
        ids: this.assets,
        vs_currencies: this.currency.toLowerCase(),
      });

      if (result.code === 200) {
        cacheProvider
          .instance()
          .set(this.category + "_prices", result.data, cryptoCacheTTL);
        currentPrices = result.data;
      } else {
        return new HttpError("Something went wrong!", 500);
      }
    }

    return currentPrices;
  }
}

module.exports = CryptoPrices;
