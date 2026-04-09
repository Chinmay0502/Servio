import React from "react";

const WhyServio = () => {
  return (
    <section id="about" className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="fade-up mb-10">
          <p className="font-mono text-[.7rem] tracking-[.2em] text-highlight uppercase mb-3">
            Why Servio
          </p>

          <h2
            className="font-[font1] font-extrabold leading-tight"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
          >
            Built different.
            <br />
            Built for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-up">
          {/* Wide card */}
          <div
            className="md:col-span-2 border border-[#6c3be8]/25 rounded-2xl p-8 hover:border-primary transition-colors"
            style={{
              background:
                "linear-gradient(135deg,rgba(108,59,232,.18),rgba(232,24,92,.08))",
            }}
          >
            <span className="text-3xl block mb-4">📍</span>
            <h3 className="font-[font2] font-bold text-lg mb-2">
              Hyperlocal Matching
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our smart engine matches you with verified pros within your exact
              locality — not just your city. Faster arrival, lower cost, familiar
              faces.
            </p>

            <span className="inline-flex items-center gap-2 mt-5 bg-highlight/10 text-highlight border border-highlight/25 rounded-full px-4 py-1.5 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse inline-block"></span>
              Live in your area
            </span>
          </div>

          {/* Tracking card (tall) */}
          <div className="row-span-2 bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 hover:border-primary transition-colors">
            <span className="text-3xl block mb-4">🛰️</span>
            <h3 className="font-[font2] font-bold text-base mb-2">
              Real-Time Tracking
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Know exactly where your provider is, from acceptance to arrival.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full bg-highlight flex-shrink-0"
                  style={{ boxShadow: "0 0 8px rgba(232,24,92,.8)" }}
                ></div>
                <div className="text-xs">
                  <span className="font-semibold text-white">
                    Booking Confirmed
                  </span>{" "}
                  <span className="text-gray-500">· 10:30 AM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full bg-highlight flex-shrink-0"
                  style={{ boxShadow: "0 0 8px rgba(232,24,92,.8)" }}
                ></div>
                <div className="text-xs">
                  <span className="font-semibold text-white">
                    Provider Accepted
                  </span>{" "}
                  <span className="text-gray-500">· 10:32 AM</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 animate-pulse"></div>
                <div className="text-xs">
                  <span className="font-semibold text-white">On the way</span>{" "}
                  <span className="text-gray-500">· ~12 min</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-white/15 flex-shrink-0"></div>
                <div className="text-xs text-gray-500">
                  Service in Progress
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-white/15 flex-shrink-0"></div>
                <div className="text-xs text-gray-500">
                  Completed & Payment
                </div>
              </div>
            </div>
          </div>

          {/* Small cards */}
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 hover:border-primary transition-colors">
            <span className="text-3xl block mb-3">✅</span>
            <h3 className="font-[font2] font-bold text-base mb-2">
              Verified Professionals
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Background-checked, ID-verified, and rated by real customers before
              joining.
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 hover:border-primary transition-colors">
            <span className="text-3xl block mb-3">💳</span>
            <h3 className="font-[font2] font-bold text-base mb-2">
              Pay After Service
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Pay only when the job is done. Cash, UPI, or cards accepted.
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 hover:border-primary transition-colors">
            <span className="text-3xl block mb-3">🔁</span>
            <h3 className="font-[font2] font-bold text-base mb-2">
              Instant Rebooking
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Rebook your favourite pro with one tap. History saved
              automatically.
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 hover:border-primary transition-colors">
            <span className="text-3xl block mb-3">🤝</span>
            <h3 className="font-[font2] font-bold text-base mb-2">
              Earn as a Provider
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Join Servio, set your schedule, and grow your local customer base.
            </p>

            <span className="inline-flex items-center gap-2 mt-3 bg-highlight/10 text-highlight border border-pink/20 rounded-full px-3 py-1 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse inline-block"></span>
              Join 500+ pros
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyServio;