import { Helmet } from 'react-helmet-async';
import PageHeader from '../dashboards/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import Wallets from '../dashboards/Wallets';
import WatchList from '../dashboards/WatchList';

function Overview() {
  return (
    <>
      <Helmet>
        <title>Overview</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Overview"/>
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
          <Wallets assets={[]} />
          </Grid>
          <Grid item xs={12}>
            <WatchList />
          </Grid> 
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Overview;
