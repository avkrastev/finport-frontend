import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useContext, useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchETFs, getETFsStatus, selectAllETFs } from './ETFsSlice';
import CollapsibleTable from '../CollapsibleTable';
import { AuthContext } from 'src/utils/context/authContext';
import MissingApiKeyMessage from '../MissingApiKeyMessage';
import WatchListWithChart from '../WatchListWithChart';

function DashboardETF() {
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
        {!authUserData.stocks_api_key && (
          <MissingApiKeyMessage text="To be able to see ETF prices in real time please add an API key" />
        )}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <WatchListWithChart
              assets={ETFs}
              category="etf"
              loading={etfStatus}
            />
          </Grid>
          {ETFs.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={ETFs.stats}
                category="etf"
                loading={etfStatus}
                selectedTransaction={() => {}}
                openModal={() => {}}
                clearOpenedRow={() => {}}
              />
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardETF;
