// components/PublicRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const isLoggedIn = user && user.id;
  
  // Allow access to MFA verification even if user is logged in
  const mfaRoutes = ["/verify-mfa", "/generate-secret"];
  const isMfaRoute = mfaRoutes.includes(location.pathname);

  return isLoggedIn && !isMfaRoute ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;