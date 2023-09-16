import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { legacy_createStore as createStore } from '@reduxjs/toolkit'
import {rootReducer} from './reducers'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['token', 'course', 'courses'],
  blacklist: []
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Assign the arrow function to a variable before exporting it as the default module
const configureStore = () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}
export default configureStore