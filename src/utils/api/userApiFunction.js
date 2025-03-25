import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

// Base URL for API requests
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Helper function to get the token from localStorage
const getToken = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return userData ? userData.token : null;
};

// Generic API request function
const apiRequest = async (
  method,
  url,
  data = {},
  headers = {},
  withCredentials = false
) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers,
      withCredentials
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      dispatchApiError({ method });
    }
    return error.response;
  }
};

// User login
export const userLogin = async (email, password) => {
  return apiRequest('post', '/users/login', { email, password }, {}, true);
};

// User signup
export const userSignUp = async (name, email, password) => {
  return apiRequest('post', '/users/signup', { name, email, password });
};

// Reset password
export const resetPassword = async (email) => {
  return apiRequest('post', '/users/reset', { email });
};

// Change password
export const changePassword = async (id, password) => {
  return apiRequest('post', '/users/changePassword', { id, password });
};

// Get logged-in user data
export const getLoggedInUserData = async () => {
  const token = getToken();
  return apiRequest(
    'get',
    '/users/',
    {},
    { Authorization: `Basic ${token}` },
    true
  );
};

// Update user data
export const updateUser = async (data, key) => {
  const token = getToken();
  return apiRequest(
    'patch',
    '/users/',
    { key, data },
    { Authorization: `Basic ${token}` },
    true
  );
};

// Verify email
export const verifyEmail = async (id) => {
  return apiRequest('get', `/users/verify?id=${id}`);
};

// Send verification email
export const sendVerificationEmail = async () => {
  const token = getToken();
  return apiRequest(
    'post',
    '/users/sendVerificationEmail',
    {},
    { Authorization: `Basic ${token}` },
    true
  );
};

export const userLogout = async () => {
  const token = getToken();
  return apiRequest('post', '/users/logout', {}, { Authorization: `Basic ${token}` }, true);
};

