import { Helmet } from 'react-helmet-async';
import PageHeader from '../PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Stack, Snackbar, Alert } from '@mui/material';
import Footer from 'src/components/Footer';

import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { AppDispatch } from 'src/app/store';
import { fetchETFs, getETFsStatus, selectAllETFs } from './ETFsSlice';
import CollapsibleTable from '../CollapsibleTable';
import { AuthContext } from 'src/utils/context/authContext';
import MissingApiKeyMessage from '../MissingApiKeyMessage';
import WatchListWithChart from '../WatchListWithChart';
import { useTranslation } from 'react-i18next';
import StocksModal from 'src/content/dialogs/stocks';
import { getSnackbarSuccessMessage } from 'src/utils/functions';
import {
  getTransactionAddStatus,
  getTransactionDeleteStatus,
  getTransactionsError,
  getTransactionUpdateStatus,
  resetStatuses
} from 'src/content/applications/Transactions/transactionSlice';
import { resetReportsState } from '../Reports/reportsSlice';

function DashboardETF() {
  const { t } = useTranslation();
  const { authUserData } = useContext(AuthContext);
  const dispatch: AppDispatch = useDispatch();
  const ETFs = useSelector(selectAllETFs);
  const etfStatus = useSelector(getETFsStatus);

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
    if (etfStatus === 'idle') {
      dispatch(fetchETFs());
    }
  }, [etfStatus, dispatch]);

  useEffect(() => {
    if (transactionAddStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchETFs());
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
      dispatch(fetchETFs());
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
      dispatch(fetchETFs());
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
        <title>{t('ETFs Dashboard')}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader title={t('ETFs Portfolio')} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        {!authUserData.stocks_api_key && (
          <MissingApiKeyMessage
            text={t(
              'To be able to see ETF prices in real time please add an API key'
            )}
          />
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
              openModal={openMainModal}
            />
          </Grid>
          {ETFs.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={ETFs.stats}
                category="etf"
                loading={etfStatus}
                selectedTransaction={(row) => setCurrentTransaction(row)}
                openModal={() => setOpenTransactionModal(true)}
                clearOpenedRow={clearOpenedRow}
              />
            </Grid>
          )}
        </Grid>
        <StocksModal
          transaction={currentTransaction}
          open={openTransactionModal}
          close={handleCloseTransactionModal}
          tabs={true}
          stats={ETFs.stats}
          category="etf"
          {...authUserData}
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

export default DashboardETF;
