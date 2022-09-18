import { Helmet } from 'react-helmet-async';
import PageHeader from '../../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import ReportsTable from '../../ReportsTable';
import { useEffect } from 'react';
import { fetchTransactionsPerMonth, getMontlyReportData, getMontlyReportStatus } from '../reportsSlice';

function DashboardCrypto() {
  const dispatch: AppDispatch = useDispatch();
  const montlyReport = useSelector(getMontlyReportData);
  const montlyReportStatus = useSelector(getMontlyReportStatus);

  useEffect(() => {
    if (montlyReportStatus === 'idle') {
      dispatch(fetchTransactionsPerMonth());
    }
  }, [montlyReportStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>Monthly Report</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Monthly Report" />
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
            {montlyReport.map(report => {
              return <ReportsTable key={report.year} year={report.year} months={report.transactions} />;
            })
            }
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
