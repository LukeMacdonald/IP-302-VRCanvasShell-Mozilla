import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: null, // Initialize the token to null or an appropriate default value
};

const tokenReducer = createSlice({
  name: 'token',
  initialState,
  reducers: {
    // Action to set the token when a user enters it
    setToken: (state, action) => {
      state.value = action.payload;
    },
    // Action to clear the token when needed
    clearToken: (state) => {
      state.value = null;
    },
  },
});

export const { setToken, clearToken } = tokenReducer.actions;
export default tokenReducer.reducer;
