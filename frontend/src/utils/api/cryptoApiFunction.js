import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function autocompleteCrypto(query) {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/search?query=' + query
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    console.log(error);
  }
}

export async function cryptoHistoricalData(coin, date) {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/' + coin + '/history?date=' + date
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    console.log(error);
  }
}
