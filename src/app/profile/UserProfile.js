'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, ShoppingBag, MapPin, LogOut, Edit3, ChevronRight, Phone, Calendar, Crown, Check, X, Trash2, Loader2, Edit2
} from 'lucide-react';

export default function UserProfile() {
  const brandBrown = "#8c5a35";
  const router = useRouter();
  
  // ================= STATES =================
  const [activeTab, setActiveTab] = useState('My Profile'); // <-- Tab Switching State
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editing Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null); // Edit करने के लिए ID
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [profileRes, ordersRes, addressRes] = await Promise.all([
          fetch('/api/user/profile', { headers }),
          fetch('/api/orders', { headers }),
          fetch('/api/addresses', { headers })
        ]);

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();
        const addressData = await addressRes.json();

        if (profileData.success) {
          setProfile(profileData.profile);
          setNewName(profileData.profile.name);
        }
        if (ordersData.success) setOrders(ordersData.orders);
        if (addressData.success) setAddresses(addressData.addresses);

      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // ================= HANDLERS =================

  // 1. Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // 2. Update Name
  const handleUpdateName = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...profile, name: newName });
        setIsEditingName(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error updating name");
    }
  };

  // 3. Save Address (Add & Update)
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const isUpdating = !!editAddressId;
    const method = isUpdating ? 'PUT' : 'POST';
    const bodyData = isUpdating ? { ...addressForm, id: editAddressId } : addressForm;

    try {
      const res = await fetch('/api/addresses', {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      
      if (data.success) {
        if (isUpdating) {
          // Update local state array
          setAddresses(addresses.map(addr => addr.id === editAddressId ? { ...addr, ...addressForm } : addr));
        } else {
          // Add to local state array
          setAddresses([data.address, ...addresses]);
        }
        setShowAddressModal(false);
        setAddressForm({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
        setEditAddressId(null);
      } else {
        alert(data.message || "Failed to save address");
      }
    } catch (error) {
      alert("Something went wrong while saving address.");
    }
  };

  // Open Edit Modal
  const openEditModal = (addr) => {
    setAddressForm({
      fullName: addr.fullName, phone: addr.phone, address: addr.address,
      city: addr.city, state: addr.state, pincode: addr.pincode
    });
    setEditAddressId(addr.id);
    setShowAddressModal(true);
  };

  // 4. Delete Address
  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch('/api/addresses', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ id }) // ID body में भेज रहे हैं
      });
      if (res.ok) {
        setAddresses(addresses.filter(addr => addr.id !== id));
      }
    } catch (error) {
      alert("Error deleting address");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Sidebar Configuration (Reduced links)
  const sidebarLinks = [
    { name: "My Profile", icon: User },
    { name: "Orders", icon: ShoppingBag },
    { name: "Address Book", icon: MapPin },
  ];

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8c5a35] w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 lg:p-12 font-sans text-gray-800">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <nav className="flex flex-col">
              {sidebarLinks.map((link, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveTab(link.name)}
                  className={`flex items-center gap-4 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === link.name
                    ? "bg-[#fcf3eb] text-[#8c5a35] border-r-4 border-[#8c5a35]" 
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <link.icon size={18} />
                  {link.name}
                </button>
              ))}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors w-full text-left border-t border-gray-50"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>

       
       
        </aside>

        {/* ================= RIGHT CONTENT ================= */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* ----------------- TAB: MY PROFILE ----------------- */}
          {activeTab === 'My Profile' && (
            <>
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                  <div className="w-24 h-24 bg-[#f5f4ef] rounded-full flex items-center justify-center text-[#8c5a35] shrink-0">
                    <User size={48} strokeWidth={1} />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                        <input 
                          type="text" 
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)}
                          className="border border-[#8c5a35] px-3 py-1 rounded-md outline-none text-xl font-serif font-bold text-gray-900 w-full max-w-[200px]"
                        />
                        <button onClick={handleUpdateName} className="p-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200"><Check size={16}/></button>
                        <button onClick={() => {setIsEditingName(false); setNewName(profile.name);}} className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"><X size={16}/></button>
                      </div>
                    ) : (
                      <h2 className="text-2xl font-serif font-bold text-gray-900">{profile.name}</h2>
                    )}
                    <p className="text-sm text-gray-500 mt-1 lowercase">{profile.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Phone size={14} /> {profile.phone || 'Not Added'}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={14} /> Member since {formatDate(profile.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {!isEditingName && (
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="px-6 py-2 border border-[#8c5a35] text-[#8c5a35] rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#fcf3eb] transition-colors shrink-0"
                  >
                    Edit Name <Edit3 size={14} />
                  </button>
                )}
              </section>

              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-gray-900 tracking-wide uppercase text-sm">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Full Name</p>
                    <p className="text-sm font-bold text-gray-800">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Email Address</p>
                    <p className="text-sm font-bold text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-gray-800">{profile.phone || 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Password</p>
                      <p className="text-sm font-bold text-gray-800 tracking-widest">••••••••</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ----------------- TAB: ADDRESS BOOK ----------------- */}
          {activeTab === 'Address Book' && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 tracking-wide uppercase text-sm">Address Book</h3>
                <button 
                  onClick={() => {
                    setAddressForm({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
                    setEditAddressId(null);
                    setShowAddressModal(true);
                  }}
                  className="text-[#8c5a35] text-xs font-bold flex items-center gap-2 uppercase tracking-widest hover:underline"
                >
                  <MapPin size={14} /> Add New Address
                </button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="text-sm text-gray-500 py-12 border border-dashed border-gray-200 rounded-xl text-center bg-gray-50">
                  No addresses found. Add a new address to place orders.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-[#fcfaf7] p-6 rounded-2xl border border-gray-100 relative group">
                      <h4 className="font-bold text-gray-900 text-sm mb-2">{addr.fullName}</h4>
                      <div className="text-[13px] text-gray-500 space-y-1 leading-relaxed pr-12">
                        <p>{addr.address}</p>
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p>{addr.country}</p>
                        <p className="mt-2 pt-2 border-t border-gray-200/50">Phone: {addr.phone}</p>
                      </div>
                      
                      {/* Action Buttons (Edit & Delete) */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button 
                          onClick={() => openEditModal(addr)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-2 bg-white rounded-lg shadow-sm border border-gray-100"
                          title="Edit Address"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-white rounded-lg shadow-sm border border-gray-100"
                          title="Delete Address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ----------------- TAB: ORDERS ----------------- */}
          {activeTab === 'Orders' && (
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900 tracking-wide uppercase text-sm">My Orders</h3>
              </div>
              
              {orders.length === 0 ? (
                 <div className="text-sm text-gray-500 py-12 border border-dashed border-gray-200 rounded-xl text-center bg-gray-50">
                   You have no recent orders.
                 </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="py-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors px-4 rounded-xl -mx-4">
                      <div className="flex items-center gap-6 flex-1 w-full">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                          <img 
                            src={order.image?.startsWith('http') ? order.image : order.image}
                            alt={order.itemName} 
                            className="w-full h-full object-cover mix-blend-multiply" 
                            onError={(e) => e.target.src = '/placeholder-image.jpg'}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 mb-1 lowercase">Order #{order.orderNumber}</p>
                          <p className="text-sm font-medium text-gray-500 line-clamp-1">{order.itemName || 'Multiple Items'}</p>
                        </div>
                      </div>
                      <div className="text-center md:text-left w-full md:w-auto">
                        <p className="text-xs text-gray-400 mb-1">{formatDate(order.createdAt)}</p>
                        <p className="font-bold text-gray-900 text-sm">₹{parseFloat(order.totalAmount).toLocaleString()}</p>
                      </div>
                      <div className="w-full md:w-auto text-center">
                        <span className={`inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === "DELIVERED" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-[#8c5a35] text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-widest transition-colors w-full md:w-auto mt-2 md:mt-0">
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </main>
      </div>

      {/* ================= ADD/EDIT ADDRESS MODAL ================= */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-in-center">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">{editAddressId ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input required type="text" value={addressForm.fullName} onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="John Doe"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                <input required type="text" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="10-digit number"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Address</label>
                <textarea required value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="Street, Area, etc."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                  <input required type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="City"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
                  <input required type="text" value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="State"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pincode</label>
                <input required type="text" value={addressForm.pincode} onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35]" placeholder="Pincode"/>
              </div>
              
              <button type="submit" className="w-full py-3 mt-4 text-white font-bold rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: brandBrown }}>
                {editAddressId ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}