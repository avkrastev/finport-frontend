import { useState, useEffect, useContext } from 'react';
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
  Typography
} from '@mui/material';
import {
  autocompleteStocks,
  autocompleteStocks2
} from '../../utils/api/stocksApiFunction';
import { autocompleteCrypto } from '../../utils/api/cryptoApiFunction';
import {
  p2pPlatforms,
  transactionTypes,
  commodities,
  currencies
} from '../../constants/common';
import {
  addNewTransaction,
  updateTransaction
} from '../../content/applications/Transactions/transactionSlice';
import { AuthContext } from 'src/utils/context/authContext';
import { changeCryptoStatus } from 'src/content/dashboards/Crypto/cryptoSlice';
import { changeStocksStatus } from 'src/content/dashboards/Stocks/stocksSlice';
import { changeETFStatus } from 'src/content/dashboards/Etf/ETFsSlice';
import { changeMiscStatus } from 'src/content/dashboards/Misc/miscSlice';
import { changeCommoditiesStatus } from 'src/content/dashboards/Commodities/commoditiesSlice';
import { changeP2PStatus } from 'src/content/dashboards/P2P/p2pSlice';
import { useForm } from 'src/utils/hooks/form-hook';
import { transactionStateDescriptor } from './transactionStateDescriptor';
import Input from '../../components/FormElements/Input';
import { VALIDATOR_REQUIRE } from 'src/utils/validators';
import Selector from '../FormElements/Selector';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

function TransactionModal(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const [assetsDropdown, setAssetsDropdown] = useState([]);
  const [isEditForm, setIsEditForm] = useState(false);

  const { authUserData } = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    transactionStateDescriptor()
  );

  useEffect(() => {
    if (!isEditForm) {
      setAssetsDropdown([]);

      if (formState.inputs.category.value === 'p2p') {
        const p2pPlatformsOptions = p2pPlatforms.map((platform) => {
          let newItems = {};
          newItems.key = platform.name;
          newItems.value = platform.name;
          return newItems;
        });
        setAssetsDropdown(p2pPlatformsOptions);
      }

      if (formState.inputs.category.value === 'commodities') {
        setAssetsDropdown(commodities);
      }
      setFormData({
        ...formState.inputs,
        name: { value: '', isValid: false },
        asset_id: { value: '', isValid: true },
        symbol: { value: '', isValid: true }
      });
    }
  }, [formState.inputs.category.value]); // eslint-disable-line

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

  const handleAssetChange = (event, value) => {
    if (value) {
      setFormData({
        ...formState.inputs,
        name: { value: value.value, isValid: true },
        asset_id: { value: value.id || '', isValid: true },
        symbol: { value: value.key, isValid: true }
      });
    }
  };

  const handleAssetsDropdownChange = async (event) => {
    const currentVal = event.target.value;
    let assets = [];

    if (formState.inputs.category.value) {
      switch (formState.inputs.category.value) {
        case 'crypto':
          if (currentVal.length > 2) {
            const responseData = await autocompleteCrypto(currentVal);

            assets = responseData.data.coins.map((item) => {
              let newItems = {};
              newItems.key = item.symbol;
              newItems.value = item.name;
              newItems.id = item.id;
              return newItems;
            });
          }
          break;
        case 'stocks':
        case 'etf':
          if (currentVal.length > 2) {
            const responseData = await autocompleteStocks2(
              currentVal,
              authUserData.stocks_api_key
            );

            assets = responseData.data.ResultSet.Result.map((item) => {
              let newItems = {};
              newItems.key = item.symbol;
              newItems.value = item.name;
              newItems.id = item.symbol;
              return newItems;
            });
          }
          break;
        default:
          break;
      }

      setAssetsDropdown(assets);
    }
  };

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

      switch (formState.inputs.category.value) {
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

      props.close();
      setFormData(transactionStateDescriptor());
      setTab(0);
    } catch (err) {
      console.log(err);
      // TODO catch error
    }
  };

  const handleCloseDialog = () => {
    setFormData(transactionStateDescriptor());
    setTab(0);
    props.close();
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
                {formState.inputs.category.value !== 'p2p' && (
                  <Tab label={t('Transfer')} {...a11yProps(2)} />
                )}
              </Tabs>
            )}
            {!isEditForm && (
              <Selector
                required
                autoHighlight
                fullWidth
                id="category"
                options={
                  props?.categories?.filter((category) => category.show) || []
                }
                label={t('Category')}
                sx={{ mt: 2, mb: 1 }}
                onInput={inputHandler}
                {...formState.inputs.category}
              />
            )}

            {isEditForm ? (
              <Typography
                variant="h3"
                component="h2"
                align="center"
                sx={{ m: 2 }}
              >
                {formState.inputs.name.value}{' '}
                {formState.inputs.symbol.value
                  ? '(' + formState.inputs.symbol.value + ')'
                  : ''}
              </Typography>
            ) : formState.inputs.category.value === 'misc' ||
              (formState.inputs.category.value === 'stocks' &&
                !authUserData.stocks_api_key) ||
              (formState.inputs.category.value === 'etf' &&
                !authUserData.stocks_api_key) ? (
              <Input
                fullWidth
                required
                margin="dense"
                sx={{ mt: 1, mb: 2 }}
                id="name"
                label={t('Asset')}
                type="text"
                onInput={inputHandler}
                {...formState.inputs.name}
                validators={[VALIDATOR_REQUIRE()]}
              />
            ) : (
              <Selector
                required
                autoHighlight
                fullWidth
                id="asset"
                options={assetsDropdown}
                label={t('Asset')}
                sx={{ mt: 2, mb: 1 }}
                change={handleAssetChange}
                {...formState.inputs.symbol}
                inputChange={handleAssetsDropdownChange}
              />
            )}

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
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
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
            {formState.inputs.category.value !== 'p2p' &&
              (formState.inputs.category.value === 'commodities' ? (
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
              ) : (
                <Input
                  required
                  sx={{ input: { textAlign: 'right' } }}
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
              ))}

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
    </>
  );
}

export default TransactionModal;
