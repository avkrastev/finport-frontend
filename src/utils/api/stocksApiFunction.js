import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';
import { getToken } from './userApiFunction';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Basic ${token}`;
    } else {
      console.error('Token not found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const apiRequest = async (method, url, params = {}, customHeaders = {}) => {
  try {
    const response = await axiosInstance.request({
      method,
      url,
      params,
      headers: { ...customHeaders },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status >= 500) {
      dispatchApiError({ method: method.toUpperCase() });
    }
    console.error(error);
  }
};

export const autocompleteStocks = (query) => {
  return apiRequest('GET', 'https://yfapi.net/v6/finance/autocomplete', { lang: 'en', query }, {
    'x-api-key': 'AX8d8CNw1w8g5SY6QKXHAKdUzciPA1A3p4UpEhjb',
  });
};

export const autocompleteStocks2 = (query) => {
  return apiRequest('GET', '/assets/autocomplete', { query });
};
