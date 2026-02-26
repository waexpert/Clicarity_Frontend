// Header version1 :- with profile and breadcrumbs
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


// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import "../../css/Header.css";
// import LogoutButton from './Logout';
// import { Menu,Settings2  } from 'lucide-react';

// // shadcn components
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// import UserProfileCard from '../../pages/Profile/UserProfileCard';
// import Menus from '../../pages/Dashboard/components/Menus';
// import MobileMenu from '../../pages/Dashboard/components/MobileMenu';


// const Header = () => {
//     const location = useLocation();
//     const userData = useSelector((state) => state.user);
//     const [openMenu,setOpenMenu] = useState(false);

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

//     // Extract the last part of the path
//     const currentPage = location.pathname.split('/').filter(Boolean).pop();

//     // Check if breadcrumb should be hidden
//     const shouldHideBreadcrumb = currentPage === "verify-mfa" || currentPage === "generate-secret";

//     return (
//         <div className='header-wrapper h-[8rem]'>
//             <div className="header-top">
//                 <Link to="/" className="header-logo">
//                     <img 
//                         src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" 
//                         alt="Clicarity Logo" 
//                         className='logo-image' 
//                     />
//                 </Link>

//                 <div className="header-actions !hidden sm:block">
//                     <LogoutButton className="" />

//                     <DropdownMenu modal={false}>
//                         <DropdownMenuTrigger asChild>
//                             <button 
//                                 className="avatar-button"
//                                 aria-label="User profile menu"
//                             >
//                                 <Avatar className="avatar-image">
//                                     <AvatarImage 
//                                         src="https://lakshysharma.netlify.app/assets/favicon_portfolio-Bjs1LOnZ.png" 
//                                         alt={`${userData?.first_name || 'User'} avatar`}
//                                     />
//                                     <AvatarFallback className="avatar-fallback">
//                                         {getUserInitials()}
//                                     </AvatarFallback>
//                                 </Avatar>
//                             </button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent 
//                             align="end" 
//                             side="bottom"
//                             className="profile-dropdown"
//                             sideOffset={8}
//                             alignOffset={0}
//                             avoidCollisions={true}
//                             sticky="always"
//                         >
//                             <UserProfileCard />
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>

//                 <button onClick={()=> setOpenMenu(!openMenu)}>
//                     <Settings2  />
//                 </button>

//             </div>
//             <div className="!hidden md:block">
//             <Menus className=""/>
//             </div>

//             {/* {!shouldHideBreadcrumb && (
//                 <nav className="breadcrumb-navigation" aria-label="Breadcrumb">
//                     <Breadcrumb>
//                         <BreadcrumbList>
//                             <BreadcrumbItem>
//                                 <BreadcrumbLink asChild>
//                                     <Link to="/">Home</Link>
//                                 </BreadcrumbLink>
//                             </BreadcrumbItem>
//                             <BreadcrumbSeparator />
//                             <BreadcrumbItem>
//                                 <BreadcrumbLink asChild>
//                                     <Link to="/profile">Profile</Link>
//                                 </BreadcrumbLink>
//                             </BreadcrumbItem>
//                         </BreadcrumbList>
//                     </Breadcrumb>
//                 </nav>
//             )} */}

//           {  openMenu && <MobileMenu/>

//         }
//         </div>
//     );
// };

// export default Header;


import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../../css/Header.css";
import LogoutButton from './Logout';
import { Settings2 } from 'lucide-react';

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
import Menus from '../../pages/Dashboard/components/Menus';
import MobileMenu from '../../pages/Dashboard/components/MobileMenu';


const Header = () => {
    const location = useLocation();
    const userData = useSelector((state) => state.user);
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside.
    // Portal menus (DropMenu, SubMenu) render into document.body so they are
    // outside menuRef — we must NOT close when clicks land inside them.
    useEffect(() => {
        if (!openMenu) return;
        const handler = (e) => {
            // Inside sidebar wrapper → keep open
            if (menuRef.current && menuRef.current.contains(e.target)) return;
            // Inside any portaled dropdown → keep open
            if (e.target.closest('[data-mobile-portal]')) return;
            setOpenMenu(false);
        };
        // Use pointerup instead of mousedown so the click on menu items
        // fully registers BEFORE we close the menu (critical on Android)
        document.addEventListener("pointerup", handler);
        return () => document.removeEventListener("pointerup", handler);
    }, [openMenu]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (openMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [openMenu]);

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

    const currentPage = location.pathname.split('/').filter(Boolean).pop();
    const shouldHideBreadcrumb = currentPage === "verify-mfa" || currentPage === "generate-secret";

    return (
        // ← position: relative so MobileMenu (absolute) anchors here
        <div className='header-wrapper h-[8rem] ' style={{ position: 'relative' }}>
            <div className="header-top">
                <Link to="/" className="header-logo">
                    <img
                        src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                        alt="Clicarity Logo"
                        className='logo-image'
                    />
                </Link>

                <div className="header-actions hidden md:flex">
                    <LogoutButton />
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button className="avatar-button" aria-label="User profile menu">
                                <Avatar className="avatar-image">
                                    <AvatarImage
                                        src="https://lakshysharma.netlify.app/assets/favicon_portfolio-Bjs1LOnZ.png"
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

                {/* Mobile: show avatar + settings toggle */}
                <div className="flex md:hidden items-center gap-2">

                                        <button
                        className="p-1 rounded hover:bg-gray-100 transition"
                        onClick={() => setOpenMenu(!openMenu)}
                        aria-label="Toggle menu"
                    >
                        <Settings2 size={20} />
                    </button>

                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button className="avatar-button" aria-label="User profile menu">
                                <Avatar className="avatar-image">
                                    <AvatarImage
                                        src="https://lakshysharma.netlify.app/assets/favicon_portfolio-Bjs1LOnZ.png"
                                        alt={`${userData?.first_name || 'User'} avatar`}
                                    />
                                    <AvatarFallback className="avatar-fallback">
                                        {getUserInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom" className="profile-dropdown"
                            sideOffset={8} avoidCollisions sticky="always">
                            <UserProfileCard />
                        </DropdownMenuContent>
                    </DropdownMenu>


                </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:block">
                <Menus />
            </div>

            {/* Mobile menu — overlays below the header, not behind content */}
            {openMenu && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',   /* fixed so it sits above everything */
                        top: 64,
                        left: 0,
                        height: '100vh',
                        zIndex: 9999,
                        marginLeft: 10
                        // boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
                    }}
                >
                    <MobileMenu onClose={() => setOpenMenu(!openMenu)} />
                </div>
            )}
        </div>
    );
};

export default Header;


// Glad it's working! Here's the full breakdown:

// ---

// ## The Problem — Android Touch Event Order

// On Chrome Android, when you tap something, the browser fires events in this exact sequence:

// ```
// touchstart → mousedown → touchend → mouseup → click
// ```

// The key thing to understand is that **`click` fires last** — after `mousedown`.

// ---

// ## What Was Going Wrong

// You had an **outside-click handler** on `document` using `mousedown` to close the menu when tapping outside. The logic was:

// > "If the tap lands outside the sidebar or portal menu → close it"

// But here's what actually happened on Android when you tapped a menu item:

// ```
// 1. touchstart fires   → nothing closes yet
// 2. mousedown fires    → ⚠️ outside-click handler runs
//                         → item IS inside portal, so menu stays open...
//                         → BUT on Android, portal DOM timing is unreliable
//                         → handler closes the menu anyway
// 3. Menu unmounts      → DropItem component is destroyed
// 4. click fires        → ❌ nothing there to click anymore
// 5. Navigation never happens
// ```

// The menu item was being **destroyed before the click could register**.

// ---

// ## Why It Worked in an Empty Page

// In an empty page there was no outside-click handler at all — so `mousedown` didn't close anything, `click` fired normally, and navigation worked fine. The `Header.jsx` outside-click handler was the only thing causing it.

// ---

// ## The Fix — `pointerup` instead of `mousedown`

// `pointerup` fires **after** `mouseup`, just before or alongside `click`:

// ```
// touchstart → mousedown → touchend → mouseup → pointerup → click
// ```

// So the corrected sequence became:

// ```
// 1. touchstart fires   → nothing
// 2. mousedown fires    → nothing (no longer listening here)
// 3. touchend fires     → nothing
// 4. mouseup fires      → nothing
// 5. click fires        → ✅ DropItem click handler runs → navigation happens
// 6. pointerup fires    → outside-click handler runs → menu closes cleanly
// ```

// Navigation completes **before** the menu closes. Problem solved.

// ---

// ## One Line Summary

// > `mousedown` was closing the menu before `click` could fire on Android. Switching to `pointerup` lets the click complete first, then closes the menu.

// ---
// *📅 Thursday, February 26, 2026 — IST (Mumbai)*