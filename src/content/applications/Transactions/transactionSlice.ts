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
  assets: Asset[];
  page: number;
  limit: number;
  records: number;
  filter: string;
  sort: string;
}

interface Asset {
  id: string;
  category: string;
  name: string;
  symbol: string;
  currency: string;
  price: number;
  price_usd: number;
  quantity: number;
  date: Date;
  type: number;
}

interface TransactionState {
  transactions: Transaction;
  filteredTransactions: Transaction;
  selectedTransaction: Asset;
  status: string;
  addStatus: string;
  updateStatus: string;
  deleteStatus: string;
  error: string;
}

const initialState: TransactionState = {
  transactions: {
    assets: [],
    page: 0,
    limit: 0,
    records: 0,
    filter: '',
    sort: ''
  },
  filteredTransactions: {
    assets: [],
    page: 0,
    limit: 0,
    records: 0,
    filter: '',
    sort: ''
  },
  selectedTransaction: null,
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  addStatus: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  updateStatus: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  deleteStatus: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: string) => {
    const response = await getAssets(params);
    return response.data as Transaction;
  }
);

export const addNewTransaction = createAsyncThunk(
  'transactions/addNewTransaction',
  async (transaction) => {
    const response = await addNewAsset(transaction);
    return response.data.asset as Asset;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction) => {
    const response = await updateAsset(transaction);
    return response.data.asset as Asset;
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

export const fetchFilteredTransactions = createAsyncThunk(
  'transactions/fetchFilteredTransactions',
  async (params: string) => {
    const response = await getAssets(params);
    return response.data as Transaction;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    changeTransactionStatus(state, action) {
      state.status = action.payload;
    },
    resetStatuses(state) {
      state.addStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.status = 'succeeded';
          state.transactions = action.payload;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewTransaction.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.transactions.assets.push(action.payload);
        state.transactions.assets.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const { id } = action.payload;
        const transactions = state.transactions.assets.filter(
          (transaction) => transaction.id !== id
        );
        state.transactions.assets = [...transactions, action.payload];
        state.transactions.assets.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        state.selectedTransaction = action.payload;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(
        deleteTransaction.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteStatus = 'succeeded';
          state.selectedTransaction = state.transactions.assets.find(
            (transaction) => transaction.id === action.payload
          );
          const transactions = state.transactions.assets.filter(
            (transaction) => transaction.id !== action.payload
          );
          state.transactions.assets = transactions;
        }
      )
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTransactions.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteTransactions.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const transactions = state.transactions.assets.filter(
          (transaction) => !action.payload.includes(transaction.id)
        );

        state.transactions.assets = transactions;
      })
      .addCase(deleteTransactions.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(
        fetchFilteredTransactions.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.filteredTransactions = action.payload;
        }
      );
  }
});

export const selectAllTransactions = (state: RootState) =>
  state.transactions.transactions;
export const selectFilteredTransactions = (state: RootState) =>
  state.transactions.filteredTransactions;
export const getSelectedTransaction = (state: RootState) =>
  state.transactions.selectedTransaction;
export const getTransactionsStatus = (state: RootState) =>
  state.transactions.status;
export const getTransactionAddStatus = (state: RootState) =>
  state.transactions.addStatus;
export const getTransactionUpdateStatus = (state: RootState) =>
  state.transactions.updateStatus;
export const getTransactionDeleteStatus = (state: RootState) =>
  state.transactions.deleteStatus;
export const getTransactionsError = (state: RootState) =>
  state.transactions.error;

export const { changeTransactionStatus, resetStatuses } =
  transactionsSlice.actions;

export default transactionsSlice.reducer;
