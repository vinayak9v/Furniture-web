'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  BarChart3,
  Settings,
  Loader2
} from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const brandBrown = "#8c5a35";

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ================= API LOGIN HANDLER =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 1. Store Token & Admin Info in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));

        // 2. Set cookie for server-side middleware auth
        document.cookie = `adminToken=${data.token}; path=/; max-age=86400`;

        // 3. Redirect to Dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Failed to connect to the server. Check if the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* ================= LEFT SECTION (DARK PANEL) ================= */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-[#1a1a1a] text-white p-12 flex-col justify-between">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: "url('/admin-login-bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/60 to-[#8c5a35]/40"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-2 border border-orange-400 rounded-lg">
              <Settings className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-widest leading-none">FURNITURE</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </div>

          <h2 className="text-4xl font-serif font-bold mb-4">Welcome Back!</h2>
          <p className="text-gray-300 text-sm mb-12 max-w-xs">
            Login to your admin account to manage your store effectively.
          </p>

          {/* Feature List */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full border border-white/20"><ShieldCheck size={20} className="text-orange-400"/></div>
              <div><h4 className="font-bold text-sm">Secure Access</h4><p className="text-xs text-gray-400 mt-1">Your data is protected with advanced security</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full border border-white/20"><BarChart3 size={20} className="text-orange-400"/></div>
              <div><h4 className="font-bold text-sm">Analytics Overview</h4><p className="text-xs text-gray-400 mt-1">Track sales, orders & customer activity in real-time</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-full border border-white/20"><Settings size={20} className="text-orange-400"/></div>
              <div><h4 className="font-bold text-sm">Easy Management</h4><p className="text-xs text-gray-400 mt-1">Manage products, orders, customers & more</p></div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-gray-500 italic">© 2026 Furniture. All Rights Reserved.</p>
      </div>

      {/* ================= RIGHT SECTION (LOGIN FORM) ================= */}
      <div className="flex-1 bg-[#f8f9fa] flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#fcfaf7] rounded-full flex items-center justify-center text-[#8c5a35] mb-6 border border-gray-50">
              <Settings size={32} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-sm text-gray-400">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8c5a35] focus:ring-[#8c5a35]" />
                <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900">Remember Me</span>
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-[#8c5a35] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#8c5a35]/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Lock size={18} /> Login</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
