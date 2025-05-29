// import React, { useState } from 'react';
// import '../css/Login.css';
// import { userLogin } from '../features/userMethod/userSlice';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [recaptchaChecked, setRecaptchaChecked] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   const dispatch = useDispatch();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Before API call", email,password);

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/login`, {email,password});
//       const userData = res.data.user;

//       dispatch(userLogin(userData)); // Update state with backend response

//       alert("Form submitted successfully!");
//       console.log("User after registration:", userData);
//       navigate("/verify-mfa")
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Registration failed! Please try again.");
//     }
//   };

//   return (
//     <div className="login-container">
    

//       <form className="login-form" onSubmit={handleSubmit}>
//       <img src='/Images/logo.png'/>
//         <label>
//           Email
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>

//         <label className="password-label">
//           Password
//           <div className="password-field">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <span
//               className="toggle-password"
//               onClick={() => setShowPassword(!showPassword)}
//               title="Toggle Password"
//             >
//               👁️
//             </span>
//             <a href="#" className="forgot-password">Forgot password?</a>
//           </div>
//         </label>

//         {/* <label className="recaptcha-box">
//           <input
//             type="checkbox"
//             checked={recaptchaChecked}
//             onChange={(e) => setRecaptchaChecked(e.target.checked)}
//           />
//           <span>I'm not a robot</span>
//           <div className="recaptcha-img">reCAPTCHA</div>
//         </label> */}

//         <button type="submit" className="signin-btn">Sign In</button>

//         <p className="bottom-text">
//           Don’t have an account ? <a href="/register">Signup</a>
//         </p>

//         <p className="terms">
//           By signing in to this app you agree to <a href="#">Terms of Service</a> and
//           acknowledge the <a href="#">Privacy Policy</a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { userLogin } from '../features/userMethod/userSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Shadcn UI components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import Sonner toast
import { toast } from "sonner";

// Import Lucide React icons
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/login`, { email, password });
      const userData = res.data.user;

      dispatch(userLogin(userData));
      
      toast.success("Login Successful", {
        description: "You have been signed in successfully."
      });
      
      navigate("/verify-mfa");
    } catch (error) {
      console.error("Login failed:", error);
      
      toast.error("Login Failed", {
        description: error.response?.data?.message || "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-[400px] mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src='/Images/logo.png' alt="Clicarity Logo" className="h-38" />
        
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#333] font-normal text-base">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded px-3 py-2 border-slate-300 focus:border-[#4285B4] focus:ring-[#4285B4]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#333] font-normal text-base">Password</Label>
              <a 
                href="#" 
                className="text-sm text-[#4285B4] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded px-3 py-2 border-slate-300 focus:border-[#4285B4] focus:ring-[#4285B4]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-[#4285B4] hover:bg-[#3778b4] font-medium text-white mt-6"
            disabled={isLoading}
          >
            Sign In
          </Button>
          
          <div className="text-center pt-2">
            <p className="text-[#333] text-sm">
              Don't have an account? <a href="/register" className="text-[#4285B4] hover:underline font-medium">Signup</a>
            </p>
          </div>
          
          <div className="text-center text-xs text-[#666] mt-4">
            By signing in to this app you agree to 
            <a href="#" className="text-[#4285B4] hover:underline"> Terms of Service </a> 
            and acknowledge the 
            <a href="#" className="text-[#4285B4] hover:underline"> Privacy Policy</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;