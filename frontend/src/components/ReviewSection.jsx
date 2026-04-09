import React from "react";

const ReviewSection = () => {
  return (
    <section className="py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="fade-up text-center mb-12">
          <p className="font-mono text-[.7rem] tracking-[.2em] text-highlight uppercase mb-3">
            Testimonials
          </p>

          <h2
            className="font-[font1] font-extrabold leading-tight"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
          >
            Locals love Servio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-up mt-20">
          {/* Card 1 */}
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 relative overflow-hidden hover:border-highlight/30 transition-colors">
            <span
              className="absolute top-0 right-4 text-[7rem] leading-none font-syne select-none pointer-events-none"
              style={{ color: "rgba(108,59,232,.07)" }}
            >
              "
            </span>

            <div className="text-highlight text-sm mb-3">★★★★★</div>

            <p className="text-gray-400 text-sm leading-relaxed italic mb-6">
              Got an electrician within 20 minutes of booking. Professional,
              clean, and fixed everything quickly. A total game changer for
              Bhubaneswar!
            </p>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#6c3be8,#e8185c)",
                }}
              >
                S
              </div>

              <div>
                <div className="font-semibold text-sm">Suman Rath</div>
                <div className="text-gray-500 text-xs">
                  📍 Patia, Bhubaneswar
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 relative overflow-hidden hover:border-highlight/30 transition-colors">
            <span
              className="absolute top-0 right-4 text-[7rem] leading-none font-syne select-none pointer-events-none"
              style={{ color: "rgba(108,59,232,.07)" }}
            >
              "
            </span>

            <div className="text-highlight text-sm mb-3">★★★★★</div>

            <p className="text-gray-400 text-sm leading-relaxed italic mb-6">
              The real-time tracking is so reassuring. I knew exactly when the
              plumber would arrive. Transparent pricing — no hidden costs at
              all.
            </p>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#0ea5e9,#6c3be8)",
                }}
              >
                N
              </div>

              <div>
                <div className="font-semibold text-sm">Neha Mishra</div>
                <div className="text-gray-500 text-xs">
                  📍 Nayapalli, Bhubaneswar
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-7 relative overflow-hidden hover:border-highlight/30 transition-colors">
            <span
              className="absolute top-0 right-4 text-[7rem] leading-none font-syne select-none pointer-events-none"
              style={{ color: "rgba(108,59,232,.07)" }}
            >
              "
            </span>

            <div className="text-highlight text-sm mb-3">★★★★★</div>

            <p className="text-gray-400 text-sm leading-relaxed italic mb-6">
              Booked AC service for 3 units, handled all in one visit. Super
              efficient. Will use Servio for all my future home needs without
              hesitation.
            </p>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                }}
              >
                A
              </div>

              <div>
                <div className="font-semibold text-sm">Amit Senapati</div>
                <div className="text-gray-500 text-xs">
                  📍 Cuttack Road, Odisha
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;