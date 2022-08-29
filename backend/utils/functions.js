const axios = require("axios");
const cacheProvider = require("./cache-provider");

const exchangeRates = async (amount, from, date = "", base = "USD") => {
  let currencyRates;

  const today = new Date().toISOString().slice(0, 10);

  if (
    cacheProvider.instance().has("currency_rates") &&
    (date !== "" || date === today)
  ) {
    currencyRates = cacheProvider.instance().get("currency_rates");
  } else {
    let historyDate = "latest";
    if (date < today) {
      historyDate = new Date(date).toISOString().slice(0, 10);
    }
    const options = {
      method: "GET",
      url: "https://api.exchangerate.host/" + historyDate + "?base=" + base,
    };

    await axios
      .request(options)
      .then(function (response) {
        if (historyDate === "latest") {
          cacheProvider
            .instance()
            .set("currency_rates", response.data.rates, 86400);
        }
        currencyRates = response.data.rates;
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  if (currencyRates.hasOwnProperty(from.toUpperCase())) {
    return amount / currencyRates[from.toUpperCase()];
  }
  return false;
};

const roundNumber = (num, scale = 2) => {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(
      Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
      "e-" +
      scale
    );
  }
};

exports.exchangeRates = exchangeRates;
exports.roundNumber = roundNumber;
