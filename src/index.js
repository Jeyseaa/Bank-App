import React from 'react';
import { createRoot } from 'react-dom/client';  // Import createRoot from 'react-dom/client'
import App from './App';
import { auth } from './firebase';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App auth={auth} />
  </React.StrictMode>
);
