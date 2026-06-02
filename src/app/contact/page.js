'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const brandColor = "#5d6044";

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-gray-800">
        <Navbar/>
      
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gray-50 py-16 md:py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-500 font-light max-w-2xl mx-auto">
            Whether you have a question about our furniture collections, need assistance with an order, or want to inquire about custom designs, our team at Gioteak is here to help.
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT SIDE: Contact Information */}
          <div>
            <h2 className="text-2xl font-serif text-gray-900 mb-8">Contact Information</h2>
            
            <div className="flex flex-col gap-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" style={{ color: brandColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Our Showroom</h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    123 Furniture Boulevard<br />
                    Design District, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" style={{ color: brandColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm font-light">
                    +1 (555) 123-4567<br />
                    <span className="text-xs text-gray-400">Mon-Fri from 9am to 6pm</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" style={{ color: brandColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Email</h3>
                  <p className="text-gray-600 text-sm font-light">
                    support@gioteak.com<br />
                    sales@gioteak.com
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" style={{ color: brandColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">Business Hours</h3>
                  <p className="text-gray-600 text-sm font-light">
                    Monday - Friday: 9:00 AM - 8:00 PM<br />
                    Saturday: 10:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
            <h2 className="text-2xl font-serif text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow"
                    style={{ '--tw-ring-color': brandColor, borderColor: 'transparent' }}
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow"
                    style={{ '--tw-ring-color': brandColor, borderColor: 'transparent' }}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow"
                  style={{ '--tw-ring-color': brandColor, borderColor: 'transparent' }}
                  placeholder="How can we help you?"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-shadow resize-none"
                  style={{ '--tw-ring-color': brandColor, borderColor: 'transparent' }}
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                style={{ backgroundColor: brandColor }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} 
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg text-sm text-center border border-green-100">
                  Thank you! Your message has been sent successfully. We will get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ================= MAP SECTION (Optional Visual) ================= */}
      <section className="w-full h-80 bg-gray-200 relative overflow-hidden">
        {/* Placeholder for an actual Google Maps iframe */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
          <p className="text-sm">Google Maps Embed Placeholder</p>
        </div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2527998699!2d-74.14448787425226!3d40.69766374878431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1698244012453!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0, position: 'relative', zIndex: 10, filter: 'grayscale(0.5)' }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
     <Footer/>
    </div>
  );
}