import React from 'react'
import { GoHome } from "react-icons/go";
import "../css/Header.css"

const Header = () => {
  return (
    <div className='headerWrapper'>
        <div className="header1">
            <div className="logo">
                <img src="/Images/logo.png" alt="logo" className='logo'/>
            </div>
            <div className="menus">
                <div className="profile">
              
                </div>
            </div>
        </div>
        <div className="header2">
            <div className="option">
            <GoHome />
            <p>Home</p>
            </div>

        </div>
    </div>
  )
}

export default Header