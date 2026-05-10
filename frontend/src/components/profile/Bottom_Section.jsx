import React from 'react'
import { Link } from 'react-router-dom'

const Bottom_Section = () => {
  return (
    <div className='border border-blur-[14px] border-white/20 rounded-2xl px-5 py-2.5 mt-2 flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-0 font-semibold lg:w-[145vh]  bg-[rgba(20,22,35,0.55)]'>
        <Link to="#">Terms & Condition</Link>
        <Link to="#">Privacy</Link>
        <Link to="#">Coupons</Link>
        <Link to="#">Offers</Link>
        <Link to="#">Help</Link>
        <Link to="#">Raise Complain</Link>
    </div>
  )
}

export default Bottom_Section