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
import { fetchStocks, getStocksStatus, selectAllStocks } from './stocksSlice';
import CollapsibleTable from '../CollapsibleTable';

function DashboardCrypto() {
  const dispatch: AppDispatch = useDispatch();
  const stocks = useSelector(selectAllStocks);
  const stocksStatus = useSelector(getStocksStatus);

  useEffect(() => {
    if (stocksStatus === 'idle') {
      dispatch(fetchStocks());
    }
  }, [stocksStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>Stocks Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Stocks Portfolio" />
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
              assets={stocks}
              category="stocks"
              loading={stocksStatus}
            />
          </Grid>
          <Grid item xs={12}>
            <CollapsibleTable
              assets={stocks?.stats}
              category="stocks"
              loading={stocksStatus}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCrypto;
