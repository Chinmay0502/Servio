import React from 'react'
import Order_Card from './Order_Card'

const Previous_Order = () => {
  return (
    <div className='rounded-2xl shadow-xl transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 p-5 lg:w-[67rem]'>
      <h2 className='text-highlight font-bold text-xl'>Orders History :-</h2>
      <div className='mt-5 flex flex-col lg:flex-row gap-3 lg:gap-5'>
        <Order_Card/>
        <Order_Card/>
        <Order_Card/>
        <Order_Card/>
      </div>
    </div>
  )
}

export default Previous_Order