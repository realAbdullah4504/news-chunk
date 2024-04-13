import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading:false,
    user: {},
  },
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.isAuthenticated = false;
    },

    setUser: (state, action) => {
      // console.log("s11111111", action?.payload);
      state.user = action.payload.user;
    },
    initUser: (state) => {
      state.user = {};
    },
  },
});
export const { login, logout, setUser, initUser } = authSlice.actions;
export default authSlice.reducer;
