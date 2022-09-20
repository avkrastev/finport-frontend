import { Helmet } from 'react-helmet-async';
import PageHeader from '../../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
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

function DashboardCrypto() {
  const dispatch: AppDispatch = useDispatch();
  const report = useSelector(getYearlyReportsData);
  const reportStatus = useSelector(getYearlyReportStatus);

  useEffect(() => {
    if (reportStatus === 'idle') {
      dispatch(fetchTransactionsPerYears());
    }
  }, [reportStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>Yearly Report</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Yearly Report" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            {report && (
              <>
                <WatchListYearly
                  totalInvested={report.totalInvested}
                  yearlySpent={report.yearlySpent}
                  yearsLabels={report.yearsLabels}
                  totalTransactions={report.totalTransactions}
                />
                <br />
                <br />
                <ReportsTable year={report.year} months={report.transactions} />
              </>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
