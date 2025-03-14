import React from 'react'
import AdminSidebar from './AdminSidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
     <div className='flex'>
        <AdminSidebar />
        <div className='w-full ml-16 md:ml-56'>
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout