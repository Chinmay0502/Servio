import React from "react";
import { FaUsers, FaShieldAlt, FaBolt, FaMapMarkedAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="text-white font-[Roobert]">

      {/* HERO SECTION */}
      <section className="p-5">
        <div
          className="rounded-b-[3rem] flex items-center justify-center h-[35rem] text-center"
          style={{
            background: `radial-gradient(120% 60% at 50% 100%, #4E2FB7 0%, #2F1D73 45%, rgba(47,29,115,0.4) 65%, #020313 100%), 
            linear-gradient(180deg,#020313 0%,#020313 30%,#0B0825 55%,#2F1D73 80%,#4E2FB7 100%)`,
          }}
        >
          <div className="max-w-4xl flex flex-col gap-6">

            <h1 className="text-4xl md:text-6xl font-bold font-[font1]">
              Powering the Future of
              <span className="text-highlight"> Local Services</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl">
              Servio connects people with trusted professionals instantly.
              Our mission is to make local services faster, safer, and
              incredibly convenient.
            </p>

            <div className="flex justify-center gap-6 mt-4">
              <div className="bg-highlight px-6 py-3 rounded-lg font-semibold shadow-[0_0_30px_rgba(233,30,99,0.5)]">
                10K+ Customers
              </div>
              <div className="border border-highlight px-6 py-3 rounded-lg">
                500+ Professionals
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SERVIO */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold mb-6">What is Servio?</h2>

        <p className="text-gray-400 max-w-4xl mx-auto text-lg">
          Servio is a smart local services platform designed to connect
          customers with verified professionals in real-time. Whether it's
          home repairs, cleaning, electrical work, or maintenance, Servio
          ensures you get reliable help instantly.
        </p>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose Servio
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-8 rounded-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(78,47,183,0.5)] transition">
            <FaShieldAlt className="text-highlight text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Experts</h3>
            <p className="text-gray-400 text-sm">
              Every professional is background checked and verified.
            </p>
          </div>

          <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-8 rounded-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(78,47,183,0.5)] transition">
            <FaBolt className="text-highlight text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
            <p className="text-gray-400 text-sm">
              Find and book services instantly within seconds.
            </p>
          </div>

          <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-8 rounded-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(78,47,183,0.5)] transition">
            <FaMapMarkedAlt className="text-highlight text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
            <p className="text-gray-400 text-sm">
              Track professionals arriving at your location.
            </p>
          </div>

          <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-8 rounded-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(78,47,183,0.5)] transition">
            <FaUsers className="text-highlight text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
            <p className="text-gray-400 text-sm">
              Thousands of happy customers rely on Servio daily.
            </p>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-4xl font-bold mb-16">Servio in Numbers</h2>

        <div className="grid md:grid-cols-4 gap-10">

          <div className="bg-[#020313] border border-white/10 rounded-xl p-8">
            <h3 className="text-4xl font-bold text-highlight">10K+</h3>
            <p className="text-gray-400 mt-2">Happy Customers</p>
          </div>

          <div className="bg-[#020313] border border-white/10 rounded-xl p-8">
            <h3 className="text-4xl font-bold text-highlight">500+</h3>
            <p className="text-gray-400 mt-2">Service Experts</p>
          </div>

          <div className="bg-[#020313] border border-white/10 rounded-xl p-8">
            <h3 className="text-4xl font-bold text-highlight">50+</h3>
            <p className="text-gray-400 mt-2">Cities Covered</p>
          </div>

          <div className="bg-[#020313] border border-white/10 rounded-xl p-8">
            <h3 className="text-4xl font-bold text-highlight">24/7</h3>
            <p className="text-gray-400 mt-2">Customer Support</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          <h2 className="text-4xl font-bold">
            Ready to Experience Servio?
          </h2>

          <p className="text-gray-400">
            Join thousands of happy customers who trust Servio for their
            everyday services.
          </p>

          <div className="flex justify-center">
            <button className="bg-highlight px-8 py-3 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(233,30,99,0.6)] transition">
              Book a Service
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;