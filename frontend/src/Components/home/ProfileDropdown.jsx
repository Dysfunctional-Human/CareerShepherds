import { DropdownMenu,DropdownMenuItem,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuShortcut ,DropdownMenuSeparator} from '@/components/ui/dropdown-menu'

import { User,LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import React from 'react'
import { Button } from '../ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'
function ProfileDropdown() {
    const navigate = useNavigate();
    const handleLogout = () => {
        axios.post('/api/auth/logout')
        .then((res) => {
            console.log(res);
            toast.success('Logged out successfully');
            navigate('/login');
        })
        .catch((err) => {
            console.log(err);
            toast.error(`Failed to logout: ${err.message}`);
        })
    }

  return (
    <DropdownMenu className='mt-2'>
        <DropdownMenuTrigger asChild>
            <User size={18}  strokeWidth={1}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-24'>
      <Link to='/onboarding/upload'>
      <DropdownMenuItem>
        Profile
      </DropdownMenuItem>
      </Link>
      <DropdownMenuSeparator />
        <DropdownMenuItem className='text-red-500' onClick={handleLogout} >
            Log out<LogOut size={18}  strokeWidth={1} />
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

  )
}

export default ProfileDropdown
