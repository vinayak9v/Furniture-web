import React from 'react';
import { Truck, Award, ShieldCheck, Headphones } from 'lucide-react';

export default function FeaturesBanner() {
  // आइकॉन और ब्रांड का कलर (Olive Green)
  const brandColor = "#5d6044";

  // फीचर्स का डेटा ताकि कोड क्लीन रहे
  const features = [
    {
      icon: Truck,
      title: "FREE DELIVERY",
      description: "On orders above ₹9999"
    },
    {
      icon: Award,
      title: "PREMIUM QUALITY",
      description: "Crafted with the finest materials"
    },
    {
      icon: ShieldCheck,
      title: "SECURE PAYMENT",
      description: "100% secure & safe checkout"
    },
    {
      icon: Headphones,
      title: "CUSTOMER SUPPORT",
      description: "We're here to help you"
    }
  ];

  return (
    <div className="w-full bg-[#fdfdfc] py-10 md:py-12 border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Responsive Grid: Mobile(1 col) -> Tablet(2 cols) -> Desktop(4 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-4">
                
                {/* Icon Container (Light beige circle) */}
                <div className="w-14 h-14 rounded-full bg-[#f5f4ef] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" style={{ color: brandColor }} strokeWidth={1.5} />
                </div>
                
                {/* Text Section */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {feature.description}
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