import React, { useState } from 'react';
import '../css/Register.css';
import { useDispatch } from 'react-redux';
import {userRegistration} from '../features/userMethod/userSlice'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    country: '',
    currency: '',
    recaptchaChecked: false
  });
  
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userRegistration(formData))
 
    alert('Form submitted successfully!');
    console.log(formData);
  };

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <img src='/Images/logo.png'/>
        <label>
          First Name <span>*</span>
          <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required />
        </label>

        <label>
          Last Name <span>*</span>
          <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required />
        </label>

        <label>
          Email <span>*</span>
          <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Password <span>*</span>
          <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
        </label>

        <label>
          Phone Number <span>*</span>
          <div className="phone-wrapper">
            <select className="country-code" disabled>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} required />
          </div>
        </label>

        <label>
          Country <span>*</span>
          <select name="country" value={formData.country} onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="india">India</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
          </select>
        </label>

        <label>
          Currency <span>*</span>
          <select name="currency" value={formData.currency} onChange={handleChange} required>
            <option value="">Select...</option>
            <option value="inr">INR</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </label>

        <button type="submit" className="submit-btn">Sign Up</button>

        <p className="signin-link">Already have an account? <a href="#">Sign In</a></p>

        <p className="terms">
          By signing in to this app you agree to <a href="#">Terms of Service</a> and acknowledge the <a href="#">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
