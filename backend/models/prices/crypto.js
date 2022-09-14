const CoinGecko = require("coingecko-api");
const Prices = require("./prices");
const cacheProvider = require("../../utils/cache-provider");

const cryptoCacheTTL = 1000;

class CryptoPrices extends Prices {
  constructor(assets, currency, creator) {
    super();
    this.assets = assets;
    this.currency = currency;
    this.category = "crypto";
    this.creator = creator;
  }

  async getPricesPerAssets() {
    let currentPrices;

    if (
      cacheProvider.instance().has(this.category + "_prices_" + this.creator)
    ) {
      currentPrices = cacheProvider
        .instance()
        .get(this.category + "_prices_" + this.creator);
    } else {
      const CoinGeckoClient = new CoinGecko();
      const result = await CoinGeckoClient.simple.price({
        ids: this.assets,
        vs_currencies: this.currency.toLowerCase(),
      });

      if (result.code === 200) {
        cacheProvider
          .instance()
          .set(
            this.category + "_prices_" + this.creator,
            result.data,
            cryptoCacheTTL
          );
        currentPrices = result.data;
      } else {
        return new HttpError("Something went wrong!", 500);
      }
    }

    return currentPrices;
  }
}

module.exports = CryptoPrices;
