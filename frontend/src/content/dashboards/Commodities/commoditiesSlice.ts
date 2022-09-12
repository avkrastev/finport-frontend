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

interface Commodities {
  stats: Stats[];
  sums: Sums;
}

interface CommoditiesState {
  commodities: Commodities;
  status: string;
  error: string;
}

const initialState: CommoditiesState = {
  commodities: {
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

export const fetchCommodities = createAsyncThunk(
  'commodities/fetchCommodities',
  async () => {
    const response = await getAssetsByCategory('commodities');
    return response.data.assets as Commodities;
  }
);

const commoditySlice = createSlice({
  name: 'commodities',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCommodities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCommodities.fulfilled,
        (state, action: PayloadAction<Commodities>) => {
          state.status = 'succeeded';
          state.commodities = action.payload;
        }
      )
      .addCase(fetchCommodities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllCommodities = (state: RootState) =>
  state.commodities.commodities;
export const getCommoditiesStatus = (state: RootState) =>
  state.commodities.status;
export const getCommoditiesError = (state: RootState) =>
  state.commodities.error;

//export const {} = commoditySlice.actions;

export default commoditySlice.reducer;
