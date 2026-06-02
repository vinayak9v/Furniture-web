'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice'; // अपना सही पाथ दें
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, Star, Truck, ShieldCheck, Award, Minus, Plus, ShoppingCart, Loader2, MapPin, X, Lock 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ProductDetails({ params }) {
  const brandBrown = "#8c5a35";
  const brandGreen = "#5d6044";
  const API_BASE_URL = 'http://localhost:3000'; 

  const dispatch = useDispatch();
  const router = useRouter();
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for interactive UI
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // States for Checkout & Address
  const [isProcessing, setIsProcessing] = useState(false); 
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  // Token Helper
  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  };

  // ================= FETCH PRODUCT & ADDRESSES =================
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.thumbnail); 
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
        specs: `Color: ${product.color || 'Standard'}, Mat: ${product.material || 'Standard'}`,
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
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    const token = getToken();
    if (!token) return alert("Please login to purchase items.");
    if (!selectedAddressId) return alert("Please select a delivery address.");

    setIsProcessing(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      const numericPrice = parseFloat(product.price) || 0;
      const totalAmount = numericPrice * quantity;

      // 1. Create Order
      const orderData = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
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
          discount: 0,
          total: totalAmount,
          addressId: selectedAddressId 
        }),
      }).then((t) => t.json());

      if (orderData.error) {
        alert(orderData.error);
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "FURNITURE STORE",
        description: `Purchase: ${product.name}`,
        order_id: orderData.order.id, 
        handler: async function (response) {
          // 3. Verify Payment
          const verifyData = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: orderData.dbOrderId, 
              amount: totalAmount
            }),
          }).then((t) => t.json());

          if (verifyData.success) {
            router.push("/success"); 
          } else {
            alert("Payment Verification Failed!");
          }
        },
        theme: { color: brandBrown },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsProcessing(false);
    }
  };

  // ================= RENDER =================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <Loader2 className="animate-spin text-[#8c5a35] w-12 h-12" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Product Not Found"}</h2>
          <Link href="/" className="text-[#8c5a35] hover:underline font-medium">Return to Home</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.thumbnail, ...(product.images?.map(img => img.image) || [])];

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 lg:p-12 font-sans">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-gray-900">Products</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium capitalize">{product.categoryName || 'Category'}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* ================= LEFT: IMAGE GALLERY ================= */}
          <div className="space-y-4">
            <div className="w-full aspect-[4/3] md:aspect-square bg-[#f5f4ef] rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-4">
              <img 
                src={getImageUrl(activeImage)} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-[#f5f4ef] ${activeImage === img ? 'border-[#8c5a35]' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover mix-blend-multiply p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: PRODUCT INFO & CHECKOUT ================= */}
          <div className="flex flex-col">
            
            <p className="text-[#8c5a35] font-bold text-xs tracking-widest uppercase mb-2">
              {product.categoryName}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 font-bold text-xs">
                <Star size={12} className="fill-current" /> 4.8
              </div>
              <span className="text-sm text-gray-500 underline cursor-pointer">124 Reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
              {product.oldPrice && parseFloat(product.oldPrice) > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-1">₹{parseFloat(product.oldPrice).toLocaleString()}</span>
                  <span className="text-sm font-bold text-red-500 mb-1">({product.discount}% OFF)</span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {product.shortDescription || product.description}
            </p>

            {/* Actions: Quantity, Add to Cart & Buy Now */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl bg-white shrink-0 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-gray-50 text-gray-500 rounded-l-xl transition-colors">
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-4 hover:bg-gray-50 text-gray-500 rounded-r-xl transition-colors">
                    <Plus size={18} />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 flex items-center justify-center gap-3 rounded-xl text-[#5d6044] bg-white border-2 border-[#5d6044] font-bold transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
              </div>

              {/* Direct Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isProcessing}
                className="w-full h-14 flex items-center justify-center gap-3 rounded-xl text-white font-bold transition-all shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: brandGreen }}
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin" size={20} /> Processing...</>
                ) : (
                  <><Lock size={20} /> Buy It Now (₹{(parseFloat(product.price) * quantity).toLocaleString()})</>
                )}
              </button>
            </div>

            {/* ================= ADDRESS SELECTION ================= */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={16} style={{ color: brandBrown }}/> Select Delivery Address
                </h2>
                <button onClick={() => setShowAddressModal(true)} className="text-xs font-bold text-[#8c5a35] hover:underline">
                  + Add New
                </button>
              </div>

              {isAddressLoading ? (
                <div className="flex justify-center py-2"><Loader2 className="animate-spin text-gray-400" size={20}/></div>
              ) : addresses.length === 0 ? (
                <div className="text-xs text-gray-500 py-2 border border-dashed border-gray-200 rounded-lg p-3 text-center bg-gray-50">
                  No addresses found. Add an address to buy directly.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{addr.address}, {addr.city}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm bg-white p-6 rounded-2xl border border-gray-100 mb-8">
              <div>
                <span className="block text-gray-400 text-xs mb-1">SKU</span>
                <span className="font-bold text-gray-900">{product.sku || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Stock</span>
                <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}
                </span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Dimensions</span>
                <span className="font-bold text-gray-900">{product.dimensions || 'Standard'}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Material</span>
                <span className="font-bold text-gray-900">{product.material || 'Wood'}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Color</span>
                <span className="font-bold text-gray-900">{product.color || 'Natural'}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Warranty</span>
                <span className="font-bold text-gray-900">{product.warranty || '1 Year'}</span>
              </div>
            </div>

            {/* Features Banners */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-[#f5f4ef] px-3 py-2 rounded-lg">
                <Truck size={16} className="text-[#8c5a35]" /> Free Shipping
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-[#f5f4ef] px-3 py-2 rounded-lg">
                <ShieldCheck size={16} className="text-[#8c5a35]" /> Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-[#f5f4ef] px-3 py-2 rounded-lg">
                <Award size={16} className="text-[#8c5a35]" /> Top Quality
              </div>
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