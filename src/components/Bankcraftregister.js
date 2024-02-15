import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../firebase'; // Assuming your firebase.js is in the parent directory
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import './loginstyle.css';

const BankcraftRegister = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    errors: {},
    formSubmitted: false,
  });

  const eyes1 = useRef(null);
  const eyes2 = useRef(null);
  const navigate = useNavigate();
  const firestore = getFirestore();

  useEffect(() => {
    const updateEyesPosition = (event) => {
      const { clientX, clientY, touches } = event;
      const cursorX = clientX || (touches && touches[0].clientX);
      const cursorY = clientY || (touches && touches[0].clientY);

      if (cursorX === undefined || cursorY === undefined) {
        return;
      }

      const angle1 = getAngle(cursorX, cursorY, eyes1.current);
      const angle2 = getAngle(cursorX, cursorY, eyes2.current);

      const distance = 5;

      const calculateOffset = (angle) => ({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });

      eyes1.current.style.transform = `translate(${calculateOffset(angle1).x}px, ${calculateOffset(angle1).y}px)`;
      eyes2.current.style.transform = `translate(${calculateOffset(angle2).x}px, ${calculateOffset(angle2).y}px)`;
    };

    document.addEventListener('mousemove', updateEyesPosition);
    document.addEventListener('touchmove', updateEyesPosition);

    return () => {
      document.removeEventListener('mousemove', updateEyesPosition);
      document.removeEventListener('touchmove', updateEyesPosition);
    };
  }, [eyes1, eyes2]);

  const getAngle = (x, y, eyes) => {
    const eyesRect = eyes.getBoundingClientRect();
    const eyesX = eyesRect.left + eyesRect.width / 2;
    const eyesY = eyesRect.top + eyesRect.height / 2;

    return Math.atan2(y - eyesY, x - eyesX);
  };

  const validateForm = () => {
    const { name, email, mobileNumber, username, password, confirmPassword } = state;
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Please enter your name.';
    }

    if (!email.trim()) {
      errors.email = 'Please enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!mobileNumber.trim()) {
      errors.mobileNumber = 'Please enter your mobile number.';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }

    if (!username.trim()) {
      errors.username = 'Please enter your username.';
    } else if (!/^[a-zA-Z0-9_-]{3,15}$/.test(username)) {
      errors.username =
        'Username must be 3 to 15 characters long and can contain letters, numbers, underscores, and hyphens.';
    }

    if (!password.trim()) {
      errors.password = 'Please enter your password.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      const { name, email, mobileNumber, username, password } = state;

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        mobileNumber,
        username,
      });

      // Clear input values if needed
      setState({
        name: '',
        email: '',
        mobileNumber: '',
        username: '',
        password: '',
        confirmPassword: '',
        errors: {},
        formSubmitted: true,
      });

      console.log('User registered successfully.');
      navigate('/BankcraftLogin');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className="wrapper">
      <main>
        <section>
          <div className="face">
            <img src="https://iili.io/J1jTuBs.md.jpg" alt="Face" width="250" height="250" />
            <div className="eye-cover1">
              <div id="eyes1" ref={eyes1}></div>
            </div>
            <div className="eye-cover2">
              <div id="eyes2" ref={eyes2}></div>
            </div>
          </div>
          <div className="login-container">
            <div className="social-login">
              <div className="logo">
                <img src="https://iili.io/J1jnv9t.md.png" alt="Bankcraft Logo" width="100" height="100" />
                <p>BankCraft</p>
              </div>
              <p>Building your future, one transaction at a time – that's the art of Bank Craft.</p>
              <div className="social-grp">
                {['Twitter', 'Facebook', 'Google'].map((socialMedia, index) => (
                  <div key={index} className="btn">
                    <a href="#">
                      <img
                        src={`https://assets.codepen.io/9277864/social-media-${socialMedia.toLowerCase()}.svg`}
                        alt=""
                        width="32"
                        height="32"
                      />
                      <span>{socialMedia}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="email-login">
              <div className="login-h-container">
                <h1>Register to have your account</h1>
                <p>Please fill up all provided forms!</p>
                {state.formSubmitted && <p className="success-message">Form submitted successfully.</p>}
              </div>
              <form onSubmit={handleFormSubmission}>
                {['name', 'email', 'mobileNumber', 'username', 'password', 'confirmPassword'].map((inputName, index) => (
                  <label key={index} htmlFor={inputName}>
                    <input
                      id={inputName}
                      name={inputName}
                      type={inputName === 'password' || inputName === 'confirmPassword' ? 'password' : 'text'}
                      placeholder={`Enter your ${inputName}`}
                      value={state[inputName]}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors[inputName] && <p className="error">{state.errors[inputName]}</p>}
                  </label>
                ))}
                <input type="submit" value="REGISTER" />
              </form>
            </div>
          </div>
        </section>
        <div className="vector-1"></div>
        <div className="vector-2"></div>
        <div className="vector-3"></div>
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
};

export default BankcraftRegister;
