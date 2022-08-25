import axios from 'axios';

export async function getAssets() {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.get('http://localhost:3005/api/assets', {
      headers: {
        Authorization: `Basic ${token}`
      }
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function addNewAsset(transaction) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.post(
      'http://localhost:3005/api/assets',
      {
        transaction
      },
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

export async function updateAsset(id) {
    const token = JSON.parse(localStorage.getItem('userData')).token;
    try {
      const response = await axios.patch(
        `http://localhost:3005/api/assets/${id}`,
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

export async function deleteAsset(id) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.delete(
      `http://localhost:3005/api/assets/${id}`,
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
