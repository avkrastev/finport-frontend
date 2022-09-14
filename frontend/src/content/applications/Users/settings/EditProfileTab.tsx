import { useState, ChangeEvent, useContext, Fragment } from 'react';
import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  ListItem,
  List,
  ListItemText,
  Switch,
  LinearProgress
} from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import { AuthContext } from '../../../../utils/context/authContext';
import { updateUser } from '../../../../utils/api/userApiFunction';

function EditProfileTab() {
  const { authUserData, setUserData } = useContext(AuthContext);

  const [dashboard, setDashboard] = useState(authUserData.categories);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const category = dashboard.find(
      (dashboard) => dashboard.alias === event.target.name
    );
    category.show = event.target.checked;

    async function fetchUserData() {
      setLoading(true);
      const responseData = await updateUser(dashboard, 'categories');
      if (responseData.data) {
        setUserData(responseData.data, Object.keys(responseData.data)[0]);
        setDashboard(responseData.data.categories);
        setLoading(false);
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
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={12} sm={12} md={2}>
                  <Box pr={3} pb={2}>
                    Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={10}>
                  <Text color="black">
                    <b>{authUserData.name}</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={12} md={2}>
                  <Box pr={3} pb={2}>
                    E-mail:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <Text color="black">
                    <b>{authUserData.email}</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={12} md={7}>
                  <Label
                    color={authUserData.email_verified ? 'success' : 'error'}
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
            <Button variant="text" startIcon={<EditTwoToneIcon />}>
              Edit
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container sx={{ p: 2 }}>
                <Grid item xs={12} sm={12} md={2}>
                  <Box pr={3} pb={2}>
                    Stocks API Key:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={10}>
                  <Text color="black">34f34t453tg45g5ghh56h</Text>
                </Grid>
                <Grid item xs={12} sm={12} md={2} />
                <Grid item xs={12} sm={12} md={10}>
                  <Typography variant="subtitle2">
                    You must obtain it from here https://financeapi.net/
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
          <Box sx={{ width: '100%' }}>{loading && <LinearProgress />}</Box>
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
                          onChange={handleChange}
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
    </Grid>
  );
}

export default EditProfileTab;
