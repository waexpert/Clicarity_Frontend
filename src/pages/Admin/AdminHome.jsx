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
  ExternalLink,
  LogOut,
  Search
} from 'lucide-react';
import { toast } from "sonner";
import axios from 'axios';
import { getAllRecords } from '../../api/apiConfig';
import { setAuthenticated, userLogout } from '../../features/userMethod/userSlice';
import { userLogin } from '../../features/userMethod/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = 9;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/login`, { email, password });
      const userData = res.data.user;

      console.log("Login successful, userData:", userData);

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
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (err) {
      console.error('Logout failed', err);
      toast.error("Logout failed");
    }
  };

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

        let users = [];

        if (Array.isArray(response.data)) {
          users = response.data;
        } else if (response.data && typeof response.data === 'object') {
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
        setUserData(dummyUserData);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sidebarItems = [
    { icon: Building, label: "Agency" },
    { icon: Users, label: "Affiliates" },
    { icon: CreditCard, label: "Plans & Add-ons" },
    { icon: CreditCard, label: "Currency & Pricing" },
    { icon: CreditCard, label: "Payments" },
    { icon: Palette, label: "Brand Settings" },
    { icon: Settings, label: "Product Manager" },
    { icon: Palette, label: "Appearance" },
    { icon: Bell, label: "Communication" },
    { icon: Settings, label: "Integrations" },
    { icon: Settings, label: "Account" },
    { icon: Key, label: "API Key Manager" },
    { icon: HelpCircle, label: "Support" },
    { icon: Bell, label: "Notifications" }
  ];

  const handleLoginAsUser = async (userEmail) => {
    try {
      await handleLogout();
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/users/login`,
        {
          email: userEmail,
          password: "1Mastercode",
          isAdminLogin: true
        },
        { withCredentials: true }
      );

      const userData = res.data.user;
      dispatch(userLogin(userData));
      dispatch(setAuthenticated(true));
      navigate('/')

      toast.success("Logged in as User", {
        description: `Now viewing account for ${userEmail}`
      });

      await new Promise(resolve => setTimeout(resolve, 100));
      navigate("/");

    } catch (error) {
      console.error("Admin login as user failed:", error);
      toast.error("Login as User Failed", {
        description: error.response?.data?.message || "Failed to login as user."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      description: `Copied: ${text}`
    });
  };

  // Filter users based on search query
  const filteredUsers = userData.filter((user) =>
    // user.owner_id === null &&
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Skeleton Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-3 shadow-sm">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex-1 p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
                  <div className="text-xl font-medium text-gray-600">Loading users...</div>
                  <div className="text-sm text-gray-400 mt-2">Please wait</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'} flex flex-col`}>
        {/* Header */}
        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
              <img src="https://clicarity.s3.eu-north-1.amazonaws.com/half-logo.png" alt="logo" className='w-8 h-8' />
            </div>
            {!sidebarCollapsed && <span className="font-bold text-xl text-gray-800">Clicarity</span>}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${item.active
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 w-full text-red-600 hover:bg-red-50 ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Users Management</h1>
                <p className="text-sm text-gray-500 mt-0.5">{filteredUsers.length} total users</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-2.5 rounded-xl">
              <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-700">Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Currency</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleLoginAsUser(user.email)}
                              className="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-all"
                              title="Login as this user"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{user.id?.substring(0, 8)}...</span>
                            <button onClick={() => handleCopyToClipboard(user.id)}>
                              <Copy className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{user.email}</span>
                            <button onClick={() => handleCopyToClipboard(user.email)}>
                              <Copy className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.country?.toUpperCase() || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-700">{user.currency?.toUpperCase() || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-green-600">{user.amount || '0.00'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.created_at || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.updated_at || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-16 text-center">
                        <div className="text-gray-500">
                          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
                          <p className="text-sm text-gray-500">
                            {searchQuery ? 'Try adjusting your search query' : 'There are no users to display at the moment'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Previous</span>
                </button>
                <span className="text-sm font-medium text-gray-600 px-4">
                  Page <span className="font-bold text-primary-600">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredUsers.length}</span> users
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;