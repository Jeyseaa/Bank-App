// Appbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { auth } from '../firebase';

const Appbar = ({ loggedIn, setLoggedIn }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#74959a' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          BANKCRAFT
        </Typography>
        <div>
          {loggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/BankcraftLogin">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/BankcraftRegister">
                Register
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
