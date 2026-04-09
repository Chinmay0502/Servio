import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="fade-up">
          <p className="text-[.7rem] tracking-[.2em] text-highlight uppercase mb-3">
            How It Works
          </p>

          <h2
            className="font-[font1] font-extrabold leading-tight mb-3"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
          >
            Book a service in 3 simple steps
          </h2>

          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            No calls, no hassle. Describe your need, pick a pro, and relax — we
            handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 lg:mt-30 fade-up">
          {/* Step 1 */}
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center font-mono font-bold text-2xl border-2 border-purple-400"
              style={{
                background: "linear-gradient(135deg,#4c1d95,#6c3be8)",
                boxShadow: "0 0 30px rgba(108,59,232,.38)",
              }}
            >
              01
            </div>
            <h3 className="font-syne font-bold text-base mb-2">
              Search & Describe
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tell us what you need. Set your location to see nearby verified
              pros.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center font-mono font-bold text-2xl border-2 border-purple-400"
              style={{
                background: "linear-gradient(135deg,#4c1d95,#6c3be8)",
                boxShadow: "0 0 30px rgba(108,59,232,.38)",
              }}
            >
              02
            </div>
            <h3 className="font-syne font-bold text-base mb-2">Pick Your Pro</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Browse profiles, ratings, reviews. Pick the provider that fits
              you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center font-mono font-bold text-2xl border-2 border-purple-400"
              style={{
                background: "linear-gradient(135deg,#4c1d95,#6c3be8)",
                boxShadow: "0 0 30px rgba(108,59,232,.38)",
              }}
            >
              03
            </div>
            <h3 className="font-syne font-bold text-base mb-2">Book & Track</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Schedule instantly and track your provider&apos;s arrival in real
              time.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center font-mono font-bold text-2xl border-2 border-purple-400"
              style={{
                background: "linear-gradient(135deg,#4c1d95,#6c3be8)",
                boxShadow: "0 0 30px rgba(108,59,232,.38)",
              }}
            >
              04
            </div>
            <h3 className="font-syne font-bold text-base mb-2">Rate & Review</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Share your experience and earn Servio points for your next
              booking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;