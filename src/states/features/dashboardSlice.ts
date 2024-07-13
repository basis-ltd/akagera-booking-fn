import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  generateReportModal: boolean;
} = {
  generateReportModal: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setGenerateReportModal: (state, action) => {
      state.generateReportModal = action.payload;
    },
  },
});

export const { setGenerateReportModal } = dashboardSlice.actions;

export default dashboardSlice.reducer;
