'use client';

import React from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const brandColor = "#5d6044"; // Olive Green

  const reviews = [
    {
      id: 1,
      text: "The quality and finish of the sofa is absolutely amazing. It transformed my living room!",
      name: "Priya Sharma",
      stars: 5
    },
    {
      id: 2,
      text: "Great experience from order to delivery. The bed is sturdy and looks even better in person.",
      name: "Rohit Verma",
      stars: 5
    },
    {
      id: 3,
      text: "Excellent customer service and beautiful designs. Highly recommended!",
      name: "Neha Kapoor",
      stars: 5
    }
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 font-sans">
      <div className="max-w-[90rem] mx-auto relative">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col items-center justify-center mb-12">
          {/* Over-title with lines */}
       

          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 text-center">
            Trusted by Thousands of Happy Homes
          </h2>
        </div>

        {/* ================= TESTIMONIALS CONTENT ================= */}
        <div className="flex items-center gap-4">
          
          {/* Left Arrow Button */}
          <button className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-[#fcfaf7] p-8 rounded-2xl flex flex-col gap-4 border border-gray-50 shadow-sm"
              >
                {/* Quote Icon */}
                <Quote 
                  className="w-8 h-8 opacity-20" 
                  style={{ color: brandColor }} 
                  fill="currentColor"
                />

                {/* Review Text */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed italic">
                  "{review.text}"
                </p>

                {/* Name & Stars */}
                <div className="mt-2">
                  <p className="text-sm font-bold text-gray-900 mb-2">— {review.name}</p>
                  <div className="flex gap-1">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-4 h-4 fill-[#a87f54] text-[#a87f54]" 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

        </div>

        {/* Mobile Navigation Arrows (Visible only on small screens) */}
        <div className="flex md:hidden justify-center gap-4 mt-8">
           <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}