import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import QRSetup from "./pages/QrCode";
import VerifyMFA from "./pages/VerifyMFA";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DbConnection from "./pages/DbConnection";
import SchemaDashboard from "./pages/SchemaDashboard"
import Browse from "./pages/Browse";

function App() {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/register"];
  const hideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
               <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/db/:id"
          element={
            <ProtectedRoute>
            <SchemaDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/db-connection"
          element={
            <ProtectedRoute>
              <DbConnection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/generate-secret"
          element={
            <PublicRoute>
              <QRSetup />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-mfa"
          element={
            <PublicRoute>
              <VerifyMFA />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
