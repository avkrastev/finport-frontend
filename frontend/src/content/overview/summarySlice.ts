import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { getAssetsSummary } from '../../utils/api/assetsApiFunction';

interface Stats {
  _id: object;
  totalSum: string;
  totalQuantity: number;
}

interface Sums {
  totalSum: number;
}

interface Summary {
  stats: Stats[];
  sums: Sums;
}

interface SummaryState {
  summary: Summary;
  status: string;
  error: string;
}

const initialState: SummaryState = {
  summary: { sums: { totalSum: 0 }, stats: [] },
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
};

export const fetchSummary = createAsyncThunk(
  'summary/fetchSummary',
  async () => {
    const response = await getAssetsSummary();
    return response.data.assets as Summary;
  }
);

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchSummary.fulfilled,
        (state, action: PayloadAction<Summary>) => {
          state.status = 'succeeded';
          state.summary = action.payload;
        }
      )
      .addCase(fetchSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllSummary = (state: RootState) => state.summary.summary;
export const getSummaryStatus = (state: RootState) => state.summary.status;
export const getSummaryError = (state: RootState) => state.summary.error;

//export const {} = summarySlice.actions;

export default summarySlice.reducer;
