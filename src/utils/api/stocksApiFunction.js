import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function autocompleteStocks(
  query,
  apiKey = 'AX8d8CNw1w8g5SY6QKXHAKdUzciPA1A3p4UpEhjb'
) {
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

export async function autocompleteStocks2(query) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + `/assets/autocomplete?query=${query}`,
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    console.log(error);
  }
}
