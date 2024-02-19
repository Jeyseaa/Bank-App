import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './dashboard.css';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          setUser(currentUser);

          // Use local storage to persist the user UID
          localStorage.setItem('userUID', currentUser.uid);

          // Fetch user data based on UID
          const userDocRef = doc(firestore, `users/${currentUser.uid}`);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserData(userData);
            setBalance(userData.balance);
          }
        } else {
          console.log('No current user found.');
          const userUID = localStorage.getItem('userUID');

          if (userUID) {
            // If there is a user UID in local storage, try to fetch user data
            const userDocRef = doc(firestore, `users/${userUID}`);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              setUserData(userData);
              setBalance(userData.balance);
            }
          } else {
            // If no user UID in local storage, redirect to login
            navigate('/BankcraftLogin');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  const handleSidebarClick = (option) => {
    if (option === 'logout') {
      try {
        auth.signOut();
        // Remove user UID from local storage on logout
        localStorage.removeItem('userUID');
        console.log('User logged out successfully.');
        navigate('/BankcraftLogin');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    } else {
      setSelectedOption(option);
    }
  };

  const getContentForOption = () => {
    switch (selectedOption) {
      case 'overview':
        return (
          <div>
            <h2>Welcome to Overview</h2>
            {user && <p>User: {user.email}</p>}
            {userData && (
              <div>
                <p>User Data: {JSON.stringify(userData)}</p>
                {/* Display other relevant user data or transaction history */}
              </div>
            )}
          </div>
        );
      case 'balance':
        return (
          <div>
            <h2>Welcome to Balance</h2>
            {user && <p>User: {user.email}</p>}
            {loading ? (
              <p>Loading balance...</p>
            ) : (
              <p>Your current balance is: ₱{balance}</p>
            )}
          </div>
        );
      case 'transfer':
        return <h2>Welcome to Transfer Funds</h2>;
      case 'deposit':
        return <h2>Welcome to Deposit</h2>;
      case 'withdraw':
        return <h2>Welcome to Withdraw</h2>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className={`sidebar-item ${selectedOption === 'overview' ? 'active' : ''}`} onClick={() => handleSidebarClick('overview')}>
          Overview
        </div>
        <div className={`sidebar-item ${selectedOption === 'balance' ? 'active' : ''}`} onClick={() => handleSidebarClick('balance')}>
          Balance
        </div>
        <div className={`sidebar-item ${selectedOption === 'transfer' ? 'active' : ''}`} onClick={() => handleSidebarClick('transfer')}>
          Transfer Funds
        </div>
        <div className={`sidebar-item ${selectedOption === 'deposit' ? 'active' : ''}`} onClick={() => handleSidebarClick('deposit')}>
          Deposit
        </div>
        <div className={`sidebar-item ${selectedOption === 'withdraw' ? 'active' : ''}`} onClick={() => handleSidebarClick('withdraw')}>
          Withdraw
        </div>
        <div className="sidebar-item" onClick={() => handleSidebarClick('logout')}>
          Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {getContentForOption()}
      </div>
    </div>
  );
};

export default Dashboard;
