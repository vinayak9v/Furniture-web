import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="w-full bg-white py-10 px-4 md:px-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        {/* Responsive Grid: 1 column on mobile, 2 columns on tablet & desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ================= BANNER 1: SUMMER SALE ================= */}
          {/* नोट: bg-[url('/banner1.jpg')] लगाएँ जहाँ इमेज का पाथ हो */}
          <div 
            className="relative w-full min-h-[250px] sm:min-h-[300px] rounded-2xl overflow-hidden flex flex-col justify-center p-8 sm:p-12 bg-[#8c9276] bg-cover bg-center"
            style={{ backgroundImage: "url('/banner.png')" }} 
          >
            {/* Content Wrapper (Max width to keep text on the left) */}
            <div className="relative z-10 max-w-[60%] sm:max-w-[50%]">
              <p className="text-[#e2e0d3] font-medium text-sm sm:text-base mb-2">
                Summer Sale
              </p>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3 leading-tight drop-shadow-sm">
                Up to 40% Off
              </h3>
              <p className="text-[#e2e0d3] text-xs sm:text-sm mb-6">
                On selected products
              </p>
              
              <button className="flex items-center gap-2 bg-[#efe8de] hover:bg-white text-[#5d6044] text-[11px] sm:text-xs font-bold px-5 py-2.5 rounded shadow-sm transition-colors uppercase tracking-wider">
                Shop The Sale <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ================= BANNER 2: NEW COLLECTION ================= */}
          {/* नोट: bg-[url('/banner2.jpg')] लगाएँ */}
          <div 
            className="relative w-full min-h-[250px] sm:min-h-[300px] rounded-2xl overflow-hidden flex flex-col justify-center p-8 sm:p-12 bg-[#f4ece3] bg-cover bg-center"
            style={{ backgroundImage: "url('/banner2.png')" }}
          >
            {/* Content Wrapper */}
            <div className="relative z-10 max-w-[60%] sm:max-w-[55%]">
              <p className="text-[#6b6e4f] font-medium text-sm sm:text-base mb-2">
                New Collection
              </p>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3 leading-tight drop-shadow-sm">
                Minimal & Modern
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-6">
                Designed for today's lifestyle
              </p>
              
              <button className="flex items-center gap-2 bg-transparent border border-[#6b6e4f] text-[#6b6e4f] hover:bg-[#6b6e4f] hover:text-white text-[11px] sm:text-xs font-bold px-5 py-2.5 rounded transition-all uppercase tracking-wider">
                Explore Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}