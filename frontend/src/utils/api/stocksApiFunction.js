import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function autocompleteStocks(query) {
  try {
    const response = await axios.get(
      'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' +
        query +
        '&apikey=6Z6DLI4YR7J6F6HT'
    );

    return response;
  } catch (error) {
    dispatchApiError({
      method: 'GET'
    });
    console.log(error);
  }
}

export async function autocompleteStocks2(query, apiKey) {
  try {
    const response = await axios.get(
      'https://yfapi.net/v6/finance/autocomplete?lang=en&query=' + query,
      {
        headers: {
          'x-api-key': apiKey
        }
      }
    );

    return response;
  } catch (error) {
    dispatchApiError({
      method: 'GET'
    });
    console.log(error);
  }
}
