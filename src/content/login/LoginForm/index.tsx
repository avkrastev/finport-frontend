import { Box, Button, Container, Grid, Typography, Link } from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';
import { experimentalStyled } from '@mui/material/styles';
import { useState, useContext, useEffect } from 'react';
import Input from '../../../components/FormElements/Input';
import { userLogin, userSignUp } from '../../../utils/api/userApiFunction';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH
} from '../../../utils/validators';
import { useForm } from '../../../utils/hooks/form-hook';
import { AuthContext } from '../../../utils/context/authContext';
import { useDispatch } from 'react-redux';

import { changeTransactionStatus } from 'src/content/applications/Transactions/transactionSlice';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import { changeSummaryStatus } from 'src/content/overview/summarySlice';
import { Trans, useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert } from '@mui/lab';

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

const TypographyH3 = experimentalStyled(Typography)(
  ({ theme }) => `
        font-size: ${theme.typography.pxToRem(12)};
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

function LoginForm() {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(
    'Please re-enter your password!'
  );

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);

  const handleMouseDownPasswordConfirm = (event) => {
    event.preventDefault();
  };

  const [formState, inputHandler, setFormData] = useForm({
    email: { value: '', isValid: false, isTouched: false },
    password: { value: '', isValid: false, isTouched: false }
  });

  useEffect(() => {
    const listener = (event) => {
      if (
        formState.isValid &&
        (event.code === 'Enter' || event.code === 'NumpadEnter')
      ) {
        loginOrSignUp();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [formState.isValid]); // eslint-disable-line

  const switchModeHandler = () => {
    setErrorMessage('');
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          confirm_password: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: '',
            isValid: false,
            isTouched: false
          },
          confirm_password: {
            value: '',
            isValid: false,
            isTouched: false
          }
        },
        false
      );
    }
    setIsLogin((prevMode) => !prevMode);
  };

  const loginOrSignUp = async () => {
    setLoading(true);
    if (isLogin) {
      const responseData = await userLogin(
        formState.inputs.email.value,
        formState.inputs.password.value
      );

      if (responseData.status <= 299) {
        auth.login(
          responseData.data.userID,
          responseData.data.token,
          responseData.data.userData
        );
      } else {
        setErrorMessage(responseData.data.message);
      }

      setLoading(false);
    } else {
      const responseData = await userSignUp(
        formState.inputs.username.value,
        formState.inputs.email.value,
        formState.inputs.password.value
      );
      if (responseData.status <= 299) {
        auth.login(
          responseData.data.userID,
          responseData.data.token,
          responseData.data.userData
        );
      } else {
        setErrorMessage(responseData.data.message);
      }

      setLoading(false);
    }

    dispatch(changeTransactionStatus('idle'));
    dispatch(changeSummaryStatus('idle'));
  };

  const checkPasswords = () => {
    if (
      !isLogin &&
      (formState?.inputs?.password?.isTouched ||
        formState?.inputs?.confirm_password?.isTouched) &&
      formState?.inputs?.password?.value !==
        formState?.inputs?.confirm_password?.value
    ) {
      setPasswordErrorMessage("The passwords don't match!");
      setFormData(
        {
          ...formState.inputs,
          confirm_password: {
            ...formState.inputs.confirm_password,
            isValid: false
          }
        },
        false
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          confirm_password: {
            ...formState.inputs.confirm_password,
            isValid: true
          }
        },
        true
      );
    }
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
            {t('Welcome to FinPort')}
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            <Trans i18nKey="welcomeMessage">
              This is your financial portfolio. Here you can store everything
              you have invested in plus a lot of cool features.
            </Trans>
          </TypographyH2>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
            noValidate
            autoComplete="on"
          >
            <div>
              {errorMessage && (
                <Alert sx={{ mr: 1.5, ml: 1.5, mb: 2 }} severity="error">
                  {errorMessage}
                </Alert>
              )}

              {!isLogin && (
                <Input
                  required
                  id="username"
                  label={t('Name')}
                  errorMessage={t('Please enter you name!')}
                  validators={[VALIDATOR_REQUIRE()]}
                  onInput={inputHandler}
                  {...formState.inputs.username}
                />
              )}
              <Input
                required
                id="email"
                label={t('E-mail')}
                errorMessage={t('Please enter a valid email address!')}
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}
                {...formState.inputs.email}
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                id="password"
                label={t('Password')}
                errorMessage={t('Password needs to be at least 8 characters!')}
                validators={[VALIDATOR_MINLENGTH(8)]}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onInput={inputHandler}
                onBlur={checkPasswords}
                {...formState.inputs.password}
              />
              {!isLogin && (
                <Input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  required
                  id="confirm_password"
                  label={t('Confirm Password')}
                  errorMessage={t(passwordErrorMessage)}
                  onBlur={checkPasswords}
                  onInput={inputHandler}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordConfirm}
                        onMouseDown={handleMouseDownPasswordConfirm}
                        edge="end"
                      >
                        {showPasswordConfirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  validators={[VALIDATOR_REQUIRE()]}
                  {...formState.inputs.confirm_password}
                />
              )}
            </div>
            <LoadingButton
              loading={loading}
              loadingPosition="end"
              endIcon={<LoginIcon />}
              sx={{ marginTop: 2 }}
              component={RouterLink}
              to="/"
              size="large"
              variant="contained"
              disabled={!formState.isValid}
              onClick={() => loginOrSignUp()}
            >
              {isLogin ? t('Login') : t('Sign Up')}
            </LoadingButton>
          </Box>
          {isLogin ? (
            <TypographyH2 mt={2}>
              <Trans i18nKey="signUpMessage">
                You don't have an account?
                <Link href="#" underline="none" onClick={switchModeHandler}>
                  Sign Up
                </Link>
              </Trans>
            </TypographyH2>
          ) : (
            <TypographyH2 mt={2}>
              <Trans i18nKey="loginMessage">
                Already have an account?
                <Link href="#" underline="none" onClick={switchModeHandler}>
                  Login
                </Link>
              </Trans>
            </TypographyH2>
          )}
          {isLogin && (
            <TypographyH3>
              <Trans i18nKey="recoverMessage">
                Forgot Password?
                <Link href="/reset-password" underline="none">
                  Recover it
                </Link>
              </Trans>
            </TypographyH3>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default LoginForm;
