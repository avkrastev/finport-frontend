import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { getAssetsByCategory } from '../../../utils/api/assetsApiFunction';

interface Stats {
  _id: object;
  totalSum: string;
  totalQuantity: number;
}

interface SumsInDifferentCurrencies {
  currency: string;
  holdingAmount: number;
  totalAmount: number;
}

interface Sums {
  holdingValue: number;
  difference: number;
  differenceInPercents: number;
  sumsInDifferentCurrencies: SumsInDifferentCurrencies[];
}

interface Stocks {
  stats: Stats[];
  sums: Sums;
}

interface StocksState {
  stocks: Stocks;
  status: string;
  error: string;
}

const initialState: StocksState = {
  stocks: {
    sums: {
      holdingValue: 0,
      difference: 0,
      differenceInPercents: 0,
      sumsInDifferentCurrencies: [
        { currency: '', holdingAmount: 0, totalAmount: 0 }
      ]
    },
    stats: []
  },
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
};

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const response = await getAssetsByCategory('stocks');
  return response.data.assets as Stocks;
});

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    changeStocksStatus(state, action) {
      state.status = action.payload;
    },
    resetStocksState: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchStocks.fulfilled,
        (state, action: PayloadAction<Stocks>) => {
          state.status = 'succeeded';
          state.stocks = action.payload;
        }
      )
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllStocks = (state: RootState) => state.stocks.stocks;
export const getStocksStatus = (state: RootState) => state.stocks.status;
export const getStocksError = (state: RootState) => state.stocks.error;

export const { changeStocksStatus, resetStocksState } = stocksSlice.actions;

export default stocksSlice.reducer;
