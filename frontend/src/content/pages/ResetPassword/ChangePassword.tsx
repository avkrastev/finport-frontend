import { Box, Container, Grid, Typography, Link, Button } from '@mui/material';

import { experimentalStyled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Input from '../../../components/FormElements/Input';
import { changePassword } from '../../../utils/api/userApiFunction';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../../utils/validators';
import { useForm } from '../../../utils/hooks/form-hook';

import LoadingButton from '@mui/lab/LoadingButton';
import { Trans, useTranslation } from 'react-i18next';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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

function ChangePassword(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    password: { value: '', isValid: false, isTouched: false },
    confirm_password: { value: '', isValid: false, isTouched: false }
  });

  useEffect(() => {
    const listener = (event) => {
      if (
        formState.isValid &&
        (event.code === 'Enter' || event.code === 'NumpadEnter')
      ) {
        handleChangePassword();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [formState.isValid]); // eslint-disable-line

  const checkPasswords = () => {
    if (
      (formState?.inputs?.password?.isTouched ||
        formState?.inputs?.confirm_password?.isTouched) &&
      formState.inputs.password.value !==
        formState.inputs.confirm_password.value
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

  console.log(formState);

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const responseData = await changePassword(
        props.id,
        formState.inputs.password.value
      );
      if (responseData.data) {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err) {
      // TODO catch error
      setLoading(false);
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
            {t('Change Password')}
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
            {success ? (
              <Trans i18nKey="changePasswordSuccessMessage">
                You have successfully changed your password!
              </Trans>
            ) : (
              <Trans i18nKey="changePasswordMessage">
                Please, fill in your new password. It must be at least 8
                characters long.
              </Trans>
            )}
          </TypographyH2>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '35ch' } }}
            noValidate
            autoComplete="on"
          >
            {!success && (
              <div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="password"
                  label={t('Password')}
                  errorMessage={t(
                    'Password needs to be at least 8 characters!'
                  )}
                  onBlur={checkPasswords}
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
                  {...formState.inputs.password}
                />
                <Input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  required
                  id="confirm_password"
                  label={t('Confirm Password')}
                  errorMessage={t(passwordErrorMessage)}
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  onBlur={checkPasswords}
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
                  {...formState.inputs.confirm_password}
                />
              </div>
            )}
            {success ? (
              <Button href="/" variant="contained">
                {t('Go to Login')}
              </Button>
            ) : (
              <LoadingButton
                disabled={!formState.isValid}
                loading={loading}
                loadingPosition="end"
                endIcon={<VpnKeyIcon />}
                sx={{ marginTop: 2 }}
                size="large"
                variant="contained"
                onClick={() => handleChangePassword()}
              >
                {t('Change Password')}
              </LoadingButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ChangePassword;
