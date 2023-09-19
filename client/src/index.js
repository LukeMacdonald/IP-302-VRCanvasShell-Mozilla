import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './redux/store-config'

const root = ReactDOM.createRoot(document.getElementById('root'));
const { store, persistor } = configureStore();
root.render(
  <React.StrictMode>
    {/* Provide the Redux store */}
    <Provider store={store}>
      {/* Provide the Persistor */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);