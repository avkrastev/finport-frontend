import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  updatePlatformAPR,
  addPlatformAPR
} from 'src/utils/api/p2pApiFunction';
import type { RootState } from '../../../app/store';
import { getAssetsByCategory } from '../../../utils/api/assetsApiFunction';

interface Stats {
  _id: object;
  totalSum: string;
  totalQuantity: number;
}

interface Sums {
  holdingValue: number;
  difference: number;
  differenceInPercents: number;
}

interface Percentages {
  id: string;
  name: string;
  apr: number;
  creator: string;
}

interface P2P {
  stats: Stats[];
  sums: Sums;
  percentages: Percentages[];
}

interface P2PState {
  p2p: P2P;
  status: string;
  error: string;
}

const initialState: P2PState = {
  p2p: {
    sums: { holdingValue: 0, difference: 0, differenceInPercents: 0 },
    stats: [],
    percentages: []
  },
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
};

export const fetchP2P = createAsyncThunk('p2p/fetchP2P', async () => {
  const response = await getAssetsByCategory('p2p');
  return response.data.assets as P2P;
});

export const addAPR = createAsyncThunk(
  'p2p/addAPR',
  async (platformData: any) => {
    const response = await addPlatformAPR(platformData);
    return response.data.assets.percentages as Percentages;
  }
);

export const updateAPR = createAsyncThunk(
  'p2p/updateAPR',
  async (platformData: any) => {
    const response = await updatePlatformAPR(platformData);
    return response.data.assets.percentages as Percentages;
  }
);

const p2pSlice = createSlice({
  name: 'p2p',
  initialState,
  reducers: {
    changeP2PStatus(state, action) {
      state.status = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchP2P.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchP2P.fulfilled, (state, action: PayloadAction<P2P>) => {
        state.status = 'succeeded';
        state.p2p = action.payload;
      })
      .addCase(fetchP2P.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(
        addAPR.fulfilled,
        (state, action: PayloadAction<Percentages>) => {
          state.p2p.percentages.push(action.payload);
        }
      )
      .addCase(
        updateAPR.fulfilled,
        (state, action: PayloadAction<Percentages>) => {
          state.p2p.percentages.push(action.payload);
          const { id } = action.payload;
          const transactions = state.p2p.percentages.filter(
            (percentage) => percentage.id !== id
          );
          state.p2p.percentages = [...transactions, action.payload];
        }
      );
  }
});

export const selectAllP2P = (state: RootState) => state.p2p.p2p;
export const getP2PStatus = (state: RootState) => state.p2p.status;
export const getP2PError = (state: RootState) => state.p2p.error;

export const { changeP2PStatus } = p2pSlice.actions;

export default p2pSlice.reducer;
