import 'bootstrap/dist/css/bootstrap.css';
import jquery from 'jquery';
window.$ = window.jQuery=jquery;
require('bootstrap/dist/js/bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
