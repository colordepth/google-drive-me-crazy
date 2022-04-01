import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import reportWebVitals from './reportWebVitals';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import store from './services/store';
import App from './App';
import './index.css';

let persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading app...</div>} persistor={persistor}>
      <BrowserRouter basename="/app">
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

TimeAgo.addDefaultLocale(en);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
