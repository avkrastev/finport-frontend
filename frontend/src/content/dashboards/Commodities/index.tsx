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
  fetchCommodities,
  getCommoditiesStatus,
  selectAllCommodities
} from './commoditiesSlice';
import CollapsibleTable from '../CollapsibleTable';
import WatchListWithChart from '../WatchListWithChart';
import { Trans, useTranslation } from 'react-i18next';
import CryptoModal from 'src/content/dialogs/crypto';
import CommoditiesModal from 'src/content/dialogs/commodities';

function DashboardCommodities() {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const commodities = useSelector(selectAllCommodities);
  const commoditiesStatus = useSelector(getCommoditiesStatus);
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

  const currentPath = location.pathname.split('/')[2];

  const modals = {
    crypto: CryptoModal,
    stocks: CommoditiesModal,
    p2p: CommoditiesModal,
    etf: CommoditiesModal,
    misc: CommoditiesModal,
    commodities: CommoditiesModal
  };

  const Modal = modals[currentPath];

  const handleCloseTransactionModal = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpenTransactionModal(false);
  };

  useEffect(() => {
    if (commoditiesStatus === 'idle') {
      dispatch(fetchCommodities());
    }
  }, [commoditiesStatus, dispatch]);

  const getSnackbarSuccessMessage = () => {
    let message = '';
    switch (operation) {
      case 'add':
        message = 'Successfully added transaction!';
        break;
      case 'update':
        message = 'Successfully updated transaction!';
        break;
      case 'delete':
        message = 'Successfully deleted transaction(s)!';
        break;
      default:
        message = 'Successful operation!';
    }

    return t(message);
  };

  useEffect(() => {
    if (transactionAddStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchCommodities());
      setClearOpenedRow(true);
    }
    if (transactionAddStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('add');
    dispatch(resetStatuses());
  }, [transactionAddStatus, dispatch]);

  useEffect(() => {
    if (transactionUpdateStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchCommodities());
      setClearOpenedRow(true);
    }
    if (transactionUpdateStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('update');
    dispatch(resetStatuses());
  }, [transactionUpdateStatus, dispatch]);

  useEffect(() => {
    if (transactionDeleteStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(fetchCommodities());
      setClearOpenedRow(true);
    }
    if (transactionDeleteStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('delete');
    dispatch(resetStatuses());
  }, [transactionDeleteStatus, dispatch]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccessSnackbar(false);
  };

  return (
    <>
      <Helmet>
        <title>{t('Commodities Dashboard')}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          title={
            <Trans i18nKey={'Commodities Portfolio'}>
              Commodities Portfolio
            </Trans>
          }
        />
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
              openModal={() => setOpenTransactionModal(true)}
            />
          </Grid>
          {commodities.stats && (
            <Grid item xs={12}>
              <CollapsibleTable
                assets={commodities.stats}
                category="commodities"
                loading={commoditiesStatus}
                selectedTransaction={(row) => setCurrentTransaction(row)}
                openModal={() => setOpenTransactionModal(true)}
                clearOpenedRow={clearOpenedRow}
              />
            </Grid>
          )}
        </Grid>
        <Modal
          transaction={currentTransaction}
          open={openTransactionModal}
          close={handleCloseTransactionModal}
          tabs={true}
          stats={commodities.stats}
        />
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={showSuccessSnackbar}
            autoHideDuration={2000}
            onClose={handleCloseSnackbar}
          >
            <Alert variant="filled" severity="success" sx={{ width: '100%' }}>
              {getSnackbarSuccessMessage()}
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

export default DashboardCommodities;
