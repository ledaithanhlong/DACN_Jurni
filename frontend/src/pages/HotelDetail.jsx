import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Icon Components
const IconStar = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconBed = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const loadHotel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/hotels/${id}`);
        setHotel(res.data);
      } catch (error) {
        console.error('Error loading hotel:', error);
        // Fallback to sample data if API fails
        const sampleHotels = [
          {
            id: 1,
            name: 'Khách Sạn Grand Saigon',
            location: 'Quận 1, TP.HCM',
            price: 2500000,
            rating: 5,
            image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            description: 'Khách sạn 5 sao sang trọng tại trung tâm thành phố, với view đẹp và dịch vụ đẳng cấp quốc tế',
            amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa', 'Nhà hàng', 'Fitness center', 'Parking'],
            rooms: 150,
            checkIn: '14:00',
            checkOut: '12:00',
            policies: {
              cancel: 'Miễn phí hủy trước 48 giờ',
              children: 'Trẻ em dưới 12 tuổi ở miễn phí',
              pets: 'Không cho phép thú cưng',
              smoking: 'Không hút thuốc'
            }
          }
        ];
        const found = sampleHotels.find(h => h.id === Number(id)) || sampleHotels[0];
        setHotel({ ...found, id: Number(id) });
      } finally {
        setLoading(false);
      }
    };
    loadHotel();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const calculateTotal = () => {
    if (!hotel || !booking.checkIn || !booking.checkOut) return 0;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return (hotel.price || 0) * nights * booking.rooms;
  };

  const handleBook = async () => {
    if (!isSignedIn) {
      alert('Vui lòng đăng nhập để đặt phòng');
      navigate('/sign-in');
      return;
    }

    if (!booking.checkIn || !booking.checkOut) {
      alert('Vui lòng chọn ngày check-in và check-out');
      return;
    }

    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      alert('Ngày check-out phải sau ngày check-in');
      return;
    }

    try {
      const token = await getToken();
      const totalPrice = calculateTotal();
      
      await axios.post(
        `${API}/bookings`,
        {
          service_type: 'hotel',
          service_id: Number(id),
          total_price: totalPrice,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          guests: booking.guests,
          rooms: booking.rooms
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Đặt phòng thành công! Vui lòng kiểm tra voucher của bạn.');
      navigate('/vouchers');
    } catch (error) {
      console.error('Error booking:', error);
      alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin khách sạn...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khách sạn</h2>
          <p className="text-gray-600 mb-6">Khách sạn bạn tìm kiếm không tồn tại.</p>
          <button
            onClick={() => navigate('/hotels')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotal();
  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hotels')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Quay lại danh sách
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            {hotel.image_url && (
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Hotel Info */}
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{hotel.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <IconLocation className="w-5 h-5" />
                    <span className="text-lg">{hotel.location}</span>
                  </div>
                  {hotel.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-full w-fit">
                      <IconStar className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-gray-900">{hotel.rating} sao</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-blue-600">
                    {formatPrice(hotel.price)} VND
                  </div>
                  <div className="text-sm text-gray-500">/ đêm</div>
                </div>
              </div>

              {hotel.description && (
                <p className="text-gray-700 leading-relaxed text-lg mb-6">{hotel.description}</p>
              )}

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Tiện nghi</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {hotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Policies */}
              {hotel.policies && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Chính sách</h3>
                  <div className="space-y-3">
                    {hotel.policies.cancel && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hủy đặt phòng</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.cancel}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.children && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Trẻ em</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.children}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.pets && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Thú cưng</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.pets}</div>
                        </div>
                      </div>
                    )}
                    {hotel.policies.smoking && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hút thuốc</div>
                          <div className="text-gray-600 text-sm">{hotel.policies.smoking}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đặt phòng</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày check-in
                  </label>
                  <input
                    type="date"
                    value={booking.checkIn}
                    onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  {hotel.checkIn && (
                    <p className="text-xs text-gray-500 mt-1">Check-in sau {hotel.checkIn}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày check-out
                  </label>
                  <input
                    type="date"
                    value={booking.checkOut}
                    onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                    min={booking.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  {hotel.checkOut && (
                    <p className="text-xs text-gray-500 mt-1">Check-out trước {hotel.checkOut}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số khách
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, guests: Math.max(1, booking.guests - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={booking.guests}
                      onChange={(e) => setBooking({ ...booking, guests: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, guests: booking.guests + 1 })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số phòng
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, rooms: Math.max(1, booking.rooms - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={booking.rooms}
                      onChange={(e) => setBooking({ ...booking, rooms: Math.max(1, parseInt(e.target.value) || 1) })}
                      min="1"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-center font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setBooking({ ...booking, rooms: booking.rooms + 1 })}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {nights > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>{formatPrice(hotel.price)} VND × {nights} đêm × {booking.rooms} phòng</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Tổng tiền</span>
                        <span className="text-2xl font-extrabold text-blue-600">
                          {formatPrice(totalPrice)} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50"
              >
                Đặt phòng ngay
              </button>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Bạn cần đăng nhập để đặt phòng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
