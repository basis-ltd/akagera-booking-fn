import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './apiSlice';
import serviceSlice from './features/serviceSlice';
import activitySlice from './features/activitySlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    service: serviceSlice,
    activity: activitySlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
