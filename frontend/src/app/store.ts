import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from 'src/content/applications/Transactions/transactionSlice';
import cryptoSlice from 'src/content/dashboards/Crypto/cryptoSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    crypto: cryptoSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch



