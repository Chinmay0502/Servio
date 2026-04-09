import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0d0d1a] border-t border-[#6c3be8]/25 pt-16 pb-8 px-6 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#6c3be8]/20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/Final_Logo.png" alt="" className="w-[2rem]" />
              <span className="font-mono font-bold text-lg">Servio</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Connecting local service professionals with consumers across
              Odisha. Fast, verified, reliable.
            </p>

            <div className="flex gap-2">
              <div className="w-9 h-9 border border-[#6c3be8]/25 rounded-xl flex items-center justify-center cursor-pointer hover:border-highlight hover:bg-highlight/10 transition-colors text-sm">
                𝕏
              </div>
              <div className="w-9 h-9 border border-[#6c3be8]/25 rounded-xl flex items-center justify-center cursor-pointer hover:border-highlight hover:bg-highlight/10 transition-colors text-sm">
                in
              </div>
              <div className="w-9 h-9 border border-[#6c3be8]/25 rounded-xl flex items-center justify-center cursor-pointer hover:border-highlight hover:bg-highlight/10 transition-colors text-sm">
                f
              </div>
              <div className="w-9 h-9 border border-[#6c3be8]/25 rounded-xl flex items-center justify-center cursor-pointer hover:border-highlight hover:bg-highlight/10 transition-colors text-sm">
                ▶
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-mono text-[.72rem] tracking-[.12em] uppercase text-white mb-5">
              Services
            </h5>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Plumbing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Electrical
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Home Cleaning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  AC Repair
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Painting
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  View All →
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-mono text-[.72rem] tracking-[.12em] uppercase text-white mb-5">
              Company
            </h5>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Become a Pro
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-mono text-[.72rem] tracking-[.12em] uppercase text-white mb-5">
              Support
            </h5>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-highlight transition-colors"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
          <p className="text-gray-500 text-xs">
            © 2025 Servio Technologies. Made with ♥ in Odisha, India.
          </p>

          <div className="flex gap-2 flex-wrap justify-center">
            <span className="border border-[#6c3be8]/20 rounded-md px-3 py-1 font-mono text-[.62rem] text-gray-400 bg-white/[0.03]">
              🔒 Secure
            </span>
            <span className="border border-[#6c3be8]/20 rounded-md px-3 py-1 font-mono text-[.62rem] text-gray-400 bg-white/[0.03]">
              ✅ Verified Pros
            </span>
            <span className="border border-[#6c3be8]/20 rounded-md px-3 py-1 font-mono text-[.62rem] text-gray-400 bg-white/[0.03]">
              📍 Hyperlocal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;