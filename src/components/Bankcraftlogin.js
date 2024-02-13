import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

      const angle1 = getAngle(cursorX, cursorY, eyes1.current);
      const angle2 = getAngle(cursorX, cursorY, eyes2.current);

      const distance = 5;

      const transformEyes = (eyes, angle) => {
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        eyes.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      };

      transformEyes(eyes1, angle1);
      transformEyes(eyes2, angle2);
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

  const handleFormSubmission = (event) => {
    event.preventDefault();

    const { email, password } = state;

    if (email.trim() === '') {
      alert('Please enter your email.');
      return;
    }

    if (password.trim() === '') {
      alert('Please enter your password.');
      return;
    }

    console.log('Email:', email);
    console.log('Password:', password);

    // Clear input values if needed
    setState({ email: '', password: '' });
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
                  Don’t have an account? <Link to="/register">Sign up Free!</Link>
                </p>
              </div>
              <form onSubmit={handleFormSubmission}>
                {['email', 'password'].map((inputName, index) => (
                  <label key={index} htmlFor={inputName}>
                    <input
                      id={inputName}
                      name={inputName}
                      type={inputName === 'password' ? 'password' : 'email'}
                      placeholder={`Enter your ${inputName}`}
                      value={state[inputName]}
                      onChange={handleInputChange}
                    />
                  </label>
                ))}
                <div className="recovery">
                  <div>
                    <input type="checkbox" id="remember" name="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="">Forgot Password?</a>
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
