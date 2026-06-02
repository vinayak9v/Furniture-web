import React from 'react';
import { Wrench, Lightbulb, Tag, HeartHandshake } from 'lucide-react';

export default function WhyChooseUs() {
  const brandColor = "#5d6044"; // Olive Green

  const features = [
    {
      icon: Wrench,
      title: "Quality Craftsmanship",
      desc: "Expertly crafted furniture built to last."
    },
    {
      icon: Lightbulb,
      title: "Thoughtful Design",
      desc: "Modern designs that fit every space."
    },
    {
      icon: Tag,
      title: "Affordable Luxury",
      desc: "Premium look & feel without the high price."
    },
    {
      icon: HeartHandshake,
      title: "Customer First",
      desc: "Your satisfaction is our top priority."
    }
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        {/* ================= MAIN CARD ================= */}
        <div className="bg-[#fdfcf9] rounded-3xl p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          
          {/* Left Image Section */}
          {/* नोट: यहाँ 'why-choose-us.jpg' का इस्तेमाल किया गया है। */}
          <div
            className="w-full lg:w-2/5 min-h-[300px] sm:min-h-[400px] lg:h-full bg-cover bg-center rounded-2xl"
            style={{ backgroundImage: "url('/banner5.png')" }}
          ></div>

          {/* Right Content Section */}
          <div className="w-full lg:w-3/5 py-4 lg:py-8 pr-0 lg:pr-8">
            
            {/* Header */}
            <p className="text-xs font-bold tracking-[0.15em] uppercase mb-3" style={{ color: brandColor }}>
              Why Choose Us?
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Furniture That Feels<br className="hidden xl:block" /> Right, Every Time.
            </h2>
            
            {/* Green Horizontal Divider */}
            <div className="h-[2px] w-12 mb-10 md:mb-12" style={{ backgroundColor: brandColor }}></div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col gap-3">
                    {/* Icon */}
                    <Icon className="w-7 h-7" style={{ color: brandColor }} strokeWidth={1.5} />
                    
                    {/* Text */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed pr-4 xl:pr-0">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* ================= TESTIMONIAL DIVIDER ================= */}
        {/* जो इमेज के सबसे नीचे दिख रहा है */}
        <div className="flex items-center justify-center mt-20 gap-4">
          <div className="h-[1px] w-8 bg-gray-300"></div>
          <span className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">
            What Our Customers Say
          </span>
          <div className="h-[1px] w-8 bg-gray-300"></div>
        </div>

      </div>
    </section>
  );
}