import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import {
  getAssets,
  addNewAsset,
  deleteAsset,
  deleteAssets,
  updateAsset
} from '../../../utils/api/assetsApiFunction';

interface Transaction {
  id: string;
  category: string;
  name: string;
  symbol: string;
  currency: string;
  price: number;
  quantity: number;
  date: Date;
  type: number;
}

interface TransactionState {
  transactions: Transaction[];
  status: string;
  error: string;
}

const initialState: TransactionState = {
  transactions: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const response = await getAssets();
    return response.data.assets as Transaction[];
  }
);

export const addNewTransaction = createAsyncThunk(
  'transactions/addNewTransaction',
  async (transaction) => {
    const response = await addNewAsset(transaction);
    return response.data.asset as Transaction;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction) => {
    const response = await updateAsset(transaction);
    return response.data.asset as Transaction;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string) => {
    const response = await deleteAsset(id);
    if (response?.status === 200) return id;
    return `${response?.status}: ${response?.statusText}`;
  }
);

export const deleteTransactions = createAsyncThunk(
  'transactions/deleteTransactions',
  async (ids: string[]) => {
    const response = await deleteAssets(ids);
    if (response?.status === 200) return ids;
    return `${response?.status}: ${response?.statusText}`;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.status = 'succeeded';
          state.transactions = action.payload;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const { id } = action.payload;
        const transactions = state.transactions.filter(transaction => transaction.id !== id);
        state.transactions = [...transactions, action.payload];
        state.transactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<string>) => {
          const transactions = state.transactions.filter(
            (transaction) => transaction.id !== action.payload
          );
          state.transactions = transactions;
        }
      )
      .addCase(deleteTransactions.fulfilled, (state, action) => {
        const transactions = state.transactions.filter(
          (transaction) => !action.payload.includes(transaction.id)
        );

        state.transactions = transactions;
      });
  }
});

export const selectAllTransactions = (state: RootState) =>
  state.transactions.transactions;
export const getTransactionsStatus = (state: RootState) =>
  state.transactions.status;
export const getTransactionsError = (state: RootState) =>
  state.transactions.error;

//export const {  } = transactionsSlice.actions;

export default transactionsSlice.reducer;
