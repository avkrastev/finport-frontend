import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from 'src/content/applications/Transactions/transactionSlice';
import commoditiesSlice from 'src/content/dashboards/Commodities/commoditiesSlice';
import cryptoSlice from 'src/content/dashboards/Crypto/cryptoSlice';
import ETFsSlice from 'src/content/dashboards/Etf/ETFsSlice';
import miscSlice from 'src/content/dashboards/Misc/miscSlice';
import stocksSlice from 'src/content/dashboards/Stocks/stocksSlice';
import p2pSlice from 'src/content/dashboards/P2P/p2pSlice';
import summarySlice from 'src/content/overview/summarySlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    crypto: cryptoSlice,
    stocks: stocksSlice,
    ETFs: ETFsSlice,
    commodities: commoditiesSlice,
    misc: miscSlice,
    p2p: p2pSlice,
    summary: summarySlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch



