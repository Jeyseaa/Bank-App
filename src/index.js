import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { auth } from './firebase';

ReactDOM.render(
  <React.StrictMode>
    <App auth={auth} />
  </React.StrictMode>,
  document.getElementById('root')
);
