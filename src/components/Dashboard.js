import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './dashboard.css';
import { Typography } from '@mui/material';
import { getDocs, collection, where } from 'firebase/firestore';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading,setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [depositData, setDepositData] = useState(() => {
    const savedDepositData = JSON.parse(localStorage.getItem('depositData')) || {
      depositAmount: '',
      paymentMethod: '',
      accountNumber: '',
      name: '',
      mobileNumber: '',
      currency: '',
      date: '',
    };
    return savedDepositData;
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('userUID', currentUser.uid);
  
          const userDocRef = doc(firestore, `users/${currentUser.uid}`);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserData(userData);
            setBalance(userData.balance);
  
            // Set the deposit data after fetching user data
            setDepositData((prev) => ({
              ...prev,
              accountNumber: userData?.accountNumber || '',
              name: userData?.name || '',
              date: new Date().toISOString().split('T')[0], // Set current date
            }));
          }
        } else {
          const userUID = localStorage.getItem('userUID');
  
          if (userUID) {
            const userDocRef = doc(firestore, `users/${userUID}`);
            const userDocSnapshot = await getDoc(userDocRef);
  
            if (userDocSnapshot.exists()) {
              const userData = userDocSnapshot.data();
              setUserData(userData);
              setBalance(userData.balance);
  
              // Set the deposit data after fetching user data
              setDepositData((prev) => ({
                ...prev,
                accountNumber: userData?.accountNumber || '',
                name: userData?.name || '',
                date: new Date().toISOString().split('T')[0], // Set current date
              }));
            }
          } else {
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
  }, [userData, navigate]);
  

  const handleSidebarClick = (option) => {
    if (option === 'logout') {
      try {
        auth.signOut();
        localStorage.removeItem('userUID');
        navigate('/BankcraftLogin');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    } else {
      setSelectedOption(option);
    }
  };
  const [transferData, setTransferData] = useState({
    recipientAccountNumber: '',
    transferAmount: '',
  });

  const handleTransferInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
  
    try {
      console.log('Transfer data:', transferData);
  
      // Query the 'users' collection to find the recipient by account number
      const querySnapshot = await getDocs(collection(firestore, 'users'), where('accountNumber', '==', transferData.recipientAccountNumber));
  
      if (!querySnapshot.empty) {
        // Assuming there's only one user with the provided account number
        const recipientUserDocSnapshot = querySnapshot.docs[0];
  
        console.log('Recipient User Doc Snapshot:', recipientUserDocSnapshot.data());
  
        const recipientUserData = recipientUserDocSnapshot.data();
  
        if (recipientUserData) {
          const updatedBalance = balance - parseFloat(transferData.transferAmount);
  
          // Update the sender's balance
          const senderUserDocRef = doc(firestore, 'users', user.uid);
          await updateDoc(senderUserDocRef, { balance: updatedBalance });
  
          // Update the recipient's balance
          const recipientBalance = recipientUserData.balance + parseFloat(transferData.transferAmount);
          await updateDoc(recipientUserDocSnapshot.ref, { balance: recipientBalance });
  
          setSuccessMessage(`Transfer successful! ₱${transferData.transferAmount} has been sent to ${transferData.recipientAccountNumber}.`);
  
          setTransferData({
            recipientAccountNumber: '',
            transferAmount: '',
          });
        } else {
          console.error('Recipient account number does not have valid data:', transferData.recipientAccountNumber);
          setSuccessMessage('Recipient account number does not have valid data.');
        }
      } else {
        console.error('Recipient account number does not exist:', transferData.recipientAccountNumber);
        setSuccessMessage('Recipient account number does not exist.');
      }
    } catch (error) {
      console.error('Error during transfer:', error);
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  
  

  const getContentForOption = () => {
    switch (selectedOption) {
      case 'overview':
        return (
          <div className="container" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          

  
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

          </div>
        );
        case 'balance':
          return (
            <div className="content-container">
              <div className="current-balance">
                <h2>
                  ₱{balance}
                  <span>Your current balance</span>
                </h2>
              </div>
          
        </div>
        );
      case 'transfer':
        case 'transfer':
          return (
            
            <div className="deposit-container">
              <div className="logo">
          <img
            src="https://iili.io/J1jnv9t.md.png"
            alt="Bankcraft Logo"
            width="100"
            height="100"
            
          />
          <Typography variant="h6" style={{ marginLeft: '10px', fontSize: '35px', fontWeight: 'bold', fontFamily: '"Unbounded", cursive' }}>
            BANKCRAFT
          </Typography>
        </div>
              {/* Transfer Form */}
              <form className="deposit-form" onSubmit={handleTransfer}>
        <h2>Transfer Funds</h2>
        <label htmlFor="recipientAccountNumber">
          Recipient Account Number:
          <input
            type="text"
            id="recipientAccountNumber"
            name="recipientAccountNumber"
            value={transferData.recipientAccountNumber}
            onChange={handleTransferInputChange}
            required
          />
        </label>

        <label htmlFor="transferAmount">
          Transfer Amount:
          <input
            type="text"
            id="transferAmount"
            name="transferAmount"
            value={transferData.transferAmount}
            onChange={handleTransferInputChange}
            required
          />
        </label>

        <button type="submit">Transfer</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
      case 'deposit':
        return (
          <div className="deposit-container">
          <div className="logo">
          <img
            src="https://iili.io/J1jnv9t.md.png"
            alt="Bankcraft Logo"
            width="100"
            height="100"
            
          />
          <Typography variant="h6" style={{ marginLeft: '10px', fontSize: '35px', fontWeight: 'bold', fontFamily: '"Unbounded", cursive' }}>
            BANKCRAFT
          </Typography>
        </div>
            {user && (
              <form className="deposit-form" onSubmit={handleDeposit}>
                <h2>Deposit Form</h2>
                <label htmlFor="depositAmount">
                  Enter Amount:   
                  <input
                    type="text"
                    id="depositAmount"
                    name="depositAmount"
                    value={depositData.depositAmount}
                    onChange={handleDepositInputChange}
                    required
                  />
                </label>

                <label htmlFor="paymentMethod">
                  Payment Method: 
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={depositData.paymentMethod}
                    onChange={handleDepositInputChange}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="bankcard">Bankcard</option>
                    <option value="gcash">Gcash</option>
                  </select>
                </label>

                {depositData.paymentMethod === 'gcash' && (
                  <>
                    <label htmlFor="name">
                      Name:         
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={depositData.name}
                        onChange={handleDepositInputChange}
                        required
                      />
                    </label>

                    <label htmlFor="mobileNumber">
                      Mobile Number:  
                      <input
                        type="text"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={depositData.mobileNumber}
                        onChange={handleDepositInputChange}
                        required
                      />
                    </label>
                  </>
                )}

                {depositData.paymentMethod === 'bankcard' && (
                  <>
                    <label htmlFor="accountNumber">
                      Account Number:   
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={depositData.accountNumber}
                        onChange={handleDepositInputChange}
                        required
                        readOnly
                      />
                    </label>

                    <label htmlFor="name">
                      Name:   
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={depositData.name}
                        onChange={handleDepositInputChange}
                        required
                        readOnly
                      />
                    </label>
                  </>
                )}

                <label htmlFor="currency">
                  Choose Currency:   
                  <select
                    id="currency"
                    name="currency"
                    value={depositData.currency}
                    onChange={handleDepositInputChange}
                    required
                  >
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="PESO">PESO</option>
                  </select>
                </label>

                <label htmlFor="date">
                  Date:                     
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={depositData.date}
                    onChange={handleDepositInputChange}
                    required
                  />
                </label>

                <button type="submit">Deposit</button>
              </form>
            )}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        );
        case 'withdraw':
          return (
            <div className="deposit-container">
              <div className="logo">
                <img
                  src="https://iili.io/J1jnv9t.md.png"
                  alt="Bankcraft Logo"
                  width="100"
                  height="100"
                />
                <Typography
                  variant="h6"
                  style={{
                    marginLeft: '10px',
                    fontSize: '35px',
                    fontWeight: 'bold',
                    fontFamily: '"Unbounded", cursive',
                  }}
                >
                  BANKCRAFT
                </Typography>
              </div>
              {user && (
                <form className="deposit-form" onSubmit={handleWithdraw}>
                  <h2>Withdraw Form</h2>
                  <label htmlFor="withdrawAmount">
                    Enter Amount:
                    <input
                      type="text"
                      id="withdrawAmount"
                      name="withdrawAmount"
                      value={withdrawData.withdrawAmount}
                      onChange={handleWithdrawInputChange}
                      required
                    />
                  </label>
        
                  <label htmlFor="withdrawMethod">
                    Withdrawal Method:
                    <select
                      id="withdrawMethod"
                      name="withdrawMethod"
                      value={withdrawData.withdrawMethod}
                      onChange={handleWithdrawInputChange}
                      required
                    >
                      <option value="">Select Withdrawal Method</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cash">Cash Withdrawal</option>
                    </select>
                  </label>
        
                  {/* Additional fields based on withdrawal method, if needed */}
                  {withdrawData.withdrawMethod === 'bank' && (
                    <>
                      <label htmlFor="bankAccount">
                        Bank Account:
                        <input
                          type="text"
                          id="bankAccount"
                          name="bankAccount"
                          value={withdrawData.bankAccount}
                          onChange={handleWithdrawInputChange}
                          required
                        />
                      </label>
                      <label htmlFor="bankBranch">
                        Bank Branch:
                        <input
                          type="text"
                          id="bankBranch"
                          name="bankBranch"
                          value={withdrawData.bankBranch}
                          onChange={handleWithdrawInputChange}
                          required
                        />
                      </label>
                    </>
                  )}
        
                  <label htmlFor="withdrawDate">
                    Date:
                    <input
                      type="date"
                      id="withdrawDate"
                      name="withdrawDate"
                      value={withdrawData.withdrawDate}
                      onChange={handleWithdrawInputChange}
                      required
                    />
                  </label>
        
                  <button type="submit">Withdraw</button>
                </form>
              )}
              {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
          );
        
      default:
        return null;
    }
  };

  const handleDepositInputChange = (e) => {
    const { name, value } = e.target;
    setDepositData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    try {
      const updatedBalance = balance + parseFloat(depositData.depositAmount);
      const userDocRef = doc(firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, { balance: updatedBalance });

      setSuccessMessage(`Deposit successful! ₱${depositData.depositAmount} has been added to your balance.`);

      setDepositData({
        depositAmount: '',
        paymentMethod: '',
        accountNumber: '',
        name: '',
        mobileNumber: '',
        currency: '',
        date: '',
      });
    } catch (error) {
      console.error('Error during deposit:', error.message);
    }
  };

  const getAccountNumberAndName = useCallback(() => {
    if (depositData.paymentMethod === 'bankcard') {
      const accountNumber = userData?.accountNumber || '';
      const name = userData?.name || '';
      setDepositData((prev) => ({
        ...prev,
        accountNumber,
        name,
      }));
    } else if (depositData.paymentMethod === 'gcash') {
      setDepositData((prev) => ({
        ...prev,
        accountNumber: '',
        name: '',
      }));
    }
  }, [userData, depositData.paymentMethod]);
  
  useEffect(() => {
    getAccountNumberAndName();
  }, [getAccountNumberAndName]);
  

  useEffect(() => {
    localStorage.setItem('depositData', JSON.stringify(depositData));
  }, [depositData]);

  const [withdrawData, setWithdrawData] = useState(() => {
    const savedWithdrawData = JSON.parse(localStorage.getItem('withdrawData')) || {
      withdrawAmount: '',
      withdrawMethod: '',
      // Additional fields for withdrawal method, if needed
      withdrawDate: new Date().toISOString().split('T')[0],
    };
    return savedWithdrawData;
  });
  
  const handleWithdrawInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleWithdraw = async (e) => {
    e.preventDefault();
  
    try {
      const updatedBalance = balance - parseFloat(withdrawData.withdrawAmount);
      const userDocRef = doc(firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, { balance: updatedBalance });
  
      setSuccessMessage(`Withdrawal successful! ₱${withdrawData.withdrawAmount} has been deducted from your balance.`);
  
      setWithdrawData({
        withdrawAmount: '',
        withdrawMethod: '',
        // Additional fields for withdrawal method, if needed
        withdrawDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error during withdrawal:', error.message);
    }
  };
  

  return (
    <div className="dashboard-container">
      <div className="sidebar">
      <div className="sidebar">
  <div className={`sidebar-item ${selectedOption === 'overview' ? 'active' : ''}`} onClick={() => handleSidebarClick('overview')}>
    Overview
  </div>
  <div className={`sidebar-item ${selectedOption === 'balance' ? 'active' : ''}`} onClick={() => handleSidebarClick('balance')}>
    Balance
  </div>
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

      </div>

      <div className="main-content">
        {getContentForOption()}
      </div>
    </div>
  );
};

export default Dashboard;
