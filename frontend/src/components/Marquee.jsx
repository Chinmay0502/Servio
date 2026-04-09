import React from "react";
const Marquee = () => {
  return (
    <div
      className="text-sm overflow-hidden whitespace-nowrap border-y border-[#6c3be8]/25 py-3.5 bg-primary"
    >
      <div className="inline-flex animate-marquee gap-10">
        <span className="text-white font-semibold tracking-wide uppercase">
        Local Service Hub • Book Instantly • Trusted Professionals • Quick Response
        </span>
        <span className="text-white font-semibold tracking-wide uppercase">
        Local Service Hub • Book Instantly • Trusted Professionals • Quick Response
        </span>
        <span className="text-white font-semibold tracking-wide uppercase">
        Local Service Hub • Book Instantly • Trusted Professionals • Quick Response
        </span>
        <span className="text-white font-semibold tracking-wide uppercase">
        Local Service Hub • Book Instantly • Trusted Professionals • Quick Response
        </span>
        <span className="text-white font-semibold tracking-wide uppercase">
        Local Service Hub • Book Instantly • Trusted Professionals • Quick Response
        </span>
        <span className="text-white font-semibold tracking-wide uppercase">
        Local Service Hub • Book Instantly • Trusted Professionals • Quick Response
        </span>
      </div>
    </div>
  );
};

export default Marquee;