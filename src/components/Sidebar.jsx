import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png'

// icons //
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaMoneyBill } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoNuclearSharp } from "react-icons/io5";


const Sidebar = () => {
    const location = useLocation();

    const SideBar_Links = [
        { id: 1, path:"/teacher", name: "Dashboard", icon: IoNuclearSharp},
        { id: 2, path:"/teacher/profile", name: "Profile", icon: FaCircleUser},
        { id: 3, path:"/teacher/schedule", name: "Schedule", icon: RiCalendarScheduleFill},
        { id: 4, path:"/teacher/fee", name: "Fee", icon: FaMoneyBill},
    ]

    return (
        <div className='w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-r pt-8 px-4 bg-[#ffffff]'>
            {/* Logo */}
            <div className='flex items-center justify-around'>
                <img src={Logo} alt="logo" className='w-16'/>
                <h1 className='text-lg hidden md:flex'>TUTOR EASE</h1>
            </div>


            {/* Navigation Link */}
            <ul className='mt-6 space-y-6'>
                {SideBar_Links.map((link) => (
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

export default Sidebar