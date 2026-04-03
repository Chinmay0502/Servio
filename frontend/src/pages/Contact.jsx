import React from "react";

const Contact = () => {
  return (
    <div className="px-2 md:px-8 text-white font-[Roobert]">

      <div
        className="rounded-b-[3rem] flex items-center justify-center w-full p-10"
        style={{
          background: `radial-gradient(120% 60% at 50% 100%, #4E2FB7 0%, #2F1D73 45%, rgba(47,29,115,0.4) 65%, #020313 100%), 
          linear-gradient(180deg,#020313 0%,#020313 30%,#0B0825 55%,#2F1D73 80%,#4E2FB7 100%)`,
        }}
      >

        <div className="max-w-6xl w-full backdrop-blur-[14px] bg-[rgba(20,22,35,0.55)] border border-white/10 rounded-2xl p-10">

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 font-[font1]">
            Contact <span className="text-highlight">Servio</span>
          </h1>

          <p className="text-gray-400 mb-10">
            Have questions or need support? Our team is here to help you anytime.
          </p>

          <div className="grid md:grid-cols-2 gap-10">

            {/* CONTACT FORM */}
            <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-6 rounded-xl border border-white/10">

              <h2 className="text-xl font-semibold mb-6 text-highlight">
                Get in Touch
              </h2>

              <form className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 rounded-md bg-[#020313] border border-white/10 focus:border-highlight outline-none text-sm"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full p-3 rounded-md bg-[#020313] border border-white/10 focus:border-highlight outline-none text-sm"
                  />

                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 rounded-md bg-[#020313] border border-white/10 focus:border-highlight outline-none text-sm"
                />

                <textarea
                  rows="4"
                  placeholder="Your Message"
                  className="w-full p-3 rounded-md bg-[#020313] border border-white/10 focus:border-highlight outline-none text-sm"
                ></textarea>

                <button
                  className="w-full py-3 rounded-md font-semibold bg-highlight 
                  transition-all duration-300 hover:shadow-[0_0_25px_8px_rgba(233,30,99,0.6)] cursor-pointer"
                >
                  Send Message
                </button>

              </form>
            </div>

            {/* CONTACT INFO */}
            <div className="space-y-6">

              <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-6 rounded-xl border border-white/10">

                <h3 className="text-lg font-semibold text-highlight mb-4">
                  Contact Information
                </h3>

                <p className="text-gray-400 mb-2">📞 773-365-1240</p>
                <p className="text-gray-400 mb-2">📧 support@servio.com</p>
                <p className="text-gray-400">📍 Bhubaneswar, Odisha</p>

              </div>

              <div className="bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] p-6 rounded-xl border border-white/10">

                <h3 className="text-lg font-semibold text-highlight mb-4">
                  Business Hours
                </h3>

                <p className="text-gray-400">Mon - Fri : 9:00 am – 8:00 pm</p>
                <p className="text-gray-400">Saturday : 9:00 am – 6:00 pm</p>
                <p className="text-gray-400">Sunday : 9:00 am – 5:00 pm</p>

              </div>

            </div>

          </div>

          {/* MAP */}
          <div className="mt-10 rounded-xl overflow-hidden border border-white/10">

            <iframe
              className="w-full h-64"
              src="https://maps.google.com/maps?q=Bhubaneswar&t=&z=13&ie=UTF8&iwloc=&output=embed"
              title="map"
            ></iframe>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;