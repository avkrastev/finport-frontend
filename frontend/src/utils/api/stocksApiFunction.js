import axios from 'axios';

export async function autocompleteStocks(query) {
  try {
    // const response = await axios.get(
    // 	'https://yfapi.net/v6/finance/autocomplete?lang=en&query='+query, {
    // 		headers: {
    // 			'X-API-KEY': '5TsWlejPj779wWpWGcRJ63bTXIzKbO2A15BnsPPA'
    // 		}
    // 	}
    // )

    // const response = await axios.get(
    // 	'https://finnhub.io/api/v1/search?q='+query+'&token=cc2b6iaad3icrd10qct0'
    // )

    const response = await axios.get(
      'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' +
        query +
        '&apikey=6Z6DLI4YR7J6F6HT'
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}
