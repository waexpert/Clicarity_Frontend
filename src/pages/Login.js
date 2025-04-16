import React, { useState } from 'react';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaChecked, setRecaptchaChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login Submitted');
    console.log({ email, password, recaptchaChecked });
  };

  return (
    <div className="login-container">
    

      <form className="login-form" onSubmit={handleSubmit}>
      <img src='/Images/logo.png'/>
        <label>
          Email
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="password-label">
          Password
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              title="Toggle Password"
            >
              👁️
            </span>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
        </label>

        {/* <label className="recaptcha-box">
          <input
            type="checkbox"
            checked={recaptchaChecked}
            onChange={(e) => setRecaptchaChecked(e.target.checked)}
          />
          <span>I'm not a robot</span>
          <div className="recaptcha-img">reCAPTCHA</div>
        </label> */}

        <button type="submit" className="signin-btn">Sign In</button>

        <p className="bottom-text">
          Don’t have an account ? <a href="#">Signup</a>
        </p>

        <p className="terms">
          By signing in to this app you agree to <a href="#">Terms of Service</a> and
          acknowledge the <a href="#">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
