import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTransactionsPerMonths } from 'src/utils/api/assetsApiFunction';
import type { RootState } from '../../../app/store';

interface Report {
    year: string;
    transactions: [];
    totalInvested: number;
    totalTransactions: number;
    monthlySpent: [];
}
interface ReportsState {
    history: Report[];
    status: string;
    error: string;
}

const initialState: ReportsState = {
    history: [],
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
    error: null
};

export const fetchTransactionsPerMonth = createAsyncThunk('reports/fetchTransactionsPerMonth', async () => {
    const response = await getTransactionsPerMonths();
    return response.data.history as Report[];
});

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(fetchTransactionsPerMonth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(
                fetchTransactionsPerMonth.fulfilled,
                (state, action: PayloadAction<Report[]>) => {
                    state.status = 'succeeded';
                    state.history = action.payload;
                }
            )
            .addCase(fetchTransactionsPerMonth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const getMonthlyReportData = (state: RootState) => state.reports.history;
export const getMonthlyReportStatus = (state: RootState) => state.reports.status;
export const getMonthlyReportError = (state: RootState) => state.reports.error;

//export const { } = cryptoSlice.actions;

export default reportsSlice.reducer;
