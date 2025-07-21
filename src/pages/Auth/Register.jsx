// import React, { useState } from 'react';
// import '../css/Register.css';
// import { useDispatch } from 'react-redux';
// import {userRegistration} from '../features/userMethod/userSlice'
// import axios from 'axios';


// const Register = () => {
//   const [formData, setFormData] = useState({
//     id : "",
//     first_name : "",
//     last_name : "",
//     email : "",
//     password : "",
//     phone_number : "",
//     country : "",
//     currency : "",
//     is_verified : false,
//   });

//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Before API call", formData);

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/register`, formData);
//       const userData = res.data.user;

//       dispatch(userRegistration(userData)); // Update state with backend response

//       alert("Form submitted successfully!");
//       console.log("User after registration:", userData);
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Registration failed! Please try again.");
//     }
//   };

//   return (
//     <div className="form-wrapper">
//       <form className="form" onSubmit={handleSubmit}>
//         <img src='/Images/logo.png'/>
//         <label>
//           First Name <span>*</span>
//           <input type="text" name="first_name" placeholder="Enter first name" value={formData.first_name} onChange={handleChange} required />
//         </label>

//         <label>
//           Last Name <span>*</span>
//           <input type="text" name="last_name" placeholder="Enter last name" value={formData.last_name} onChange={handleChange} required />
//         </label>

//         <label>
//           Email <span>*</span>
//           <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
//         </label>

//         <label>
//           Password <span>*</span>
//           <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
//         </label>

//         <label>
//           Phone Number <span>*</span>
//           <div className="phone-wrapper">
//             <select className="country" disabled>
//               <option value="+91">🇮🇳 +91</option>
//             </select>
//             <input type="tel" name="phone_number" placeholder="Phone number" value={formData.phone_number} onChange={handleChange} required />
//           </div>
//         </label>

//         <label>
//           Country <span>*</span>
//           <select name="country" value={formData.country} onChange={handleChange} required>
//             <option value="">Select...</option>
//             <option value="india">India</option>
//             <option value="usa">United States</option>
//             <option value="uk">United Kingdom</option>
//           </select>
//         </label>

//         <label>
//           Currency <span>*</span>
//           <select name="currency" value={formData.currency} onChange={handleChange} required>
//             <option value="">Select...</option>
//             <option value="inr">INR</option>
//             <option value="usd">USD</option>
//             <option value="eur">EUR</option>
//           </select>
//         </label>

//         <button type="submit" className="submit-btn">Sign Up</button>

//         <p className="signin-link">Already have an account? <a href="/login">Sign In</a></p>

//         <p className="terms">
//           By signing in to this app you agree to <a href="#">Terms of Service</a> and acknowledge the <a href="#">Privacy Policy</a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userRegistration } from '../../features/userMethod/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import Sonner toast
import { toast } from "sonner";

// Import Lucide React icons
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    country: "",
    currency: "",
    is_verified: false,
    user_type: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/users/register`, formData);
      const userData = res.data.user;


      setTimeout(() => {
        console.log("About to navigate to /verify-mfa");
        navigate("/generate-secret", { replace: true });
      }, 10);

      dispatch(userRegistration(userData));

      toast.success("Registration Successful", {
        description: "Your account has been created successfully."
      });
      // navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);

      toast.error("Registration Failed", {
        description: error.response?.data?.message || "Please check your information and try again."
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
          <img src='https://clicarity.s3.eu-north-1.amazonaws.com/logo.png' alt="Clicarity Logo" className="h-38" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-[#333] font-normal text-base">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Enter first name"
              value={formData.first_name}
              onChange={handleChange}
              className="h-10 rounded px-3 py-2 border-slate-300 focus:border-[#4285B4] focus:ring-[#4285B4]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-[#333] font-normal text-base">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={handleChange}
              className="h-10 rounded px-3 py-2 border-slate-300 focus:border-[#4285B4] focus:ring-[#4285B4]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#333] font-normal text-base">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="h-10 rounded px-3 py-2 border-slate-300 focus:border-[#4285B4] focus:ring-[#4285B4]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#333] font-normal text-base">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
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

          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-[#333] font-normal text-base">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="w-[100px] flex-shrink-0">
                <Select disabled defaultValue="+91">
                  <SelectTrigger className="h-10 rounded">
                    <SelectValue placeholder="IN +91" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="Phone number"
                value={formData.phone_number}
                onChange={handleChange}
                className="h-10 rounded px-3 py-2 border-slate-300 focus:border-[#4285B4] focus:ring-[#4285B4]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-[#333] font-normal text-base">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleSelectChange("country", value)}
              required
            >
              <SelectTrigger className="h-10 rounded">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-[#333] font-normal text-base">
              Currency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => handleSelectChange("currency", value)}
              required
            >
              <SelectTrigger className="h-10 rounded">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">INR</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="align-center">
            <Checkbox
              id="subscribe"
              checked={checked}
              onCheckedChange={(val) => setChecked(!!val)}
            />
            <label htmlFor="subscribe" className="text-sm">
              SignIn as Owner
            </label>
          </div> */}

          <Button
            type="submit"
            className="w-full h-11 bg-[#4285B4] hover:bg-[#3778b4] font-medium text-white mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="text-center pt-2">
            <p className="text-[#333] text-sm">
              Already have an account? <a href="/login" className="text-[#4285B4] hover:underline font-medium">Sign In</a>
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

export default Register;