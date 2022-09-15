import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Card, Snackbar, Stack } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ConfirmDialog from './ConfirmDialog';

import {
  selectAllTransactions,
  getTransactionsStatus,
  fetchTransactions,
  getTransactionAddStatus,
  getTransactionUpdateStatus,
  getTransactionDeleteStatus,
  getTransactionsError,
  resetStatuses
} from './transactionSlice';
import TransactionModal from 'src/components/TransactionModal';
import SuspenseLoader from 'src/components/SuspenseLoader';

function RecentOrders() {
  const dispatch = useDispatch();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [clickedTransactionId, setClickedTransactionId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showFailedSnackbar, setShowFailedSnackbar] = useState(false);
  const [operation, setOperation] = useState('');

  const transactions = useSelector(selectAllTransactions);
  const transactionsStatus = useSelector(getTransactionsStatus);
  const transactionAddStatus = useSelector(getTransactionAddStatus);
  const transactionUpdateStatus = useSelector(getTransactionUpdateStatus);
  const transactionDeleteStatus = useSelector(getTransactionDeleteStatus);
  const transactionsError = useSelector(getTransactionsError);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccessSnackbar(false);
  };

  useEffect(() => {
    if (transactionsStatus === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [transactionsStatus, dispatch]);

  useEffect(() => {
    if (transactionAddStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
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
    }
    if (transactionDeleteStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('delete');
    dispatch(resetStatuses());
  }, [transactionDeleteStatus, dispatch]);

  const openDeleteModal = (id) => {
    setClickedTransactionId(id);
    setSelectedTransaction(
      transactions.find((transaction) => transaction.id === id)
    );

    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const openEditModal = (id) => {
    setSelectedTransaction(
      transactions.find((transaction) => transaction.id === id)
    );
    setOpenTransactionModal(true);
  };

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

    return message;
  };

  if (transactionsStatus === 'loading') {
    return <SuspenseLoader></SuspenseLoader>;
  }

  return (
    <Card>
      <RecentOrdersTable
        assets={transactions}
        openDeleteModal={openDeleteModal}
        openEditModal={openEditModal}
      />
      <ConfirmDialog
        open={openConfirmModal}
        title="Are you sure you want to delete this transaction?"
        transactionId={clickedTransactionId}
        category={selectedTransaction.category}
        close={handleCloseConfirmModal}
      />
      <TransactionModal
        transaction={selectedTransaction}
        open={openTransactionModal}
        close={handleCloseTransactionModal}
        tabs={true}
      />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            variant="filled"
            severity="success"
            sx={{ width: '100%' }}
          >
            {getSnackbarSuccessMessage()}
          </Alert>
        </Snackbar>
        <Snackbar
          open={showFailedSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            variant="filled"
            severity="error"
            sx={{ width: '100%' }}
          >
            {transactionsError}
          </Alert>
        </Snackbar>
      </Stack>
    </Card>
  );
}

export default RecentOrders;
