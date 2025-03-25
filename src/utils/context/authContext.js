import { createContext } from 'react';

export const AuthContext = createContext({
    token: null,
    login: (uid, token, userData, expiration) => {},
    logout: () => {},
    authUserData: {},
    setUserData: (userData, key) => {}
});
