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
  Alert
} from '@mui/material';

import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Label from 'src/components/Label';
import { AuthContext } from '../../../../utils/context/authContext';
import { updateUser } from '../../../../utils/api/userApiFunction';

function EditProfileTab() {
  const { authUserData, setUserData } = useContext(AuthContext);

  const [dashboard, setDashboard] = useState(authUserData.categories);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const category = dashboard.find(
      (dashboard) => dashboard.alias === event.target.name
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
        (dashboard) => dashboard.alias === event.target.name
      );
      category.show = event.target.checked;
    }
    async function fetchUserData() {
      const responseData = await updateUser(
        event.target.value,
        event.target.name
      );
      if (responseData.data) {
        if (event.target.name === 'categories') setDashboard(responseData.data.categories);
        setUserData(responseData.data, Object.keys(responseData.data)[0]);
        setShowSuccessSnackbar(true);
      }
    }

    fetchUserData();
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
                Personal Details
              </Typography>
              <Typography variant="subtitle2">
                Manage information related to your personal details
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={12} sm={12} md={2}>
                  <Box style={{ lineHeight: '2.3rem' }}>Name:</Box>
                </Grid>
                <Grid item xs={12} sm={12} md={10}>
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
                  <Box style={{ lineHeight: '2.3rem' }}>E-mail:</Box>
                </Grid>
                <Grid item xs={12} sm={12} md={10}>
                  <Typography style={{ lineHeight: '2.3rem' }} variant="h5">
                    <span style={{ display: 'inline-block' }}>
                      {authUserData.email}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: '1rem',
                        lineHeight: '2.3rem',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Label
                        color={
                          authUserData.email_verified ? 'success' : 'error'
                        }
                      >
                        {authUserData.email_verified ? (
                          <DoneTwoToneIcon fontSize="small" />
                        ) : (
                          <CloseTwoToneIcon fontSize="small" />
                        )}
                        <b>
                          {authUserData.email_verified
                            ? 'Verified'
                            : 'Not verified'}
                        </b>
                      </Label>
                    </span>
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
                API keys
              </Typography>
              <Typography variant="subtitle2">
                Manage keys for reading data from 3rd party interfaces
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
                      label="Stocks API key"
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
                    You must obtain it from&nbsp;
                    <Link
                      fontWeight={'bold'}
                      color="inherit"
                      underline="none"
                      href="https://financeapi.net/"
                      target="_blank"
                    >
                      https://financeapi.net/
                    </Link>
                    . You have to go and create an account. Then you will be
                    redirected to the Dashboard where you can see the API key.
                    Just paste it here.
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
                Dashboards
              </Typography>
              <Typography variant="subtitle2">
                Show/hide dashboards from your portfolio
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
                          primary={category.name}
                        />
                        <Switch
                          color="primary"
                          checked={category.show}
                          onChange={handleCategoryChange}
                          name={category.alias}
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
            Successfully modified data!
          </Alert>
        </Snackbar>
      </Stack>
    </Grid>
  );
}

export default EditProfileTab;
