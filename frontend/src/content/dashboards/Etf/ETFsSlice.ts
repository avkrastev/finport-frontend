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

interface Etf {
  stats: Stats[];
  sums: Sums;
}

interface StocksState {
  ETFs: Etf;
  status: string;
  error: string;
}

const initialState: StocksState = {
  ETFs: {
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

export const fetchETFs = createAsyncThunk('stocks/fetchETFs', async () => {
  const response = await getAssetsByCategory('etf');
  return response.data.assets as Etf;
});

const ETFsSlice = createSlice({
  name: 'ETFs',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchETFs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchETFs.fulfilled, (state, action: PayloadAction<Etf>) => {
        state.status = 'succeeded';
        state.ETFs = action.payload;
      })
      .addCase(fetchETFs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllETFs = (state: RootState) => state.ETFs.ETFs;
export const getETFsStatus = (state: RootState) => state.ETFs.status;
export const getETFsError = (state: RootState) => state.ETFs.error;

//export const {} = stocksSlice.actions;

export default ETFsSlice.reducer;
