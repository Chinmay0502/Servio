import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = ({openNav, setOpenNav}) => {
  return (
    <div className={`${openNav ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[60%] flex-col justify-between px-8 pb-6 pt-50 font-bold lg:hidden rounded-br-2xl rounded-tr-2xl shadow-xl shadow-[#4724ab] transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 text-xl`}>
        <div>
            <div className='flex justify-start items-center gap-10'>
                <nav>
                    <ul className='flex flex-col gap-10'>
                    <NavLink onClick={()=>setOpenNav(false)} to={"/"} className={({isActive}) => `${isActive ? "pb-1 border-b-4 border-primary transition-all" : "text-white"}cursor-pointer`}>Home</NavLink>
                    <NavLink onClick={()=>setOpenNav(false)} to={"/services"} className={({isActive}) => `${isActive ? "pb-1 border-b-4 border-primary transition-all" : "text-white"} cursor-pointer`}>All Services</NavLink>
                    <NavLink onClick={()=>setOpenNav(false)} to={"contact"} className={({isActive}) => `${isActive ? "pb-1 border-b-4 border-primary transition-all" : "text-white"} cursor-pointer`}>Contact Us</NavLink>
                    <NavLink onClick={()=>setOpenNav(false)} to={"/about"} className={({isActive}) => `${isActive ? "pb-1 border-b-4 border-primary transition-all" : "text-white"} cursor-pointer`}>About Us</NavLink>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
  )
}

export default SideBar