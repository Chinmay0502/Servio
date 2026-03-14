import React from 'react'
import Admin_Header from '../../components/admin/Admin_Header'
import Request_Section from '../../components/admin/Request_Section'

const Admin_Dashboard = () => {
  return (
    <div className='px-12 mt-5 flex'>
        <Admin_Header/>
        <Request_Section/>
    </div>
  )
}

export default Admin_Dashboard