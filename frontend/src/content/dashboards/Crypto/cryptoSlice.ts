import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { getCryptoAssets } from '../../../utils/api/assetsApiFunction';

interface Crypto {
  _id: object;
  totalSum: string;
  totalQuantity: number;
}

interface TransactionState {
  crypto: Crypto[];
  status: string;
  error: string;
}

const initialState: TransactionState = {
  crypto: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
};

export const fetchCrypto = createAsyncThunk('crypto/fetchCrypto', async () => {
  const response = await getCryptoAssets();
  return response.data.assets as Crypto[];
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCrypto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCrypto.fulfilled,
        (state, action: PayloadAction<Crypto[]>) => {
          state.status = 'succeeded';
          state.crypto = action.payload;
        }
      )
      .addCase(fetchCrypto.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllCrypto = (state: RootState) => state.crypto.crypto;
export const getCryptoStatus = (state: RootState) => state.crypto.status;
export const getCryptoError = (state: RootState) => state.crypto.error;

export const {} = cryptoSlice.actions;

export default cryptoSlice.reducer;
