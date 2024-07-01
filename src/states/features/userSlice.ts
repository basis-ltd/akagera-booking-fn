import { User } from '@/types/models/user.types';
import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  usersList: User[];
  selectedUser?: User;
  user: User;
  token: string;
  createUserModal: boolean
} = {
  usersList: [],
  selectedUser: undefined,
  user: store.get('user'),
  token: store.get('token') || '',
  createUserModal: false
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
    setCreateUserModal: (state, action) => {
      state.createUserModal = action.payload
    }
  },
});

export const {
  setUsersList,
  setSelectedUser,
  setUser,
  addUserToList,
  removeUserFromList,
  setToken,
  setCreateUserModal
} = userSlice.actions;

export default userSlice.reducer;
