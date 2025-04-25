// LogoutButton.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userLogout } from '../features/userMethod/userSlice'; // assuming you're using Redux slice

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
      dispatch(userLogout()); // Clear Redux user state
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return <button className='submit-btn' onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
