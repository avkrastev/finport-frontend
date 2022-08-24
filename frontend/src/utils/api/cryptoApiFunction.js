import axios from 'axios';

export async function autocompleteCrypto(query) {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/search?query=' + query
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}
