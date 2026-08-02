'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import { 
  Minus, Plus, Trash2, ArrowLeft, Lock, ChevronRight, Loader2, MapPin, X, User
} from 'lucide-react'; // Added 'User' icon

export default function CartPage() {
  const brandBrown = "#8c5a35"; 
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false); 
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- Login Check State
  
  // Modal State for New Address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // टोकन प्राप्त करने के लिए हेल्पर फंक्शन
  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  };

  // Check Login Status and Fetch Addresses on Mount
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token); // <-- Set Login State

    const fetchAddresses = async () => {
      try {
        if (!token) {
          setIsAddressLoading(false);
          return; // अगर टोकन नहीं है तो API कॉल न करें
        }

        const res = await fetch('/api/addresses', {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setAddresses(data.addresses);
          if (data.addresses.length > 0) {
            setSelectedAddressId(data.addresses[0].id);
          }
        } else if (res.status === 401) {
           console.log("Unauthorized, token might be invalid or expired.");
        }
      } catch (error) {
        console.error("Failed to fetch addresses");
      } finally {
        setIsAddressLoading(false);
      }
    };
    
    fetchAddresses();
  }, []);

  const handleUpdateQuantity = (id, delta) => {
    dispatch(updateQuantity({ id, delta }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // CALCULATIONS (Discount Removed)
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = 0; // डिस्काउंट 0 कर दिया गया है
  const total = subtotal; // अब टोटल सीधे सबटोटल के बराबर होगा

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

  // ================= RAZORPAY INTEGRATION =================
// ================= CASHFREE INTEGRATION =================
  
  // 1. Load Cashfree SDK
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

  // 2. Handle Checkout Process
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      return alert("Please select a delivery address to proceed.");
    }

    const token = getToken();
    if (!token) {
      return alert("Please login to proceed with checkout.");
    }

    setIsProcessing(true);

    const isLoaded = await loadCashfreeScript();
    if (!isLoaded) {
      alert("Cashfree SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // Step A: Create Order API Call
      const orderData = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          discount, 
          total,
          addressId: selectedAddressId 
        }),
      }).then((t) => t.json());

      // Ensure backend returns payment_session_id
      if (orderData.error || !orderData.payment_session_id) {
        alert(orderData.error || "Failed to initiate Cashfree payment session.");
        setIsProcessing(false);
        return;
      }

      // Step B: Initialize Cashfree
      const cashfree = window.Cashfree({
        mode: "sandbox", // लाइव करते समय इसे "production" कर दें
      });

      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal", // इससे यूजर उसी पेज पर रहेगा
      };

      // Step C: Open Cashfree Modal & Handle Payment Response
      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          alert(`Payment Failed: ${result.error.message}`);
          setIsProcessing(false);
        }
        
        if (result.paymentDetails) {
          // Step D: Verify Payment on Backend
          const verifyData = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
              orderId: orderData.order_id 
            }),
          }).then((t) => t.json());

          if (verifyData.success) {
            dispatch(clearCart());
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
  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 lg:p-12 font-sans text-gray-800">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-baseline mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          Your Cart <span className="text-xl font-sans font-normal text-gray-500">({cartItems.length} Items)</span>
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= LEFT: PRODUCTS TABLE ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 bg-[#f5f4ef] p-4 text-[11px] font-bold uppercase tracking-widest text-gray-900">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {cartItems.length === 0 ? (
               <div className="p-8 text-center text-gray-500">Your cart is empty.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                    <div className="col-span-1 md:col-span-6 flex gap-4">
                      <div className="w-20 h-20 md:w-28 md:h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{item.name}</h3>
                        <p className="text-xs font-medium text-green-600 mt-2">In Stock</p>
                      </div>
                    </div>
                    <div className="hidden md:block col-span-2 text-center font-bold text-sm">
                      ₹{item.price.toLocaleString()}
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-2 hover:bg-gray-50 text-gray-400">
                          <Minus size={14} />
                        </button>
                        <span className="px-4 text-sm font-bold w-10 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-2 hover:bg-gray-50 text-gray-400">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                      <span className="font-bold text-sm md:text-base" style={{ color: brandBrown }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Link href="/products" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* ================= RIGHT: ADDRESS & SUMMARY ================= */}
        <div className="space-y-6">
          
          {/* Address Selection Section (Only visible if logged in and cart is not empty) */}
          {isLoggedIn && cartItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={18} style={{ color: brandBrown }}/> Delivery Address
                </h2>
                <button onClick={() => setShowAddressModal(true)} className="text-xs font-bold text-[#8c5a35] hover:underline">
                  + Add New
                </button>
              </div>

              {isAddressLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" size={24}/></div>
              ) : addresses.length === 0 ? (
                <div className="text-sm text-gray-500 py-2 border border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50">
                  No addresses found. Please add one to proceed.
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#8c5a35] bg-[#fcfaf7]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#8c5a35]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900">{addr.fullName}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-xs text-gray-600 font-medium mt-1">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order Summary Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-serif font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cartItems.length} Items)</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold" style={{ color: brandBrown }}>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* ================= CONDITIONAL CHECKOUT BUTTON ================= */}
              {cartItems.length === 0 ? (
                <button 
                  disabled
                  className="w-full flex items-center justify-center gap-3 py-4 mt-4 rounded-xl text-white font-bold opacity-50 cursor-not-allowed transition-all" 
                  style={{ backgroundColor: brandBrown }}
                >
                  <Lock size={18} /> Cart is Empty
                </button>
              ) : !isLoggedIn ? (
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center justify-center gap-3 py-4 mt-4 rounded-xl text-white font-bold transition-all hover:opacity-90 shadow-lg shadow-[#8c5a35]/20" 
                  style={{ backgroundColor: brandBrown }}
                >
                  <User size={18} /> Login to Checkout
                </button>
              ) : (
                <button 
                  disabled={isProcessing || addresses.length === 0}
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-3 py-4 mt-4 rounded-xl text-white font-bold transition-all hover:opacity-90 shadow-lg shadow-[#8c5a35]/20 disabled:opacity-50 disabled:cursor-not-allowed" 
                  style={{ backgroundColor: brandBrown }}
                >
                  {isProcessing ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    <><Lock size={18} /> Proceed to Checkout</>
                  )}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddNewAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input required type="text" value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="John Doe"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                <input required type="text" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="10-digit number"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Address (Street, Area)</label>
                <textarea required value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="123 Main Street..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                  <input required type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="City"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
                  <input required type="text" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="State"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pincode</label>
                <input required type="text" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="e.g. 400001"/>
              </div>
              
              <button type="submit" className="w-full py-3 mt-4 text-white font-bold rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: brandBrown }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}