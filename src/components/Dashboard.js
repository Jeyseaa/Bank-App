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
          <div className="container" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div className="card">
              <div className="card-inner">
                <div className="front">
                  <img src="https://i.ibb.co/PYss3yv/map.png" className="map-img" alt="Map" />
                  <div className="row">
                    <img src="https://i.ibb.co/G9pDnYJ/chip.png" width="60px" alt="Chip" />
                    <img src="https://i.ibb.co/GptPpp4/bankcrafttext.png" width="100px" alt="Visa Logo" />
                  </div>
                  <div className="row card-no">
                    <p>{userData?.cardNumber?.slice(0, 4)}</p>
                    <p>{userData?.cardNumber?.slice(4, 8)}</p>
                    <p>{userData?.cardNumber?.slice(8, 12)}</p>
                    <p>{userData?.cardNumber?.slice(12)}</p>
                  </div>
                  <div className="row card-holder">
                    <p>CARD HOLDER</p>
                    <p>VALID TILL</p>
                  </div>
                  <div className="row name">
                    <p>{userData && userData.name}</p>
                    <p>10 / 30</p>
                  </div>
                </div>
                <div className="back">
                  <img src="https://i.ibb.co/PYss3yv/map.png" className="map-img" alt="Map" />
                  <div className="bar"></div>
                  <div className="row card-cvv">
                    <div>
                      <img src="https://i.ibb.co/S6JG8px/pattern.png" alt="Pattern" />
                    </div>
                    <p>{userData && userData.cvv}</p>
                  </div>
                  <div className="row card-text">
                    <p>Building your future, one transaction at a time – that's the art of Bank Craft.</p>
                  </div>
                  <div className="row signature">
                    <p>CUSTOMER SIGNATURE</p>
                    <img src="https://i.ibb.co/GptPpp4/bankcrafttext.png" width="80px" alt="Visa Logo" />
                  </div>
                </div>
              </div>
            </div>
            <div className="firstRow">
  <div className="elemfirst" id="first">
    <h5>ACCOUNT DETAILS</h5>
    <p><strong>ACCOUNT HOLDER</strong><br />{userData && userData.name}</p>
    <p><strong>ACCOUNT NO</strong><br />{userData && userData.accountNumber}</p>
    <p><strong>ACCOUNT TYPE</strong><br />Savings Account</p>
    <p></p>
  </div>
  <div className="elemfirst">
    <h5>BALANCE (in Philippines Peso (₱))</h5>
    <div id="balance">₱ {balance}</div>
  </div>
</div>
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
        {/* ... (other sidebar items) */}
        {/* Add other sidebar items based on your application requirements */}
        <div className="sidebar-item" onClick={() => handleSidebarClick('transfer')}>
          Transfer Funds
        </div>
        <div className="sidebar-item" onClick={() => handleSidebarClick('deposit')}>
          Deposit
        </div>
        <div className="sidebar-item" onClick={() => handleSidebarClick('withdraw')}>
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
