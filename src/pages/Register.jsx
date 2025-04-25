import React, { useState } from 'react';
import '../css/Register.css';
import { useDispatch } from 'react-redux';
import {userRegistration} from '../features/userMethod/userSlice'
import axios from 'axios';


const Register = () => {
  const [formData, setFormData] = useState({
    id : "",
    first_name : "",
    last_name : "",
    email : "",
    password : "",
    phone_number : "",
    country : "",
    currency : "",
    is_verified : false,
  });
  
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Before API call", formData);

    try {
      const res = await axios.post("http://localhost:3000/users/register", formData);
      const userData = res.data.user;

      dispatch(userRegistration(userData)); // Update state with backend response

      alert("Form submitted successfully!");
      console.log("User after registration:", userData);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed! Please try again.");
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <img src='/Images/logo.png'/>
        <label>
          First Name <span>*</span>
          <input type="text" name="first_name" placeholder="Enter first name" value={formData.first_name} onChange={handleChange} required />
        </label>

        <label>
          Last Name <span>*</span>
          <input type="text" name="last_name" placeholder="Enter last name" value={formData.last_name} onChange={handleChange} required />
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
            <select className="country" disabled>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input type="tel" name="phone_number" placeholder="Phone number" value={formData.phone_number} onChange={handleChange} required />
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

        <p className="signin-link">Already have an account? <a href="/login">Sign In</a></p>

        <p className="terms">
          By signing in to this app you agree to <a href="#">Terms of Service</a> and acknowledge the <a href="#">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
