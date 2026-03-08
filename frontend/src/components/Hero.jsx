import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="p-4 mid:p-10">
        <div className="h-[40rem] md:h-[35rem] flex justify-center items-center w-full rounded-b-4xl" style={{ background: `radial-gradient(120% 60% at 50% 100%, #4E2FB7 0%, #2F1D73 45%, rgba(47,29,115,0.4) 65%, #020313 100%), linear-gradient( 180deg, #020313 0%, #020313 30%, #0B0825 55%, #2F1D73 80%, #4E2FB7 100%)`,}}>
          <div className="w-3/4 text-center p-5 flex flex-col gap-5 justify-center items-center">
            <div className="text-highlight text-sm md:text-xl font-[Roobert]">LOCAL SERVICES. REAL-TIME. RELIABLE.</div>
            <div className="font-bold text-3xl md:text-6xl font-[font1]">Smart Local Services</div>
            <div className="font-bold text-3xl md:text-6xl font-[font1]"><span className="inline-block border-3 border-highlight px-2 py-1 rounded-lg font-[font2] hover:animate-[shake_0.4s_ease-in-out]">Delivered</span><span> when you need them</span></div>
            <div className="text-sm md:text-xl font-[Roobert] text-gray-400">Find verified local professionals, book instantly, and track your service in real time with Servio.</div>
            <div><span className="text-highlight">10,000+</span> Happy Customers Using Servio Every Month</div>
            <div className="bg-highlight md:w-[10rem] text-sm px-3 py-2 rounded-md font-semibold cursor-pointer transition-all duration-300 hover:shadow-[0_0_25px_8px_rgba(233,30,99,0.6)] flex justify-center items-center gap-2 group">
              <button className="cursor-pointer">Get Service Now </button>
              <div className=" hidden group-hover:flex">
                <FaArrowRight className="text-[0.8rem]"/>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Hero;
