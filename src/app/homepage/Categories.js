'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link'; // <-- Link इम्पोर्ट किया

export default function CategoriesSection() {
  const brandColor = "#5d6044";
  const API_BASE_URL = '';

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.categories);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Server connection error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${API_BASE_URL}${imagePath}`;
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8" style={{ backgroundColor: brandColor }}></div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: brandColor }}>
              Shop By Category
            </span>
            <div className="h-[1px] w-8" style={{ backgroundColor: brandColor }}></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 text-center">
            Explore Our Furniture Categories
          </h2>
        </div>

        {error && (
          <div className="mb-8 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
            <Loader2 size={32} className="animate-spin" style={{ color: brandColor }} />
            <p className="text-sm font-medium">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              // <-- div को हटाकर Link लगा दिया गया है -->
              <Link 
                href={`/category/${category.id}`} 
                key={category.id} 
                className="group cursor-pointer rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-gray-100">
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${getImageUrl(category.image)}')` }}
                  ></div>
                </div>

                <div className="bg-[#fcfaf7] p-4 flex flex-col items-center justify-center border-t-0 border border-gray-100 rounded-b-xl">
                  <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 mb-1.5 tracking-wider uppercase">
                    {category.name} 
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 flex items-center justify-center gap-1 group-hover:text-[#5d6044] transition-colors font-medium">
                    Explore Now <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}