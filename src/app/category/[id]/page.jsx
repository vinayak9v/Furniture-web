'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice'; 
import { Heart, ShoppingCart, Star, Loader2, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CategoryProductsPage({ params }) {
  const brandGreen = "#5d6044";
  const API_BASE_URL = '';
  
  const dispatch = useDispatch();
  const { id: categoryId } = use(params);

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}/products`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
          setCategoryName(data.categoryName);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Server connection error');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) fetchCategoryProducts();
  }, [categoryId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg'; 
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().includes('₹') ? price : `₹${price}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
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
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fdfbf7] py-12 px-4 md:px-8 font-sans">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight size={14} />
              <Link href="/products" className="hover:text-gray-900">Categories</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900 font-medium capitalize">{categoryName || 'Loading...'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 capitalize">
              {categoryName} Collection
            </h1>
            <p className="text-sm text-gray-500 mt-2">Showing {products.length} Products</p>
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
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-white">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((p) => (
                <Link href={`/products/${p.slug}`} key={p.id} className="group bg-white rounded-2xl p-3 border border-gray-50 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                  
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
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}