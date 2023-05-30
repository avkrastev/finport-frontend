import { Box, Container, Grid, Typography } from '@mui/material';

import { experimentalStyled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Input from '../../../components/FormElements/Input';
import { resetPassword } from '../../../utils/api/userApiFunction';
import { VALIDATOR_EMAIL } from '../../../utils/validators';
import { useForm } from '../../../utils/hooks/form-hook';

import LoadingButton from '@mui/lab/LoadingButton';
import { Trans, useTranslation } from 'react-i18next';
import SendIcon from '@mui/icons-material/Send';
import Alert from '@mui/material/Alert';

const TypographyH1 = experimentalStyled(Typography)(
  ({ theme }) => `
          font-size: ${theme.typography.pxToRem(50)};
      `
);

const TypographyH2 = experimentalStyled(Typography)(
  ({ theme }) => `
          font-size: ${theme.typography.pxToRem(17)};
      `
);

const LabelWrapper = experimentalStyled(Box)(
  ({ theme }) => `
          background-color: ${theme.colors.success.main};
          color: ${theme.palette.success.contrastText};
          font-weight: bold;
          border-radius: 30px;
          text-transform: uppercase;
          display: inline-block;
          font-size: ${theme.typography.pxToRem(11)};
          padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
          margin-bottom: ${theme.spacing(2)};
      `
);

function SendResetLink() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formState, inputHandler] = useForm({
    email: { value: '', isValid: false }
  });

  useEffect(() => {
    const listener = (event) => {
      if (
        formState.isValid &&
        (event.code === 'Enter' || event.code === 'NumpadEnter')
      ) {
        handleResetPassword();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [formState.isValid]); // eslint-disable-line

  const handleResetPassword = async () => {
    setErrorMessage('');
    setLoading(true);

    const responseData = await resetPassword(formState.inputs.email.value);
    if (responseData.status <= 299) {
      setSuccess(true);
      setLoading(false);
    } else {
      setErrorMessage(responseData.data.message);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        container
      >
        <Grid item md={10} lg={8} mx="auto">
          <LabelWrapper color="success">
            {t('Version {{version}}', { version: '1.0.0' })}
          </LabelWrapper>
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            {t('Reset Password')}
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            {!success ? (
              <Trans i18nKey="resetMessage">
                By filling in your email you will receive instructions to change
                your password.
              </Trans>
            ) : (
              <Trans i18nKey="resetSuccessMessage">
                An email with additional instructions has been sent to your
                inbox!
              </Trans>
            )}
          </TypographyH2>

          {errorMessage && (
            <Alert sx={{ mr: 1.5, ml: 1.5, mb: 2 }} severity="error">
              {errorMessage}
            </Alert>
          )}

          {!success && (
            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
              noValidate
              autoComplete="on"
            >
              <div>
                <Input
                  required
                  id="email"
                  label={t('E-mail')}
                  errorMessage={t('Please enter a valid email address!')}
                  validators={[VALIDATOR_EMAIL()]}
                  onInput={inputHandler}
                  {...formState.inputs.email}
                />
              </div>
              <LoadingButton
                loading={loading}
                loadingPosition="end"
                endIcon={<SendIcon />}
                sx={{ marginTop: 2 }}
                size="large"
                variant="contained"
                disabled={!formState.isValid}
                onClick={() => handleResetPassword()}
              >
                {t('Send Reset Link')}
              </LoadingButton>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default SendResetLink;
