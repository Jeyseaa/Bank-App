import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Appbar from './components/Appbar';
import BankcraftRegister from './components/Bankcraftregister'; 
import BankcraftLogin from './components/Bankcraftlogin'; 
import Dashboard from './components/Dashboard';
import { AppBar } from '@mui/material';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <Appbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          {[
            { path: '/AppBar', element: <AppBar /> },
            { path: '/BankcraftRegister', element: <BankcraftRegister /> },
            { path: '/BankcraftLogin', element: <BankcraftLogin /> },
            { path: '/dashboard/*', element: <Dashboard /> },
          ].map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
