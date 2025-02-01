
  import React, { useState } from 'react'
  import { Link, NavLink } from 'react-router-dom'

  import {Menu,X} from 'lucide-react'
  import logo from '@/assets/logo.png'
import { cn } from '@/lib/utils'
import ProfileDropdown from './ProfileDropdown'
  function HomeNav() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
      setIsOpen(!isOpen)
    }

    return (
      <nav
        className="w-full absolute top-0 left-1/2 font-lg transform -translate-x-1/2 font-thin flex justify-between items-center h-12 text-white shadow-sm p-10  border-b border-zinc-800"
        role="navigation"
      >
        <Link to='/app'>
          <div className="flex items-center">
            <img src={logo} className='h-9 w-9' alt="Logo" />
            <div className="font-thin text-lg">CareerShepherds</div>
          </div>
        </Link>

        <div className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`md:flex space-x-10 ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-5 md:p-0`}>
          <NavLink to='/app/chat' className={({isActive, isPending})=>cn("m-0 p-0",!isActive?"text-zinc-100/80":"text-white")}>
            Chat
          </NavLink>
          <NavLink to='/app/checker' className={({isActive, isPending})=>cn("m-0 p-0",!isActive?"text-zinc-100/80":"text-white")}>
            Resume Checker
          </NavLink >
          <NavLink to='/app/flashcards' className={({isActive, isPending})=>cn("m-0 p-0",!isActive?"text-zinc-100/80":"text-white")}>
            FlashCards
          </NavLink>
          <NavLink to='/app/recommendations' className={({isActive, isPending})=>cn("m-0 p-0",!isActive?"text-zinc-100/80":"text-white")}>
            Recommendations
          </NavLink >
          <ProfileDropdown/>
        </div>
      </nav>
    )
  }


export default HomeNav
