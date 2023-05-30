import { Box, Typography, Container, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { styled } from '@mui/material/styles';
import { verifyEmail } from 'src/utils/api/userApiFunction';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AuthContext } from 'src/utils/context/authContext';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function StatusVerification() {
  const { setUserData } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [message, setMessage] = useState();
  const search = window.location.search;
  const params = new URLSearchParams(search);

  useEffect(() => {
    async function fetchMyAPI() {
      const result = await verifyEmail(params.get('id'));
      setMessage(result.data.message);
      if (result.status === 200) {
        setUserData({ email_verified: true }, 'email_verified');
      }
    }
    fetchMyAPI();
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('Email - Verification')}</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Container maxWidth="md">
              <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                {message}
              </Typography>
            </Container>
            <Button
              size="large"
              sx={{ mx: 1 }}
              variant="contained"
              onClick={() => {
                navigate('/');
              }}
            >
              {t('Home Page')}
            </Button>
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

export default StatusVerification;
