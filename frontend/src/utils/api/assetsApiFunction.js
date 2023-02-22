import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function getAssets(query = '') {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/assets?' + query,
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
    return error.response;
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
    dispatchApiError({
      method: 'GET'
    });
    return error.response;
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
    dispatchApiError({
      method: 'GET'
    });
    return error.response;
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
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    return error.response;
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
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'PATCH'
      });
    }
    return error.response;
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
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'DELETE'
      });
    }
    return error.response;
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
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'DELETE_MANY'
      });
    }
    return error.response;
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
    if (error.response.status >= 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    return error.response;
  }
}

export async function getTransactionsReport(period) {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/assets/report?period=' + period,
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
    return error.response;
  }
}

export async function getCommodityPrices() {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/assets/commodity/prices',
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
    return error.response;
  }
}
