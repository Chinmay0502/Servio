import React from "react";

const Address_Section = () => {
  return (
    <div className="rounded-2xl shadow-xl transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 p-5 lg:w-[67rem] lg:mt-5">
      <div className="flex justify-between">
        <h2 className="font-bold text-highlight text-xl">Addresses :- </h2>
        <button className="bg-primary px-2 py-1 rounded-md font-semibold">
          New Address +
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 text-sm">
        <div className=" lg:w-1/2 border border-blur-[14px] border-white/20 p-3 rounded-md mt-3">
          <p className="text-lg font-semibold text-primary">Address 1</p>
          <ul className="flex gap-5 lg:gap-10 mt-2">
            <li>
              House No 
            </li>
            <li>
              Locality 
            </li>
            <li>
              City 
            </li>
            <li>
              Pin Code 
            </li>
            <li>
              State 
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 border border-blur-[14px] border-white/20 p-3 rounded-md mt-3">
          <p className="text-lg font-semibold text-primary">Address 2</p>
          <ul className="flex gap-5 lg:gap-10 mt-2">
            <li>
              House No 
            </li>
            <li>
              Locality
            </li>
            <li>
              City 
            </li>
            <li>
              Pin Code 
            </li>
            <li>
              State 
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 text-sm">
        <div className="lg:w-1/2 border border-blur-[14px] border-white/20 p-3 rounded-md mt-3">
          <p className="text-lg font-semibold text-primary">Address 3</p>
          <ul className="flex gap-5 lg:gap-10 mt-2">
            <li>
              House No 
            </li>
            <li>
              Locality
            </li>
            <li>
              City 
            </li>
            <li>
              Pin Code 
            </li>
            <li>
              State 
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 border border-blur-[14px] border-white/20 p-3 rounded-md mt-3">
          <p className="text-lg font-semibold text-primary">Address 4</p>
          <ul className="flex gap-5 lg:gap-10 mt-2">
            <li>
              House No 
            </li>
            <li>
              Locality
            </li>
            <li>
              City 
            </li>
            <li>
              Pin Code 
            </li>
            <li>
              State 
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Address_Section;
