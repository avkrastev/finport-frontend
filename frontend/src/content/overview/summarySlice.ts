import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { historyForAWeek, historySinceStart } from 'src/utils/api/historyApiFunction';
import type { RootState } from '../../app/store';
import { getAssetsSummary } from '../../utils/api/assetsApiFunction';

interface Stats {
  _id: object;
  alias: string;
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
  history: History[];
  historySinceStart: HistorySinceStart;
  status: string;
  historyStatus: string;
  error: string;
}

interface History {
  category: string;
  date: string;
  price: number;
}

interface HistorySinceStart {
  historyData: historyData[];
  differenceInPercents: number;
  difference: number;
  category: string;
}

interface historyData {
  _id: GroupData;
  categories: Categories[];
  balance: number;
  total: number;
}

interface Categories {
  balance: number;
  total: number;
}

interface GroupData {
  date: string;
}

const initialState: SummaryState = {
  summary: { sums: { totalSum: 0 }, stats: [] },
  history: [],
  historySinceStart: null,
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  historyStatus: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
};

export const fetchSummary = createAsyncThunk(
  'summary/fetchSummary',
  async () => {
    const response = await getAssetsSummary();
    return response.data.assets as Summary;
  }
);

export const fetchHistory = createAsyncThunk(
  'summary/fetchHistory',
  async () => {
    const response = await historyForAWeek();
    return response.data.history as History[];
  }
);

export const fetchHistorySinceStart = createAsyncThunk(
  'summary/fetchHistorySinceStart',
  async (category: string) => {
    const response = await historySinceStart(category);
    return response.data.historySinceStart as HistorySinceStart;
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
      })
      .addCase(
        fetchHistory.fulfilled,
        (state, action: PayloadAction<History[]>) => {
          state.history = action.payload;
        }
      )
      .addCase(fetchHistorySinceStart.pending, (state) => {
        state.historyStatus = 'loading';
      })
      .addCase(
        fetchHistorySinceStart.fulfilled,
        (state, action: PayloadAction<HistorySinceStart>) => {
          state.historyStatus = 'succeeded';
          state.historySinceStart = action.payload;
        }
      )
      .addCase(fetchHistorySinceStart.rejected, (state, action) => {
        state.historyStatus = 'failed';
      });
  }
});

export const selectAllSummary = (state: RootState) => state.summary.summary;
export const selectAllHistory = (state: RootState) => state.summary.history;
export const selectAllHistorySinceStart = (state: RootState) => state.summary.historySinceStart;
export const getSummaryStatus = (state: RootState) => state.summary.status;
export const getHistoryStatus = (state: RootState) => state.summary.historyStatus;
export const getSummaryError = (state: RootState) => state.summary.error;

//export const {} = summarySlice.actions;

export default summarySlice.reducer;
