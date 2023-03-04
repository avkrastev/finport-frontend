import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Container,
  CardContent,
  Box,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import ReportsTable from '../../ReportsTable';
import { useEffect, useState, SyntheticEvent } from 'react';
import {
  fetchTransactionsPerMonths,
  getMonthlyReportsData,
  getMonthlyReportStatus
} from '../reportsSlice';
import WatchListMonthly from '../../WatchListMonthly';
import ReportSkeleton from '../../ReportSkeleton';
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

function ReportMonthly() {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const monthlyReport = useSelector(getMonthlyReportsData);
  const monthlyReportStatus = useSelector(getMonthlyReportStatus);
  const [yearTab, setYearTab] = useState(0);

  useEffect(() => {
    if (monthlyReportStatus === 'idle') {
      dispatch(fetchTransactionsPerMonths());
    }
  }, [monthlyReportStatus, dispatch]);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setYearTab(newValue);
  };

  if (monthlyReportStatus !== 'succeeded') {
    return <ReportSkeleton tabs={true} />;
  }

  return (
    <>
      <Helmet>
        <title>{t('Monthly Report')}</title>
      </Helmet>
      <Container maxWidth="lg" sx={{ p: 5 }}>
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
                <Tabs
                  centered
                  variant="standard"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  value={yearTab}
                  onChange={handleTabChange}
                >
                  {monthlyReport.map((report, i) => (
                    <Tab key={i} label={report.year} {...a11yProps(i)} />
                  ))}
                </Tabs>
                {monthlyReport[yearTab] && (
                  <TabPanel value={yearTab} index={yearTab}>
                    <WatchListMonthly
                      year={monthlyReport[yearTab].year}
                      totalInvested={monthlyReport[yearTab].totalInvested}
                      totalTransactions={
                        monthlyReport[yearTab].totalTransactions
                      }
                      monthlySpent={monthlyReport[yearTab].monthlySpent}
                    />
                    <br />
                    <br />
                    <ReportsTable
                      year={monthlyReport[yearTab].year}
                      months={monthlyReport[yearTab].transactions}
                    />
                  </TabPanel>
                )}
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ReportMonthly;
