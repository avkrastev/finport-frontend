import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from '../AccountBalance';
import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchCrypto, getCryptoStatus, selectAllCrypto } from './cryptoSlice';
import CollapsibleTable from '../CollapsibleTable';

function DashboardCrypto() {
  const dispatch: AppDispatch = useDispatch();
  const crypto = useSelector(selectAllCrypto);
  const cryptoStatus = useSelector(getCryptoStatus);

  useEffect(() => {
    if (cryptoStatus === 'idle') {
      dispatch(fetchCrypto());
    }
  }, [cryptoStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>Crypto Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Crypto Portfolio" />
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
            <AccountBalance
              assets={crypto}
              category="crypto"
              loading={cryptoStatus}
            />
          </Grid>
          <Grid item xs={12}>
            <CollapsibleTable
              assets={crypto?.stats}
              category="crypto"
              loading={cryptoStatus}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
