import React from 'react'
import { GoHome } from "react-icons/go";
import "../css/Header.css"
import LogoutButton from './Logout';
import { Link, useNavigate } from 'react-router-dom';

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

//   

const Header = () => {

    const navigate = useNavigate();
    return (
        <div className='headerWrapper'>
            <div className="header1">
                <div className="logo">
                    <img src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" alt="logo" className='logo' />
                </div>
                <div className="menus">
                    <LogoutButton />
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            {/* <div className="header2">
            <div className="option">
            <GoHome />
            <p>Home</p>
            </div>
        </div> */}

            <div className="">
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
        </div>
    )
}

export default Header