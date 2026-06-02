    import React from 'react';
import { Truck, Award, RefreshCw, Headphones } from 'lucide-react';

export default function ServiceFeatures() {
  // आइकॉन और ब्रांड के लिए ब्राउन शेड (इमेज के अनुसार)
  const iconColor = "#8c5a35";

  const services = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders above ₹9999"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Crafted with the finest materials"
    },
    {
      icon: RefreshCw, // Easy Returns के लिए
      title: "Easy Returns",
      description: "Hassle-free returns within 7 days"
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description: "We're here to help you"
    }
  ];

  return (
    <div className="w-full bg-[#f8f6f2] py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid setup for responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex items-center gap-5">
                
                {/* Icon Section */}
                <div className="shrink-0">
                  <Icon 
                    size={42} 
                    strokeWidth={1.2} 
                    style={{ color: iconColor }} 
                  />
                </div>
                
                {/* Text Section */}
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-tight">
                    {service.description}
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}