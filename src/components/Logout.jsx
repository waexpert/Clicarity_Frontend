// LogoutButton.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userLogout } from '../features/userMethod/userSlice'; 
import { Button } from './ui/button';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/logout`, {}, { withCredentials: true });
      dispatch(userLogout()); // Clear Redux user state
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return <Button className='submit-btn' onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
