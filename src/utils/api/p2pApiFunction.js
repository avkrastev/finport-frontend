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

const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axiosInstance.request({ method, url, data });
    return response;
  } catch (error) {
    if (error.response?.status >= 500) {
      dispatchApiError({ method: method.toUpperCase() });
    }
    console.error(error);
  }
};

export const addPlatformAPR = (platformData) =>
  apiRequest('POST', '/p2p', platformData);

export const updatePlatformAPR = (platformData) =>
  apiRequest('PATCH', `/p2p/${platformData.id}`, platformData);

export const getAssetsByCategory = (category) =>
  apiRequest('GET', `/assets/${category}`);

export const getAssetsSummary = () => apiRequest('GET', '/assets/summary');

export const addNewAsset = (transaction) =>
  apiRequest('POST', '/assets', { transaction });

export const updateAsset = (transaction) =>
  apiRequest('PATCH', `/assets/${transaction.id}`, transaction);

export const deleteAsset = (id) => apiRequest('DELETE', `/assets/${id}`);

export const deleteAssets = (ids) =>
  apiRequest('POST', '/assets/deleteMany', { ids });

export const getAssetById = (id) => apiRequest('GET', `/assets/${id}`);
