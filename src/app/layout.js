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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`}
      >
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}