import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function addPlatformAPR(platformData) {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/p2p',
      {
        ...platformData
      },
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    console.log(error);
  }
}

export async function updatePlatformAPR(platformData) {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/p2p/${platformData.id}`,
      {
        ...platformData
      },
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'PATCH'
      });
    }
    console.log(error);
  }
}

export async function getAssetsByCategory(category) {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/assets/' + category,
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
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

export async function getAssetsSummary() {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/assets/summary',
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
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

export async function addNewAsset(transaction) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/assets',
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
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    console.log(error);
  }
}

export async function updateAsset(transaction) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/assets/${transaction.id}`,
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
      `${process.env.REACT_APP_BACKEND_URL}/assets/${id}`,
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'DELETE'
      });
    }
    console.log(error);
  }
}

export async function deleteAssets(ids) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/assets/deleteMany',
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
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'DELETE_MANY'
      });
    }
    console.log(error);
  }
}

export async function getAssetById(id) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/assets/${id}`,
      {
        headers: {
          Authorization: `Basic ${token}`
        }
      }
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
