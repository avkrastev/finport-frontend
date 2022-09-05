import axios from 'axios';

export async function getAssets(query = '') {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      'http://localhost:3005/api/assets?' + query,
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

export async function getAssetsByCategory(category) {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      'http://localhost:3005/api/assets/' + category,
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

export async function updateAsset(transaction) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.patch(
      `http://localhost:3005/api/assets/${transaction.id}`,
      {
        ...transaction
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

export async function deleteAssets(ids) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.post(
      'http://localhost:3005/api/assets/deleteMany',
      {
        ids
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

export async function getAssetById(id) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.get(`http://localhost:3005/api/assets/${id}`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}
