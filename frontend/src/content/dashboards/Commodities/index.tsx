import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import {
  fetchCommodities,
  getCommoditiesStatus,
  selectAllCommodities
} from './commoditiesSlice';
import CollapsibleTable from '../CollapsibleTable';
import WatchListWithChart from '../WatchListWithChart';

function DashboardCommodities() {
  const dispatch: AppDispatch = useDispatch();
  const commodities = useSelector(selectAllCommodities);
  const commoditiesStatus = useSelector(getCommoditiesStatus);

  useEffect(() => {
    if (commoditiesStatus === 'idle') {
      dispatch(fetchCommodities());
    }
  }, [commoditiesStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>Commodities Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title="Commodities Portfolio" />
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
            <WatchListWithChart
              assets={commodities}
              category="commodities"
              loading={commoditiesStatus}
            />
          </Grid>
          {commodities.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={commodities.stats}
                category="commodities"
                loading={commoditiesStatus}
              />
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardCommodities;
