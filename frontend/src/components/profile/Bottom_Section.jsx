import React from 'react'
import { Link } from 'react-router-dom'

const Bottom_Section = () => {
  return (
    <div className='border border-blur-[14px] border-white/20 rounded-2xl px-5 py-2.5 mt-2 flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-0 font-semibold'>
        <Link>Terms & Condition</Link>
        <Link>Privacy</Link>
        <Link>Coupons</Link>
        <Link>Offers</Link>
        <Link>Help</Link>
        <Link>Raise Complain</Link>
    </div>
  )
}

export default Bottom_Section