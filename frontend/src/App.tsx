import { useRoutes } from 'react-router-dom';
import routes from './router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import ThemeProvider from './theme/ThemeProvider';
import { CssBaseline } from '@mui/material';
import { AuthContext } from './utils/context/authContext';
import { useAuth } from './utils/hooks/auth-hook';


const App = () => {
  const { token, login, logout } = useAuth()
  
  const content = useRoutes(routes(token));

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token, login, logout}}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
            {content}
        </LocalizationProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
export default App;
