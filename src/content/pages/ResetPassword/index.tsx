import { Box, Container, Card } from '@mui/material';

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import SendResetLink from './SendResetLink';
import ChangePassword from './ChangePassword';

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);

function ResetPasswordForm() {
  const { t } = useTranslation();

  const location = useLocation();

  const search = location.search;
  const params = new URLSearchParams(search);
  const isPasswordChangeView = !!params.get('id');

  return (
    <OverviewWrapper>
      <Helmet>
        <title>{t('Reset Password')}</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={5} alignItems="center">
          {/* <Logo /> */}
        </Box>
        <Card sx={{ p: 10, mb: 10, borderRadius: 12 }}>
          {isPasswordChangeView ? (
            <ChangePassword id={params.get('id')} />
          ) : (
            <SendResetLink />
          )}
        </Card>
      </Container>
    </OverviewWrapper>
  );
}

export default ResetPasswordForm;
