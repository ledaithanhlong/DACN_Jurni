import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Icon Components
const IconAirplane = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconLuggage = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

const IconMeal = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.056 4.024.166C13.155 8.51 14 9.473 14 10.608v2.513M6 8.25c0 1.355.056 2.697.166 4.024C6.845 15.49 7.907 16 9 16h6c1.093 0 2.155-.51 2.834-1.726.11-1.327.166-2.669.166-4.024M6 8.25V6.5c0-1.355.056-2.697.166-4.024C6.845 1.51 7.907 1 9 1h6c1.093 0 2.155.51 2.834 1.726.11 1.327.166 2.669.166 4.024V8.25" />
  </svg>
);

const IconWifi = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
);

const IconEntertainment = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
  </svg>
);

const IconSeat = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    passengers: 1
  });
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const loadFlight = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/flights/${id}`);
        setFlight(res.data);
      } catch (error) {
        console.error('Error loading flight:', error);
        alert('Không tìm thấy chuyến bay');
        navigate('/flights');
      } finally {
        setLoading(false);
      }
    };
    loadFlight();
  }, [id, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, total: diffMs };
  };

  const getClassLabel = (flightClass) => {
    const labels = {
      'ECONOMY': 'Phổ thông',
      'PREMIUM_ECONOMY': 'Phổ thông đặc biệt',
      'BUSINESS': 'Thương gia',
      'FIRST': 'Hạng nhất'
    };
    return labels[flightClass] || flightClass;
  };

  const calculateTotal = () => {
    if (!flight) return 0;
    return (flight.price || 0) * booking.passengers;
  };

  const handleBook = async () => {
    if (!isSignedIn) {
      alert('Vui lòng đăng nhập để đặt vé');
      navigate('/sign-in');
      return;
    }

    if (flight.available_seats !== null && flight.available_seats < booking.passengers) {
      alert(`Chỉ còn ${flight.available_seats} ghế trống. Vui lòng chọn số lượng hành khách phù hợp.`);
      return;
    }

    try {
      const token = await getToken();
      const totalPrice = calculateTotal();
      
      await axios.post(
        `${API}/bookings`,
        {
          service_type: 'flight',
          service_id: Number(id),
          total_price: totalPrice,
          guests: booking.passengers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate('/checkout', { 
        state: { 
          type: 'flight',
          item: flight,
          passengers: booking.passengers,
          totalPrice: totalPrice
        } 
      });
    } catch (error) {
      console.error('Error booking:', error);
      alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#FF6B35' }}></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin chuyến bay...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy chuyến bay</h2>
          <p className="text-gray-600 mb-6">Chuyến bay bạn tìm kiếm không tồn tại.</p>
          <button
            onClick={() => navigate('/flights')}
            className="text-white px-6 py-3 rounded-full font-semibold transition"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const duration = calculateDuration(flight.departure_time, flight.arrival_time);
  const totalPrice = calculateTotal();

  // Get airline logo
  const getAirlineLogo = (airlineName) => {
    const logos = {
      'Vietnam Airlines': '/AirlineLogo/vietnam-airlines.png',
      'VietJet Air': '/AirlineLogo/vietjet.png',
      'Bamboo Airways': '/AirlineLogo/bamboo.png',
      'Jetstar Pacific': '/AirlineLogo/jetstar.png'
    };
    return logos[airlineName] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/flights')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-600 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Quay lại danh sách
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight Header Card */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {getAirlineLogo(flight.airline) ? (
                    <img
                      src={getAirlineLogo(flight.airline)}
                      alt={flight.airline}
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFE8E0' }}>
                      <IconAirplane className="w-12 h-12" style={{ color: '#FF6B35' }} />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{flight.airline}</h1>
                    {flight.flight_number && (
                      <p className="text-gray-600">Số hiệu chuyến bay: <span className="font-semibold">{flight.flight_number}</span></p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {getClassLabel(flight.class)}
                      </span>
                      {flight.aircraft_type && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {flight.aircraft_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Route */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  {/* Departure */}
                  <div className="flex-1 text-center">
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatTime(flight.departure_time)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">{formatDateShort(flight.departure_time)}</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {flight.departure_airport_code || flight.departure_city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {flight.departure_airport || flight.departure_city}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col items-center px-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {duration.hours}h {duration.minutes}m
                    </p>
                    <div className="flex items-center w-full">
                      <div className="flex-1 border-t-2 border-dashed border-gray-400"></div>
                      <IconAirplane className="w-8 h-8 mx-2" style={{ color: '#FF6B35' }} />
                      <div className="flex-1 border-t-2 border-dashed border-gray-400"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Bay thẳng</p>
                  </div>

                  {/* Arrival */}
                  <div className="flex-1 text-center">
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {formatTime(flight.arrival_time)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">{formatDateShort(flight.arrival_time)}</p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {flight.arrival_airport_code || flight.arrival_city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {flight.arrival_airport || flight.arrival_city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Ngày khởi hành</p>
                  <p className="font-semibold text-gray-900">{formatDate(flight.departure_time)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Thời gian bay</p>
                  <p className="font-semibold text-gray-900">{duration.hours} giờ {duration.minutes} phút</p>
                </div>
                {flight.available_seats !== null && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Ghế còn trống</p>
                    <p className="font-semibold text-gray-900">{flight.available_seats} ghế</p>
                  </div>
                )}
                {flight.total_seats && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Tổng số ghế</p>
                    <p className="font-semibold text-gray-900">{flight.total_seats} ghế</p>
                  </div>
                )}
              </div>
            </div>

            {/* Flight Services */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dịch vụ và tiện ích</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {flight.hand_luggage && (
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                    <IconLuggage className="text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Hành lý xách tay</p>
                      <p className="text-sm text-gray-600">{flight.hand_luggage}</p>
                    </div>
                  </div>
                )}
                {flight.baggage_allowance && (
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                    <IconLuggage className="text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Hành lý ký gửi</p>
                      <p className="text-sm text-gray-600">{flight.baggage_allowance}</p>
                    </div>
                  </div>
                )}
                {flight.meal_included && (
                  <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4">
                    <IconMeal className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Bữa ăn</p>
                      <p className="text-sm text-gray-600">Bao gồm bữa ăn</p>
                    </div>
                  </div>
                )}
                {flight.wifi_available && (
                  <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-4">
                    <IconWifi className="text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">WiFi</p>
                      <p className="text-sm text-gray-600">WiFi miễn phí</p>
                    </div>
                  </div>
                )}
                {flight.entertainment && (
                  <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-4">
                    <IconEntertainment className="text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Giải trí</p>
                      <p className="text-sm text-gray-600">Hệ thống giải trí trên máy bay</p>
                    </div>
                  </div>
                )}
                {flight.seat_selection && (
                  <div className="flex items-center gap-3 bg-indigo-50 rounded-xl p-4">
                    <IconSeat className="text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Chọn ghế</p>
                      <p className="text-sm text-gray-600">Có thể chọn ghế trước</p>
                    </div>
                  </div>
                )}
              </div>

              {Array.isArray(flight.amenities) && flight.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiện ích khác</h3>
                  <div className="flex flex-wrap gap-2">
                    {flight.amenities.map((amenity, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Policies */}
            {flight.policies && Object.keys(flight.policies).length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Chính sách vé</h2>
                <div className="space-y-4">
                  {flight.refundable && (
                    <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                      <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Hoàn tiền</div>
                        <div className="text-sm text-gray-600">
                          {flight.policies.refund || 'Vé có thể được hoàn tiền theo chính sách của hãng hàng không'}
                        </div>
                      </div>
                    </div>
                  )}
                  {flight.changeable && (
                    <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                      <IconCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Đổi vé</div>
                        <div className="text-sm text-gray-600">
                          {flight.policies.change || 'Vé có thể được đổi theo chính sách của hãng hàng không'}
                        </div>
                      </div>
                    </div>
                  )}
                  {flight.policies.cancel && (
                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <IconCheck className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">Hủy vé</div>
                        <div className="text-sm text-gray-600">{flight.policies.cancel}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {flight.description && (
              <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin chuyến bay</h2>
                <p className="text-gray-700 leading-relaxed">{flight.description}</p>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-6 sticky top-8">
              <div className="text-right mb-4">
                <div className="text-3xl font-extrabold" style={{ color: '#FF6B35' }}>
                  {formatPrice(flight.price)} VND
                </div>
                <div className="text-sm text-gray-500">/ người</div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đặt vé</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số hành khách
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, passengers: Math.max(1, booking.passengers - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={booking.passengers}
                      onChange={(e) => setBooking({ ...booking, passengers: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      max={flight.available_seats || undefined}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const max = flight.available_seats || 9;
                        setBooking({ ...booking, passengers: Math.min(max, booking.passengers + 1) });
                      }}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-orange-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  {flight.available_seats !== null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Còn {flight.available_seats} ghế trống
                    </p>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>{formatPrice(flight.price)} VND × {booking.passengers} người</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Tổng tiền</span>
                      <span className="text-2xl font-extrabold" style={{ color: '#FF6B35' }}>
                        {formatPrice(totalPrice)} VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="w-full text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-orange-500/50"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Đặt vé ngay
              </button>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Bạn cần đăng nhập để đặt vé
                </p>
              )}

              {flight.available_seats !== null && flight.available_seats < 5 && (
                <p className="text-xs text-orange-600 text-center mt-4 font-semibold">
                  ⚠️ Chỉ còn {flight.available_seats} ghế trống!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

