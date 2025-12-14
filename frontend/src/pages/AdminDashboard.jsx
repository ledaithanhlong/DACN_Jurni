import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import AdminUsers from '../components/admin/AdminUsers.jsx';
import AdminFlights from '../components/admin/AdminFlights.jsx';
import AdminCars from '../components/admin/AdminCars.jsx';
import AdminActivities from '../components/admin/AdminActivities.jsx';
import AdminHotels from '../components/admin/AdminHotels.jsx';
import AdminVouchers from '../components/admin/AdminVouchers.jsx';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Quản lý Người dùng'},
    { id: 'hotels', label: 'Quản lý Khách sạn'},
    { id: 'flights', label: 'Quản lý Chuyến bay'},
    { id: 'cars', label: 'Quản lý Xe cho thuê'},
    { id: 'activities', label: 'Quản lý Hoạt động'},
    { id: 'vouchers', label: 'Quản lý Voucher' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bảng điều khiển Quản trị</h1>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'hotels' && <AdminHotels />}
        {activeTab === 'flights' && <AdminFlights />}
        {activeTab === 'cars' && <AdminCars />}
        {activeTab === 'activities' && <AdminActivities />}
        {activeTab === 'vouchers' && <AdminVouchers />}
      </div>
    </div>
  );
}
