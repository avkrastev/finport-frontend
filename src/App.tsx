import { useRoutes } from 'react-router-dom';
import routes from './router';

import ThemeProvider from './theme/ThemeProvider';
import { CssBaseline } from '@mui/material';
import { AuthContext } from './utils/context/authContext';
import { useAuth } from './utils/hooks/auth-hook';

import './i18n';
import CustomErrorBoundary from './error-management/CustomErrorBoundary';

const App = () => {
  const { token, login, logout, authUserData, setUserData } = useAuth();

  const content = useRoutes(routes());

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        authUserData,
        setUserData
      }}
    >
      <ThemeProvider>
        <CssBaseline />
        <CustomErrorBoundary>{content}</CustomErrorBoundary>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};
export default App;
