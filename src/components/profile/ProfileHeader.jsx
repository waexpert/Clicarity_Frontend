import React from 'react'
import { AiFillProduct } from "react-icons/ai";
import { IoIosContact } from "react-icons/io";
import { BsMicrosoftTeams } from "react-icons/bs";
import "../../css/Profile.css"
import { useNavigate } from 'react-router-dom';

const ProfileHeader = () => {

  const navigate = useNavigate();
  return (
    <div>
        <div className="headerMenu">
            <button className="menu" onClick={()=> navigate("/")}>
            <AiFillProduct />
            <p>All Products</p>
            </button>

            <button className="menu" onClick={()=> navigate("/profile/permissions")}>
            <IoIosContact />
            <p>Roles and Permission</p>
            </button>

            <button className="menu" onClick={()=>navigate("/profile/teamMember")}>
            <BsMicrosoftTeams />
            <p>Team Member</p>
            </button>
        </div>
    </div>
  )
}

export default ProfileHeader