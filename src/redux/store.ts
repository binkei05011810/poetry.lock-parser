import { configureStore } from '@reduxjs/toolkit';
import packageReducer from './slices/packageSlice';

const store = configureStore({
  reducer: { packageManager: packageReducer },
});

//Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type:packageManager: {packageMap: {}; packageList: {};}
export type AppDispatch = typeof store.dispatch;
export default store;
