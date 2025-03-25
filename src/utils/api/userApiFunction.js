import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getToken = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return userData?.token || null;
};

const apiRequest = async (method, url, data = {}, requiresAuth = false) => {
  try {
    const headers = {};
    
    if (requiresAuth) {
      const token = getToken();
      if (token) {
        headers.Authorization = `Basic ${token}`;
      } else {
        console.warn('No token found for authenticated request.');
      }
    }

    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers,
      withCredentials: true, 
    });

    return response;
  } catch (error) {
    if (error.response?.status >= 500) {
      dispatchApiError({ method: method.toUpperCase() });
    }
    console.error(error);
  }
};

// Authentication & User Management APIs
export const userLogin = (email, password) => apiRequest('post', '/users/login', { email, password });
export const userSignUp = (name, email, password) => apiRequest('post', '/users/signup', { name, email, password });
export const resetPassword = (email) => apiRequest('post', '/users/reset', { email });
export const changePassword = (id, password) => apiRequest('post', '/users/changePassword', { id, password });

// User-related requests that require authentication
export const getLoggedInUserData = () => apiRequest('get', '/users/', {}, true);
export const updateUser = (data, key) => apiRequest('patch', '/users/', { key, data }, true);
export const verifyEmail = (id) => apiRequest('get', `/users/verify?id=${id}`);
export const sendVerificationEmail = () => apiRequest('post', '/users/sendVerificationEmail', {}, true);
export const userLogout = () => apiRequest('post', '/users/logout', {}, true);
