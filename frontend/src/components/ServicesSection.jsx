import React from "react";

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="fade-up flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <p className="font-highlight text-[.7rem] tracking-[.2em] text-highlight uppercase mb-3">
              All Services
            </p>

            <h2
              className="font-[font1] font-extrabold leading-tight "
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
            >
              Everything your home
              <br />
              &amp; life needs
            </h2>
          </div>

          <button className="border border-[#6c3be8]/30 text-white px-5 py-2 rounded-lg text-lg hover:border-purp-light hover:text-purp-light transition-colors">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 fade-up">
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">🔧</span>
            <h4 className="font-semibold text-lg mb-1">Plumbing</h4>
            <p className="text-gray-500 text-xs">
              Leaks, fittings & pipe repair
            </p>
            <span className="inline-block mt-3 text-[.65rem] font-[font2] bg-highlight/10 text-highlight border border-highlight/25 rounded-full px-2.5 py-0.5">
              Most Booked
            </span>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">⚡</span>
            <h4 className="font-semibold text-lg mb-1">Electrician</h4>
            <p className="text-gray-500 text-xs">
              Wiring, panels & installations
            </p>
            <span className="inline-block mt-3 text-[.65rem] bg-highlight/10 text-highlight border border-highlight/25 rounded-full px-2.5 py-0.5">
              Top Rated
            </span>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">🧹</span>
            <h4 className="font-semibold text-lg mb-1">Home Cleaning</h4>
            <p className="text-gray-500 text-xs">Deep clean, sofa & carpet</p>
            <span className="inline-block mt-3 text-[.65rem] font-mono bg-primary/10 text-purple-300 border border-primary rounded-full px-2.5 py-0.5">
              New
            </span>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">❄️</span>
            <h4 className="font-semibold text-lg mb-1">AC Repair</h4>
            <p className="text-gray-500 text-xs">
              Service, gas refill & install
            </p>
            <span className="inline-block mt-3 text-[.65rem] font-mono bg-highlight/10 text-highlight border border-highlight/25 rounded-full px-2.5 py-0.5">
              Trending
            </span>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">🎨</span>
            <h4 className="font-semibold text-lg mb-1">Painting</h4>
            <p className="text-gray-500 text-xs">
              Interior, exterior & texture
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">🪚</span>
            <h4 className="font-semibold text-lg mb-1">Carpentry</h4>
            <p className="text-gray-500 text-xs">
              Furniture repair & custom
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">🐛</span>
            <h4 className="font-semibold text-lg mb-1">Pest Control</h4>
            <p className="text-gray-500 text-xs">
              Termite, cockroach & rodent
            </p>
          </div>

          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-highlight hover:shadow-[0_12px_40px_rgba(232,24,92,.15)]">
            <span className="text-3xl block mb-4">💇</span>
            <h4 className="font-semibold text-lg mb-1">Salon at Home</h4>
            <p className="text-gray-500 text-xs">Hair, skin & grooming</p>
            <span className="inline-block mt-3 text-[.65rem] font-mono bg-primary/10 text-purple-300 border border-primary rounded-full px-2.5 py-0.5">
              Popular
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;