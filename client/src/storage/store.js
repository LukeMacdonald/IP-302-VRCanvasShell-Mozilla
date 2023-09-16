import { configureStore } from '@reduxjs/toolkit'
import courseIDReducer from './reducers/courseIDReducer'
import tokenReducer from './reducers/tokenReducer'

export const store = configureStore({
  reducer: {
    courseID: courseIDReducer,
    token: tokenReducer
  },
})