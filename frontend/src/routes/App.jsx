import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import HomePage from '../pages/HomePage.jsx';
import HotelsPage from '../pages/HotelsPage.jsx';
import HotelDetail from '../pages/HotelDetail.jsx';
import FlightsPage from '../pages/FlightsPage.jsx';
import CarsPage from '../pages/CarsPage.jsx';
import ActivitiesPage from '../pages/ActivitiesPage.jsx';
import VouchersPage from '../pages/VouchersPage.jsx';
import FavoritesPage from '../pages/FavoritesPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import SignInPage from '../pages/SignInPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import VerifyEmailPage from '../pages/VerifyEmailPage.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NavUserSection = () => {
  const { user } = useUser();
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim());
  const isAdmin = user?.primaryEmailAddress?.emailAddress && adminEmails.includes(user.primaryEmailAddress.emailAddress);

  return (
    <>
      <Link to="/favorites" className="text-sm text-white/90 hover:text-white transition drop-shadow-sm">Yêu thích</Link>
      <Link to="/notifications" className="text-sm text-white/90 hover:text-white transition drop-shadow-sm">Thông báo</Link>
      {isAdmin && (
        <Link to="/admin" className="text-sm bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition shadow-md font-medium">
          Quản trị
        </Link>
      )}
      <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
    </>
  );
};

const Nav = ({ clerkEnabled }) => {
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSolid(window.scrollY > 120);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isSolid ? 'bg-blue-900/95 backdrop-blur shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">Jurni</Link>
            <div className="hidden md:flex items-center gap-5 text-sm">
              <Link to="/hotels" className="text-white/90 hover:text-white font-medium transition drop-shadow-sm">Khách sạn</Link>
              <Link to="/flights" className="text-white/90 hover:text-white font-medium transition drop-shadow-sm">Vé máy bay</Link>
              <Link to="/cars" className="text-white/90 hover:text-white font-medium transition drop-shadow-sm">Cho thuê xe</Link>
              <Link to="/activities" className="text-white/90 hover:text-white font-medium transition drop-shadow-sm">Hoạt động & Vui chơi</Link>
              <Link to="/vouchers" className="text-white/90 hover:text-white font-medium transition drop-shadow-sm">Voucher</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {clerkEnabled ? (
              <>
                <SignedIn>
                  <NavUserSection />
                </SignedIn>
                <SignedOut>
                  <Link to="/sign-in" className="text-white/90 hover:text-white px-4 py-2 font-medium transition drop-shadow-sm">
                    Đăng Nhập
                  </Link>
                  <Link to="/sign-up" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition shadow-md">
                    Đăng ký
                  </Link>
                </SignedOut>
              </>
            ) : (
              <span className="text-sm text-white/70">Auth disabled</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminOnly = ({ children, clerkEnabled }) => {
  if (!clerkEnabled) return <Navigate to="/" replace />;
  const { user, isLoaded } = useUser();
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim());
  const isAdmin = user?.primaryEmailAddress?.emailAddress && adminEmails.includes(user.primaryEmailAddress.emailAddress);
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

// Component to sync clerk user to backend
function SyncUser() {
  const { getToken, isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [synced, setSynced] = React.useState(false);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;
    
    // Reset synced state when user changes
    setSynced(false);
    
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 5;
    
    const syncUser = async () => {
      try {
        // Wait a bit for user data to be available
        if (!user && retryCount < 2) {
          retryCount++;
          setTimeout(syncUser, 1000);
          return;
        }

        const token = await getToken();
        if (!token) {
          console.warn('No token available for sync-user, retrying...');
          if (retryCount < maxRetries && mounted) {
            retryCount++;
            setTimeout(syncUser, 1000 * retryCount);
          }
          return;
        }
        
        console.log('Attempting to sync user:', { userId, email: user?.primaryEmailAddress?.emailAddress });
        
        const response = await axios.post(`${API}/auth/sync-user`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (mounted) {
          console.log('sync-user: success', response.data);
          setSynced(true);
        }
      } catch (err) {
        console.error('sync-user failed', {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err.message
        });
        
        // Retry logic
        if (retryCount < maxRetries && mounted) {
          retryCount++;
          console.log(`Retrying sync-user (attempt ${retryCount}/${maxRetries})...`);
          setTimeout(syncUser, 1000 * retryCount); // Exponential backoff
        }
      }
    };
    
    // Delay to ensure Clerk session is fully established
    const timeoutId = setTimeout(syncUser, 1000);
    
    return () => { 
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [getToken, isSignedIn, isLoaded, userId, user]);

  return null;
}

export default function App({ clerkEnabled }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Nav clerkEnabled={clerkEnabled} />
      <main className="flex-1 pt-16">
        {/* Sync user when signed in */}
        {clerkEnabled && (
          <SignedIn>
            <SyncUser />
          </SignedIn>
        )}

        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-up/verify-email-address" element={<VerifyEmailPage />} />
          <Route path="/" element={<div className="pt-0"><HomePage /></div>} />
        <Route path="/hotels" element={<div className="max-w-7xl mx-auto px-4 py-6"><HotelsPage /></div>} />
        <Route path="/hotels/:id" element={<div className="max-w-7xl mx-auto px-4 py-6"><HotelDetail /></div>} />
        <Route path="/flights" element={<div className="max-w-7xl mx-auto px-4 py-6"><FlightsPage /></div>} />
        <Route path="/cars" element={<div className="max-w-7xl mx-auto px-4 py-6"><CarsPage /></div>} />
        <Route path="/activities" element={<div className="max-w-7xl mx-auto px-4 py-6"><ActivitiesPage /></div>} />
        <Route path="/vouchers" element={<div className="max-w-7xl mx-auto px-4 py-6"><VouchersPage /></div>} />
        <Route path="/favorites" element={<div className="max-w-7xl mx-auto px-4 py-6"><FavoritesPage /></div>} />
        <Route path="/notifications" element={<div className="max-w-7xl mx-auto px-4 py-6"><NotificationsPage /></div>} />
          <Route path="/admin" element={<AdminOnly clerkEnabled={clerkEnabled}><div className="max-w-7xl mx-auto px-4 py-6"><AdminDashboard /></div></AdminOnly>} />
        </Routes>
      </main>
      <footer className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-xl font-semibold tracking-wide">Jurni</div>
            <p className="mt-3 text-sm text-white/80">© 2025 Jurni – Khám phá Việt Nam theo cách của bạn.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">Thông tin liên hệ</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Source: <a href="https://github.com/ledaithanhlong/DACN_Jurni" target="_blank" rel="noreferrer" className="hover:text-white underline">github.com/ledaithanhlong/DACN_Jurni</a></li>
              <li>Hotline: <a href="tel:0769749465" className="hover:text-white">0769 749 465</a></li>
              <li>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">Liên kết nhanh</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="text-white/80 hover:text-white">Trang chủ</Link>
              <Link to="/about" className="text-white/80 hover:text-white">Giới thiệu</Link>
              <Link to="/activities" className="text-white/80 hover:text-white">Tour trong nước</Link>
              <Link to="/support" className="text-white/80 hover:text-white">Liên hệ / Hỗ trợ</Link>
              <Link to="/terms" className="text-white/80 hover:text-white">Điều khoản &amp; Chính sách</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

