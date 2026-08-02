'use client'
import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Clock,
  Home
} from 'lucide-react';

export default function Footer() {
  const brandGreen = "#5d6044"; // इमेज के अनुसार ऑलिव ग्रीन

  return (
    <footer className="w-full font-sans">
      
      {/* ================= NEWSLETTER SECTION ================= */}
      <div 
        className="py-8 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: brandGreen }}
      >
        <div className="flex items-center gap-4 text-white">
          <div className="p-3 border border-white/30 rounded-md">
            <Mail className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-wider uppercase">Subscribe to our Newsletter</h3>
            <p className="text-sm text-white/80">Get exclusive offers, new arrivals & design inspiration.</p>
          </div>
        </div>

        <form className="flex w-full md:w-auto max-w-xl gap-2">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 min-w-[280px] px-4 py-3 rounded-md text-gray-800 outline-none focus:ring-2 focus:ring-white/50"
          />
          <button className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-colors">
            Subscribe
          </button>
        </form>
      </div>

      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="bg-[#1a1a1a] text-gray-300 py-16 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
             
               <div className="flex items-center">
              <img
                src="/logo (3).png"
                alt="Furniture Logo"
                className="h-10 md:h-14 w-auto object-contain"
              />
            </div>
            </div>
            <p className="text-sm leading-relaxed mb-8">
              We create beautiful, high-quality furniture that brings comfort and elegance to your home.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, idx) => (
                <Link key={idx} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#5d6044] transition-colors">
                  <Icon className="w-4 h-4 text-white" fill="currentColor" strokeWidth={0} />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Living Room</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Bedroom</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dining Room</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Office</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Outdoor</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Customer Service */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Customer Service</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#5d6044] mt-1 shrink-0" />
                <span>123, Furniture Street, Woodland, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#5d6044] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#5d6044] shrink-0" />
                <span>support@furniture.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#5d6044] shrink-0" />
                <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM COPYRIGHT BAR ================= */}
      <div className="bg-[#111111] py-6 px-4 md:px-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© 2026 Gioteak. All Rights Reserved.</p>
          
          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-3">
             <div className="h-6 w-10 bg-gray-800 rounded flex items-center justify-center font-bold text-[10px] text-blue-400">VISA</div>
             <div className="h-6 w-10 bg-gray-800 rounded flex items-center justify-center font-bold text-[10px] text-orange-400">MC</div>
             <div className="h-6 w-12 bg-gray-800 rounded flex items-center justify-center font-bold text-[8px] text-white">RUPAY</div>
             <div className="h-6 w-10 bg-gray-800 rounded flex items-center justify-center font-bold text-[10px] text-green-400">UPI</div>
          </div>
        </div>
      </div>
    </footer>
  );
}