import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    login: (uid, token, userData, expiration) => {},
    logout: () => {},
    authUserData: {},
    setUserData: (userData, key) => {}
});
