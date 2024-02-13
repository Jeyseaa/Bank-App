import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Appbar from './components/Appbar';
import BankcraftLogin from './components/Bankcraftlogin';
import BankcraftRegister from './components/Bankcraftregister';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  

  return (
    <Router>
      <div className="App">
        <Appbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          {[
            { path: '/', element: <BankcraftLogin /> },
            { path: '/register', element: <BankcraftRegister /> },
            { path: '/BankcraftLogin', element: <BankcraftLogin /> },
          ].map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
