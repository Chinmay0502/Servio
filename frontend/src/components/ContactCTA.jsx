import React from "react";

const ContactCTA = () => {
  return (
    <div
      id="contact"
      className="relative py-24 px-6 text-center border-y border-[#6c3be8]/25 overflow-hidden fade-up min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 70% 80% at 50% 50%,rgba(108,59,232,.28) 0%,transparent 70%),linear-gradient(135deg,rgba(232,24,92,.07),rgba(108,59,232,.07))",
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto mt-5">
        <p className="font-mono text-[.7rem] tracking-[.2em] text-highlight uppercase mb-4">
          Get Started Today
        </p>

        <h2
          className="font-[] font-extrabold leading-tight mb-4"
          style={{ fontSize: "clamp(3rem,5vw,5rem)" }}
        >
          Ready to fix it, clean it,
          <br />
          or upgrade it?
        </h2>

        <p className="text-gray-400 max-w-md mx-auto leading-relaxed mb-10">
          Join thousands of happy customers in Odisha getting services done
          right, on time, every time.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            className="bg-highlight text-white px-10 py-3.5 rounded-xl font-bold text-base hover:-translate-y-1 transition-transform"
            style={{ boxShadow: "0 0 40px rgba(232,24,92,.4)" }}
          >
            Book a Service Now
          </button>

          <button className="border border-white/20 text-white px-10 py-3.5 rounded-xl font-bold text-base hover:border-primary hover:text-purp-light transition-colors">
            Explore All Services
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Are you a service provider?{" "}
          <a
            href="#"
            className="text-purple-400 underline underline-offset-2 hover:text-pink transition-colors"
          >
            Join Servio as a Pro →
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactCTA;