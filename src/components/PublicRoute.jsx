// components/PublicRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = user && user.id; 

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
