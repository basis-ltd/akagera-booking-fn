import { Settings } from '@/types/models/settings.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  settingsList: Settings[];
  selectedSettings?: Settings;
  updateUsdRateModal: boolean;
  updateAdminEmailModal: boolean;
} = {
  settingsList: [],
  selectedSettings: undefined,
  updateUsdRateModal: false,
  updateAdminEmailModal: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettingsList: (state, action: { payload: Settings[] }) => {
      state.settingsList = action.payload;
    },
    setSelectedSettings: (state, action) => {
      state.selectedSettings = action.payload;
    },
    setUpdateUsdRateModal: (state, action: { payload: boolean }) => {
      state.updateUsdRateModal = action.payload;
    },
    setUpdateAdminEmailModal: (state, action: { payload: boolean }) => {
      state.updateAdminEmailModal = action.payload;
    },
    setUpdateSettings: (state, action: { payload: Settings }) => {
      state.settingsList = state.settingsList.map((setting) =>
        setting.id === action.payload?.id ? action.payload : setting
      );
    },
  },
});

export const {
  setSettingsList,
  setSelectedSettings,
  setUpdateUsdRateModal,
  setUpdateAdminEmailModal,
  setUpdateSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
