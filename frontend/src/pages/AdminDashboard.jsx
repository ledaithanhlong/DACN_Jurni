import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminUsers from '../components/admin/AdminUsers.jsx';
import AdminFlights from '../components/admin/AdminFlights.jsx';
import AdminCars from '../components/admin/AdminCars.jsx';
import AdminActivities from '../components/admin/AdminActivities.jsx';
import AdminHotels from '../components/admin/AdminHotels.jsx';
import AdminVouchers from '../components/admin/AdminVouchers.jsx';
import AdminBookings from '../components/admin/AdminBookings.jsx';
import NotificationSender from '../components/NotificationSender.jsx';
import {
  LayoutDashboard,
  Users,
  Hotel,
  Plane,
  Car,
  Compass,
  Ticket,
  FileText,
  Menu,
  X,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Activity,
  MessageSquare,
  UsersRound,
  Bell
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeServices: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'bookings', label: 'Đặt chỗ', icon: FileText },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'hotels', label: 'Khách sạn', icon: Hotel },
    { id: 'flights', label: 'Chuyến bay', icon: Plane },
    { id: 'cars', label: 'Xe cho thuê', icon: Car },
    { id: 'activities', label: 'Hoạt động', icon: Compass },
    { id: 'vouchers', label: 'Voucher', icon: Ticket },
    { id: 'notifications', label: 'Gửi thông báo', icon: Bell },
    { id: 'chat', label: 'Quản lý Chat', icon: MessageSquare, isExternal: true },
    { id: 'team', label: 'Quản lý Team', icon: UsersRound, isExternal: true, path: '/team' },
  ];

  // Fetch real stats from API
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab, getToken]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1 truncate">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} shadow-lg flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Sticks to navbar, same color */}
      <aside
        className={`${sidebarOpen ? 'w-72' : 'w-20'
          } text-white transition-all duration-300 flex flex-col shadow-2xl fixed h-screen z-40 top-0 left-0`}
        style={{ backgroundColor: '#0D47A1' }}
      >
        {/* Logo & Toggle - Below navbar */}
        <div className="p-5 flex items-center justify-between border-b border-white/20 pt-20">
          {sidebarOpen && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
              <p className="text-xs text-sky-200 mt-1">Bảng điều khiển quản trị</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-sky-500/50 rounded-lg transition-colors ml-auto"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => item.isExternal ? navigate(item.path || '/admin/chat') : setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-white/20 text-white shadow-lg scale-105 font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:translate-x-1'
                  }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {sidebarOpen && (
                  <span className="font-semibold text-sm">{item.label}</span>
                )}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/20 bg-black/10">
            <p className="text-xs text-white/60 text-center">
              © 2024 Jurni Travel Platform
            </p>
          </div>
        )}
      </aside>

      {/* Main Content - Full height from top */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 min-h-screen`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Tổng quan'}
                </h2>
                <p className="text-gray-600 text-sm">
                  Quản lý và theo dõi {menuItems.find(item => item.id === activeTab)?.label.toLowerCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Hôm nay</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-xl h-32 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                  <div className="lg:col-span-2">
                    <StatCard
                      title="Tổng đặt chỗ"
                      value={stats.totalBookings.toLocaleString()}
                      icon={ShoppingBag}
                      trend="+12.5% so với tháng trước"
                      color="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <StatCard
                      title="Người dùng"
                      value={stats.totalUsers.toLocaleString()}
                      icon={Users}
                      trend="+8.2% so với tháng trước"
                      color="bg-gradient-to-br from-green-500 to-green-600"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <StatCard
                      title="Dịch vụ hoạt động"
                      value={stats.activeServices.toLocaleString()}
                      icon={Activity}
                      trend="+5 dịch vụ mới"
                      color="bg-gradient-to-br from-orange-500 to-orange-600"
                    />
                  </div>
                  <div className="lg:col-span-6">
                    <StatCard
                      title="Doanh thu"
                      value={formatCurrency(stats.totalRevenue)}
                      icon={DollarSign}
                      trend="+15.3% so với tháng trước"
                      color="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-sky-600 rounded-full"></div>
                  Thao tác nhanh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {menuItems.slice(1).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => item.isExternal ? navigate(item.path || '/admin/chat') : setActiveTab(item.id)}
                        className="flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 group"
                      >
                        <div className="p-3 bg-sky-100 rounded-xl group-hover:bg-sky-500 transition-all duration-200">
                          <Icon className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-sky-700 text-sm">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-sky-600 rounded-full"></div>
                  Hoạt động gần đây
                </h3>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-sky-500"></div>
                          <div>
                            <p className="font-semibold text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600 mt-0.5">{activity.detail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">{activity.time}</span>
                          {activity.amount && (
                            <p className="text-sm font-semibold text-green-600 mt-0.5">
                              {formatCurrency(activity.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có hoạt động nào</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab !== 'overview' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {activeTab === 'bookings' && <AdminBookings />}
              {activeTab === 'users' && <AdminUsers />}
              {activeTab === 'hotels' && <AdminHotels />}
              {activeTab === 'flights' && <AdminFlights />}
              {activeTab === 'cars' && <AdminCars />}
              {activeTab === 'activities' && <AdminActivities />}
              {activeTab === 'vouchers' && <AdminVouchers />}
              {activeTab === 'notifications' && <NotificationSender />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
