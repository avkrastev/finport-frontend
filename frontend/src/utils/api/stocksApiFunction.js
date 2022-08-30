import axios from 'axios';
import { format } from 'date-fns';

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

export async function stocksHistoricalData(ticker, date) {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (today === date) {
      const yesterday = new Date();
      yesterday.setDate(new Date().getDate() - 1);
      date = format(new Date(yesterday), 'yyyy-MM-dd');
    }
    const response = await axios.get(
      'https://api.polygon.io/v1/open-close/' +
        ticker +
        '/' +
        date +
        '?adjusted=true&apiKey=vn3TiKHlBmtj5q8WebUeiNoy40E5BUUM'
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}
