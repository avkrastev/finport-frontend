import axios from 'axios';
import dispatchApiError from 'src/error-management/dispatchApiError';
import { getToken } from './userApiFunction';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/assets';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();  

    if (token) {
      config.headers.Authorization = `Basic ${token}`;
    } else {
      return Promise.reject(new Error('Unauthorized: No token provided'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = (error, method) => {
  if (error.response?.status >= 500) dispatchApiError({ method });
  return error.response;
};

export const getAssets = (query = '') =>
  axiosInstance.get(`?${query}`).catch((error) => handleError(error, 'GET'));

export const getAssetsByCategory = (category) =>
  axiosInstance.get(`/${category}`).catch((error) => handleError(error, 'GET'));

export const getAssetsSummary = () =>
  axiosInstance.get('/summary').catch((error) => handleError(error, 'GET'));

export const addNewAsset = (transaction) =>
  axiosInstance
    .post('', { transaction })
    .catch((error) => handleError(error, 'POST'));

export const updateAsset = (transaction) =>
  axiosInstance
    .patch(`/${transaction.id}`, transaction)
    .catch((error) => handleError(error, 'PATCH'));

export const deleteAsset = (id) =>
  axiosInstance.delete(`/${id}`).catch((error) => handleError(error, 'DELETE'));

export const deleteAssets = (ids) =>
  axiosInstance
    .post('/deleteMany', { ids })
    .catch((error) => handleError(error, 'DELETE_MANY'));

export const getAssetById = (id) =>
  axiosInstance.get(`/${id}`).catch((error) => handleError(error, 'GET'));

export const getTransactionsReport = (period) =>
  axiosInstance
    .get('/report', { params: { period } })
    .catch((error) => handleError(error, 'GET'));

export const getCommodityPrices = () =>
  axiosInstance
    .get('/commodity/prices')
    .catch((error) => handleError(error, 'GET'));

export const getCryptoPrice = (asset) =>
  axiosInstance
    .get('/crypto/prices', { params: { token: asset } })
    .then((res) => res.data.price)
    .catch((error) => handleError(error, 'GET'));

export const getStockPrice = (asset) =>
  axiosInstance
    .get('/stock/prices', { params: { stock: asset } })
    .then((res) => res.data.price)
    .catch((error) => handleError(error, 'GET'));
