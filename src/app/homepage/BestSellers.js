'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice'; 

export default function BestSellers() {
  const brandColor = "#5d6044";
  const API_BASE_URL = 'http://localhost:3000'; 

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?page=1&limit=5`);
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

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // <-- Link को ट्रिगर होने से रोकेगा
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
    <section className="w-full bg-white py-16 px-4 md:px-8 font-sans">
      <div className="max-w-[90rem] mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-6" style={{ backgroundColor: brandColor }}></div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: brandColor }}>
                Best Sellers
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Our Most Loved Pieces
            </h2>
          </div>

          <Link href="/products" className="flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-[#5d6044] transition-colors uppercase tracking-wider mb-1">
            View All Products <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        {error && (
          <div className="mb-8 text-center text-red-600 font-medium bg-red-50 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 size={36} className="animate-spin" style={{ color: brandColor }} />
            <p className="text-sm font-medium">Loading best sellers...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
            No products found right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {products.map((product) => (
              // <-- यहाँ Link ऐड किया गया है -->
              <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col relative cursor-pointer">
                
                <div className="relative w-full aspect-[4/3] sm:aspect-square bg-[#f5f4ef] rounded-xl overflow-hidden mb-4">
                  <div 
                    className="w-full h-full bg-cover bg-center mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${getImageUrl(product.thumbnail)}')` }}
                  ></div>
                  
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} // Wishlist पर क्लिक होने से रोके
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-[#5d6044] hover:bg-white shadow-sm transition-all"
                  >
                    <Heart className="w-4 h-4" strokeWidth={1.5} />
                  </button>

                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded shadow-sm">
                      Sale
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end gap-2 px-1">
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs font-medium text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Star className="w-3.5 h-3.5 fill-[#a87f54] text-[#a87f54]" />
                      <span>{product.rating || "4.5"}</span>
                      <span className="text-gray-400">({product.reviews || "12"})</span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleAddToCart(e, product)} // <-- e पास किया गया है
                    className="p-2.5 rounded-lg text-white transition-colors shadow-sm shrink-0 relative z-10"
                    style={{ backgroundColor: brandColor }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a4d36'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = brandColor}
                  >
                    <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>

              </Link>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}