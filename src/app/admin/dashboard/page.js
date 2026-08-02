'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Home, Box, Grid, ShoppingBag, Users, Tag, Star, Image as ImageIcon,
  Archive, Truck, CreditCard, BarChart2, Settings, UserCircle, Shield, LogOut,
  Menu, Search, Bell, Calendar, ChevronDown, ArrowUp, Eye, ChevronRight,
  ShoppingCart,
  User
} from 'lucide-react';
import CategoryManager from '@/components/admin/CategoryManager';
import AddProductPage from '@/components/admin/Products';
import AdminOrdersPage from '@/components/admin/orders';
import UsersList from '@/components/admin/UsersList';

export default function AdminDashboard() {
  const router = useRouter();
  const brandBrown = "#8c5a35";

  // ================= STATE MANAGEMENT =================
  const [activeTab, setActiveTab] = useState('Dashboard');

  // ================= LOGOUT HANDLER =================
  const handleLogout = () => {
    // 1. Clear Local Storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');

    // 2. Clear Cookies
    document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 3. Redirect to login page
    router.push('/admin/login');
  };

  // ================= DUMMY DATA =================
  const salesData = [
    { name: '13 May', revenue: 10000 },
    { name: '14 May', revenue: 30000 },
    { name: '15 May', revenue: 45000 },
    { name: '16 May', revenue: 68000 }, // Peak
    { name: '17 May', revenue: 48000 },
    { name: '18 May', revenue: 30000 },
    { name: '19 May', revenue: 58000 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 652, color: '#10b981' }, // Emerald
    { name: 'Processing', value: 312, color: '#3b82f6' }, // Blue
    { name: 'Shipped', value: 184, color: '#f59e0b' }, // Amber
    { name: 'Cancelled', value: 100, color: '#8b5cf6' }, // Purple
  ];

  const recentOrders = [
    { id: '#ORD12548', name: 'Rohan Sharma', email: 'rohan@gmail.com', date: '19 May 2024', time: '10:30 AM', amount: '₹29,999', status: 'Delivered', avatar: '/avatar1.jpg' },
    { id: '#ORD12547', name: 'Priya Verma', email: 'priya@gmail.com', date: '19 May 2024', time: '09:15 AM', amount: '₹24,999', status: 'Processing', avatar: '/avatar2.jpg' },
    { id: '#ORD12546', name: 'Amit Patel', email: 'amit@gmail.com', date: '18 May 2024', time: '08:45 PM', amount: '₹15,499', status: 'Shipped', avatar: '/avatar3.jpg' },
    { id: '#ORD12545', name: 'Neha Singh', email: 'neha@gmail.com', date: '18 May 2024', time: '06:20 PM', amount: '₹8,999', status: 'Delivered', avatar: '/avatar4.jpg' },
    { id: '#ORD12544', name: 'Vikram Joshi', email: 'vikram@gmail.com', date: '18 May 2024', time: '03:10 PM', amount: '₹12,499', status: 'Cancelled', avatar: '/avatar5.jpg' },
  ];

  const topProducts = [
    { name: 'Luxe Comfort Sofa', sold: 210, revenue: '₹6,29,790', image: '/p1.jpg' },
    { name: 'Solid Wood Dining Table', sold: 168, revenue: '₹4,19,832', image: '/p2.jpg' },
    { name: 'Modern Lounge Chair', sold: 142, revenue: '₹2,14,580', image: '/p3.jpg' },
    { name: 'King Size Bed', sold: 120, revenue: '₹3,59,880', image: '/p4.jpg' },
    { name: 'Bookshelf', sold: 98, revenue: '₹1,32,300', image: '/p7.jpg' },
  ];

  const sidebarMenu = [
    { icon: Box, label: 'Products', hasSub: true },
    { icon: Grid, label: 'Categories' },
    { icon: ShoppingBag, label: 'Orders',  },
    { icon: User, label: 'Users', },
    { icon: Settings, label: 'Settings', divider: true },
    { icon: LogOut, label: 'Logout' },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans overflow-hidden text-gray-800">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[260px] bg-[#1a1c23] text-gray-400 flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
          <div className="p-1.5 border border-orange-400 rounded-lg text-orange-400">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-white font-serif font-bold tracking-widest text-lg leading-tight">FURNITURE</h1>
            <p className="text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {sidebarMenu.map((item, idx) => (
            <div key={idx}>
              {item.divider && <div className="h-px bg-gray-800 my-4 mx-2"></div>}
              <div
                onClick={() => {
                  if (item.label === 'Logout') {
                    handleLogout();
                  } else {
                    setActiveTab(item.label);
                  }
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
                activeTab === item.label ? 'bg-[#8c5a35] text-white' : 'hover:bg-gray-800 hover:text-white'
              }`}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.hasSub && <ChevronRight size={16} />}
                {item.badge && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-xl cursor-pointer hover:bg-gray-800">
            <div className="flex items-center gap-3">
              <img src="/admin-avatar.jpg" alt="Admin" className="w-10 h-10 rounded-full bg-gray-600" />
              <div>
                <p className="text-white text-sm font-bold">Admin</p>
                <p className="text-[#10b981] text-[10px] font-bold">Super Administrator</p>
              </div>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top Header */}
        <header className="bg-white h-[72px] px-8 flex items-center justify-between border-b border-gray-100 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-900"><Menu size={24} /></button>
            <h2 className="text-xl font-bold text-gray-900">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search here..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-[#8c5a35]/20" />
            </div>
            <button className="relative text-gray-500 hover:text-gray-900">
              <Bell size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">5</span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer border-l pl-6">
              <img src="/admin-avatar.jpg" alt="Admin" className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="text-sm font-bold text-gray-900">Admin</span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

          {/* ================= CONDITIONAL RENDERING BASED ON ACTIVE TAB ================= */}

          {activeTab === 'Products' && (
            <div className="w-full">
              <AddProductPage />
            </div>
          )}

          {activeTab === 'Categories' && (
            <div className="w-full">
             <CategoryManager />
            </div>
          )}

          {activeTab === 'Orders' && (
            <div className="w-full">
             <AdminOrdersPage />
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="w-full">
             <UsersList />
            </div>
          )}

          {/* Default Dashboard View */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Date Filter */}
              <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer shadow-sm">
                  <Calendar size={16} className="text-gray-500" />
                  <span>13 May 2024 - 19 May 2024</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0"><ShoppingCart size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,248</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-medium"><ArrowUp size={12}/> 18.5% <span className="text-gray-400">from last week</span></p>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0"><CreditCard size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹12,45,680</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-medium"><ArrowUp size={12}/> 22.3% <span className="text-gray-400">from last week</span></p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0"><Users size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                    <h3 className="text-2xl font-bold text-gray-900">3,682</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-medium"><ArrowUp size={12}/> 16.8% <span className="text-gray-400">from last week</span></p>
                  </div>
                </div>
                {/* Card 4 */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0"><Box size={24} /></div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-900">856</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-medium"><ArrowUp size={12}/> 8.3% <span className="text-gray-400">from last week</span></p>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Sales Overview (Line Chart) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Sales Overview</h3>
                    <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer">
                      This Week <ChevronDown size={14} />
                    </div>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(value) => `${value/1000}K`} />
                        <Tooltip
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Order Status (Donut Chart) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-900">Order Status</h3>
                    <button className="text-xs font-bold text-gray-500 hover:text-gray-900">View All</button>
                  </div>
                  <div className="flex flex-col items-center justify-center relative h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text inside Donut */}
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-gray-900">1,248</span>
                      <span className="text-xs text-gray-500">Total</span>
                    </div>
                  </div>
                  {/* Custom Legend */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-2">
                    {orderStatusData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-600">{item.name}</span>
                        <span className="text-xs font-medium text-gray-400 ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden">
                  <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Recent Orders</h3>
                    <button className="text-xs font-bold text-gray-500 hover:text-gray-900">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentOrders.map((order, idx) => {
                          // Status Badge styling logic
                          let badgeStyle = "";
                          if (order.status === 'Delivered') badgeStyle = "bg-emerald-100 text-emerald-600";
                          else if (order.status === 'Processing') badgeStyle = "bg-blue-100 text-blue-600";
                          else if (order.status === 'Shipped') badgeStyle = "bg-orange-100 text-orange-600";
                          else if (order.status === 'Cancelled') badgeStyle = "bg-red-100 text-red-600";

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={order.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                                  <div>
                                    <p className="text-sm font-bold text-gray-900">{order.name}</p>
                                    <p className="text-xs text-gray-500">{order.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-900">{order.date}</p>
                                <p className="text-xs text-gray-500">{order.time}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-md text-[11px] font-bold ${badgeStyle}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Top Selling Products</h3>
                    <button className="text-xs font-bold text-gray-500 hover:text-gray-900">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase text-center">Sold</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {topProducts.map((product, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt="" className="w-10 h-10 rounded-lg bg-gray-100 object-cover" />
                                <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 text-center">{product.sold}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{product.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Fallback for other tabs */}
          {!['Dashboard', 'Products', 'Categories', 'Orders', 'Users'].includes(activeTab) && (
             <div className="flex items-center justify-center h-full">
               <h1 className="text-2xl font-bold text-gray-400">Content for {activeTab} is under construction.</h1>
             </div>
          )}

        </div>
      </main>

      {/* Global Custom Scrollbar Style for Sidebar and Main Content */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        aside.custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
