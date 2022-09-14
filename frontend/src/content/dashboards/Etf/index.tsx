import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Alert } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from '../AccountBalance';
import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useContext, useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchETFs, getETFsStatus, selectAllETFs } from './ETFsSlice';
import CollapsibleTable from '../CollapsibleTable';
import { AuthContext } from 'src/utils/context/authContext';

function DashboardCrypto() {
  const { authUserData } = useContext(AuthContext);
  const dispatch: AppDispatch = useDispatch();
  const ETFs = useSelector(selectAllETFs);
  const etfStatus = useSelector(getETFsStatus);

  useEffect(() => {
    if (etfStatus === 'idle') {
      dispatch(fetchETFs());
    }
  }, [etfStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>ETFs Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="ETFs Portfolio" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          {!authUserData.stocks_api_key &&
            ETFs.stats &&
            etfStatus === 'succeeded' && (
              <Alert sx={{ mb: 3 }} variant="outlined" severity="info">
                To be able to see stock data prices please add an API key here.
              </Alert>
            )}
          <Grid item xs={12}>
            <AccountBalance assets={ETFs} category="etf" loading={etfStatus} />
          </Grid>
          {ETFs.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={ETFs.stats}
                category="etf"
                loading={etfStatus}
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
