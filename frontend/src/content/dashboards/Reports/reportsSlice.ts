import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTransactionsReport } from 'src/utils/api/assetsApiFunction';
import type { RootState } from '../../../app/store';

interface Report {
  year: string;
  transactions: [];
  totalInvested: number;
  totalTransactions: number;
  monthlySpent: [];
  yearsLabels: [];
  yearlySpent: [];
}
interface ReportsState {
  months: Report[];
  years: Report;
  statusMonthly: string;
  errorMonthly: string;
  statusYearly: string;
  errorYearly: string;
}

const initialState: ReportsState = {
  months: [],
  years: null,
  statusMonthly: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  errorMonthly: null,
  statusYearly: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  errorYearly: null
};

export const fetchTransactionsPerMonths = createAsyncThunk(
  'reports/fetchTransactionsPerMonths',
  async () => {
    const response = await getTransactionsReport('monthly');
    return response.data.history as Report[];
  }
);

export const fetchTransactionsPerYears = createAsyncThunk(
  'reports/fetchTransactionsPerYears',
  async () => {
    const response = await getTransactionsReport('yearly');
    return response.data.history as Report;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTransactionsPerMonths.pending, (state) => {
        state.statusMonthly = 'loading';
      })
      .addCase(
        fetchTransactionsPerMonths.fulfilled,
        (state, action: PayloadAction<Report[]>) => {
          state.statusMonthly = 'succeeded';
          state.months = action.payload;
        }
      )
      .addCase(fetchTransactionsPerMonths.rejected, (state, action) => {
        state.statusMonthly = 'failed';
        state.errorMonthly = action.error.message;
      })
      .addCase(fetchTransactionsPerYears.pending, (state) => {
        state.statusYearly = 'loading';
      })
      .addCase(
        fetchTransactionsPerYears.fulfilled,
        (state, action: PayloadAction<Report>) => {
          state.statusYearly = 'succeeded';
          state.years = action.payload;
        }
      )
      .addCase(fetchTransactionsPerYears.rejected, (state, action) => {
        state.statusYearly = 'failed';
        state.errorYearly = action.error.message;
      });
  }
});

export const getMonthlyReportsData = (state: RootState) => state.reports.months;
export const getYearlyReportsData = (state: RootState) => state.reports.years;
export const getMonthlyReportStatus = (state: RootState) => state.reports.statusMonthly;
export const getMonthlyReportsError = (state: RootState) => state.reports.errorMonthly;
export const getYearlyReportStatus = (state: RootState) => state.reports.statusYearly;
export const getYearlyReportsError = (state: RootState) => state.reports.errorYearly;

//export const { } = reportsSlice.actions;

export default reportsSlice.reducer;
