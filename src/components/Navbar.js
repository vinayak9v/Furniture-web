'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { setCart } from '../app/store/cartSlice'; // अपना सही पाथ चेक कर लें
import { 
  Truck, Phone, Mail, ChevronDown, Search, User, ShoppingCart, Menu, X, Loader2
} from 'lucide-react';

export default function Navbar() {
  const brandColor = "#5d6044"; 
  const router = useRouter(); 
  const searchRef = useRef(null);
  
  // States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); 
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false); 

  // Search UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Redux
  const cartItems = useSelector((state) => state.cart?.items || []);
  const dispatch = useDispatch(); 

  // Close search dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Search Effect (Debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.products);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms का डिले

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Initial Load: Get Cart from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      dispatch(setCart(JSON.parse(savedCart)));
    }
  }, [dispatch]);

  // Initial Load: Fetch Categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories); 
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileClick = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSearchResultClick = (slug) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    router.push(`/products/${slug}`);
  };

  return (
    <div className="w-full font-sans shadow-sm relative sticky top-0 z-50 bg-white">
      
      {/* ================= TOP BAR ================= */}
      <div 
        className="hidden md:flex justify-between items-center px-4 md:px-8 py-2.5 text-white text-xs font-medium"
        style={{ backgroundColor: brandColor }}
      >
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5" />
          <span>Free Delivery on Orders Above ₹9999</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            <span>Call Us: +91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            <span>support@furniture.com</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <header className="bg-white px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        
        {/* 1. Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo (3).png" alt="Furniture Logo" className="h-10 md:h-14 w-auto object-contain" />
          </Link>
        </div>

        {/* 2. Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 relative">
          <Link href="/" className="text-[13px] font-bold text-[#5d6044] border-b-2 border-[#5d6044] pb-1 uppercase tracking-wide">
            Home
          </Link>
          <Link href="/products" className="text-[13px] font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide transition-colors">
            Shop 
          </Link>

          {/* === COLLECTIONS HOVER DROPDOWN === */}
          <div className="group relative">
            <Link href="/collections" className="text-[13px] font-bold text-gray-800 hover:text-[#5d6044] flex items-center gap-1 uppercase tracking-wide transition-colors py-2">
              Collections <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" strokeWidth={2.5}/>
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white shadow-xl rounded-xl border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="grid grid-cols-4 gap-6">
                {isLoadingCategories && <p className="col-span-4 text-center text-gray-500 text-sm py-4">Loading categories...</p>}
                {!isLoadingCategories && categories.length === 0 && <p className="col-span-4 text-center text-red-400 text-sm py-4">No categories available.</p>}
                {!isLoadingCategories && categories.length > 0 && (
                  categories.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`} className="flex flex-col items-center gap-3 group/item">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover/item:border-[#5d6044] transition-all duration-300 shadow-sm">
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-800 group-hover/item:text-[#5d6044] text-center">{category.name}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <Link href="/about" className="text-[13px] font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide transition-colors">About Us</Link>
          <Link href="/contact" className="text-[13px] font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide transition-colors">Contact Us</Link>
        </nav>

        {/* 3. Search Bar, Action Icons & Mobile Menu Button */}
        <div className="flex items-center gap-4 sm:gap-5 flex-1 lg:flex-none justify-end relative" ref={searchRef}>
          
          {/* Dynamic Search Box (Desktop & Medium Screens) */}
          <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-full sm:w-64 max-w-xs opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
            <input 
              type="text" 
              placeholder="Search furniture..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#5d6044]"
            />
            {isSearching ? (
              <Loader2 className="absolute right-2 top-2.5 text-gray-400 animate-spin" size={14} />
            ) : (
              searchQuery && <X className="absolute right-2 top-2.5 text-gray-400 cursor-pointer hover:text-gray-600" size={14} onClick={() => setSearchQuery('')} />
            )}
            
            {/* Float Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60] max-h-80 overflow-y-auto divide-y divide-gray-50">
                {searchResults.map((prod) => (
                  <div 
                    key={prod.id} 
                    onClick={() => handleSearchResultClick(prod.slug)}
                    className="p-3 flex gap-3 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <img src={prod.thumbnail} alt={prod.name} className="w-10 h-10 object-cover rounded-md bg-gray-50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">{prod.name}</h4>
                      <p className="text-[11px] text-[#5d6044] font-bold mt-0.5">₹{parseFloat(prod.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Button for Search Box */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)} 
            className={`hover:text-[#5d6044] transition-colors ${isSearchOpen ? 'text-[#5d6044]' : 'text-gray-800'}`}
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          <button onClick={handleProfileClick} className="hover:text-[#5d6044] transition-colors hidden sm:block">
            <User className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
          </button>
          
          <Link href="/cart">
            <button className="relative hover:text-[#5d6044] transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-800" strokeWidth={1.5} />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                  {totalCartItems}
                </span>
              )}
            </button>
          </Link>

          <button className="lg:hidden text-gray-800 hover:text-[#5d6044] transition-colors" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* ================= MOBILE NAVIGATION MENU ================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col py-4 px-6 gap-2">
            
            {/* Mobile Search Input directly inside menu */}
            <div className="relative my-2 w-full">
              <input 
                type="text" 
                placeholder="Search furniture..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              
              {/* Mobile Search Overlay Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden z-50 divide-y divide-gray-50">
                  {searchResults.map((prod) => (
                    <div key={prod.id} onClick={() => { toggleMobileMenu(); handleSearchResultClick(prod.slug); }} className="p-3 flex gap-3 items-center">
                      <img src={prod.thumbnail} alt={prod.name} className="w-10 h-10 object-cover rounded-md" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{prod.name}</h4>
                        <p className="text-xs text-[#5d6044] font-semibold">₹{parseFloat(prod.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/" className="text-sm font-bold text-[#5d6044] uppercase tracking-wide py-3 border-b border-gray-50" onClick={toggleMobileMenu}>Home</Link>
            <Link href="/products" className="text-sm font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide py-3 border-b border-gray-50" onClick={toggleMobileMenu}>Shop</Link>

            {/* Mobile Collections Toggle */}
            <div className="border-b border-gray-50">
              <button className="w-full text-left text-sm font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide py-3 flex justify-between items-center" onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}>
                Collections <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCollectionsOpen ? 'rotate-180' : ''}`} strokeWidth={2}/>
              </button>
              
              {isMobileCollectionsOpen && (
                <div className="grid grid-cols-2 gap-4 pb-4 pt-2">
                  {isLoadingCategories ? (
                    <p className="col-span-2 text-xs text-gray-500 py-2">Loading...</p>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <Link key={category.id} href={`/category/${category.id}`} onClick={toggleMobileMenu} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                        <img src={category.image} alt={category.name} className="w-10 h-10 rounded-full object-cover" />
                        <span className="text-xs font-semibold text-gray-700">{category.name}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="col-span-2 text-xs text-red-400 py-2">No categories found.</p>
                  )}
                </div>
              )}
            </div>

            <Link href="/about" className="text-sm font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide py-3 border-b border-gray-50" onClick={toggleMobileMenu}>About Us</Link>
            <Link href="/contact" className="text-sm font-bold text-gray-800 hover:text-[#5d6044] uppercase tracking-wide py-3" onClick={toggleMobileMenu}>Contact Us</Link>

            <div className="flex gap-6 pt-4 mt-2 border-t border-gray-100 sm:hidden">
              <button onClick={handleProfileClick} className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#5d6044]">
                <User className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] uppercase">Account</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}