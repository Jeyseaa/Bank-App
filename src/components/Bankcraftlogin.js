import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase'; // Import any additional dependencies as needed
import './loginstyle.css';

const BankcraftLogin = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const eyes1 = useRef(null);
  const eyes2 = useRef(null);

  useEffect(() => {
    const updateEyesPosition = (event) => {
      const { clientX, clientY, touches } = event;
      const cursorX = clientX || (touches && touches[0].clientX);
      const cursorY = clientY || (touches && touches[0].clientY);

      if (cursorX === undefined || cursorY === undefined) {
        return;
      }

      // Ensure that eyes1.current and eyes2.current are not null or undefined
      if (eyes1.current && eyes2.current) {
        const angle1 = getAngle(cursorX, cursorY, eyes1.current);
        const angle2 = getAngle(cursorX, cursorY, eyes2.current);

        const distance = 5;

        const calculateOffset = (angle) => ({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });

        eyes1.current.style.transform = `translate(${calculateOffset(angle1).x}px, ${calculateOffset(angle1).y}px)`;
        eyes2.current.style.transform = `translate(${calculateOffset(angle2).x}px, ${calculateOffset(angle2).y}px)`;
      }
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();

    const { email, password } = state;

    console.log('Attempting to log in with:', email, password);

    try {
      // Login user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login (redirect, show success message, etc.)
      console.log('Login successful!', userCredential.user);

      // Update the state to clear the input fields
      setState({ email: '', password: '' });
    } catch (error) {
      console.error('Error logging in:', error.code, error.message, error);

      // Check error codes for specific cases
      if (error.code === 'auth/user-not-found') {
        alert('Email does not exist');
      } else if (error.code === 'auth/wrong-password') {
        alert('Password is incorrect');
      } else {
        // Handle other errors
        alert('Email or Password are incorrect');
      }
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
                <h1>Login to your account</h1>
                <p>
                  Don’t have an account? <Link to="/BankcraftRegister">Sign up Free!</Link>
                </p>
              </div>
              <form onSubmit={handleFormSubmission}>
                <label htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={state.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label htmlFor="password">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={state.password}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <div className="recovery">
                  <div>
                    <input type="checkbox" id="remember" name="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#">Forgot Password?</a>
                </div>
                <input type="submit" value="LOGIN" />
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

export default BankcraftLogin;
