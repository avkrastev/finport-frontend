import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      const expiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(expiration);
      localStorage.setItem(
        'userData', 
        JSON.stringify({
          userId: uid, 
          token, 
          expiration: expiration.toISOString()
        })
      );
    }, []);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    }, [login]);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      localStorage.removeItem('userData');
    }, []);
  
    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remainingTime = new Date(tokenExpirationDate).getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);

    return {token, login, logout};
}