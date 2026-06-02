import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PageHeader() {
  return (
    <section className="relative w-full h-[250px] md:h-[300px] overflow-hidden bg-[#f9f8f3]">
      
      {/* ================= BACKGROUND IMAGE ================= */}
      {/* 
        इमेज में राइट साइड में फर्नीचर है और लेफ्ट साइड में वाइट फेड (fade) है। 
        इसके लिए हम 'bg-gradient-to-r' का इस्तेमाल करेंगे।
      */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-right no-repeat"
        style={{ backgroundImage: "url('/productbanner.png')" }} 
      >
        {/* White Gradient Overlay (Left to Right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f9f8f3] via-[#f9f8f3]/80 to-transparent w-full md:w-2/3"></div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
        
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
          All Products
        </h1>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          
          <ChevronRight size={16} className="text-gray-400" />
          
          <Link href="/shop" className="hover:text-gray-900 transition-colors">
            Shop
          </Link>

          <ChevronRight size={16} className="text-gray-400" />

          <span className="text-gray-900">All Products</span>
        </nav>

      </div>
    </section>
  );
}