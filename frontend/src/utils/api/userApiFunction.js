import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

export async function userLogin(email, password) {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/users/login',
      {
        email,
        password
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    return error.response;
  }
}

export async function userSignUp(name, email, password) {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/users/signup',
      {
        name,
        email,
        password
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    return error.response;
  }
}

export async function resetPassword(email) {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/users/reset',
      {
        email
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    return error.response;
  }
}

export async function changePassword(id, password) {
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/users/changePassword',
      {
        id,
        password
      }
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'POST'
      });
    }
    return error.response;
  }
}

export async function getLoggedInUserData() {
  const token = JSON.parse(localStorage.getItem('userData')).token;

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/users/',
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
    return error.response;
  }
}

export async function updateUser(data, key) {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.patch(
      process.env.REACT_APP_BACKEND_URL + '/users/',
      {
        key,
        data
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
    return error.response;
  }
}

export async function verifyEmail(id) {
  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_URL + '/users/verify?id=' + id
    );

    return response;
  } catch (error) {
    if (error.response.status === 500) {
      dispatchApiError({
        method: 'GET'
      });
    }
    return error.response;
  }
}

export async function sendVerificationEmail() {
  const token = JSON.parse(localStorage.getItem('userData')).token;
  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_URL + '/users/sendVerificationEmail',
      {},
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
    return error.response;
  }
}
