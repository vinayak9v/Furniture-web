'use client'; // Next.js App Router में client-side state यूज़ करने के लिए ये ज़रूरी है

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Redirect के लिए इम्पोर्ट किया
import { 
  Mail, 
  Lock, 
  EyeOff, 
  Truck, 
  Award, 
  ShieldCheck, 
  Home,
  LockKeyhole
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter(); // <-- Router इनिशियलाइज़ किया

  // 1. स्टेट वैरिएबल्स बनाना
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. ईमेल वैलिडेशन फंक्शन
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 3. फॉर्म सबमिट हैंडलर (API Call)
  const handleLogin = async (e) => {
    e.preventDefault(); // पेज को रीलोड होने से रोकता है
    setError('');

    // दोनों फील्ड्स चेक करना
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    // ईमेल फॉर्मेट चेक करना
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // API कॉल शुरू
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // अगर HTTP स्टेटस एरर हो या API ने success: false भेजा हो
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid credentials. Please try again.');
      }

      // ================= SUCCESS =================
      // 1. Token और User Data को LocalStorage में सेव करें
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // ऑब्जेक्ट को स्ट्रिंग में बदलकर सेव करें
      }

      console.log('Login Successful:', data);
      
      // 2. सफलता का मैसेज दिखाएं (ऑप्शनल)
      // alert('Login Successful!'); 
      
      // 3. यूज़र को होमपेज या डैशबोर्ड पर भेज दें
      router.push('/'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // बटन को डिसेबल करने का लॉजिक (अगर दोनों फील्ड खाली हैं)
  const isButtonDisabled = !email || !password || isLoading;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans text-gray-800 bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: "url('/main.png')" }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl min-h-[650px] border border-white/40">
        
        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex md:w-1/2 relative p-8 lg:p-10 flex-col justify-between">
          <div className="relative z-10 flex items-center gap-3">
            
           <div className="flex items-center shrink-0">
       
            <img src="/logo (3).png" alt="Furniture Logo" className="h-10 md:h-14 w-auto object-contain" />

        </div>
          </div>

          <div className="relative z-10 mt-12 max-w-sm">
            <p className="text-[#8c5a35] font-bold mb-2 text-sm bg-white/60 inline-block px-3 py-1 rounded-md">Welcome Back!</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight drop-shadow-md">
              Login to Your<br />Account
            </h2>
            <p className="text-gray-900 font-medium text-sm pr-4 bg-white/50 p-3 rounded-lg backdrop-blur-md">
              Access your account to explore our exclusive collections and amazing offers.
            </p>
          </div>

          <div className="flex-grow"></div>

          <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-xl p-4 flex flex-row justify-between items-center gap-3 border border-white/50 shadow-lg">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#8c5a35]" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-xs text-gray-900">Free Delivery</h4>
                <p className="text-[10px] text-gray-600">On orders above ₹9999</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-3">
              <Award className="w-6 h-6 text-[#8c5a35]" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-xs text-gray-900">Premium Quality</h4>
                <p className="text-[10px] text-gray-600">Crafted with the<br/>finest materials</p>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-300 pl-3">
              <ShieldCheck className="w-6 h-6 text-[#8c5a35]" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-xs text-gray-900">Secure Payment</h4>
                <p className="text-[10px] text-gray-600">100% secure &<br/>safe checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col relative bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          
          <div className="absolute top-6 right-8 text-sm text-gray-600 hidden sm:block">
            Don't have an account? <a href="/register" className="text-[#8c5a35] font-semibold hover:underline">Register Now</a>
          </div>

          <div className="max-w-sm w-full mx-auto mt-12 flex-1 flex flex-col justify-center">
            <p className="text-[#a55c20] font-medium mb-1 text-base">Welcome Back!</p>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Login to Your Account</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter your credentials to access your account</p>

            {/* Error Message Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer">
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#8c5a35] focus:ring-[#8c5a35]"
                    defaultChecked 
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-[#8c5a35] hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isButtonDisabled}
                className={`w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-2 shadow-md 
                  ${isButtonDisabled 
                    ? 'bg-[#8c5a35]/60 cursor-not-allowed shadow-none' 
                    : 'bg-[#8c5a35] hover:bg-[#734a2b] shadow-[#8c5a35]/20'
                  }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
              <LockKeyhole className="w-3.5 h-3.5" />
              <p>Your data is safe with us. We never share your information.</p>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 sm:hidden">
               Don't have an account? <a href="/register" className="text-[#8c5a35] font-semibold hover:underline">Register Now</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}