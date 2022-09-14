import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from '../AccountBalance';
import Wallets from '../Wallets';
import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchP2P, getP2PStatus, selectAllP2P } from './p2pSlice';
import CollapsibleTable from '../CollapsibleTable';

function DashboardCrypto() {
  const dispatch: AppDispatch = useDispatch();
  const p2p = useSelector(selectAllP2P);
  const p2pStatus = useSelector(getP2PStatus);

  useEffect(() => {
    if (p2pStatus === 'idle') {
      dispatch(fetchP2P());
    }
  }, [p2pStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>P2P Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="P2P Portfolio" />
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
            <AccountBalance assets={p2p} category="p2p" loading={p2pStatus} />
          </Grid>
          {p2p && (
            <Grid item lg={12} xs={12}>
              <Wallets assets={p2p} status={p2pStatus} />
            </Grid>
          )}
          {p2p.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={p2p.stats}
                category="p2p"
                loading={p2pStatus}
              />
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
