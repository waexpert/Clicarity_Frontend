// QRSetup.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const QRSetup = () => {
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const user_id = user.id;

  useEffect(() => {
    const fetchQRCode = async () => {
        try {
          const res = await axios.post(
            'http://localhost:3000/mfa/setup',
            { user_id },
            { withCredentials: true }
          );
          setQrCodeBase64(res.data.qr); // 🔥 fixed line
        } catch (err) {
          console.error('Failed to fetch QR Code:', err);
        }
      };
      

    fetchQRCode();
  }, []);

  return (
    <div className="qr-setup-wrapper">
      <h2>Multi-Factor Authentication Setup</h2>
      <p>Scan this QR code with Google Authenticator or any MFA app:</p>

      {qrCodeBase64 ? (
        <img src={qrCodeBase64} alt="MFA QR Code" style={{ width: 200, height: 200 }} />
      ) : (
        <p>Loading QR Code...</p>
      )}

      <button onClick={() => navigate('/verify-mfa')} className="continue-btn">
        Continue
      </button>
    </div>
  );
};

export default QRSetup;
