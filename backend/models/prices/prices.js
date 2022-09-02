const cacheProvider = require("../../utils/cache-provider");

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
}

module.exports = Prices;
