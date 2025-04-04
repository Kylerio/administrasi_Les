import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../assets/Logo.png'

// icons //
import { PiChalkboardFill } from "react-icons/pi"
import { PiUserListFill } from "react-icons/pi"
import { RiFileList3Fill } from "react-icons/ri";

const AdminSidebar = () => {
    const location = useLocation();

    const AdminSideBar_Links = [
        { id: 1, path:"/admin", name: "Create Session", icon: PiChalkboardFill},
        { id: 2, path:"/admin/viewDataTeacher", name: "View Data Teacher", icon: PiUserListFill},
        { id: 3, path:"/admin/viewListFee", name: "View List Fee", icon: RiFileList3Fill},
    ]
  return (
    <div className='w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-[#ffffff]'>
            {/* Logo */}
            <div className='flex items-center justify-around'>
                <img src={Logo} alt="logo" className='w-16'/>
                <h1 className='text-lg hidden md:flex'>TUTOR EASE ADMIN</h1>
            </div>


            {/* Navigation Link */}
            <ul className='mt-6 space-y-6'>
                {AdminSideBar_Links.map((link) => (
                    <li key={link.id} className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500 ${location.pathname === link.path ? "bg-indigo-100 text-indigo-500": ""}`}>
                        <Link to={link.path} className='flex justify-center md:justify-start items-center md:space-x-5'>
                            {link.icon && <span>{React.createElement(link.icon)}</span>}
                            <span className='text-sm text-gray-500 hidden md:flex'>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
  )
}

export default AdminSidebar