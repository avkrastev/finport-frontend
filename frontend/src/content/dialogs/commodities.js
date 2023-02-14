import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Tab,
  Tabs,
  Typography,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import {
  transactionTypes,
  commodities,
  currencies
} from '../../constants/common';
import {
  addNewTransaction,
  updateTransaction,
  getTransactionAddStatus,
  getTransactionUpdateStatus,
  resetStatuses,
  getTransactionsError
} from '../../content/applications/Transactions/transactionSlice';
import { changeCommoditiesStatus } from 'src/content/dashboards/Commodities/commoditiesSlice';
import { useForm } from 'src/utils/hooks/form-hook';
import Input from '../../components/FormElements/Input';
import { VALIDATOR_REQUIRE } from 'src/utils/validators';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { transactionStateDescriptor } from 'src/components/TransactionModal/transactionStateDescriptor';
import Selector from 'src/components/FormElements/Selector';

function CommoditiesModal(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [isEditForm, setIsEditForm] = useState(false);
  const transactionAddStatus = useSelector(getTransactionAddStatus);
  const transactionUpdateStatus = useSelector(getTransactionUpdateStatus);
  const transactionsError = useSelector(getTransactionsError);

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showFailedSnackbar, setShowFailedSnackbar] = useState(false);
  const [operation, setOperation] = useState('');

  const [formState, inputHandler, setFormData] = useForm(
    transactionStateDescriptor()
  );

  const handleAssetChange = (event, value) => {
    if (value) {
      setFormData({
        ...formState.inputs,
        category: { value: 'commodities', isValid: true },
        name: { value: value.value, isValid: true },
        asset_id: { value: value.id || '', isValid: true },
        symbol: { value: value.key, isValid: true }
      });
    }
  };

  useEffect(() => {
    if (props.transaction) {
      setFormData(
        {
          ...formState.inputs,
          id: {
            value: props.transaction.id,
            isValid: true,
            isTouched: false
          },
          name: {
            value: props.transaction.name,
            isValid: true,
            isTouched: false
          },
          asset_id: {
            value: props.transaction.asset_id,
            isValid: true,
            isTouched: false
          },
          symbol: {
            value: props.transaction.symbol,
            isValid: true,
            isTouched: false
          },
          category: {
            value: props.transaction.category,
            isValid: true,
            isTouched: false
          },
          price: {
            value: props.transaction.price,
            isValid: true,
            isTouched: false
          },
          quantity: {
            value: props.transaction.quantity,
            isValid: true,
            isTouched: false
          },
          currency: {
            value: props.transaction.currency,
            isValid: true,
            isTouched: false
          },
          date: {
            value: props.transaction.date,
            isValid: true,
            isTouched: false
          },
          type: {
            value: props.transaction.type,
            isValid: true,
            isTouched: false
          }
        },
        true
      );
      setTab(props.transaction.type);
      setIsEditForm(true);
    }
  }, [props.transaction]); // eslint-disable-line

  const setType = (value) => {
    const transactionType = transactionTypes.find((type) => type.key === value);
    let type = value;

    setFormData({
      ...formState.inputs,
      type: { value: type, isValid: true }
    });
    setTab(transactionType.parent);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const submitTransactionForm = async () => {
    try {
      let transactionPayload = {};
      for (const [key, description] of Object.entries(formState.inputs)) {
        transactionPayload[key] = description.value;
      }

      if (isEditForm) {
        dispatch(updateTransaction(transactionPayload));
      } else {
        dispatch(addNewTransaction(transactionPayload));
      }

      props.close();
      setFormData(transactionStateDescriptor());
      setTab(0);
    } catch (err) {
      console.log(err);
      // TODO catch error
    }
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

    return t(message);
  };

  useEffect(() => {
    if (transactionAddStatus === 'succeeded') {
      setShowSuccessSnackbar(true);
      dispatch(changeCommoditiesStatus('idle'));
    }
    if (transactionAddStatus === 'failed') {
      setShowFailedSnackbar(true);
    }
    setOperation('add');
    dispatch(resetStatuses());
  }, [transactionAddStatus, dispatch]);

  const handleCloseDialog = () => {
    setFormData(transactionStateDescriptor());
    setTab(0);
    props.close();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSuccessSnackbar(false);
  };

  return (
    <>
      <Dialog open={props.open} fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.contentText}</DialogContentText>
          <Box sx={{ width: 1, p: 2 }}>
            {props.tabs && (
              <Tabs
                centered
                textColor="primary"
                indicatorColor="primary"
                value={tab}
                onChange={(event, value) => setType(value)}
              >
                <Tab label={t('Buy')} {...a11yProps(0)} />
                <Tab label={t('Sell')} {...a11yProps(1)} />
                <Tab label={t('Transfer')} {...a11yProps(2)} />
              </Tabs>
            )}

            <Selector
              required
              autoHighlight
              fullWidth
              id="asset"
              options={commodities}
              label={t('Commodity')}
              sx={{ mt: 2, mb: 1 }}
              change={handleAssetChange}
              {...formState.inputs.symbol}
            />

            {tab !== 2 && (
              <Box sx={{ display: 'grid' }}>
                <Selector
                  required
                  id="currency"
                  options={currencies}
                  label={t('Currency')}
                  sx={{ gridColumn: '1', mt: 1, mb: 1 }}
                  onInput={inputHandler}
                  {...formState.inputs.currency}
                />
                <Input
                  required
                  sx={{ gridColumn: '2', input: { textAlign: 'right' } }}
                  margin="dense"
                  id="price"
                  label={t('Price')}
                  type="number"
                  valueType="number"
                  validators={[VALIDATOR_REQUIRE()]}
                  onInput={inputHandler}
                  onFocus={(event) => event.target.select()}
                  {...formState.inputs.price}
                  emptyValue={0}
                />
              </Box>
            )}
            {tab === 2 && (
              <Selector
                required
                autoHighlight
                fullWidth
                id="transfer"
                options={transactionTypes.filter((type) => type.parent === 2)}
                label={t('Transfer')}
                sx={{ mt: 2, mb: 1 }}
                {...formState.inputs.transfer}
                onInput={inputHandler}
              />
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr'
              }}
            >
              <Input
                required
                sx={{ gridColumn: '1', input: { textAlign: 'right' } }}
                margin="dense"
                id="quantity"
                label={t('Quantity')}
                type="number"
                valueType="number"
                onFocus={(event) => event.target.select()}
                onInput={inputHandler}
                fullWidth
                validators={[VALIDATOR_REQUIRE()]}
                {...formState.inputs.quantity}
                emptyValue={0}
              />
              <Typography
                sx={{
                  gridColumn: '2',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'end',
                  ml: 2
                }}
                variant="subtitle1"
              >
                {t('in troy ounces')}
              </Typography>
            </Box>

            <Input
              margin="dense"
              id="date"
              label={t('Date')}
              type="datetime-local"
              onInput={inputHandler}
              fullWidth
              value={
                isNaN(Date.parse(formState.inputs.date.value)) == false
                  ? format(
                      new Date(formState.inputs.date.value),
                      'yyyy-MM-dd HH:mm'
                    )
                  : ''
              }
              isTouched={formState.inputs.date.isTouched}
              isValid={formState.inputs.date.isValid}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ m: 3 }}>
          <Button onClick={handleCloseDialog}>{t('Cancel')}</Button>
          <Button
            disabled={!formState.isValid}
            onClick={submitTransactionForm}
            variant="contained"
            color="primary"
            autoFocus
          >
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
}

export default CommoditiesModal;
