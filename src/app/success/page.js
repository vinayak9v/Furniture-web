'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  const brandColor = "#5d6044";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-green-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Thank you for shopping with us. We&apos;ve received your payment and your order is now being processed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/profile"
            className="flex-1 px-6 py-3 rounded-lg text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 px-6 py-3 rounded-lg text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
