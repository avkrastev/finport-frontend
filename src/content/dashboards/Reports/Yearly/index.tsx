import { Helmet } from 'react-helmet-async';
import { Grid, Container, CardContent, Box } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import ReportsTable from '../../ReportsTable';
import {
  getYearlyReportsData,
  fetchTransactionsPerYears,
  getYearlyReportStatus
} from '../reportsSlice';
import { useEffect } from 'react';
import WatchListYearly from '../../WatchListYearly';
import ReportSkeleton from '../../ReportSkeleton';
import { useTranslation } from 'react-i18next';

function ReportYearly() {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const report = useSelector(getYearlyReportsData);
  const reportStatus = useSelector(getYearlyReportStatus);

  useEffect(() => {
    if (reportStatus === 'idle') {
      dispatch(fetchTransactionsPerYears());
    }
  }, [reportStatus, dispatch]);

  if (reportStatus !== 'succeeded') {
    return <ReportSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>{t('Yearly Report')}</title>
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
            <CardContent sx={{ ml: 3, mr: 3 }}>
              <Box sx={{ width: '100%' }}>
                <WatchListYearly
                  totalInvested={report.totalInvested}
                  yearlySpent={report.yearlySpent}
                  yearsLabels={report.yearsLabels}
                  totalTransactions={report.totalTransactions}
                />
                <br />
                <br />
                <ReportsTable year={report.year} months={report.transactions} />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ReportYearly;
