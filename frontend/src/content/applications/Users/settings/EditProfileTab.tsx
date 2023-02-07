import { useState, ChangeEvent, useContext, Fragment } from 'react';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  ListItem,
  List,
  ListItemText,
  Switch,
  LinearProgress,
  Link,
  TextField,
  Stack,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';

import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { AuthContext } from '../../../../utils/context/authContext';
import {
  sendVerificationEmail,
  updateUser
} from '../../../../utils/api/userApiFunction';
import { currencies, languages } from 'src/constants/common';
import { useTranslation, Trans } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

function EditProfileTab() {
  const { authUserData, setUserData } = useContext(AuthContext);

  const { t, i18n } = useTranslation();

  const [dashboard, setDashboard] = useState(authUserData.categories);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const category = dashboard.find(
      (dashboard) => dashboard.key === event.target.name
    );
    category.show = event.target.checked;

    async function fetchUserData() {
      const responseData = await updateUser(dashboard, 'categories');
      if (responseData.data) {
        setUserData(responseData.data, Object.keys(responseData.data)[0]);
        setDashboard(responseData.data.categories);
        setShowSuccessSnackbar(true);
      }
    }

    fetchUserData();
  };

  const handleCloseSnackbar = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccessSnackbar(false);
  };

  const handleUserSettingsChange = (event: any) => {
    if (event.target.name === 'categories') {
      const category = dashboard.find(
        (dashboard) => dashboard.key === event.target.name
      );
      category.show = event.target.checked;
    }
    async function fetchUserData() {
      const responseData = await updateUser(
        event.target.value,
        event.target.name
      );
      if (responseData.data) {
        if (event.target.name === 'categories')
          setDashboard(responseData.data.categories);
        if (event.target.name === 'language')
          i18n.changeLanguage(responseData.data.language);
        setUserData(responseData.data, Object.keys(responseData.data)[0]);
        setShowSuccessSnackbar(true);
      }
    }

    fetchUserData();
  };

  const handleEmailVerification = async () => {
    setLoading(true);
    const verifyData = await sendVerificationEmail();
    if (verifyData) {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('Personal Details')}
              </Typography>
              <Typography variant="subtitle2">
                {t('Manage information related to your personal details')}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={2}>
                    <Box style={{ lineHeight: '2.3rem' }}>{t('Name')}:</Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <TextField
                      fullWidth
                      sx={{ mb: 2 }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      defaultValue={authUserData.name}
                      name="name"
                      onBlur={(event) => handleUserSettingsChange(event)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Box style={{ lineHeight: '2.3rem' }}>{t('E-mail')}:</Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <Typography style={{ lineHeight: '2.3rem' }} variant="h5">
                      <span style={{ display: 'inline-block' }}>
                        {authUserData.email}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          marginLeft: '1em',
                          verticalAlign: 'middle'
                        }}
                      >
                        {authUserData.email_verified ? (
                          <Tooltip title={t('Verified')}>
                            <VerifiedIcon fontSize="medium" color="success" />
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title={t('Not verified')}>
                              <NewReleasesIcon
                                fontSize="medium"
                                color="error"
                              />
                            </Tooltip>
                            {loading ? (
                              <CircularProgress size={20} sx={{ ml: 2 }} />
                            ) : success ? (
                              <Typography variant="subtitle2" sx={{ ml: 2 }}>
                                {t('Sent!')}
                              </Typography>
                            ) : (
                              <Link
                                href="#"
                                underline="none"
                                sx={{ ml: 1, lineHeight: 2 }}
                                onClick={handleEmailVerification}
                              >
                                {t('Send verification e-mail')}
                              </Link>
                            )}
                          </>
                        )}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={2}>
                    <Box style={{ lineHeight: '2.3rem' }}>
                      {t('Preferred language')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <TextField
                      name="language"
                      fullWidth
                      size="small"
                      select
                      value={authUserData.language}
                      onChange={(event) => handleUserSettingsChange(event)}
                    >
                      {languages.map((option) => (
                        <MenuItem key={option.value} value={option.key}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <Box style={{ lineHeight: '2.3rem' }}>
                      {t('Preferred currency')}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>
                    <TextField
                      name="currency"
                      fullWidth
                      size="small"
                      select
                      value={authUserData.currency}
                      onChange={(event) => handleUserSettingsChange(event)}
                    >
                      {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.key}>
                          {option.key} - {option.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            id="stocks-api-key"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('API keys')}:
              </Typography>
              <Typography variant="subtitle2">
                {t('Manage keys for reading data from 3rd party interfaces')}
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={12} sm={12} md={12}>
                  <Box pr={3} pb={2}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label={t('Stocks API key')}
                      margin="dense"
                      variant="outlined"
                      defaultValue={authUserData.stocks_api_key}
                      name="stocks_api_key"
                      onChange={(event) => handleUserSettingsChange(event)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography variant="subtitle2">
                    <Trans i18nKey="stockAPI">
                      You must obtain it from
                      <Link
                        fontWeight={'bold'}
                        color="inherit"
                        underline="none"
                        href="https://financeapi.net/"
                        target="_blank"
                      >
                        https://financeapi.net/
                      </Link>
                      You have to go and create an account. Then you will be
                      redirected to the Dashboard where you can see the API key.
                      Just paste it here.
                    </Trans>
                  </Typography>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {t('Dashboards')}
              </Typography>
              <Typography variant="subtitle2">
                {t('Show/hide dashboards from your portfolio')}
              </Typography>
            </Box>
            <LinearProgress />
          </Box>
          <Divider />
          {/* <Box sx={{ width: '100%' }}>{loading && <LinearProgress />}</Box> */}
          <CardContent sx={{ p: 1 }}>
            <Typography variant="subtitle2">
              <List>
                {dashboard.map((category, i) => {
                  return (
                    <Fragment key={i}>
                      <ListItem sx={{ p: 1 }}>
                        <ListItemText
                          primaryTypographyProps={{
                            variant: 'h5',
                            gutterBottom: true
                          }}
                          primary={t(category.value)}
                        />
                        <Switch
                          color="primary"
                          checked={category.show}
                          onChange={handleCategoryChange}
                          name={category.key}
                        />
                      </ListItem>
                      {i < dashboard.length - 1 && <Divider component="li" />}
                    </Fragment>
                  );
                })}
              </List>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={(event) => handleCloseSnackbar(event, 'close')}
            variant="filled"
            severity="success"
            sx={{ width: '100%' }}
          >
            {t('Successfully modified data!')}
          </Alert>
        </Snackbar>
      </Stack>
    </Grid>
  );
}

export default EditProfileTab;
