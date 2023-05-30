import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function historyForAWeek() {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/history/historyForAWeek',
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    console.log(error);
  }
}

export async function historySinceStart(category = '') {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL +
        '/history/historySinceStart?category=' +
        category,
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    console.log(error);
  }
}
