import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
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
  IconButton,
  InputAdornment,
  debounce
} from '@mui/material';
import { transactionTypes, currencies } from '../../constants/common';
import {
  addNewTransaction,
  updateTransaction
} from '../applications/Transactions/transactionSlice';
import { useForm } from 'src/utils/hooks/form-hook';
import Input from '../../components/FormElements/Input';
import { VALIDATOR_REQUIRE } from 'src/utils/validators';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { transactionStateDescriptor } from 'src/components/TransactionModal/transactionStateDescriptor';
import Selector from 'src/components/FormElements/Selector';
import {
  formatAmountAndCurrency,
  roundNumber,
  validateStateEntity
} from 'src/utils/functions';
import { autocompleteStocks2 } from 'src/utils/api/stocksApiFunction';
import { getStockPrice } from 'src/utils/api/assetsApiFunction';

function StocksModal(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [isEditForm, setIsEditForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(null);
  const [balance, setBalance] = useState(null);
  const [stockOptions, setStockOptions] = useState([]);

  const [formState, inputHandler, setFormData] = useForm(
    transactionStateDescriptor()
  );

  const fetchData = useCallback(
    debounce(async (search) => {
      setStockOptions([]);

      const responseData = await autocompleteStocks2(search);

      const options = responseData.data.map((item) => {
        let newItems = {};
        newItems.key = item.symbol;
        newItems.value = `${item.shortname} (${item.symbol})`;
        newItems.id = item.symbol;
        newItems.name = item.shortname;
        return newItems;
      });

      setStockOptions(options);
      setLoading(false);
    }, 600),
    []
  );

  const handleAssetChange = async (event, value) => {
    if (value) {
      setBalance(null);
      const selectedAsset = props.stats.find(
        (asset) => asset.symbol === value.key
      );

      let currentPrice;
      if (selectedAsset) {
        setBalance(selectedAsset.holdingQuantity);
        if (props.currency !== selectedAsset.currency) {
          currentPrice =
            selectedAsset.currentPrice * props.exchangeRates[props.currency];
        } else {
          currentPrice = selectedAsset.currentPrice;
        }
      } else {
        currentPrice = await getStockPrice(value.key);
      }

      setFormData({
        ...formState.inputs,
        category: { value: props?.category || 'stocks', isValid: true },
        name: { value: value.name, isValid: true },
        symbol: { value: value.id, isValid: true },
        price_per_asset: {
          value: roundNumber(currentPrice),
          isValid: true
        },
        price: {
          value: roundNumber(currentPrice),
          isValid: true
        }
      });
    }
  };
  const handleAssetsDropdownChange = (event) => {
    const text = event.target.value;

    if (text.length < 3) return;
    if (text) {
      setLoading(true);
      fetchData(text);
    }
  };

  useEffect(() => {
    setTotalSpent(
      formatAmountAndCurrency(
        formState.inputs.quantity.value *
          formState.inputs.price_per_asset.value,
        formState.inputs.currency.value,
        false
      )
    );
    if (
      formState.inputs.quantity.value > 0 &&
      formState.inputs.price_per_asset.value > 0
    ) {
      setFormData({
        ...formState.inputs,
        price: {
          value: roundNumber(
            formState.inputs.quantity.value *
              formState.inputs.price_per_asset.value
          ),
          isValid: true
        }
      });
    }
  }, [
    formState.inputs.price_per_asset.value,
    formState.inputs.quantity.value,
    formState.inputs.currency.value
  ]);

  useEffect(() => {
    setIsEditForm(false);
    if (Object.keys(props.transaction).length > 0) {
      setFormData({
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
          value:
            props.transaction.type === 1
              ? roundNumber(props.transaction.price) * -1
              : roundNumber(props.transaction.price),
          isValid: true,
          isTouched: false
        },
        price_per_asset: {
          value: roundNumber(
            props.transaction.price / props.transaction.quantity
          ),
          isValid: true,
          isTouched: false
        },
        quantity: {
          value:
            props.transaction.type === 1
              ? props.transaction.quantity * -1
              : props.transaction.quantity,
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
      });
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
    const currentState = { ...formState.inputs };
    const validationResult = validateStateEntity({
      stateEntity: currentState
    });

    if (!validationResult.valid) {
      setFormData(validationResult.stateEntity);
      return;
    }
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
    }
  };

  const handleCloseDialog = () => {
    setFormData(transactionStateDescriptor());
    setTab(0);
    props.close();
  };

  const handleSetAllQuantity = () => {
    setFormData(
      {
        ...formState.inputs,
        quantity: { value: balance, isValid: true }
      },
      true
    );
  };

  return (
    <>
      <Dialog open={props.open} fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.contentText}</DialogContentText>
          <Box sx={{ width: 1, pt: 2, pl: 5, pr: 5 }}>
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

            {isEditForm ? (
              <Typography
                variant="h3"
                component="h2"
                align="center"
                sx={{ m: 2 }}
              >
                {t(formState.inputs.name.value)}
              </Typography>
            ) : (
              <Selector
                loading={loading}
                required
                autoHighlight
                fullWidth
                id="asset"
                options={stockOptions}
                label={props.category === 'etf' ? t('ETFs') : t('Stocks')}
                sx={{ mt: 2, mb: 1 }}
                change={handleAssetChange}
                inputChange={handleAssetsDropdownChange}
                value={formState.inputs.symbol.value}
                isValid={formState.inputs.name.isValid}
                isTouched={formState.inputs.name.isTouched}
                noOptionsText={t('No matches found')}
              />
            )}

            {tab !== 2 && (
              <Box sx={{ display: 'grid' }}>
                <Selector
                  required
                  showKey
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
                  id="price_per_asset"
                  label={t('Price')}
                  type="number"
                  valueType="number"
                  validators={[VALIDATOR_REQUIRE()]}
                  onInput={inputHandler}
                  onFocus={(event) => event.target.select()}
                  {...formState.inputs.price_per_asset}
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

            {balance && formState.inputs.type.value === 1 && (
              <Box
                sx={{
                  display: 'grid'
                }}
              >
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
                  {t('Balance')}: {balance} {formState.inputs.symbol.value}
                </Typography>
              </Box>
            )}

            <Input
              required
              sx={{ gridColumn: '1', input: { textAlign: 'right' } }}
              margin="dense"
              id="quantity"
              label={t('Quantity')}
              type="number"
              valueType="number"
              endAdornment={
                balance &&
                formState.inputs.type.value === 1 && (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      sx={{ fontSize: 15 }}
                      onClick={handleSetAllQuantity}
                      edge="end"
                    >
                      max
                    </IconButton>
                  </InputAdornment>
                )
              }
              onFocus={(event) => event.target.select()}
              onInput={inputHandler}
              fullWidth
              validators={[VALIDATOR_REQUIRE()]}
              {...formState.inputs.quantity}
              emptyValue={0}
            />

            {tab !== 2 && (
              <Input
                disabled
                fullWidth
                sx={{ input: { textAlign: 'right' } }}
                margin="dense"
                label={t('Total Spent')}
                type="text"
                value={totalSpent}
              />
            )}

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
            onClick={submitTransactionForm}
            variant="contained"
            color="primary"
            autoFocus
          >
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StocksModal;
