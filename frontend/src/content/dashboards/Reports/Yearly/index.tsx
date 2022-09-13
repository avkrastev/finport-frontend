import { Helmet } from 'react-helmet-async';
import PageHeader from '../../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import ReportsTable from '../../ReportsTable';

function DashboardCrypto() {
  //const dispatch: AppDispatch = useDispatch();

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
            <ReportsTable/>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
