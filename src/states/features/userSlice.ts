import { User } from '@/types/models/user.types';
import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  usersList: User[];
  selectedUser: User;
  user: User;
  token: string;
} = {
  usersList: [],
  selectedUser: {} as User,
  user: store.get('user') || ({} as User),
  token: store.get('token') || '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      store.set('user', action.payload);
    },
    addUserToList: (state, action) => {
      state.usersList.unshift(action.payload);
    },
    removeUserFromList: (state, action) => {
      state.usersList = state.usersList.filter(
        (user) => user.id !== action.payload
      );
    },
    setToken: (state, action) => {
      state.token = action.payload;
      store.set('token', action.payload);
    },
  },
});

export const {
  setUsersList,
  setSelectedUser,
  setUser,
  addUserToList,
  removeUserFromList,
  setToken,
} = userSlice.actions;

export default userSlice.reducer;
