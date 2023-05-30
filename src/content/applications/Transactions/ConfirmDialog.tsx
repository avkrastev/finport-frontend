import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { deleteTransaction, deleteTransactions } from './transactionSlice';

const ConfirmDialog = (props: any) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();

  const handleConfirmClicked = () => {
    if (props.bulkDelete) {
      handleBulkDeleteButton();
    } else {
      handleDeleteTransaction();
    }
  };

  const handleBulkDeleteButton = () => {
    try {
      dispatch(deleteTransactions(props.selectedIds)).unwrap();
    } catch (err) {
      console.error('Failed to delete the transaction', err);
    }
    props.close();
    props.cleanSelection();
  };

  const handleDeleteTransaction = () => {
    try {
      if (props.transactionId) dispatch(deleteTransaction(props.transactionId));
      props.close();
    } catch (err) {
      console.error('Failed to delete the transaction', err);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t(props.title)}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t(props.content)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>{t('No')}</Button>
        <Button
          onClick={handleConfirmClicked}
          variant="contained"
          color="error"
          autoFocus
        >
          {t('Yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
