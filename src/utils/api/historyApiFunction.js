import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';
import { getToken } from './userApiFunction';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL
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

const apiRequest = async (method, url, params = null) => {
  try {
    const response = await axiosInstance.request({ method, url, params });
    return response;
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      dispatchApiError({ method: method.toUpperCase() });
    }
    console.error(error);
  }
};

export const historyForAWeek = () =>
  apiRequest('GET', '/history/historyForAWeek');

export const historySinceStart = (category = '') =>
  apiRequest('GET', '/history/historySinceStart', { category });
