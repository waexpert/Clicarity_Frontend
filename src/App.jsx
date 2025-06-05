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
import RecordTaskDashboard from "./pages/RecordTaskDashboard";
import RecordJobDashboard from "./pages/RecordJobDashboard"
import TaskManagementTable from "./pages/TaskManagementTable";
import Job from "./pages/Job"
import CaptureWebhook from "./components/CaptureWebhook";
import StructureJobStatus from "./pages/TablePreview/StructureJobStatus";

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
        {/* Task Management */}
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
              <RecordTaskDashboard />
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

        {/* Job Status */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Job />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/record"
          element={
            <ProtectedRoute>
              <RecordJobDashboard />
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

        <Route path="/testing" element={
          // <CaptureWebhook/>
          <StructureJobStatus/>
          } />

         <Route path="/db/:id/job_status" element={
          // <CaptureWebhook/>
          <StructureJobStatus/>
          } />


      </Routes>
    </>
  );
}

export default App;
