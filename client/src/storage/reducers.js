import { createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Define the initial state for course ID
const initialCourseState = {
  value: null,
};

// Create a course ID slice
export const courseIDReducer = createSlice({
  name: 'courseID',
  initialState: initialCourseState,
  reducers: {
    // Action to set the course ID
    setCourseID: (state, action) => {
      state.value = action.payload;
    },
    // Action to clear the course ID if needed
    clearCourseID: (state) => {
      state.value = null;
    },
    // You can add more actions for course ID state management here
  },
});

// Export action creators generated by the course ID slice
export const { setCourseID, clearCourseID } = courseIDReducer.actions;

// Define the initial state for token
const initialTokenState = {
  value: null, // Initialize the token to null or an appropriate default value
};

// Create a token slice
export const tokenReducer = createSlice({
  name: 'token',
  initialState: initialTokenState,
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

export const rootReducer = combineReducers({
  courseID: courseIDReducer.reducer,
  token: tokenReducer.reducer,
});

