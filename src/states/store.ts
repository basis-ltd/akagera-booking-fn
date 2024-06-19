import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './apiSlice';
import serviceSlice from './features/serviceSlice';
import activitySlice from './features/activitySlice';
import bookingSlice from './features/bookingSlice';
import activityRateSlice from './features/activityRateSlice';
import bookingPeopleSlice from './features/bookingPeopleSlice';
import bookingVehicleSlice from './features/bookingVehicleSlice';
import bookingActivitySlice from './features/bookingActivitySlice';
import userSlice from './features/userSlice';
import sidebarSlice from './features/sidebarSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    service: serviceSlice,
    activity: activitySlice,
    booking: bookingSlice,
    activityRate: activityRateSlice,
    bookingPeople: bookingPeopleSlice,
    bookingVehicle: bookingVehicleSlice,
    bookingActivity: bookingActivitySlice,
    user: userSlice,
    sidebar: sidebarSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
