import axios from 'axios';

export async function historyForAWeek() {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      'http://localhost:3005/api/history/historyForAWeek',
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}
