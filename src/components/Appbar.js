
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { auth } from '../firebase';
import './loginstyle.css';

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
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div className="logo">
          <img
            src="https://iili.io/J1jnv9t.md.png"
            alt="Bankcraft Logo"
            width="100"
            height="100"
            style={{ marginLeft: '100px' }}
          />
          <Typography variant="h6" style={{ marginLeft: '10px', fontSize: '35px', fontWeight: 'bold', fontFamily: '"Unbounded", cursive' }}>
            BANKCRAFT
          </Typography>
        </div>
        <div>
          {loggedIn ? (
            <>
              
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
 