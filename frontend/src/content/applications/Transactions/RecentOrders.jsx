import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '@mui/material';
import RecentOrdersTable from './RecentOrdersTable';
import ConfirmDialog from './ConfirmDialog';

import {
  selectAllTransactions,
  getTransactionsStatus,
  fetchTransactions,
  deleteTransaction
} from './transactionSlice';

function RecentOrders() {
  const dispatch = useDispatch();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [clickedTransactionId, setClickedTransactionId] = useState(null);
  const handleClose = () => setOpenConfirmModal(false);

  const transactions = useSelector(selectAllTransactions);
  const transactionsStatus = useSelector(getTransactionsStatus);

  useEffect(() => {
    if (transactionsStatus === 'idle') {
      dispatch(fetchTransactions());
    }
  }, [transactionsStatus, dispatch]);

  const openDeleteModal = (id) => {
    setClickedTransactionId(id);
    setOpenConfirmModal(true);
  };

  const handleDeleteTransaction = () => {
    try {
      if (clickedTransactionId)
        dispatch(deleteTransaction(clickedTransactionId)).unwrap();
      handleClose();
    } catch (err) {
      console.error('Failed to delete the transaction', err);
    }
  };

  return (
    <Card>
      <RecentOrdersTable
        assets={transactions}
        openDeleteModal={openDeleteModal}
      />
      <ConfirmDialog
        click={handleDeleteTransaction}
        open={openConfirmModal}
        close={handleClose}
        title="Are you sure you want to delete this transaction?"
        transactionId={clickedTransactionId}
      />
    </Card>
  );
}

export default RecentOrders;
