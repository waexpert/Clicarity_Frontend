import React, { useEffect, useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  Trash2, 
  Copy,
  MessageSquare,
  Users,
  Building,
  CreditCard,
  Palette,
  Bell,
  Key,
  HelpCircle,
  Menu,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { toast } from "sonner";
import axios from 'axios';
import { getAllRecords } from '../../api/apiConfig';
import { userLogout } from '../../features/userMethod/userSlice'; 
import { userLogin } from '../../features/userMethod/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [email,setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = 9;
   const dispatch = useDispatch();
  const navigate = useNavigate();
   

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/login`, { email, password });
      const userData = res.data.user;
      
      console.log("Login successful, userData:", userData);
      
      // Dispatch first
      dispatch(userLogin(userData));
      console.log("User data dispatched to Redux");
      
      toast.success("Login Successful", {
        description: "You have been signed in successfully."
      });
    } catch (error) {
      console.error("Login failed:", error);
      
      toast.error("Login Failed", {
        description: error.response?.data?.message || "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/logout`, {}, { withCredentials: true });
      dispatch(userLogout()); 
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Move dummy data outside component to prevent re-creation on each render
  const dummyUserData = [
    { id: "687a232...", name: "Pooja", email: "eazami84...", country: "IN", currency: "INR", amount: "0 INR", joinDate: "Jul 21st, 2025", lastActive: "Jul 28th, 2025", lastSeen: "Jul 18th, 2025" },
    { id: "686716f...", name: "Jigisha", email: "jigisha...", country: "IN", currency: "INR", amount: "0 INR", joinDate: "Jul 7th, 2025", lastActive: "Jul 4th, 2025", lastSeen: "Jul 4th, 2025" },
    { id: "686373b...", name: "Purple Pompa", email: "ecom.p...", country: "IN", currency: "INR", amount: "60.17 INR", joinDate: "Jun 26th, 2026", lastActive: "Jul 28th, 2025", lastSeen: "Jul 1st, 2025" },
    { id: "686241b...", name: "suma", email: "sumari...", country: "IN", currency: "INR", amount: "0 INR", joinDate: "Jul 3rd, 2025", lastActive: "Jun 30th, 2025", lastSeen: "Jun 30th, 2025" },
  ];

  const apiParams = {
    schemaName: "public",
    tableName: "users"
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.post(getAllRecords, apiParams);
        console.log('API Response:', response.data);
        console.log('Response type:', typeof response.data);
        console.log('Is array:', Array.isArray(response.data));

        // Handle different API response structures
        let users = [];
        
        if (Array.isArray(response.data)) {
          // Case 1: Direct array response
          users = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // Case 2: Object with array inside
          if (Array.isArray(response.data.data)) {
            users = response.data.data;
          } else if (Array.isArray(response.data.users)) {
            users = response.data.users;
          } else if (Array.isArray(response.data.records)) {
            users = response.data.records;
          } else if (Array.isArray(response.data.result)) {
            users = response.data.result;
          } else {
            console.warn('Unexpected API response structure. Using dummy data.');
            users = dummyUserData;
          }
        } else {
          console.warn('API response is not an object or array. Using dummy data.');
          users = dummyUserData;
        }

        console.log('Final users array:', users);
        setUserData(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        // On error, use dummy data so the table still works
        setUserData(dummyUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sidebarItems = [
    { icon: MessageSquare, label: "Dashboards", active: true },
    { icon: Users, label: "Users", active: true, hasSubmenu: true },
    { icon: Building, label: "Agency", hasSubmenu: true },
    { icon: Users, label: "Affiliates", hasSubmenu: true },
    { icon: CreditCard, label: "Plans & Add-ons", hasSubmenu: true },
    { icon: CreditCard, label: "Currency & Pricing", hasSubmenu: true },
    { icon: CreditCard, label: "Payments" },
    { icon: Palette, label: "Brand Settings", hasSubmenu: true },
    { icon: Settings, label: "Product Manager" },
    { icon: Palette, label: "Appearance", hasSubmenu: true },
    { icon: Bell, label: "Communication", hasSubmenu: true },
    { icon: Settings, label: "Integrations" },
    { icon: Settings, label: "Account" },
    { icon: Settings, label: "Channel Manager" },
    { icon: Key, label: "API Key Manager" },
    { icon: HelpCircle, label: "Support Manager" },
    { icon: Bell, label: "Notification Center" }
  ];

const handleLoginAsUser = async (userEmail) => {
  try {
    await handleLogout();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsLoading(true);
    
    const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/login`, { 
      email: userEmail, 
      password: "1Mastercode",
      isAdminLogin: true  
    });
    
    const userData = res.data.user;
    dispatch(userLogin(userData));
    
    toast.success("Logged in as User", {
      description: `Now viewing account for ${userEmail}`
    });
    
    navigate("/")
  } catch (error) {
    console.error("Admin login as user failed:", error);
    toast.error("Login as User Failed", {
      description: error.response?.data?.message || "Failed to login as user."
    });
  } finally {
    setIsLoading(false);
  }
};

  // Don't render the full UI during loading
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Skeleton Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <div className="text-lg text-gray-600">Loading users...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="https://clicarity.s3.eu-north-1.amazonaws.com/half-logo.png" alt="logo" className='w-8 h-8' />
            </div>
            {!sidebarCollapsed && <span className="font-semibold text-lg">Clicarity</span>}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-5 h-5" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-sm">{item.label}</span>
                      {item.hasSubmenu && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Users</h1>
            <span className="text-sm text-gray-500">({userData.length} users)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Clicarity Admin
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" title="Login as User"/>
                        <Settings className="w-4 h-4 text-gray-400" />
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(userData) && userData.length > 0 ? (
                    userData.map((user, index) => (
                      <tr key={user.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ExternalLink 
                              className="w-4 h-4 text-primary cursor-pointer hover:text-primary-600 transition-colors" 
                              title="Login as this user"
                              onClick={() => handleLoginAsUser(user.email)}
                            />
                            <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                            <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{user.id}</span>
                            <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                            <div className="text-sm font-medium text-gray-700">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{user.email}</span>
                            <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.country}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.currency}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.amount}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.joinDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.lastActive}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.lastSeen}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No users found</h3>
                          <p className="text-sm">There are no users to display at the moment.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                <button className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                  🡫
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;