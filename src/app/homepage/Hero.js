'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Award, 
  Gem, 
  ShieldCheck 
} from 'lucide-react';

export default function HeroSection() {
  // 1. Array of background images
  const slides = [
    '/hero1.png', // Add these images to your 'public' folder
    '/hero2.png',
    '/hero3.png',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // 2. Carousel Controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // 3. Auto-scroll functionality (Changes slide every 5 seconds)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const brandColor = "#5d6044";

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden bg-[#Fdfbf7]">
      
      {/* ================= BACKGROUND SLIDER ================= */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-[-1]'
          }`}
          style={{
            backgroundImage: `url(${slide})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }}
        />
      ))}

      {/* Gradient Overlay: Fades from solid off-white on the left to transparent on the right */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#Fdfbf7] via-[#Fdfbf7]/95 to-transparent w-full md:w-3/4 lg:w-3/5"></div>

      {/* ================= CONTENT CONTAINER ================= */}
      {/* pt-12, pt-16, pt-20 का उपयोग करके कंटेंट को और ऊपर किया गया है */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col pt-12 md:pt-16 lg:pt-20">
        
        <div className="max-w-2xl">
          {/* Subheading */}
          <p className="text-[#5d6044] font-bold text-sm md:text-base tracking-wide mb-3">
            Crafted for Comfort. Designed for Life.
          </p>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.1] mb-5">
            Make Your Home<br />Beautiful
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base mb-6 max-w-md leading-relaxed">
            Discover stylish, comfortable & high-quality furniture for every corner of your home.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
              className="flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-bold tracking-wider hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandColor }}
            >
              SHOP NOW <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              className="px-6 py-3 bg-transparent border-2 text-sm font-bold tracking-wider hover:bg-[#5d6044]/5 transition-colors"
              style={{ borderColor: brandColor, color: brandColor }}
            >
              EXPLORE COLLECTIONS
            </button>
          </div>

          {/* Features (Bottom Left) */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-[#5d6044] mt-0.5" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight">Premium Quality</h4>
                <p className="text-[10px] text-gray-500">Finest Materials</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Gem className="w-5 h-5 text-[#5d6044] mt-0.5" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight">Modern Design</h4>
                <p className="text-[10px] text-gray-500">Timeless Style</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5d6044] mt-0.5" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight">Built to Last</h4>
                <p className="text-[10px] text-gray-500">Durable & Strong</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CAROUSEL CONTROLS ================= */}
      
      {/* Left Arrow */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800" />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  );
}