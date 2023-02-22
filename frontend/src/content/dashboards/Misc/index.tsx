import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import {} from 'src/content/applications/Transactions/transactionSlice';
import { useEffect } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchMisc, getMiscStatus, selectAllMisc } from './miscSlice';
import CollapsibleTable from '../CollapsibleTable';
import WatchListWithChart from '../WatchListWithChart';

function DashboardMisc() {
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
            <WatchListWithChart
              assets={misc}
              category="misc"
              loading={miscStatus}
            />
          </Grid>
          {misc.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={misc.stats}
                category="misc"
                loading={miscStatus}
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

export default DashboardMisc;
