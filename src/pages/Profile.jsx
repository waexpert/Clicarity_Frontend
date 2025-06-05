import React from 'react'
import { AiFillProduct } from "react-icons/ai";
import { IoIosContact } from "react-icons/io";
import { BsMicrosoftTeams } from "react-icons/bs";
import "../css/Profile.css"
import TeamMember from '../components/profile/TeamMember';
import RolesPermissions from '../components/profile/RolesPermissions';
import AddNewRoles from '../components/profile/AddNewRoles';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const navigate = useNavigate();
  return (
    <div>
        <div className="headerMenu">
            <button className="menu">
            <AiFillProduct />
            <p>All Products</p>
            </button>

            <button className="menu">
            <IoIosContact />
            <p>Roles and Permission</p>
            </button>

            <button className="menu" onClick={()=>navigate("/profile/teamMember")}>
            <BsMicrosoftTeams />
            <p>Team Member</p>
            </button>
        </div>

        {/* <TeamMember/> */}
        <RolesPermissions/>
        {/* <AddNewRoles/> */}
    </div>
  )
}

export default Profile