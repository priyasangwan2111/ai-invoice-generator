import {useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";

import{ Link } from 'react-router-dom'
import {FileText,Menu,X} from 'lucide-react'
import {useAuth} from '../context/AuthContext'
import ProfileDropdown from '../layout/ProfileDropdown'
import Button from '../ui/Button'
const Header = () => {
    const [isScrolled,setIsScrolled]=useState(false);
    const [isMenuOpen,setIsMenuOpen]=useState(false);

    
    const {isAuthenticated,user,logout}=useAuth();
   
    const navigate=useNavigate();
     const[profileDropdownOpen,setProfileDropdownOpen]=useState(false)
    useEffect(()=>{
            const handleScroll=()=>{
                setIsScrolled(window.scrollY>10)
            };
            window.addEventListener('scroll',handleScroll);
            return ()=>window.removeEventListener('scroll',handleScroll);

        },[])
    
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 bg-gray-100 ${
        isScrolled ?"bg-white/95 backdrop-blur-sm shadow-lg":"bg-white/0"}`}
        >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 lg:h-28">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white"/>
                </div>
                <span className='text-xl font-bold text-gray-900'>
                    AI invoice App
                </span>
            </div>
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
                <a href="#features"className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black
                after:transition-all hover:after:w-full" >Features</a>
                
                <a href="#testimonials" className="" >Testimonials</a>   
                <a href="#faq" className="" >FAQ</a>   
                       
            </div>
            <div className='hidden lg:flex items-center space-x-4'>
                {isAuthenticated ?( 
                    <ProfileDropdown isOpen={profileDropdownOpen} onToggle={(e)=>{e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                    }}
                      avatar={user?.avatar || ""}
                      companyName={user?.name || ""}
                      email={user?.email||""}
                      onLogout={logout}></ProfileDropdown>) :(<>
                <Link to='/login' className="text-blac hover:text-gray-900 font-medium transition-colors duration-200">Login</Link>
                <Link to='/signup' className="bg-blue-900 hover:bg-blue-950 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">Sign Up
                </Link></>)}
                



            </div>
            <div className='lg-hidden'>
                <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className='p-2 rounded-lg text-grau-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200'>
                    {isMenuOpen?
                        <X className='w-6 h-6'/>
                    :
                        <Menu className='w-6 h-6'/>
                    }

                </button>
            </div>
        </div>
    
    </div>
    {isMenuOpen &&(
        <div className='lg-hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg'>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200">Features</a>
                <a href="" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200">Testimonials</a>
                <a href="" className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200">FAQ</a>
                <div className="border-t border-gray-200 my-2"></div>
                {isAuthenticated ?(<div className="p-4">
                    <Button onClick={()=>Navigate('/dashboard')} className='w-full'>Go to Dashboard

                    </Button>
                </div>):(<>
                <Link to="/login" className='block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200'>Login</Link>
                <Link to="/signup" className='block w-full text-left bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200'>Sign Up</Link>
                </>
                )

                    }
            </div>
        </div>
    )}
   </header>
  )
}

export default Header