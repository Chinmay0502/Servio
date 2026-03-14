import React from "react";

const LogoLoader = ({show}) => {
  return  show && (
    <div className="flex items-center justify-center h-screen bg-black">
      
      <div className="relative flex flex-col items-center justify-center">

        {/* Rotating Glow */}
        <div className="absolute w-72 h-72 rounded-full blur-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-40 animate-spin-slow"></div>

        {/* Logo */}
        <img
          src="/Final_Logo.png"
          alt="Loading..."
          className="w-40 animate-pulse-slow"
        />
        <h1 className="font-bold text-3xl text-highlight">SERVIO.....</h1>

      </div>

    </div>
  );
};

export default LogoLoader;