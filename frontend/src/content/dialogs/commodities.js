import { useState, useEffect } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  transactionTypes,
  commodities,
  currencies,
  commoditiesWeights,
  gramOunceRatio
} from '../../constants/common';
import {
  addNewTransaction,
  updateTransaction
} from '../../content/applications/Transactions/transactionSlice';
import { useForm } from 'src/utils/hooks/form-hook';
import Input from '../../components/FormElements/Input';
import { VALIDATOR_REQUIRE } from 'src/utils/validators';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { transactionCommodityStateDescriptor } from 'src/components/TransactionModal/transactionStateDescriptor';
import Selector from 'src/components/FormElements/Selector';
import { getCommodityPrices } from 'src/utils/api/assetsApiFunction';
import {
  formatAmountAndCurrency,
  roundNumber,
  validateStateEntity
} from 'src/utils/functions';

function CommoditiesModal(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [isEditForm, setIsEditForm] = useState(false);
  const [currentPrices, setCurrentPrices] = useState([]);
  const [totalSpent, setTotalSpent] = useState(null);
  const [balance, setBalance] = useState(null);

  const [formState, inputHandler, setFormData] = useForm(
    transactionCommodityStateDescriptor()
  );

  useEffect(() => {
    async function getPrices() {
      const response = await getCommodityPrices();
      if (response.status === 200) setCurrentPrices(response.data.prices);
    }

    getPrices();
  }, []);

  const handleAssetChange = async (event, value) => {
    if (value) {
      setBalance(null);
      const selectedAsset = props.stats.find(
        (asset) => asset.symbol === value.key
      );

      if (selectedAsset && selectedAsset.holdingQuantity > 0) {
        setBalance(selectedAsset.holdingQuantity);
      }

      setFormData({
        ...formState.inputs,
        category: { value: 'commodities', isValid: true },
        name: { value: value.value, isValid: true },
        asset_id: { value: value.id || '', isValid: true },
        symbol: { value: value.key, isValid: true },
        price_per_asset: {
          value: roundNumber(currentPrices[value.key]?.price),
          isValid: true
        },
        price: {
          value: roundNumber(currentPrices[value.key]?.price),
          isValid: true
        }
      });
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
  }, [
    formState.inputs.price_per_asset.value,
    formState.inputs.quantity.value,
    formState.inputs.currency.value
  ]);

  useEffect(() => {
    if (!isEditForm && currentPrices[formState.inputs.symbol.value]) {
      if (formState.inputs.weight.value === 'gr') {
        setFormData({
          ...formState.inputs,
          price_per_asset: {
            value: roundNumber(
              currentPrices[formState.inputs.symbol.value]?.price *
                gramOunceRatio
            ),
            isValid: true
          }
        });
      }
      if (formState.inputs.weight.value === 'toz') {
        setFormData({
          ...formState.inputs,
          price_per_asset: {
            value: roundNumber(
              currentPrices[formState.inputs.symbol.value]?.price
            ),
            isValid: true
          }
        });
      }
    }
  }, [formState.inputs.weight.value, formState.inputs.symbol.value]);

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
        weight: {
          value: props.transaction.weight || 'toz',
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
      setFormData(transactionCommodityStateDescriptor());
      setTab(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseDialog = () => {
    setFormData(transactionCommodityStateDescriptor());
    setTab(0);
    props.close();
  };

  const handleSetAllQuantity = () => {
    setFormData({
      ...formState.inputs,
      quantity: { value: balance, isValid: true }
    });
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
                required
                autoHighlight
                fullWidth
                id="asset"
                options={commodities}
                label={t('Commodity')}
                sx={{ mt: 2, mb: 1 }}
                change={handleAssetChange}
                value={formState.inputs.symbol.value}
                isValid={formState.inputs.name.isValid}
                isTouched={formState.inputs.name.isTouched}
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
                  {t('Balance')}: {balance} {t('toz')}
                </Typography>
              </Box>
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
              <Selector
                disableClearable
                fullWidth
                id="weight"
                options={commoditiesWeights}
                label={t('Weight')}
                sx={{ mt: 1, gridColumn: '2' }}
                onInput={inputHandler}
                {...formState.inputs.weight}
              />
            </Box>

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

export default CommoditiesModal;
