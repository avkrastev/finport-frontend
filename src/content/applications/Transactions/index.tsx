import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentOrders from './RecentOrders.jsx';
import MissingApiKeyMessage from 'src/content/dashboards/MissingApiKeyMessage';
import { useContext } from 'react';
import { AuthContext } from 'src/utils/context/authContext';

function ApplicationsTransactions() {
  const { authUserData } = useContext(AuthContext);

  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        {!authUserData.stocks_api_key && (
          <MissingApiKeyMessage text="To be able to use stocks and ETF data please add an API key" />
        )}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;
