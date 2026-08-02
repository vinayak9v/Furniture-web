'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice'; // अपना सही पाथ दें
import { 
  ChevronDown, Minus, Heart, ShoppingCart, 
  LayoutGrid, List, ChevronRight, Star, Loader2
} from 'lucide-react';

export default function ProductListingPage() {
  const brandGreen = "#5d6044";
  const brandBrown = "#8c5a35";
  const API_BASE_URL = '';

  const dispatch = useDispatch();

  // ================= STATES =================
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ================= FETCH PRODUCTS (API) =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // यहाँ limit 12 कर दी है ताकि पेज भरा हुआ लगे
        const response = await fetch(`/api/products?page=1&limit=12`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Server connection error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================= HELPERS =================
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg'; 
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${API_BASE_URL}${imagePath}`;
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().includes('₹') ? price : `₹${price}`;
  };

  // Add to Cart Logic
  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Link को ट्रिगर होने से रोकेगा
    e.stopPropagation();

    const numericPrice = parseFloat(product.price.toString().replace(/[^0-9.]/g, '')) || 0;

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: numericPrice,
      image: getImageUrl(product.thumbnail),
      specs: 'Standard Size', 
      inStock: true
    }));

    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT SIDEBAR (FILTERS) ================= */}
        <aside className="lg:col-span-3 space-y-6">
          
          {/* Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <h3 className="font-bold text-sm uppercase tracking-wider">Categories</h3>
              <Minus size={16} />
            </div>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex justify-between items-center text-[#8c5a35] bg-[#fcfaf7] p-2 rounded-lg cursor-pointer">
                <span>All Products</span> <span className="text-xs">({products.length})</span>
              </li>
              {['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Storage', 'Outdoor'].map((cat, idx) => (
                <li key={idx} className="flex justify-between items-center text-gray-500 hover:text-gray-900 cursor-pointer px-2">
                  <span>{cat}</span> <span className="text-xs">({28 - idx * 2})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm uppercase tracking-wider">Price Range</h3>
              <Minus size={16} />
            </div>
            <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8c5a35] mb-4" />
            <div className="flex justify-between text-xs font-bold text-gray-400 mb-6">
              <span>₹0</span> <span>₹1,00,000+</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#8c5a35] text-white text-xs font-bold rounded-lg uppercase tracking-widest">Apply</button>
              <button className="flex-1 py-2 border border-gray-200 text-gray-400 text-xs font-bold rounded-lg uppercase tracking-widest">Reset</button>
            </div>
          </div>

          {/* Material Filter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider">Material</h3>
              <Minus size={16} />
            </div>
            <div className="space-y-3">
              {['Solid Wood', 'Engineered Wood', 'Metal', 'Plastic', 'Glass'].map((mat, i) => (
                <label key={i} className="flex items-center justify-between text-sm text-gray-500 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8c5a35] focus:ring-[#8c5a35]" />
                    <span>{mat}</span>
                  </div>
                  <span className="text-xs">({45 - i * 7})</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* ================= RIGHT CONTENT (PRODUCTS) ================= */}
        <main className="lg:col-span-9">
          
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-sm font-medium text-gray-500">Showing {products.length} Products</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Sort by:</span>
                <div className="flex items-center gap-1 font-bold text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg bg-white cursor-pointer">
                  Latest <ChevronDown size={14} />
                </div>
              </div>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button className="p-2 bg-[#5d6044] text-white"><LayoutGrid size={18} /></button>
                <button className="p-2 bg-white text-gray-400 hover:text-gray-900"><List size={18} /></button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 text-center text-red-600 font-medium bg-red-50 py-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Grid Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
              <Loader2 size={40} className="animate-spin text-[#8c5a35]" />
              <p className="text-sm font-bold tracking-widest uppercase">Loading Products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-white">
              No products found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <Link href={`/products/${p.slug}`} key={p.id} className="group bg-white rounded-2xl p-3 border border-gray-50 shadow-sm hover:shadow-md transition-shadow relative cursor-pointer flex flex-col">
                    
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" 
                        style={{ backgroundImage: `url('${getImageUrl(p.thumbnail)}')` }}
                      ></div>
                      
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-[#8c5a35] transition-colors shadow-sm"
                      >
                        <Heart size={16} />
                      </button>

                      {p.discount > 0 && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded shadow-sm">
                          Sale
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="px-1 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1 truncate">{p.name}</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</span>
                          {p.oldPrice && parseFloat(p.oldPrice) > 0 && (
                            <span className="text-[11px] text-gray-400 line-through">{formatPrice(p.oldPrice)}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-[#a87f54] text-[#a87f54]" />
                          <span className="text-[11px] font-bold text-gray-900">{p.rating || "4.5"}</span>
                          <span className="text-[11px] text-gray-400">({p.reviews || "12"})</span>
                        </div>
                        
                        <button 
                          onClick={(e) => handleAddToCart(e, p)}
                          className="p-2.5 text-white rounded-lg transition-colors shadow-sm relative z-10"
                          style={{ backgroundColor: brandGreen }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a4d36'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = brandGreen}
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-12">
                <button className="w-10 h-10 rounded-full bg-[#5d6044] text-white text-sm font-bold">1</button>
                {[2, 3, 4].map(num => (
                  <button key={num} className="w-10 h-10 rounded-full border border-gray-100 text-gray-400 text-sm font-bold hover:bg-gray-50 transition-colors">{num}</button>
                ))}
                <span className="text-gray-400">...</span>
                <button className="w-10 h-10 rounded-full border border-gray-100 text-gray-400 text-sm font-bold">10</button>
                <button className="w-10 h-10 rounded-full border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}