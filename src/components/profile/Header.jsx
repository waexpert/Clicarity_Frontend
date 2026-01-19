// import React from 'react'
// import { GoHome } from "react-icons/go";
// import "../css/Header.css"
// import LogoutButton from './Logout';
// import { Link, useNavigate,useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// // shadcn part
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// // User Profile Card Component
// import UserProfileCard from '../pages/Profile/UserProfileCard';

// const Header = () => {
//     const navigate = useNavigate();
//     const userData = useSelector((state) => state.user);

//     // Get user initials for avatar fallback
//     const getUserInitials = () => {
//         if (userData?.first_name && userData?.last_name) {
//             return userData.first_name.charAt(0) + userData.last_name.charAt(0);
//         } else if (userData?.first_name) {
//             return userData.first_name.charAt(0);
//         } else if (userData?.email) {
//             return userData.email.charAt(0).toUpperCase();
//         }
//         return "U";
//     };

//       const location = useLocation();
//   const path = location.pathname; // '/verify-mfa'

//   // Extract the last part after '/'
//   const page = path.split('/').filter(Boolean).pop();


//     return (
//         <div className='headerWrapper'>
//             <div className="header1">
//                 <div className="logo">
//                     <img src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" alt="logo" className='logo' />
//                 </div>
//                 <div className="menus">
//                     <LogoutButton />
                    
//                     {/* Profile Dropdown - Fixed positioning */}
//                     <DropdownMenu modal={false}>
//                         <DropdownMenuTrigger asChild>
//                             <button className="cursor-pointer border-0 bg-transparent p-0 focus:outline-none">
//                                 <Avatar className="hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200">
//                                     <AvatarImage src="https://github.com/shadcn.png" />
//                                     <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
//                                         {getUserInitials()}
//                                     </AvatarFallback>
//                                 </Avatar>
//                             </button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent 
//                             align="end" 
//                             side="bottom"
//                             className="w-auto p-0 shadow-xl border-0 z-50"
//                             sideOffset={8}
//                             alignOffset={0}
//                             avoidCollisions={true}
//                             sticky="always"
//                         >
//                             <UserProfileCard />
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </div>
            
//             { page == "verify-mfa" || page == "generate-secret" ? "":(
//             <div className="breadcrumb-container">
//                 <Breadcrumb>
//                     <BreadcrumbList>
//                         <BreadcrumbItem>
//                             <BreadcrumbLink asChild>
//                                 <Link to={"/"}>Home</Link>
//                             </BreadcrumbLink>
//                         </BreadcrumbItem>
//                         <BreadcrumbSeparator />
//                         <BreadcrumbItem>
//                             <BreadcrumbLink asChild>
//                                 <Link to={"/profile"}>Profile</Link>
//                             </BreadcrumbLink>
//                         </BreadcrumbItem>
//                     </BreadcrumbList>
//                 </Breadcrumb>
//             </div>
// )}
//         </div>
//     )
// }

// export default Header


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../../css/Header.css";
import LogoutButton from './Logout';

// shadcn components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import UserProfileCard from '../../pages/Profile/UserProfileCard';

const Header = () => {
    const location = useLocation();
    const userData = useSelector((state) => state.user);

    // Get user initials for avatar fallback
    const getUserInitials = () => {
        if (userData?.first_name && userData?.last_name) {
            return userData.first_name.charAt(0) + userData.last_name.charAt(0);
        } else if (userData?.first_name) {
            return userData.first_name.charAt(0);
        } else if (userData?.email) {
            return userData.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    // Extract the last part of the path
    const currentPage = location.pathname.split('/').filter(Boolean).pop();
    
    // Check if breadcrumb should be hidden
    const shouldHideBreadcrumb = currentPage === "verify-mfa" || currentPage === "generate-secret";

    return (
        <div className='header-wrapper'>
            <div className="header-top">
                <Link to="/" className="header-logo">
                    <img 
                        src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" 
                        alt="Clicarity Logo" 
                        className='logo-image' 
                    />
                </Link>
                
                <div className="header-actions">
                    <LogoutButton />
                    
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button 
                                className="avatar-button"
                                aria-label="User profile menu"
                            >
                                <Avatar className="avatar-image">
                                    <AvatarImage 
                                        src="https://github.com/shadcn.png" 
                                        alt={`${userData?.first_name || 'User'} avatar`}
                                    />
                                    <AvatarFallback className="avatar-fallback">
                                        {getUserInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="end" 
                            side="bottom"
                            className="profile-dropdown"
                            sideOffset={8}
                            alignOffset={0}
                            avoidCollisions={true}
                            sticky="always"
                        >
                            <UserProfileCard />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            {!shouldHideBreadcrumb && (
                <nav className="breadcrumb-navigation" aria-label="Breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/">Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/profile">Profile</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </nav>
            )}
        </div>
    );
};

export default Header;