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

interface Status {
  severity: 'error' | 'success' | 'warning';
  text: string;
}

function EditProfileTab() {
  const { authUserData, setUserData } = useContext(AuthContext);

  const { t, i18n } = useTranslation();

  const [dashboard, setDashboard] = useState(authUserData.categories);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [status, setStatus] = useState<Status>({
    severity: 'error',
    text: ''
  });

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const category = dashboard.find(
      (dashboard) => dashboard.key === event.target.name
    );
    category.show = event.target.checked;

    async function fetchUserData() {
      const responseData = await updateUser(dashboard, 'categories');
      setShowSnackbar(true);
      if (responseData.status <= 299) {
        setUserData(responseData.data, Object.keys(responseData.data)[0]);
        setDashboard(responseData.data.categories);
        setStatus({
          severity: 'success',
          text: 'Successfully modified data!'
        });
      } else {
        setStatus({
          severity: 'error',
          text: responseData.data.message
        });
      }
    }

    fetchUserData();
  };

  const handleCloseSnackbar = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
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
      setShowSnackbar(true);
      if (responseData.status <= 299) {
        if (event.target.name === 'categories')
          setDashboard(responseData.data.categories);
        if (event.target.name === 'language')
          i18n.changeLanguage(responseData.data.language);
        setUserData(responseData.data, Object.keys(responseData.data)[0]);

        setStatus({
          severity: 'success',
          text: 'Successfully modified data!'
        });
      } else {
        setStatus({
          severity: 'error',
          text: responseData.data.message
        });
      }
    }

    fetchUserData();
  };

  const handleEmailVerification = async () => {
    setLoading(true);
    const verifyData = await sendVerificationEmail();
    if (verifyData.status <= 299) {
      setSuccess(true);
    } else {
      setShowSnackbar(true);
      setStatus({
        severity: 'error',
        text: verifyData.data.message
      });
    }
    setLoading(false);
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
                          {t(option.description)} - {option.value}
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
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={(event) => handleCloseSnackbar(event, 'close')}
            variant="filled"
            severity={status.severity}
            sx={{ width: '100%' }}
          >
            {t(status.text)}
          </Alert>
        </Snackbar>
      </Stack>
    </Grid>
  );
}

export default EditProfileTab;
