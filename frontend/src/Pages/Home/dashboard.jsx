import HomeNav from '@/components/home/HomeNav'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <div className='bg-black flex flex-col min-h-screen text-white w-full'>
    <HomeNav/>
    <Outlet/>
    </div>
  )
}

export default Dashboard
