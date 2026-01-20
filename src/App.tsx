// import { useLocation } from "react-router-dom";
// import './variables/color.css'
// import { Routes, Route } from "react-router-dom";
// import { useSelector } from "react-redux"; // Added missing import
// import Header from "./components/profile/Header";
// import Register from "./pages/Auth/Register";
// import Login from "./pages/Auth/Login";
// import Home from "./pages/Home";
// import QRSetup from "./pages/Auth/QrCode";
// import VerifyMFA from "./pages/Auth/VerifyMFA";
// import ProtectedRoute from "./pages/Helper/ProtectedRoute";
// import PublicRoute from "./pages/Helper/PublicRoute";
// import DbConnection from "./pages/DbConnection";
// import SchemaDashboard from "./pages/TaskStatus/SchemaDashboard"
// import Profile from "./pages/Team/Profile";
// import TeamMember from "./components/profile/TeamMember";
// import RolesPermissions from "./components/profile/RolesPermissions";
// import Task from "./pages/TaskStatus/Task";
// import RecordTaskDashboard from "./pages/TaskStatus/RecordTaskDashboard";
// import RecordJobDashboard from "./pages/JobStatus/RecordJobDashboard"
// import TaskManagementTable from "./pages/TaskStatus/TaskManagementTable";
// import Job from "./pages/JobStatus/Job"
// import CaptureWebhook from "./pages/JobStatus/CaptureWebhook";
// import StructureJobStatus from "./pages/JobStatus/StructureJobStatus";
// // import CustomTable from "./components/customTable/CustomTable";

// import Testing from "./pages/Testing";
// import SheetComment from "./pages/CustomForms/SheetComment";
// import PostgresComment from "./pages/CustomForms/PostgresComment";
// import UploadFile from "./pages/CustomForms/UploadFile";
// import Reminder from "./pages/CustomForms/Reminder";
// import RecordLeadDashboard from "./pages/LeadStatus/RecordLeadDashboard";
// import StructureLeadStatus from "./pages/LeadStatus/StructureLeadStatus";
// import Lead from "./pages/LeadStatus/Lead";
// import Payment from "./pages/PaymentStatus/Payment";
// import RecordPaymentDashboard from "./pages/PaymentStatus/RecordPaymentDashboard";
// import StructurePaymentStatus from "./pages/PaymentStatus/StructurePaymentStatus";
// import { Helmet } from "react-helmet";
// import CustomSchemaDashboard from "./pages/DatabaseConnection/CustomSchemaDashboard";
// import CustomCaptureWebhook from "./pages/DatabaseConnection/CustomCaptureWebhook";
// import CustomStructure from "./pages/DatabaseConnection/CustomStructure";
// import DropDownSetup from "./pages/Setup/DropDownSetup";
// import SheetTransfer from "./pages/JSR_Services/SheetTransfer";
// import AdminHome from "./pages/Admin/AdminHome";
// import SpreadsheetDemo from "./pages/Profile/SpreadSheet";
// import WastageInput from "./pages/CustomForms/WastageInput";
// import AssignTeamMember from "./pages/CustomForms/AssignTeamMember";
// import CustomUpdateForm from "./pages/CustomForms/CustomUpdateForm";
// import StatusUpdate from "./pages/CustomForms/StatusUpdate";
// import AutocompleteInput from "./pages/test/AutoCompletionTest";
// import CustomViewForm from "./pages/CustomForms/CustomViewForm";
// import ViewBuilder from "./pages/Views/ViewBuilder";
// import CreateView from "./pages/Views/CreateView";
// import RLSManagement from "./pages/Admin/RLSManagement";
// import RolesCreator from "./pages/Roles/RolesCreator";
// import RolesAssignment from "./pages/Roles/RolesAssignment";
// import AdminProtectedRoute from "./pages/Helper/AdminProtectedRoute";
// import './utils/axiosConfig';
// import GlobalLoading from "./components/GlobalLoading";
// import CustomTable from "./pages/CustomTable/CustomTableWithErrorBoundary";

// function App() {
//   const location = useLocation();
//   // const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  
//   const hideHeader =
//     ["/login", "/register", "/sheet", "/postgres", "/upload", "/reminder", "/admin", "/wastage","/assign-team-member","/status-update"].includes(location.pathname) ||
//     (location.pathname === "/jobstatus/record" && location.search.includes("pa_id="));

//   return (
//     <>
//       <Helmet>
//         <title>Clicarity - Professional Workflow Solutions</title>
//         <meta name="description" content="Your description here" />
//       </Helmet>
//       <GlobalLoading/>
//       {!hideHeader && <Header />}
//       <Routes>
//         {/* Public Routes */}
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/register"
//           element={
//             <PublicRoute>
//               <Register />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/generate-secret"
//           element={
//             <PublicRoute>
//               <QRSetup />
//             </PublicRoute>
//           }
//         />
//         <Route
//           path="/verify-mfa"
//           element={
//             <PublicRoute>
//               <VerifyMFA />
//             </PublicRoute>
//           }
//         />

//         {/* Protected Routes */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile/teamMember"
//           element={
//             <ProtectedRoute>
//               <TeamMember />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile/permissions"
//           element={
//             <ProtectedRoute>
//               <RolesPermissions />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/db/:id"
//           element={
//             <ProtectedRoute>
//               {/* <SchemaDashboard /> */}
//               <CustomSchemaDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/db/custom"
//           element={
//             <ProtectedRoute>
//               <CustomSchemaDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/db/custom/capture"
//           element={
//             <ProtectedRoute>
//               <CustomStructure />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/db/custom/capture/:tableName"
//           element={
//             <ProtectedRoute>
//               <CustomStructure />
//             </ProtectedRoute>
//           }
//         />

//         {/* Task Management */}
//         <Route
//           path="/tasks"
//           element={
//             <ProtectedRoute>
//               <Task />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/tasks/bulk"
//           element={
//             <ProtectedRoute>
//               <TaskManagementTable />
//             </ProtectedRoute>
//           }
//         />

//         {/* Job Status */}
//         <Route
//           path="/jobstatus"
//           element={
//             <ProtectedRoute>
//               <Job />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/:tableName1/record"
//           element={
//             <ProtectedRoute>
//               <CustomTable />
//             </ProtectedRoute>
//           }
//         />
//         <Route 
//           path="/db/:id/job_status" 
//           element={
//             <ProtectedRoute>
//               <StructureJobStatus />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Lead Status */}
//         <Route
//           path="/leadstatus"
//           element={
//             <ProtectedRoute>
//               <Lead />
//             </ProtectedRoute>
//           }
//         />
//         <Route 
//           path="/db/:id/lead_status" 
//           element={
//             <ProtectedRoute>
//               <StructureLeadStatus />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Payment Status */}
//         <Route
//           path="/paymentstatus"
//           element={
//             <ProtectedRoute>
//               <Payment />
//             </ProtectedRoute>
//           }
//         />
//         <Route 
//           path="/db/:id/payment_status" 
//           element={
//             <ProtectedRoute>
//               <StructurePaymentStatus />
//             </ProtectedRoute>
//           } 
//         />
         
//         <Route
//           path="/database"
//           element={
//             <ProtectedRoute>
//               <DbConnection />
//             </ProtectedRoute>
//           }
//         />

//         {/* Special Routes */}
//         <Route 
//           path="/testing" 
//           element={<Testing />} 
//         />
//         <Route 
//           path="/sheet" 
//           element={
//             <ProtectedRoute>
//               <SheetComment />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/postgres" 
//           element={
//             <ProtectedRoute>
//               <PostgresComment />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/upload" 
//           element={
//             <ProtectedRoute>
//               <UploadFile />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/reminder" 
//           element={
//             <ProtectedRoute>
//               <Reminder />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/sheetTransfer/:us_id" 
//           element={
//             <ProtectedRoute>
//               <SheetTransfer/>
//             </ProtectedRoute>
//           } 
//         />

//         {/* Setup Routes */}
//         <Route 
//           path="/db/setup/:tableName" 
//           element={
//             <ProtectedRoute>
//               <DropDownSetup />
//             </ProtectedRoute>
//           } 
//         />

//         <Route
//         path="/assign-team-member"
//         element={
//           <ProtectedRoute>
//            <AssignTeamMember/> 
//           </ProtectedRoute> 
//         }
//         />
        
//         <Route 
//           path="/spread" 
//           element={<SpreadsheetDemo />} 
//         />
//         <Route 
//           path="/wastage" 
//           element={<WastageInput/>}
//         />

// <Route
//   path="/admin"
//   element={
//     <AdminProtectedRoute>
//       <AdminHome/>
//     </AdminProtectedRoute>
//   }
// />

//         <Route
//           path="/admin/rls"
//           element={
//             <ProtectedRoute>
//               <RLSManagement/>
//             </ProtectedRoute>
//         }
//         />

//         {/* Catch-all route */}
//         <Route 
//           path="*" 
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/custom-update" 
//           element={
//             <ProtectedRoute>
//               <CustomUpdateForm/>
//             </ProtectedRoute>

//           } 
//         />

//         <Route
//          path ="/custom-view"
//          element={
//            <ProtectedRoute>
//      <CustomViewForm/>
//            </ProtectedRoute>
     
//          }
//          />

//         <Route 
//           path="/status-update" 
//           element={
//             <ProtectedRoute>
//               <StatusUpdate/>
//             </ProtectedRoute>
             
//           } 
//         />

//         <Route 
//           path="/autocomplete" 
//           element={
//               <AutocompleteInput/>
//           } 
//         />

// {/* Views Route */}
//         <Route 
//           path="/views/view-builder" 
//           element={
//             <ProtectedRoute>
//               <ViewBuilder />
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/views/create-view/new" 
//           element={
//             <ProtectedRoute>
//               <CreateView />
//             </ProtectedRoute>
//           } 
//         />
    
//         <Route 
//           path="/roles/create" 
//           element={
//             <ProtectedRoute>
//               <RolesCreator />
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/roles/assign" 
//           element={
//             <ProtectedRoute>
//               <RolesAssignment />
//             </ProtectedRoute>
//           } 
//         />

//       </Routes>


      
//     </>
//   );
// }

// export default App;



import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { lazy, Suspense, useMemo } from "react";

import './variables/color.css';
import './utils/axiosConfig';

import Header from "./components/profile/Header";
import GlobalLoading from "./components/GlobalLoading";
import ProtectedRoute from "./pages/Helper/ProtectedRoute";
import PublicRoute from "./pages/Helper/PublicRoute";
import AdminProtectedRoute from "./pages/Helper/AdminProtectedRoute";

// Eager-loaded critical components (small, frequently used)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";

// Lazy-loaded components for code splitting
const QRSetup = lazy(() => import("./pages/Auth/QrCode"));
const VerifyMFA = lazy(() => import("./pages/Auth/VerifyMFA"));
const DbConnection = lazy(() => import("./pages/DbConnection"));
const SchemaDashboard = lazy(() => import("./pages/TaskStatus/SchemaDashboard"));
const Profile = lazy(() => import("./pages/Team/Profile"));
const TeamMember = lazy(() => import("./components/profile/TeamMember"));
const RolesPermissions = lazy(() => import("./components/profile/RolesPermissions"));
const Task = lazy(() => import("./pages/TaskStatus/Task"));
const TaskManagementTable = lazy(() => import("./pages/TaskStatus/TaskManagementTable"));
const Job = lazy(() => import("./pages/JobStatus/Job"));
const StructureJobStatus = lazy(() => import("./pages/JobStatus/StructureJobStatus"));
const Testing = lazy(() => import("./pages/Testing"));
const SheetComment = lazy(() => import("./pages/CustomForms/SheetComment"));
const PostgresComment = lazy(() => import("./pages/CustomForms/PostgresComment"));
const UploadFile = lazy(() => import("./pages/CustomForms/UploadFile"));
const Reminder = lazy(() => import("./pages/CustomForms/Reminder"));
const Lead = lazy(() => import("./pages/LeadStatus/Lead"));
const StructureLeadStatus = lazy(() => import("./pages/LeadStatus/StructureLeadStatus"));
const Payment = lazy(() => import("./pages/PaymentStatus/Payment"));
const StructurePaymentStatus = lazy(() => import("./pages/PaymentStatus/StructurePaymentStatus"));
const CustomSchemaDashboard = lazy(() => import("./pages/DatabaseConnection/CustomSchemaDashboard"));
const CustomStructure = lazy(() => import("./pages/DatabaseConnection/CustomStructure"));
const DropDownSetup = lazy(() => import("./pages/Setup/DropDownSetup"));
const SheetTransfer = lazy(() => import("./pages/JSR_Services/SheetTransfer"));
const AdminHome = lazy(() => import("./pages/Admin/AdminHome"));
const SpreadsheetDemo = lazy(() => import("./pages/Profile/SpreadSheet"));
const WastageInput = lazy(() => import("./pages/CustomForms/WastageInput"));
const AssignTeamMember = lazy(() => import("./pages/CustomForms/AssignTeamMember"));
const CustomUpdateForm = lazy(() => import("./pages/CustomForms/CustomUpdateForm"));
const StatusUpdate = lazy(() => import("./pages/CustomForms/StatusUpdate"));
const AutocompleteInput = lazy(() => import("./pages/test/AutoCompletionTest"));
const CustomViewForm = lazy(() => import("./pages/CustomForms/CustomViewForm"));
const ViewBuilder = lazy(() => import("./pages/Views/ViewBuilder"));
const CreateView = lazy(() => import("./pages/Views/CreateView"));
const RLSManagement = lazy(() => import("./pages/Admin/RLSManagement"));
const RolesCreator = lazy(() => import("./pages/Roles/RolesCreator"));
const RolesAssignment = lazy(() => import("./pages/Roles/RolesAssignment"));
const CustomTable = lazy(() => import("./pages/CustomTable/CustomTableWithErrorBoundary"));

// Constants
const HIDDEN_HEADER_PATHS = [
  "/login",
  "/register",
  "/sheet",
  "/postgres",
  "/upload",
  "/reminder",
  "/admin",
  "/wastage",
  "/assign-team-member",
  "/status-update"
];

// Loading fallback component
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh' 
  }}>
    <GlobalLoading />
  </div>
);

function App() {
  const location = useLocation();

  // Memoize header visibility logic
  const shouldHideHeader = useMemo(() => {
    if (HIDDEN_HEADER_PATHS.includes(location.pathname)) {
      return true;
    }
    // Check for dynamic route pattern: /:tableName1/record with pa_id param
    if (location.pathname.endsWith('/record') && location.search.includes("pa_id=")) {
      return true;
    }
    return false;
  }, [location.pathname, location.search]);

  return (
    <>
      <Helmet>
        <title>Clicarity - Professional Workflow Solutions</title>
        <meta name="description" content="Streamline your workflow with Clicarity's comprehensive task, job, and payment management solutions" />
      </Helmet>
      
      <GlobalLoading />
      
      {!shouldHideHeader && <Header />}
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
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

          {/* Protected Routes - Home & Profile */}
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

          {/* Database Routes */}
          <Route
            path="/database"
            element={
              <ProtectedRoute>
                <DbConnection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/db/:id"
            element={
              <ProtectedRoute>
                <CustomSchemaDashboard />
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

          {/* Task Management Routes */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/bulk"
            element={
              <ProtectedRoute>
                <TaskManagementTable />
              </ProtectedRoute>
            }
          />

          {/* Job Status Routes */}
          <Route
            path="/jobstatus"
            element={
              <ProtectedRoute>
                <Job />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:tableName1/record"
            element={
              <ProtectedRoute>
                <CustomTable />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/db/:id/job_status" 
            element={
              <ProtectedRoute>
                <StructureJobStatus />
              </ProtectedRoute>
            } 
          />

          {/* Lead Status Routes */}
          <Route
            path="/leadstatus"
            element={
              <ProtectedRoute>
                <Lead />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/db/:id/lead_status" 
            element={
              <ProtectedRoute>
                <StructureLeadStatus />
              </ProtectedRoute>
            } 
          />

          {/* Payment Status Routes */}
          <Route
            path="/paymentstatus"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/db/:id/payment_status" 
            element={
              <ProtectedRoute>
                <StructurePaymentStatus />
              </ProtectedRoute>
            } 
          />

          {/* Custom Forms Routes */}
          <Route 
            path="/sheet" 
            element={
              <ProtectedRoute>
                <SheetComment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/postgres" 
            element={
              <ProtectedRoute>
                <PostgresComment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadFile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reminder" 
            element={
              <ProtectedRoute>
                <Reminder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wastage" 
            element={
              <ProtectedRoute>
                <WastageInput />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assign-team-member"
            element={
              <ProtectedRoute>
                <AssignTeamMember /> 
              </ProtectedRoute> 
            }
          />
          <Route 
            path="/custom-update" 
            element={
              <ProtectedRoute>
                <CustomUpdateForm />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/custom-view"
            element={
              <ProtectedRoute>
                <CustomViewForm />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/status-update" 
            element={
              <ProtectedRoute>
                <StatusUpdate />
              </ProtectedRoute>
            } 
          />

          {/* Setup & Service Routes */}
          <Route 
            path="/db/setup/:tableName" 
            element={
              <ProtectedRoute>
                <DropDownSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sheetTransfer/:us_id" 
            element={
              <ProtectedRoute>
                <SheetTransfer />
              </ProtectedRoute>
            } 
          />

          {/* Views Routes */}
          <Route 
            path="/views/view-builder" 
            element={
              <ProtectedRoute>
                <ViewBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/views/create-view/new" 
            element={
              <ProtectedRoute>
                <CreateView />
              </ProtectedRoute>
            } 
          />

          {/* Roles Routes */}
          <Route 
            path="/roles/create" 
            element={
              <ProtectedRoute>
                <RolesCreator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/roles/assign" 
            element={
              <ProtectedRoute>
                <RolesAssignment />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminHome />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/rls"
            element={
              <AdminProtectedRoute>
                <RLSManagement />
              </AdminProtectedRoute>
            }
          />

          {/* Test/Demo Routes */}
          <Route 
            path="/testing" 
            element={
              <ProtectedRoute>
                <Testing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/spread" 
            element={
              <ProtectedRoute>
                <SpreadsheetDemo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/autocomplete" 
            element={
              <ProtectedRoute>
                <AutocompleteInput />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;