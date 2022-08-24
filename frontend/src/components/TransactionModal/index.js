import { useState, useRef } from 'react';
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
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { autocompleteStocks } from '../../utils/api/stocksApiFunction';
import { autocompleteCrypto } from '../../utils/api/cryptoApiFunction';
import { currencies } from '../../constants/currencies';
import { transfers } from '../../constants/common';

function TransactionModal(props) {
  const autoC = useRef(null);

  const [tab, setTab] = useState(0);
  const [transferDropdown, setTransferDropdown] = useState('in');

  const [transactionForm, setTransactionForm] = useState({
    category: '',
    assets: [],
    asset: '',
    symbol: '',
    currency: 'USD',
    price: '',
    quantity: '',
    date: new Date()
  });

  const handleCategoryChange = (event, value) => {
    setTransactionForm({
      ...transactionForm,
      category: value.alias,
      assets: [],
      asset: '',
      symbol: ''
    });

    const ele = autoC.current.getElementsByClassName(
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
        asset: value.name,
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

      setTransactionForm({
        ...transactionForm,
        assets,
        asset: '',
        symbol: ''
      });
    }
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  const submitTransactionForm = () => {
    console.log(transactionForm);
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
                onChange={(event, value) => setTab(value)}
              >
                <Tab label="Buy" {...a11yProps(0)} />
                <Tab label="Sell" {...a11yProps(1)} />
                <Tab label="Transfer" {...a11yProps(2)} />
              </Tabs>
            )}
            <Autocomplete
              id="category"
              sx={{ mt: 2, mb: 1 }}
              options={props.categories}
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
            <Autocomplete
              ref={autoC}
              id="asset"
              sx={{ mt: 2, mb: 1 }}
              onChange={handleAssetChange}
              options={transactionForm.assets}
              autoHighlight
              getOptionLabel={(option) => `${option.name} (${option.symbol})`}
              renderOption={(props, option) => {
                return (
                  <Box component="li" key={option.symbol} {...props}>
                    {option.name} ({option.symbol})
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
            {tab !== 2 && (
              <Box sx={{ display: 'grid' }}>
                <TextField
                  sx={{ gridColumn: '1', mt: 1, mb: 1 }}
                  id="outlined-select-currency"
                  select
                  label="Currency"
                  value={'USD'}
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
                onChange={(event) => setTransferDropdown(event.target.value)}
              >
                {transfers.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {transactionForm.category !== 'p2p' && (
              <TextField
                sx={{ input: { textAlign: 'right' } }}
                margin="dense"
                id="quantity"
                label="Quantity"
                type="number"
                onChange={(event) => {
                  return setTransactionForm({
                    ...transactionForm,
                    quantity: event.target.value
                  });
                }}
                fullWidth
              />
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date"
                inputFormat="dd.MM.yyyy"
                value={transactionForm.date}
                onChange={(event) => {
                  return setTransactionForm({
                    ...transactionForm,
                    date: event.toDateString()
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
          <Button onClick={submitTransactionForm}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TransactionModal;
