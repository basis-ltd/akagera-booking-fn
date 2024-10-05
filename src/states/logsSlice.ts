import { Logs } from '@/types/models/logs.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  logsList: Logs[];
  activitiesLogs: Logs[];
  criticalLogs: Logs[];
  errorLogs: Logs[];
} = {
  logsList: [],
  activitiesLogs: [],
  criticalLogs: [],
  errorLogs: [],
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogsList: (state, action) => {
      state.logsList = action.payload;
    },
    setActivitiesLogs: (state, action) => {
      state.activitiesLogs = action.payload;
    },
    setCriticalLogs: (state, action) => {
      state.criticalLogs = action.payload;
    },
    setErrorLogs: (state, action) => {
      state.errorLogs = action.payload;
    },
  },
});

export const { setLogsList, setActivitiesLogs, setCriticalLogs, setErrorLogs } =
  logsSlice.actions;

export default logsSlice.reducer;
