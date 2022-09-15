import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/app/store';
import { changeCommoditiesStatus } from 'src/content/dashboards/Commodities/commoditiesSlice';
import { changeCryptoStatus } from 'src/content/dashboards/Crypto/cryptoSlice';
import { changeETFStatus } from 'src/content/dashboards/Etf/ETFsSlice';
import { changeMiscStatus } from 'src/content/dashboards/Misc/miscSlice';
import { changeP2PStatus } from 'src/content/dashboards/P2P/p2pSlice';
import { changeStocksStatus } from 'src/content/dashboards/Stocks/stocksSlice';
import {
  changeTransactionStatus,
  deleteTransaction,
  deleteTransactions
} from './transactionSlice';

const ConfirmDialog = (props: any) => {
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
      if (props.transactionId)
        dispatch(deleteTransaction(props.transactionId))
          .unwrap()
          .then(() => {
            if (props.refetchTransactions) {
              dispatch(changeTransactionStatus('idle'));
            }

            switch (props.category) {
              case 'crypto':
                dispatch(changeCryptoStatus('idle'));
                break;
              case 'stocks':
                dispatch(changeStocksStatus('idle'));
                break;
              case 'etf':
                dispatch(changeETFStatus('idle'));
                break;
              case 'misc':
                dispatch(changeMiscStatus('idle'));
                break;
              case 'commodities':
                dispatch(changeCommoditiesStatus('idle'));
                break;
              case 'p2p':
                dispatch(changeP2PStatus('idle'));
                break;
              default:
                break;
            }
          });
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
          onClick={handleConfirmClicked}
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
