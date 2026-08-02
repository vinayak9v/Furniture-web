'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search State (Frontend Only)
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10; // Items per page

  const [updatingId, setUpdatingId] = useState(null);

  const statusOptions = [
    'PLACED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  ];

  // Fetch orders only when currentPage changes (No search dependency)
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    setIsLoading(true);
    try {
      // API call with only pagination parameters
      const res = await fetch(`/api/admin/orders?page=${page}&limit=${limit}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
        setTotalOrders(data.pagination.totalOrders);
      } else {
        setError(data.message || "Failed to fetch orders.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Frontend Search Logic
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const orderId = String(order.orderNumber || order.id).toLowerCase();
    const customerName = String(order.customerName || '').toLowerCase();
    const customerEmail = String(order.customerEmail || '').toLowerCase();

    return (
      orderId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower)
    );
  });

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      } else {
        alert(data.message || 'Failed to update status.');
      }
    } catch (error) {
      alert('An error occurred while updating.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header & Search Bar Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Total Orders: {totalOrders}</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search in current page..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#8c5a35] focus:ring-1 focus:ring-[#8c5a35] transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Order Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 relative">
                {/* Loading State Overlay */}
                {isLoading && (
                  <tr className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center min-h-[200px]">
                    <td><Loader2 className="animate-spin text-[#8c5a35] w-8 h-8" /></td>
                  </tr>
                )}

                {filteredOrders.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      {searchTerm ? 'No matching orders found on this page.' : 'No orders found.'}
                    </td>
                  </tr>
                ) : (
                  // Map over filteredOrders instead of orders
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-900">
                        #{order.orderNumber || order.id}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{order.customerName}</div>
                        <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                        <div className="text-gray-400 text-xs">{order.city}, {order.state}</div>
                      </td>
                      <td className="p-4 font-medium">
                        ₹{order.totalAmount}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.paymentStatus} ({order.paymentMethod})
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-[#8c5a35] disabled:opacity-50"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                          {updatingId === order.id && <Loader2 size={16} className="animate-spin text-[#8c5a35]" />}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION CONTROLS ================= */}
          {!isLoading && totalPages > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <span className="text-sm text-gray-600">
                Showing Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
