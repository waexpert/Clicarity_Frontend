import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import QRSetup from "./pages/Auth/QrCode";
import VerifyMFA from "./pages/Auth/VerifyMFA";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DbConnection from "./pages/DbConnection";
import SchemaDashboard from "./pages/TaskStatus/SchemaDashboard"
import Profile from "./pages/Team/Profile";
import TeamMember from "./components/profile/TeamMember";
import RolesPermissions from "./components/profile/RolesPermissions";
import Task from "./pages/TaskStatus/Task";
import RecordTaskDashboard from "./pages/TaskStatus/RecordTaskDashboard";
import RecordJobDashboard from "./pages/JobStatus/RecordJobDashboard"
import TaskManagementTable from "./pages/TaskStatus/TaskManagementTable";
import Job from "./pages/JobStatus/Job"
import CaptureWebhook from "./pages/JobStatus/CaptureWebhook";
import StructureJobStatus from "./pages/JobStatus/StructureJobStatus";
import CustomTable from "./components/CustomTable";
import Testing from "./pages/Testing";
import SheetComment from "./pages/Comment/SheetComment";
import PostgresComment from "./pages/Comment/PostgresComment";
import UploadFile from "./pages/Comment/UploadFile";
import WorkspaceSwitcher from "./pages/Comment/Reminder";
import Reminder from "./pages/Comment/Reminder";
import RecordLeadDashboard from "./pages/LeadStatus/RecordLeadDashboard";
import StructureLeadStatus from "./pages/LeadStatus/StructureLeadStatus";
import Lead from "./pages/LeadStatus/Lead";
import Payment from "./pages/PaymentStatus/Payment";
import RecordPaymentDashboard from "./pages/PaymentStatus/RecordPaymentDashboard";
import StructurePaymentStatus from "./pages/PaymentStatus/StructurePaymentStatus";
import { Helmet } from "react-helmet";
import CustomSchemaDashboard from "./pages/DatabaseConnection/CustomSchemaDashboard";
import CustomCaptureWebhook from "./pages/DatabaseConnection/CustomCaptureWebhook";
import CustomStructure from "./pages/DatabaseConnection/CustomStructure";
import DropDownSetup from "./pages/Setup/DropDownSetup";
import SheetTransfer from "./pages/JSR_Services/SheetTransfer";


function App() {
const location = useLocation();

const hideHeader =
  ["/login", "/register", "/sheet", "/postgres", "/upload", "/reminder"].includes(location.pathname) ||
  (location.pathname === "/jobstatus/record" && location.search.includes("pa_id="));


  return (
    <>
      <Helmet>
        <title>Clicarity - Professional Workflow Solutions</title>
        <meta name="description" content="Your description here" />
      </Helmet>
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
          path="/db/:id"
          element={
            <ProtectedRoute>
              <SchemaDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/db/custom"
          element={
            <ProtectedRoute>
              <CustomSchemaDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/db/custom/capture"
          element={
            <ProtectedRoute>
              <CustomStructure />
            </ProtectedRoute>
          }
        />

        <Route
          path="/db/custom/capture/:tableName"
          element={
            <ProtectedRoute>
              <CustomStructure />
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
        {/* <Route
          path="/tasks/record"
          element={
            <ProtectedRoute>
              <RecordTaskDashboard />
            </ProtectedRoute>
          }
        /> */}

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
          path="/jobstatus"
          element={
            <ProtectedRoute>
              <Job />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/jobstatus/record"
          element={
            <ProtectedRoute>
              <RecordJobDashboard />
            </ProtectedRoute>
          }
        /> */}

                <Route
          path="/:tableName1/record"
          element={
            <ProtectedRoute>
              <CustomTable />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/:tableName1/record1"
          element={
            <ProtectedRoute>
              <CustomTable />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/db/:id/job_status" element={
          <ProtectedRoute>
            <StructureJobStatus />
          </ProtectedRoute>
        } />

        {/* Lead Status */}
        <Route
          path="/leadstatus"
          element={
            <ProtectedRoute>
              <Lead />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/leadstatus/record"
          element={
            <ProtectedRoute>
              <RecordLeadDashboard />
            </ProtectedRoute>
          }
        /> */}


        <Route path="/db/:id/lead_status" element={
          <ProtectedRoute>
            <StructureLeadStatus />
          </ProtectedRoute>
        } />
        {/* ///////////////////////////////////////////////////////////////         */}


        {/* Payment Status */}
        <Route
          path="/paymentstatus"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/paymentstatus/record"
          element={
            <ProtectedRoute>
              <RecordPaymentDashboard />
            </ProtectedRoute>
          }
        /> */}


        <Route path="/db/:id/payment_status" element={
          <ProtectedRoute>
            <StructurePaymentStatus />
          </ProtectedRoute>
        } />

        {/* ////////////////////////////////////////////////////////          */}
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
          // <StructureJobStatus/>
          <Testing />

        } />

        <Route path="/sheet" element={
          <ProtectedRoute>
            <SheetComment />
          </ProtectedRoute>

        } />
        <Route path="/postgres" element={
          <ProtectedRoute>
            <PostgresComment />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadFile />
          </ProtectedRoute>
        } />
        <Route path="/reminder" element={
          <ProtectedRoute>
            <Reminder />
          </ProtectedRoute>
        } />

        <Route path="/sheetTransfer/:us_id" element={
          <ProtectedRoute>
            <SheetTransfer/>
          </ProtectedRoute>
        } />


        {/* Setup Routes */}
        <Route path="/db/setup/:tableName" element={
          <ProtectedRoute>
            <DropDownSetup />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Home />} />

      </Routes>
    </>
  );
}

export default App;
