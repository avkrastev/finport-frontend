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

interface RealEstate {
  stats: Stats[];
  sums: Sums;
}

interface RealEstateState {
  real: RealEstate;
  status: string;
  error: string;
}

const initialState: RealEstateState = {
  real: {
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

export const fetchRealEstate = createAsyncThunk(
  'misc/fetchRealEstates',
  async () => {
    const response = await getAssetsByCategory('realestate');
    return response.data.assets as RealEstate;
  }
);

const realEstateSlice = createSlice({
  name: 'real',
  initialState,
  reducers: {
    changeRealEstatesStatus(state, action) {
      state.status = action.payload;
    },
    resetRealEstatesState: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRealEstate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRealEstate.fulfilled,
        (state, action: PayloadAction<RealEstate>) => {
          state.status = 'succeeded';
          state.real = action.payload;
        }
      )
      .addCase(fetchRealEstate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllRealEstate = (state: RootState) => state.real.real;
export const getRealEstateStatus = (state: RootState) => state.real.status;
export const getRealEstateError = (state: RootState) => state.real.error;

export const { changeRealEstatesStatus, resetRealEstatesState } =
  realEstateSlice.actions;

export default realEstateSlice.reducer;
