'use client';

import React, { useState, useEffect, use } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice'; // Update path if needed
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, ChevronLeft, Star, Truck, ShieldCheck, Award, 
  Minus, Plus, ShoppingCart, Loader2, MapPin, X, Heart, 
  Maximize2, RotateCcw
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetails({ params }) {
  const brandBrown = "#a66a38"; 
  const brandGreen = "#7a8a6b";
  const API_BASE_URL = '';

  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = use(params);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // NEW STATE
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for interactive UI
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  
  // Mock States for Selectors 
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [selectedColor, setSelectedColor] = useState('Default');
  const [selectedMaterial, setSelectedMaterial] = useState('Fabric');
  const [pincode, setPincode] = useState('');

  // States for Checkout & Address
  const [isProcessing, setIsProcessing] = useState(false); 
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  };

  // ================= FETCH PRODUCT & RELATED & ADDRESSES =================
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.thumbnail); 

          // === FETCH RELATED PRODUCTS (Using categoryId) ===
          if (data.product.categoryId) {
            fetchRelatedProducts(data.product.categoryId, data.product.id);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        setError('Server error while fetching product');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedProducts = async (catId, currentProductId) => {
      try {
        const res = await fetch(`/api/categories/${catId}/products`);
        const data = await res.json();
        if (data.success && data.products) {
          // Remove the current product from the related list
          const filtered = data.products.filter(p => p.id !== currentProductId);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch related products", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIsAddressLoading(false);
          return; 
        }
        const res = await fetch('/api/addresses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setAddresses(data.addresses);
          if (data.addresses.length > 0) {
            setSelectedAddressId(data.addresses[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses");
      } finally {
        setIsAddressLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
      fetchAddresses();
    }
  }, [slug]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg'; 
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  // ================= ADD TO CART =================
  const handleAddToCart = () => {
    const numericPrice = parseFloat(product.price) || 0;
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: numericPrice,
        image: getImageUrl(product.thumbnail),
        specs: `Size: ${selectedSize}, Color: ${selectedColor}, Mat: ${selectedMaterial}`,
        inStock: product.stock > 0
      }));
    }
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  // ================= ADD NEW ADDRESS =================
  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      
      if (data.success) {
        setAddresses([data.address, ...addresses]);
        setSelectedAddressId(data.address.id);
        setShowAddressModal(false);
        setNewAddress({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
      } else {
        alert(data.message || "Failed to add address");
      }
    } catch (error) {
      alert("Something went wrong while adding address.");
    }
  };

  // ================= BUY NOW (RAZORPAY CHECKOUT) =================
  // ================= BUY NOW (CASHFREE CHECKOUT) =================
  const handleBuyNowClick = () => {
    const token = getToken();
    if (!token) return alert("Please login to purchase items.");
    setCheckoutStep(true);
  };

  // 1. Load the Cashfree SDK Script
  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. Process Payment via Cashfree
  const processPayment = async () => {
    if (!selectedAddressId) return alert("Please select a delivery address.");
    
    setIsProcessing(true);

    const isLoaded = await loadCashfreeScript();
    if (!isLoaded) {
      alert("Cashfree SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      const numericPrice = parseFloat(product.price) || 0;
      const totalAmount = numericPrice * quantity;

      // STEP A: Create the order on your backend
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}` 
        },
        body: JSON.stringify({
          items: [{
            id: product.id,
            name: product.name,
            price: numericPrice,
            quantity: quantity,
            image: getImageUrl(product.thumbnail)
          }],
          subtotal: totalAmount,
          total: totalAmount,
          addressId: selectedAddressId 
        }),
      });
      
      const orderData = await response.json();

      // Ensure your backend returns the payment_session_id from Cashfree
      if (orderData.error || !orderData.payment_session_id) {
        alert(orderData.error || "Failed to initiate Cashfree payment session.");
        setIsProcessing(false);
        return;
      }

      // STEP B: Initialize Cashfree
      const cashfree = window.Cashfree({
        mode: "sandbox", // Change to "production" when deploying live
      });

      // STEP C: Open the Cashfree Checkout Modal
      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal", // Keeps the user on the same page
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          alert(`Payment Failed: ${result.error.message}`);
          setIsProcessing(false);
        }
        
        if (result.paymentDetails) {
          // STEP D: Verify payment status on your backend
          const verifyData = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}` 
            },
            body: JSON.stringify({
              orderId: orderData.order_id, // Pass the Cashfree order ID to verify
            }),
          }).then((t) => t.json());

          if (verifyData.success) {
            setCheckoutStep(false);
            router.push("/success"); 
          } else {
            alert("Payment Verification Failed!");
            setIsProcessing(false);
          }
        }
      });

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
      setIsProcessing(false);
    } 
  };

  // ================= RENDER =================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#8c5a35] w-12 h-12" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Product Not Found"}</h2>
          <Link href="/" className="text-[#8c5a35] hover:underline font-medium">Return to Home</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.thumbnail, ...(product.images?.map(img => img.image) || [])];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-gray-900">Shop</Link>
          <ChevronRight size={14} />
          <Link href={`/category/${product.categoryId}`} className="hover:text-gray-900 capitalize">{product.categoryName || 'Category'}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ================= LEFT: IMAGE GALLERY ================= */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 h-[500px] md:h-[600px]">
            {/* Vertical Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide md:w-24 shrink-0 pb-2 md:pb-0">
              {allImages.slice(0, 5).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 md:w-full md:h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all bg-[#f7f5f0] ${activeImage === img ? 'border-[#a66a38]' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover mix-blend-multiply" />
                  {idx === 4 && allImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium text-sm">
                      +{allImages.length - 5}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 bg-[#f7f5f0] rounded-xl overflow-hidden flex items-center justify-center group">
              {product.discount > 0 && (
                 <span className="absolute top-4 left-4 bg-[#a66a38] text-white text-xs font-bold px-3 py-1 rounded">Sale {product.discount}%</span>
              )}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-gray-700 transition">
                <ChevronLeft size={24} />
              </button>
              <img 
                src={getImageUrl(activeImage)} 
                alt={product.name} 
                className="w-[85%] h-[85%] object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-gray-700 transition">
                <ChevronRight size={24} />
              </button>
              <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm text-gray-700 transition">
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* ================= RIGHT: PRODUCT INFO ================= */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-[#a66a38]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < 4 ? "fill-current" : i === 4 ? "fill-current opacity-50" : ""} />
                ))}
                <span className="text-gray-900 font-medium ml-2 text-sm">4.8 (120 Reviews)</span>
              </div>
            </div>

            {/* UPDATED: Price, Old Price, Discount */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
              {/* Sirf tabhi dikhao jab oldPrice exist ho aur price ke barabar na ho */}
              {product.oldPrice && parseFloat(product.oldPrice) !== parseFloat(product.price) && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{parseFloat(product.oldPrice).toLocaleString()}</span>
                </>
              )}
              {/* Discount from API Database */}
              {product.discount > 0 && (
                <span className="text-sm font-bold bg-[#fdf2e9] text-[#a66a38] px-2 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-6">Inclusive of all taxes</p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.shortDescription || "Experience unmatched comfort with our Luxe Comfort Sofa. Designed with a perfect blend of style, durability, and premium quality fabric."}
            </p>

            {/* Options UI */}
            <div className="space-y-6 mb-8">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                 <h3 className="text-sm font-semibold text-gray-900">Quantity</h3>
                 <div className="flex items-center border border-gray-200 rounded-md bg-white w-28 h-10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <Plus size={16} />
                    </button>
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-md text-white font-medium transition-all bg-[#9d5c2e] hover:bg-[#864c24] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button 
                  onClick={handleBuyNowClick}
                  disabled={product.stock === 0 || isProcessing}
                  className="flex-1 h-12 flex items-center justify-center gap-2 rounded-md text-gray-900 bg-white border border-gray-900 font-medium transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
              <button className="w-full h-12 flex items-center justify-center gap-2 rounded-md text-gray-700 bg-white border border-gray-200 font-medium transition-all hover:bg-gray-50">
                <Heart size={18} /> Add to Wishlist
              </button>
            </div>

            {/* Delivery Availability */}
            <div className="border border-gray-200 rounded-lg p-4 bg-[#faf9f6]">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={18} className="text-gray-700" />
                <span className="text-sm font-semibold text-gray-900">Check Delivery Availability</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter your pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded bg-white px-3 py-2 text-sm outline-none focus:border-[#a66a38]" 
                />
                <button className="px-4 py-2 border border-[#a66a38] text-[#a66a38] text-sm font-medium rounded hover:bg-orange-50/50 transition">
                  Check
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ================= FEATURES BAR ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-200 my-12">
          <div className="flex items-center gap-3">
            <Truck size={32} strokeWidth={1} className="text-[#a66a38]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
              <p className="text-xs text-gray-500">On orders above ₹9999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw size={32} strokeWidth={1} className="text-[#a66a38]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
              <p className="text-xs text-gray-500">Within 7 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award size={32} strokeWidth={1} className="text-[#a66a38]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">1 Year Warranty</p>
              <p className="text-xs text-gray-500">On structural parts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={32} strokeWidth={1} className="text-[#a66a38]" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
              <p className="text-xs text-gray-500">100% safe & secure</p>
            </div>
          </div>
        </div>

        {/* ================= TABS SECTION ================= */}
        <div className="mb-16">
          <div className="flex overflow-x-auto border-b border-gray-200 gap-8 mb-8 scrollbar-hide">
            {['Description', 'Specifications', 'Reviews (120)'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === tab ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {activeTab === 'Description' && (
              <>
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {product.description || "The Luxe Comfort Sofa is crafted for those who value luxury and relaxation."}
                  </p>
                </div>
                <div className="bg-gray-50 p-8 flex items-center justify-center rounded-xl">
                  <img src={getImageUrl(product.thumbnail)} alt="Product View" className="w-full max-w-sm h-auto opacity-80 mix-blend-multiply" />
                </div>
              </>
            )}
            
            {activeTab === 'Specifications' && (
              <div className="col-span-1 w-full bg-gray-50 rounded-xl p-6 border border-gray-100">
                <ul className="space-y-4">
                  <li className="flex justify-between border-b pb-2 text-sm"><span className="text-gray-500">Material</span><span className="font-medium text-gray-900">{product.material || '-'}</span></li>
                  <li className="flex justify-between border-b pb-2 text-sm"><span className="text-gray-500">Color</span><span className="font-medium text-gray-900">{product.color || '-'}</span></li>
                  <li className="flex justify-between border-b pb-2 text-sm"><span className="text-gray-500">Dimensions</span><span className="font-medium text-gray-900">{product.dimensions || '-'}</span></li>
                  <li className="flex justify-between border-b pb-2 text-sm"><span className="text-gray-500">Weight</span><span className="font-medium text-gray-900">{product.weight || '-'}</span></li>
                  <li className="flex justify-between pb-2 text-sm"><span className="text-gray-500">Warranty</span><span className="font-medium text-gray-900">{product.warranty || '-'}</span></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp) => (
                <Link href={`/products/${rp.slug}`} key={rp.id} className="group flex flex-col border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition bg-white">
                  <div className="relative aspect-square bg-[#f7f5f0] p-4 flex items-center justify-center">
                    <img 
                      src={getImageUrl(rp.thumbnail)} 
                      alt={rp.name} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                    />
                    {rp.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-[#a66a38] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                        {rp.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">{rp.name}</h3>
                    <p className="text-xs text-gray-500 mb-2 truncate">{rp.shortDescription || rp.categoryName}</p>
                    <div className="mt-auto flex items-baseline gap-2">
                      <span className="font-bold text-gray-900 text-lg">₹{parseFloat(rp.price).toLocaleString()}</span>
                      {rp.oldPrice && parseFloat(rp.oldPrice) !== parseFloat(rp.price) && (
                        <span className="text-xs text-gray-400 line-through">₹{parseFloat(rp.oldPrice).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= CHECKOUT / ADDRESS SELECTION MODAL ================= */}
      {checkoutStep && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#a66a38]" /> 
                Select Delivery Address
              </h3>
              <button 
                onClick={() => setCheckoutStep(false)} 
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-700">Saved Addresses</h4>
                <button 
                  onClick={() => setShowAddressModal(true)} 
                  className="text-xs font-bold text-[#a66a38] hover:underline"
                >
                  + Add New Address
                </button>
              </div>

              {isAddressLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#a66a38]" size={28}/></div>
              ) : addresses.length === 0 ? (
                <div className="text-sm text-center text-gray-500 py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 mb-6">
                  No addresses found. Please add a new address to continue with your purchase.
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {addresses.map((addr) => (
                    <label 
                      key={addr.id} 
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#a66a38] bg-orange-50/30' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        name="checkout_address" 
                        checked={selectedAddressId === addr.id} 
                        onChange={() => setSelectedAddressId(addr.id)} 
                        className="mt-1 accent-[#a66a38] w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-sm text-gray-900">
                          {addr.fullName} <span className="text-xs font-normal text-gray-500 ml-2">{addr.phone}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {addr.address}, {addr.city}, {addr.state} - <span className="font-medium">{addr.pincode}</span>
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-gray-900">₹{(parseFloat(product.price) * quantity).toLocaleString()}</p>
                </div>
                <button 
                  onClick={processPayment} 
                  disabled={!selectedAddressId || isProcessing}
                  className="bg-[#9d5c2e] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-[#864c24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddNewAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input required type="text" value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#a66a38]" placeholder="John Doe"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                <input required type="text" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#a66a38]" placeholder="10-digit number"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Address (Street, Area)</label>
                <textarea required value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#a66a38]" placeholder="123 Main Street..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                  <input required type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#a66a38]" placeholder="City"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
                  <input required type="text" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#a66a38]" placeholder="State"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pincode</label>
                <input required type="text" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#a66a38]" placeholder="e.g. 400001"/>
              </div>
              
              <button type="submit" className="w-full py-3 mt-4 text-white font-bold rounded-lg transition-colors hover:bg-[#864c24]" style={{ backgroundColor: brandBrown }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
    <Footer/>
    </>
  );
}