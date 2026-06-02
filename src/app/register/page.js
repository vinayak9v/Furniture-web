'use client'; 

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  EyeOff, 
  Truck, 
  Award, 
  ShieldCheck, 
  Home,
  LockKeyhole,
  User,  // Name के लिए नया आइकॉन
  Phone  // Phone के लिए नया आइकॉन
} from 'lucide-react';

export default function RegisterPage() {
  // 1. स्टेट वैरिएबल्स (4 फील्ड्स के लिए)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. वैलिडेशन फंक्शन्स
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    // सिम्पल 10-डिजिट नंबर चेक
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // 3. फॉर्म सबमिट हैंडलर (API Call)
  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError('');
    setSuccessMsg('');

    // खाली फील्ड्स चेक करना
    if (!name || !email || !password || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    // फॉर्मेट वैलिडेशन
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPhone(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // API कॉल शुरू
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // आपकी cURL रिक्वेस्ट के अनुसार डेटा भेजा जा रहा है
        body: JSON.stringify({ 
          name: name, 
          email: email, 
          password: password, 
          phone: phone 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // सफलता पर
      setSuccessMsg('Account created successfully! You can now login.');
      // फॉर्म क्लियर कर दें (optional)
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // बटन को डिसेबल करने का लॉजिक
  const isButtonDisabled = !name || !email || !password || !phone || isLoading;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans text-gray-800 bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: "url('/main.png')" }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      {/* फॉर्म बड़ा होने के कारण min-h-[700px] किया गया है ताकि सब अच्छे से फिट हो */}
      <div className="relative z-10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl min-h-[700px] border border-white/40">
        
        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex md:w-1/2 relative p-8 lg:p-10 flex-col justify-between">
          <div className="relative z-10 flex items-center gap-3">
           
           <div className="flex items-center shrink-0">
       
            <img src="/logo (3).png" alt="Furniture Logo" className="h-10 md:h-14 w-auto object-contain" />

        </div>
          </div>

          <div className="relative z-10 mt-12 max-w-sm">
            <p className="text-[#8c5a35] font-bold mb-2 text-sm bg-white/60 inline-block px-3 py-1 rounded-md">Join Us Today!</p>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight drop-shadow-md">
              Create an<br />Account
            </h2>
            <p className="text-gray-900 font-medium text-sm pr-4 bg-white/50 p-3 rounded-lg backdrop-blur-md">
              Register now to explore our exclusive collections and amazing offers.
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
            Already have an account? <a href="/login" className="text-[#8c5a35] font-semibold hover:underline">Login Now</a>
          </div>

          <div className="max-w-sm w-full mx-auto mt-8 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Register</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter your details to create a new account</p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
                {successMsg}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRegister}>
              
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name" 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
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
                    placeholder="test@gmail.com" 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210" 
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)" 
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8c5a35]/20 focus:border-[#8c5a35] transition-all"
                  />
                  <div 
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeOff className={`h-4 w-4 hover:text-gray-600 ${showPassword ? 'text-[#8c5a35]' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isButtonDisabled}
                className={`w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-4 shadow-md 
                  ${isButtonDisabled 
                    ? 'bg-[#8c5a35]/60 cursor-not-allowed shadow-none' 
                    : 'bg-[#8c5a35] hover:bg-[#734a2b] shadow-[#8c5a35]/20'
                  }`}
              >
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs">
              <LockKeyhole className="w-3.5 h-3.5" />
              <p>Your data is safe with us. We never share your information.</p>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 sm:hidden">
               Already have an account? <a href="/login" className="text-[#8c5a35] font-semibold hover:underline">Login Now</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}