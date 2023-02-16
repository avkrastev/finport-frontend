import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetCommoditiesState } from 'src/content/dashboards/Commodities/commoditiesSlice';
import { resetCryptoState } from 'src/content/dashboards/Crypto/cryptoSlice';
import { resetETFState } from 'src/content/dashboards/Etf/ETFsSlice';
import { resetMiscState } from 'src/content/dashboards/Misc/miscSlice';
import { resetP2PState } from 'src/content/dashboards/P2P/p2pSlice';
import { resetStocksState } from 'src/content/dashboards/Stocks/stocksSlice';
import { resetSummaryState } from 'src/content/overview/summarySlice';

let logoutTimer;

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [authUserData, setAuthUserData] = useState(null);
  const { i18n } = useTranslation();

  const login = useCallback((uid, token, userData, expirationDate) => {
    setToken(token);
    setAuthUserData(userData);

    let expiration;
    if (expirationDate) {
      expiration = new Date(
        new Date(expirationDate).getTime() +
          (1000 * 60 * 60 -
            (new Date(expirationDate).getTime() - new Date().getTime()))
      );
    } else {
      expiration = new Date(new Date().getTime() + 1000 * 60 * 60);
    }

    if (i18n.language !== userData.language) {
      i18n.changeLanguage(userData.language);
    }

    setTokenExpirationDate(expiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token,
        expiration: expiration.toISOString(),
        userData
      })
    );
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.userData,
        new Date(storedData.expiration)
      );
    }
    if (storedData && !authUserData) {
      setAuthUserData(storedData.userData);
    }
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setAuthUserData(null);
    localStorage.removeItem('userData');

    dispatch(resetSummaryState());
    dispatch(resetCommoditiesState());
    dispatch(resetCryptoState());
    dispatch(resetETFState());
    dispatch(resetP2PState());
    dispatch(resetMiscState());
    dispatch(resetStocksState());

    navigate('/');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        new Date(tokenExpirationDate).getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  const setUserData = useCallback((userData, key) => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      storedData['userData'][key] = userData[key];
      setAuthUserData(storedData['userData']);
      localStorage.setItem('userData', JSON.stringify(storedData));
    }
  }, []);

  return { token, login, logout, authUserData, setUserData };
};
