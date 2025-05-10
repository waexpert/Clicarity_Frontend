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
import Profile from "./pages/Profile";
import TeamMember from "./components/profile/TeamMember";
import RolesPermissions from "./components/profile/RolesPermissions";
import Task from "./pages/Task";
import RecordsDashboard from "./pages/RecordTaskDashboard";
import TaskManagementTable from "./pages/TaskManagementTable";

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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/teamMember"
          element={
            <ProtectedRoute>
              <TeamMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/permissions"
          element={
            <ProtectedRoute>
              <RolesPermissions />
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
              <SchemaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Task />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/record"
          element={
            <ProtectedRoute>
              <RecordsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/record/create"
          element={
            <ProtectedRoute>
              <TaskManagementTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/database"
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
