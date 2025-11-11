import React from 'react';
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
  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-500 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">Traveloka</Link>
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
    <div className="min-h-screen bg-gray-50">
      <Nav clerkEnabled={clerkEnabled} />
      <div className="pt-16">
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
      </div>
    </div>
  );
}

