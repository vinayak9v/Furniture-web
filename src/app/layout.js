'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Provider } from 'react-redux';
import { store } from '../app/store/store'; // Adjust path
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Add JSON-LD Structured Data for Local Business/Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AgriculturalBusiness",
              "name": "Morvi Crop Science Pvt Ltd",
              "url": "https://www.morvicropscience.com",
              "description": "Leading provider of agricultural seeds, insecticides, and fertilizers.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9876543210", 
                "contactType": "customer service"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`}
      >
        {/* <Navbarr /> */}
        {/* <MorviNavbar/> */}
        
      <Provider store={store}>
            {children}
       </Provider>;
        
        {/* <Footer /> */}
      </body>
    </html>
  );
}