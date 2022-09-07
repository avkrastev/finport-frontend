import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from '../AccountBalance';
import Wallets from '../Wallets';
import WatchList from '../WatchList';
import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchMisc, getMiscStatus, selectAllMisc } from './miscSlice';
import CollapsibleTable from '../CollapsibleTable';

function DashboardCrypto() {
  const dispatch: AppDispatch = useDispatch();
  const misc = useSelector(selectAllMisc);
  const miscStatus = useSelector(getMiscStatus);

  useEffect(() => {
    if (miscStatus === 'idle') {
      dispatch(fetchMisc());
    }
  }, [miscStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>Miscellaneous Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Miscellaneous Portfolio" />
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
            <AccountBalance assets={misc} category="misc" />
          </Grid> 
          <Grid item xs={12}>
            <CollapsibleTable assets={misc?.stats} asset="misc" />
          </Grid>
          {/* <Grid item lg={12} xs={12}>
            <Wallets />
          </Grid>
          <Grid item xs={12}>
            <WatchList />
          </Grid> */}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
