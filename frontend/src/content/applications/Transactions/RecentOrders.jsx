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
import TransactionModal from 'src/components/TransactionModal';

function RecentOrders() {
  const dispatch = useDispatch();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [clickedTransactionId, setClickedTransactionId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState({});

  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

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
      handleCloseConfirmModal();
    } catch (err) {
      console.error('Failed to delete the transaction', err);
    }
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const openEditModal = (id) => {
    setSelectedTransaction(
      transactions.find((transaction) => transaction.id === id)
    );
    setOpenTransactionModal(true);
  };

  return (
    <Card>
      <RecentOrdersTable
        assets={transactions}
        openDeleteModal={openDeleteModal}
        openEditModal={openEditModal}
      />
      <ConfirmDialog
        click={handleDeleteTransaction}
        open={openConfirmModal}
        close={handleCloseConfirmModal}
        title="Are you sure you want to delete this transaction?"
        transactionId={clickedTransactionId}
      />
      <TransactionModal
        transaction={selectedTransaction}
        open={openTransactionModal}
        close={handleCloseTransactionModal}
        tabs={true}
      />
    </Card>
  );
}

export default RecentOrders;
