import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Stack, Snackbar, Alert } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import {
  getTransactionAddStatus,
  getTransactionDeleteStatus,
  getTransactionsError,
  getTransactionUpdateStatus,
  resetStatuses
} from 'src/content/applications/Transactions/transactionSlice';
import { useEffect, useState } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchMisc, getMiscStatus, selectAllMisc } from './miscSlice';
import CollapsibleTable from '../CollapsibleTable';
import WatchListWithChart from '../WatchListWithChart';
import { useTranslation } from 'react-i18next';
import { getSnackbarSuccessMessage } from 'src/utils/functions';
import MiscModal from 'src/content/dialogs/misc';
import { resetReportsState } from '../Reports/reportsSlice';

function DashboardMisc() {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const misc = useSelector(selectAllMisc);
  const miscStatus = useSelector(getMiscStatus);
  const transactionAddStatus = useSelector(getTransactionAddStatus);
  const transactionUpdateStatus = useSelector(getTransactionUpdateStatus);
  const transactionDeleteStatus = useSelector(getTransactionDeleteStatus);
  const transactionsError = useSelector(getTransactionsError);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [clearOpenedRow, setClearOpenedRow] = useState(false);
  const [operation, setOperation] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showFailedSnackbar, setShowFailedSnackbar] = useState(false);

  useEffect(() => {
    if (miscStatus === 'idle') {
      dispatch(fetchMisc());
    }
  }, [miscStatus, dispatch]);

  useEffect(() => {
    if (transactionAddStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchMisc());
      setClearOpenedRow(true);
    }
    if (transactionAddStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('add');
    dispatch(resetStatuses());
    dispatch(resetReportsState());
  }, [transactionAddStatus, dispatch]);

  useEffect(() => {
    if (transactionUpdateStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchMisc());
      setClearOpenedRow(true);
    }
    if (transactionUpdateStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('update');
    dispatch(resetStatuses());
    dispatch(resetReportsState());
  }, [transactionUpdateStatus, dispatch]);

  useEffect(() => {
    if (transactionDeleteStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchMisc());
      setClearOpenedRow(true);
    }
    if (transactionDeleteStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('delete');
    dispatch(resetStatuses());
    dispatch(resetReportsState());
  }, [transactionDeleteStatus, dispatch]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccessSnackbar(false);
  };

  const handleCloseTransactionModal = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenTransactionModal(false);
  };

  const openMainModal = () => {
    setOpenTransactionModal(true);
    setCurrentTransaction({});
  };

  return (
    <>
      <Helmet>
        <title>{t('Miscellaneous Dashboard')}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title={t('Miscellaneous Portfolio')} />
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
              openModal={openMainModal}
            />
          </Grid>
          {misc.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={misc.stats}
                category="misc"
                loading={miscStatus}
                selectedTransaction={(row) => setCurrentTransaction(row)}
                openModal={() => setOpenTransactionModal(true)}
                clearOpenedRow={clearOpenedRow}
              />
            </Grid>
          )}
        </Grid>
        <MiscModal
          transaction={currentTransaction}
          open={openTransactionModal}
          close={handleCloseTransactionModal}
          tabs={true}
          stats={misc.stats}
        />
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={showSuccessSnackbar}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
          >
            <Alert variant="filled" severity="success" sx={{ width: '100%' }}>
              {getSnackbarSuccessMessage(operation)}
            </Alert>
          </Snackbar>
          <Snackbar
            open={showFailedSnackbar}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
          >
            <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
              {transactionsError}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardMisc;
