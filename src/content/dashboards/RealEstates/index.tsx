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
import {
  fetchRealEstate,
  getRealEstateStatus,
  selectAllRealEstate
} from './RealEstatesSlice';
import CollapsibleTable from '../CollapsibleTable';
import WatchListWithChart from '../WatchListWithChart';
import { useTranslation } from 'react-i18next';
import { getSnackbarSuccessMessage } from 'src/utils/functions';
import RealModal from 'src/content/dialogs/real';
import { resetReportsState } from '../Reports/reportsSlice';
import RealEstateCard from './RealEstateCard';
import { resetSummaryState } from 'src/content/overview/summarySlice';

function DashboardRealEstates() {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const realEstates = useSelector(selectAllRealEstate);
  const realEstatesStatus = useSelector(getRealEstateStatus);
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
    if (realEstatesStatus === 'idle') {
      dispatch(fetchRealEstate());
    }
  }, [realEstatesStatus, dispatch]);

  useEffect(() => {
    if (transactionAddStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchRealEstate());
      setClearOpenedRow(true);
    }
    if (transactionAddStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('add');
    dispatch(resetStatuses());
    dispatch(resetReportsState());
    dispatch(resetSummaryState());
  }, [transactionAddStatus, dispatch]);

  useEffect(() => {
    if (transactionUpdateStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchRealEstate());
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
      dispatch(fetchRealEstate());
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
        <title>{t('Real Estate Dashboard')}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title={t('Real Estate Portfolio')} />
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
              assets={realEstates}
              category="real"
              loading={realEstatesStatus}
              openModal={openMainModal}
            />
          </Grid>
          {realEstates && (
            <Grid item lg={12} xs={12}>
              <RealEstateCard assets={realEstates} status={realEstatesStatus} />
            </Grid>
          )}
          {realEstates.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={realEstates.stats}
                category="real"
                loading={realEstatesStatus}
                selectedTransaction={(row) => setCurrentTransaction(row)}
                openModal={() => setOpenTransactionModal(true)}
                clearOpenedRow={clearOpenedRow}
              />
            </Grid>
          )}
        </Grid>
        <RealModal
          transaction={currentTransaction}
          open={openTransactionModal}
          close={handleCloseTransactionModal}
          tabs={true}
          stats={realEstates.stats}
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

export default DashboardRealEstates;
