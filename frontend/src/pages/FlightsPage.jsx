import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Professional SVG Icons
const AirplaneIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

const MoneyIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LuggageIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const AirlineIcon = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
  </svg>
);

// Component để hiển thị logo với fallback
const AirlineLogo = ({ logo, name, bgColor }) => {
  const [logoError, setLogoError] = useState(false);
  
  return (
    <div className={`mb-3 ${bgColor} rounded-lg p-3 flex items-center justify-center h-20`}>
      {!logoError ? (
        <img 
          src={logo} 
          alt={`${name} logo`}
          className="max-h-14 max-w-full object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <AirlineIcon className="w-12 h-12 text-gray-400" />
      )}
    </div>
  );
};

export default function FlightsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Tự động lấy thông tin từ FlightIdeasPage hoặc JurniHero nếu có
  const searchFromState = location.state?.from || '';
  const searchToState = location.state?.to || '';
  const searchDateState = location.state?.date || '';

  useEffect(() => {
    // Tự động tìm kiếm nếu có thông tin từ FlightIdeasPage hoặc JurniHero
    if (searchFromState || searchToState) {
      loadFlights(searchFromState, searchToState);
    } else {
      // Nếu không có, load tất cả chuyến bay để hiển thị
      loadFlights('', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFromState, searchToState]); // Trigger khi from hoặc to thay đổi

  const loadFlights = async (from = '', to = '') => {
    setLoading(true);
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      
      const res = await axios.get(`${API}/flights`, { params });
      setFlights(res.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error loading flights:', error);
      setFlights([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

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
    return `${hours}h ${minutes}m`;
  };

  const handleBook = (flight) => {
    navigate('/checkout', { 
      state: { 
        type: 'flight',
        item: flight 
      } 
    });
  };

  // Thông tin các hãng hàng không
  const airlines = [
    { 
      name: 'Vietnam Airlines', 
      logo: '/AirlineLogo/vietnam-airlines.png',
      description: 'Hãng hàng không quốc gia, dịch vụ 5 sao', 
    },
    { 
      name: 'VietJet Air', 
      logo: '/AirlineLogo/vietjet.png',
      description: 'Hãng hàng không giá rẻ, nhiều chuyến bay', 
    },
    { 
      name: 'Bamboo Airways', 
      logo: '/AirlineLogo/bamboo.png',
      description: 'Hãng hàng không mới, hiện đại', 
    },
    { 
      name: 'Jetstar Pacific', 
      logo: '/AirlineLogo/jetstar.png',
      description: 'Giá rẻ, phù hợp du lịch', 
    },
  ];

  // Tips đặt vé
  const bookingTips = [
    {
      title: 'Đặt vé sớm để tiết kiệm',
      description: 'Đặt vé trước 2-3 tháng thường có giá tốt hơn 20-30%',
      icon: MoneyIcon,
      color: 'text-green-600'
    },
    {
      title: 'Chọn giờ bay linh hoạt',
      description: 'Chuyến bay sáng sớm hoặc tối muộn thường rẻ hơn',
      icon: ClockIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Theo dõi giá với cảnh báo',
      description: 'Sử dụng tính năng cảnh báo giá để nhận thông báo khi giá giảm',
      icon: BellIcon,
      color: 'text-orange-600'
    },
    {
      title: 'Kiểm tra hành lý ký gửi',
      description: 'Một số hãng bay giá rẻ tính phí hành lý riêng, cần kiểm tra trước',
      icon: LuggageIcon,
      color: 'text-purple-600'
    },
  ];

  // FAQ
  const faqs = [
    {
      question: 'Có thể đổi/hủy vé không?',
      answer: 'Tùy theo loại vé và chính sách của từng hãng hàng không. Vé khuyến mãi thường không được đổi/hủy, vé thường có thể đổi với phí.'
    },
    {
      question: 'Cần chuẩn bị gì khi đi máy bay?',
      answer: 'CMND/CCCD hoặc hộ chiếu còn hạn, vé máy bay (bản điện tử hoặc in), đến sân bay trước 2 giờ cho chuyến bay nội địa.'
    },
    {
      question: 'Hành lý xách tay được mang bao nhiêu?',
      answer: 'Thông thường 7kg cho hành lý xách tay, kích thước không quá 56x36x23cm. Hành lý ký gửi tùy theo gói vé đã mua.'
    },
    {
      question: 'Làm thế nào để có giá vé rẻ nhất?',
      answer: 'Đặt vé sớm, chọn giờ bay linh hoạt, theo dõi các chương trình khuyến mãi, sử dụng tính năng cảnh báo giá của chúng tôi.'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-3">Vé máy bay</h1>
        <p className="text-gray-600 text-lg">
          So sánh và đặt vé máy bay từ các hãng hàng không uy tín tại Việt Nam. 
          Tìm kiếm chuyến bay phù hợp với ngân sách và lịch trình của bạn.
        </p>
        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ để tìm kiếm chuyến bay
          </button>
        </div>
      </div>

      {/* Kết quả tìm kiếm */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchFromState && searchToState 
                ? `Chuyến bay từ ${searchFromState} đến ${searchToState}`
                : searchFromState 
                  ? `Chuyến bay từ ${searchFromState}`
                  : searchToState
                    ? `Chuyến bay đến ${searchToState}`
                    : 'Tất cả chuyến bay'}
            </h2>
              {flights.length > 0 && (
                <span className="text-sm text-gray-600">
                  Tìm thấy <span className="font-semibold text-blue-600">{flights.length}</span> chuyến bay
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tìm kiếm chuyến bay...</p>
              </div>
            ) : flights.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy chuyến bay</h3>
                <p className="text-gray-600 mb-4">
                  Hiện tại không có chuyến bay phù hợp. Vui lòng thử tìm kiếm với điểm đi/đến khác.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Tìm kiếm chuyến bay khác
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Airline Info */}
                        <div className="flex-shrink-0">
                          {flight.image_url ? (
                            <img
                              src={flight.image_url}
                              alt={flight.airline}
                              className="w-24 h-24 object-contain rounded-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </div>
                          )}
                          <p className="text-center mt-2 text-sm font-semibold text-gray-700">
                            {flight.airline}
                          </p>
                        </div>

                        {/* Flight Details */}
                        <div className="flex-1 grid md:grid-cols-3 gap-4">
                          {/* Departure */}
                          <div>
                            <p className="text-2xl font-bold text-gray-800 mb-1">
                              {formatTime(flight.departure_time)}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {formatDate(flight.departure_time)}
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                              {flight.departure_city}
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm text-gray-500 mb-2">
                              {calculateDuration(flight.departure_time, flight.arrival_time)}
                            </p>
                            <div className="flex items-center w-full">
                              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                              <svg className="w-6 h-6 text-blue-600 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Bay thẳng</p>
                          </div>

                          {/* Arrival */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800 mb-1">
                              {formatTime(flight.arrival_time)}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              {formatDate(flight.arrival_time)}
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                              {flight.arrival_city}
                            </p>
                          </div>
                        </div>

                        {/* Price and Book Button */}
                        <div className="flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                          <div className="text-center md:text-right">
                            <p className="text-3xl font-bold text-blue-600 mb-2">
                              {formatPrice(flight.price)} VND
                            </p>
                            <p className="text-xs text-gray-500 mb-4">Giá cho 1 người</p>
                            <button
                              onClick={() => handleBook(flight)}
                              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                              Chọn chuyến bay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* Thông tin các hãng hàng không */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Các hãng hàng không đối tác</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {airlines.map((airline, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <AirlineLogo logo={airline.logo} name={airline.name} bgColor={airline.color} />
              <h3 className="font-semibold text-gray-800 mb-1">{airline.name}</h3>
              <p className="text-sm text-gray-600">{airline.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips đặt vé */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mẹo đặt vé máy bay giá rẻ</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {bookingTips.map((tip, idx) => {
            const IconComponent = tip.icon;
            return (
              <div key={idx} className="bg-white rounded-lg p-4 flex gap-4">
                <div className={`flex-shrink-0 ${tip.color}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-8 bg-blue-600 rounded-xl shadow-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Chưa tìm thấy chuyến bay phù hợp?</h2>
        <p className="mb-6 text-blue-100">
          Sử dụng tính năng cảnh báo giá để nhận thông báo khi có giá tốt, hoặc khám phá các ý tưởng chuyến bay mới
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/price-alerts')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Đặt cảnh báo giá
          </button>
          <button
            onClick={() => navigate('/flight-ideas')}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Khám phá ý tưởng chuyến bay
          </button>
        </div>
      </div>
    </div>
  );
}
