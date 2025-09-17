import React from 'react'
import { GoHome } from "react-icons/go";
import "../css/Header.css"
import LogoutButton from './Logout';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// shadcn part
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// User Profile Card Component
import UserProfileCard from './UserProfileCard';

const Header = () => {
    const navigate = useNavigate();
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

      const location = useLocation();
  const path = location.pathname; // '/verify-mfa'

  // Extract the last part after '/'
  const page = path.split('/').filter(Boolean).pop();


    return (
        <div className='headerWrapper'>
            <div className="header1">
                <div className="logo">
                    <img src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" alt="logo" className='logo' />
                </div>
                <div className="menus">
                    <LogoutButton />
                    
                    {/* Profile Dropdown - Fixed positioning */}
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button className="cursor-pointer border-0 bg-transparent p-0 focus:outline-none">
                                <Avatar className="hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-200">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                        {getUserInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                            align="end" 
                            side="bottom"
                            className="w-auto p-0 shadow-xl border-0 z-50"
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
            
            { page == "verify-mfa" || page == "generate-secret" ? "":(
            <div className="breadcrumb-container">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={"/"}>Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={"/profile"}>Profile</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
)}
        </div>
    )
}

export default Header