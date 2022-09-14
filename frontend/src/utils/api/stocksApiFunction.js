import axios from 'axios';

export async function autocompleteStocks(query) {
  try {
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

export async function autocompleteStocks2(query) {
  try {
    const response = await axios.get(
      'https://yfapi.net/v6/finance/autocomplete?lang=en&query=' + query,
      {
        headers: {
          'x-api-key': 'cNOtBiw0pQ7jbOOJqcs6J6FDrVRuLKDo5H6fsUg8'
        }
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}
