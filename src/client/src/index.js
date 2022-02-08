import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import store from './services/store';
import App from './App';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/app">
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

TimeAgo.addDefaultLocale(en);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
