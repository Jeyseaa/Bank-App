// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Appbar from './components/Appbar';
import BankcraftLogin from './components/Bankcraftlogin';
import BankcraftRegister from './components/Bankcraftregister';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <Appbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route
            path="/BankcraftLogin"
            element={<BankcraftLogin setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/BankcraftRegister"
            element={<BankcraftRegister />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
