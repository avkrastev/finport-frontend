import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { deleteTransaction } from './transactionSlice';
import { AppDispatch } from 'src/app/store';

const ConfirmDialog = (props: any) => {
  const dispatch: AppDispatch = useDispatch();

  const handleDeleteTransaction = () => {
    try {
      if (props.transactionId)
        dispatch(deleteTransaction(props.transactionId)).unwrap();
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
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>No</Button>
        <Button
          onClick={handleDeleteTransaction}
          variant="contained"
          color="error"
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
