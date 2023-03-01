import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Container,
  CardContent,
  Box,
  Tabs,
  Tab,
  Typography,
  Skeleton
} from '@mui/material';
import Footer from 'src/components/Footer';

import WatchListSkeleton from './WatchListSkeleton';
import ReportsTableSkeleton from './ReportsTableSkeleton';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function ReportSkeleton(props) {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('Report')}</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <CardContent>
              <Box sx={{ width: '100%' }}>
                {props.tabs && (
                  <Tabs
                    centered
                    variant="standard"
                    scrollButtons="auto"
                    textColor="primary"
                    indicatorColor="primary"
                    value={0}
                  >
                    <Tab
                      sx={{ backgroundColor: '#c0c0c0' }}
                      label={
                        <Skeleton
                          variant="text"
                          width={40}
                          sx={{ fontSize: '1.5rem', bgcolor: 'white' }}
                        />
                      }
                      {...a11yProps(0)}
                    />
                    <Tab
                      label={
                        <Skeleton
                          variant="text"
                          width={40}
                          sx={{ fontSize: '1.5rem' }}
                        />
                      }
                      {...a11yProps(1)}
                    />
                    <Tab
                      label={
                        <Skeleton
                          variant="text"
                          width={40}
                          sx={{ fontSize: '1.5rem' }}
                        />
                      }
                      {...a11yProps(2)}
                    />
                  </Tabs>
                )}
                <TabPanel value={0} index={0}>
                  <WatchListSkeleton />
                  <br />
                  <br />
                  <ReportsTableSkeleton />
                </TabPanel>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ReportSkeleton;
