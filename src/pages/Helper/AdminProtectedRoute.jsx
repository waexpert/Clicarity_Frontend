import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userEmail = useSelector((state) => state.user?.email);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is admin
  if (userEmail !== 'contact@clicarity.com') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;