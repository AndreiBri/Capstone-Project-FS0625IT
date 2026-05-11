import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  profile: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.profile = null;
    },
  },
});

export const { setUser, setProfile, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
