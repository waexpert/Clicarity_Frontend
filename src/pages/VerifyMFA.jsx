import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const VerifyMFA = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const user = useSelector((state) => state.user);
  const user_id = user.id;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/mfa/verify`,
        { user_id, token: code },
        { withCredentials: true }
      );

      if (res.data.success) {
        setStatus('✅ MFA Verified Successfully!');
        navigate('/')
      } else {
        setStatus('❌ Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('❌ Something went wrong.');
    }
  };

  return (
    <div className="mfa-verify-wrapper">
      <h2>Verify MFA Code</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={6}
          style={{width:200}}
        />
        <Button type="submit">Verify</Button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default VerifyMFA;
