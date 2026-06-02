import React from 'react';
import Link from 'next/link';
import { TreePine, Hammer, ShieldCheck, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const brandColor = "#5d6044";

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-gray-800">
      <Navbar/>
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b46a013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        ></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wide">
            About Gioteak
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-xl mx-auto font-light">
            Crafting timeless furniture pieces that transform houses into homes.
          </p>
        </div>
      </section>

      {/* ================= OUR STORY SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Gioteak Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative block behind image */}
            <div 
              className="absolute -bottom-6 -left-6 w-2/3 h-2/3 rounded-2xl z-0 hidden md:block"
              style={{ backgroundColor: `${brandColor}20` }} // 20% opacity of brand color
            ></div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: brandColor }}>
              Our Story
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight">
              Rooted in Nature, <br /> Designed for Life.
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed font-light text-[15px]">
              At <strong>Gioteak</strong>, we believe that furniture is more than just functional pieces occupying space; it is the soul of your home. Founded with a passion for exceptional woodwork and sustainable living, we source the finest teak and premium materials to create furniture that lasts generations.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed font-light text-[15px]">
              Every piece in our collection is a testament to meticulous craftsmanship. We collaborate with master artisans who blend traditional techniques with modern aesthetics, ensuring that when you choose Gioteak, you are choosing unparalleled elegance and comfort.
            </p>
            
            <Link href="/products">
              <button 
                className="flex items-center gap-2 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:-translate-y-1 shadow-lg shadow-gray-200"
                style={{ backgroundColor: brandColor }}
              >
                Explore Our Collection <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-white py-16 md:py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">The Gioteak Promise</h2>
            <div className="w-16 h-1 mx-auto" style={{ backgroundColor: brandColor }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                <TreePine className="w-8 h-8" style={{ color: brandColor }} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Sustainably Sourced</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                We use ethically sourced teak and premium woods, ensuring that our environmental footprint remains as minimal as possible.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                <Hammer className="w-8 h-8" style={{ color: brandColor }} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Master Craftsmanship</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Handcrafted by skilled artisans, every joint, curve, and finish is executed with precision and a deep love for woodworking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gray-50 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-8 h-8" style={{ color: brandColor }} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Built to Last</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Furniture is an investment. Our rigorous quality checks guarantee pieces that endure the test of time, both in durability and style.
              </p>
            </div>

          </div>
        </div>
      </section>
     <Footer/>
    </div>
  );
}