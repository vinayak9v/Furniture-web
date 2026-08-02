'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('adminToken='))
      ?.split('=')[1];

    if (token) {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f8f9fa]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8c5a35]"></div>
        <p className="text-gray-500 text-sm font-medium">Checking authentication...</p>
      </div>
    </div>
  );
}
