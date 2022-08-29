import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Box,
  Tab,
  Tabs,
  MenuItem,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { autocompleteStocks } from '../../utils/api/stocksApiFunction';
import { autocompleteCrypto } from '../../utils/api/cryptoApiFunction';
import { p2pPlatforms, transactionTypes, currencies } from '../../constants/common';
import {
  addNewTransaction,
  updateTransaction
} from '../../content/applications/Transactions/transactionSlice';
import { MobileDateTimePicker } from '@mui/x-date-pickers';

function TransactionModal(props) {
  const autoC = useRef(null);
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [transferDropdown, setTransferDropdown] = useState(2);
  const [assetsDropdown, setAssetsDropdown] = useState([]);
  const [isEditForm, setIsEditForm] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    id: '',
    category: '',
    name: '',
    symbol: '',
    currency: 'USD',
    price: '',
    quantity: 0,
    date: new Date(),
    type: 0
  });

  useEffect(() => {
    if (props.transaction) {
      setType(0);
      if (props.transaction.type) setType(props.transaction.type);
      setTransactionForm(props.transaction);
      setIsEditForm(true);
    }
  }, [props.transaction]);

  const handleCategoryChange = (event, value) => {
    setTransactionForm({
      ...transactionForm,
      category: value.alias,
      name: '',
      symbol: ''
    });

    if (value.alias === 'p2p') setAssetsDropdown(p2pPlatforms);
    else setAssetsDropdown([]);

    const ele = autoC.current?.getElementsByClassName(
      'MuiAutocomplete-clearIndicator'
    )[0];
    if (ele) {
      ele.click();
    }
  };

  const handleAssetChange = (event, value) => {
    if (value) {
      setTransactionForm({
        ...transactionForm,
        name: value.name,
        symbol: value.symbol
      });
    }
  };

  const handleAssetsDropdownChange = async (event) => {
    const currentVal = event.target.value;
    let assets = [];
    if (transactionForm.category) {
      switch (transactionForm.category) {
        case 'crypto':
          if (currentVal.length > 2) {
            const responseData = await autocompleteCrypto(currentVal);
            assets = responseData.data.coins;
          }
          break;
        case 'stocks':
        case 'etf':
          if (currentVal.length > 2) {
            const responseData = await autocompleteStocks(currentVal);
            assets = responseData.data.bestMatches.map((item) => {
              let newItems = {};
              newItems.symbol = item['1. symbol'];
              newItems.name = item['2. name'];
              return newItems;
            });
          }
          break;
        default:
          break;
      }

      setAssetsDropdown(assets);

      setTransactionForm({
        ...transactionForm,
        name: '',
        symbol: ''
      });
    }
  };

  const handleTransferDropdownChange = (value) => {
    setTransferDropdown(value);
    setTransactionForm({
      ...transactionForm,
      type: value
    });
  };

  const setType = (value) => {
    const transactionType = transactionTypes.find(
      (type) => type.value === value
    );
    let type = value;
    let price = transactionForm.price;
    if (transactionType.parent === 2) {
      type = transferDropdown;
      price = 0;
      setTransferDropdown(value);
    }
    setTransactionForm({
      ...transactionForm,
      type,
      price
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
      if (isEditForm) {
        dispatch(updateTransaction(transactionForm));
      } else {
        dispatch(addNewTransaction(transactionForm));
      }

      props.close();
      setTransactionForm({
        id: '',
        category: '',
        name: '',
        symbol: '',
        currency: 'USD',
        price: '',
        quantity: 0,
        date: new Date(),
        type: 0
      });
    } catch (err) {
      // TODO catch error
    }
  };

  return (
    <>
      <Dialog open={props.open} onClose={props.close} fullWidth>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.contentText}</DialogContentText>
          <Box sx={{ width: 1 }}>
            {props.tabs && (
              <Tabs
                centered
                textColor="primary"
                indicatorColor="primary"
                value={tab}
                onChange={(event, value) => setType(value)}
              >
                <Tab label="Buy" {...a11yProps(0)} />
                <Tab label="Sell" {...a11yProps(1)} />
                <Tab label="Transfer" {...a11yProps(2)} />
              </Tabs>
            )}
            {!isEditForm && (
              <Autocomplete
                id="category"
                sx={{ mt: 2, mb: 1 }}
                options={props.categories ?? []}
                onChange={handleCategoryChange}
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  if (option.show) {
                    return (
                      <Box component="li" {...props}>
                        {option.name}
                      </Box>
                    );
                  }
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="Choose a category"
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  );
                }}
              />
            )}

            {isEditForm ? (
              <Typography
                variant="h3"
                component="h2"
                align="center"
                sx={{ m: 2 }}
              >
                {transactionForm.name}{' '}
                {transactionForm.symbol
                  ? '(' + transactionForm.symbol + ')'
                  : ''}
              </Typography>
            ) : transactionForm.category === 'misc' ? (
              <TextField
                sx={{ mt: 1, mb: 2 }}
                margin="dense"
                id="asset"
                label="Asset"
                type="text"
                onChange={(event) => {
                  return setTransactionForm({
                    ...transactionForm,
                    name: event.target.value
                  });
                }}
                fullWidth
              />
            ) : (
              <Autocomplete
                ref={autoC}
                id="asset"
                sx={{ mt: 2, mb: 1 }}
                onChange={handleAssetChange}
                options={assetsDropdown}
                autoHighlight
                getOptionLabel={(option) =>
                  option.symbol
                    ? `${option.name} (${option.symbol})`
                    : `${option.name}`
                }
                renderOption={(props, option) => {
                  return (
                    <Box component="li" key={option.symbol} {...props}>
                      {option.name}{' '}
                      {option.symbol ? '(' + option.symbol + ')' : ''}
                    </Box>
                  );
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="Choose an asset"
                      inputProps={{
                        ...params.inputProps
                      }}
                      onChange={handleAssetsDropdownChange}
                    />
                  );
                }}
              />
            )}

            {tab !== 2 && (
              <Box sx={{ display: 'grid' }}>
                <TextField
                  sx={{ gridColumn: '1', mt: 1, mb: 1 }}
                  id="outlined-select-currency"
                  select
                  label="Currency"
                  value={transactionForm.currency}
                  onChange={(event) => {
                    return setTransactionForm({
                      ...transactionForm,
                      currency: event.target.value
                    });
                  }}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  sx={{ gridColumn: '2', input: { textAlign: 'right' } }}
                  margin="dense"
                  id="price"
                  label="Price"
                  type="number"
                  onChange={(event) => {
                    return setTransactionForm({
                      ...transactionForm,
                      price: Number(event.target.value)
                    });
                  }}
                  value={transactionForm.price}
                ></TextField>
              </Box>
            )}
            {tab === 2 && (
              <TextField
                fullWidth
                sx={{ mt: 1, mb: 1 }}
                id="transfer"
                select
                label="Transfer"
                value={transferDropdown}
                onChange={(event) =>
                  handleTransferDropdownChange(event.target.value)
                }
              >
                {transactionTypes
                  .filter((option) => option.parent === 2)
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            )}
            {transactionForm.category !== 'p2p' && (
              <TextField
                value={transactionForm.quantity}
                sx={{ input: { textAlign: 'right' } }}
                margin="dense"
                id="quantity"
                label="Quantity"
                type="number"
                onChange={(event) => {
                  return setTransactionForm({
                    ...transactionForm,
                    quantity: Number(event.target.value)
                  });
                }}
                fullWidth
              />
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                label="Date"
                inputFormat="dd.MM.yyyy HH:mm:ss"
                value={transactionForm.date}
                onChange={(event) => {
                  return setTransactionForm({
                    ...transactionForm,
                    date: event
                  });
                }}
                renderInput={(params) => (
                  <TextField sx={{ mt: 2, width: 1 }} {...params} />
                )}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.close}>Cancel</Button>
          <Button
            onClick={submitTransactionForm}
            variant="contained"
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TransactionModal;
