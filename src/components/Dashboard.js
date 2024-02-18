import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import your Firebase authentication functions
import './dashboard.css'; // Import your CSS file for styling

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleSidebarClick = async (option) => {
    if (option === 'logout') {
      try {
        // Add your logout logic using Firebase auth.signOut()
        await auth.signOut();
        console.log('User logged out successfully.');

        // After logging out, redirect to the BankcraftRegister page
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
        return <h2>Welcome to Overview</h2>;
      case 'balance':
        return <h2>Welcome to Balance</h2>;
      case 'transfer':
        return <h2>Welcome to Transfer Funds</h2>;
      case 'deposit':
        return <h2>Welcome to Deposit</h2>;
      case 'withdraw':
        return <h2>Welcome to Withdraw</h2>;
      default:
        return 
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
