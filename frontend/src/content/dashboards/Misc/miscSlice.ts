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

interface Misc {
  stats: Stats[];
  sums: Sums;
}

interface MiscState {
  misc: Misc;
  status: string;
  error: string;
}

const initialState: MiscState = {
  misc: {
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

export const fetchMisc = createAsyncThunk('misc/fetchMisc', async () => {
  const response = await getAssetsByCategory('misc');
  return response.data.assets as Misc;
});

const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    changeMiscStatus(state, action) {
      state.status = action.payload;
    },
    resetMiscState: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMisc.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMisc.fulfilled, (state, action: PayloadAction<Misc>) => {
        state.status = 'succeeded';
        state.misc = action.payload;
      })
      .addCase(fetchMisc.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllMisc = (state: RootState) => state.misc.misc;
export const getMiscStatus = (state: RootState) => state.misc.status;
export const getMiscError = (state: RootState) => state.misc.error;

export const { changeMiscStatus, resetMiscState } = miscSlice.actions;

export default miscSlice.reducer;
