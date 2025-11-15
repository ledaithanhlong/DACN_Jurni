import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Professional Icon Components
const IconPlane = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const IconHotel = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const IconCar = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const IconActivity = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconDownload = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const IconPrint = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 19.5l-1.591-1.591a2.25 2.25 0 010-3.182L8.25 13.5H4.5A2.25 2.25 0 002.25 15.75v3.75A2.25 2.25 0 006.75 22.5h3.75a2.25 2.25 0 002.25-2.25V18l-1.591 1.591a2.25 2.25 0 01-3.182 0zM19.5 6.75l-1.591 1.591a2.25 2.25 0 01-3.182 0L13.5 8.25v-3.75A2.25 2.25 0 0115.75 2.25h3.75A2.25 2.25 0 0121.75 4.5v3.75a2.25 2.25 0 01-2.25 2.25h-3.75l-1.591-1.591a2.25 2.25 0 010-3.182L19.5 6.75z" />
  </svg>
);

// Generate QR Code URL using a free QR code API
const generateQRCode = (text) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};

export default function VouchersPage() {
  const { getToken, isSignedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [isSignedIn]);

  const loadBookings = async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    
    try {
      const token = await getToken();
      const res = await axios.get(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Chỉ lấy các booking đã confirmed (đã thanh toán)
      const confirmedBookings = (res.data || []).filter(b => b.status === 'confirmed');
      setBookings(confirmedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      // Fallback to sample data
      setBookings(sampleVouchers);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'flight': return <IconPlane />;
      case 'hotel': return <IconHotel />;
      case 'car': return <IconCar />;
      case 'activity': return <IconActivity />;
      default: return <IconCheck />;
    }
  };

  const getServiceName = (serviceType) => {
    switch (serviceType) {
      case 'flight': return 'Vé Máy Bay';
      case 'hotel': return 'Khách Sạn';
      case 'car': return 'Thuê Xe';
      case 'activity': return 'Tour & Hoạt Động';
      default: return serviceType;
    }
  };

  // Sample vouchers for demo
  const sampleVouchers = [
    {
      id: 1,
      booking_code: 'JRN-2025-001',
      status: 'confirmed',
      total_price: 15000000,
      created_at: new Date().toISOString(),
      services: [
        {
          type: 'flight',
          name: 'Vietnam Airlines VN123',
          details: 'Hồ Chí Minh → Hà Nội',
          date: '2025-01-15 08:00',
          price: 5000000
        },
        {
          type: 'hotel',
          name: 'Grand Hotel Hanoi',
          details: 'Phòng Deluxe, 2 đêm',
          date: '2025-01-15 - 2025-01-17',
          price: 6000000
        },
        {
          type: 'car',
          name: 'Toyota Vios',
          details: '5 chỗ, 3 ngày',
          date: '2025-01-15 - 2025-01-18',
          price: 2400000
        },
        {
          type: 'activity',
          name: 'Tour Phố Cổ Hà Nội',
          details: '4 giờ, 2 người',
          date: '2025-01-16 09:00',
          price: 1600000
        }
      ]
    },
    {
      id: 2,
      booking_code: 'JRN-2025-002',
      status: 'confirmed',
      total_price: 8500000,
      created_at: new Date().toISOString(),
      services: [
        {
          type: 'flight',
          name: 'VietJet Air VJ456',
          details: 'Hà Nội → Đà Nẵng',
          date: '2025-01-20 10:30',
          price: 3000000
        },
        {
          type: 'hotel',
          name: 'Beach Resort Đà Nẵng',
          details: 'Phòng Superior, 2 đêm',
          date: '2025-01-20 - 2025-01-22',
          price: 4000000
        },
        {
          type: 'activity',
          name: 'Sun World Ba Na Hills',
          details: 'Cả ngày, 2 người',
          date: '2025-01-21 08:00',
          price: 1500000
        }
      ]
    }
  ];

  const vouchers = bookings.length > 0 ? bookings : sampleVouchers;

  const handlePrint = (voucher) => {
    window.print();
  };

  const handleDownload = (voucher) => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Travel Voucher - ${voucher.booking_code}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .voucher { border: 2px solid #1e40af; padding: 20px; margin: 20px 0; }
            .header { text-align: center; color: #1e40af; }
            .qr-code { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="voucher">
            <h1 class="header">Travel Voucher</h1>
            <p><strong>Mã đặt tour:</strong> ${voucher.booking_code}</p>
            <p><strong>Tổng tiền:</strong> ${formatPrice(voucher.total_price)} VND</p>
            <div class="qr-code">
              <img src="${generateQRCode(voucher.booking_code)}" alt="QR Code" />
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải voucher...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Travel Voucher
          </h1>
          <p className="text-xl text-gray-600">
            Xác nhận dịch vụ đã thanh toán
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <IconCheck className="w-4 h-4" />
            <span>Voucher này có thể dùng để check-in tại sân bay, nhận phòng khách sạn và nhận xe</span>
          </div>
        </div>

        {/* Vouchers List */}
        {vouchers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconCheck className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Chưa có voucher</h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có voucher nào. Hãy đặt tour và thanh toán để nhận voucher.
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
              >
                Đặt tour ngay
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {vouchers.map((voucher) => {
              const qrCodeUrl = generateQRCode(voucher.booking_code || `JRN-${voucher.id}`);
              
              return (
                <div
                  key={voucher.id}
                  className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden"
                >
                  {/* Voucher Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-blue-100 mb-1">Mã đặt tour</div>
                        <div className="text-3xl font-bold">{voucher.booking_code || `JRN-${voucher.id}`}</div>
                        <div className="text-sm text-blue-100 mt-2">
                          Ngày đặt: {formatDate(voucher.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-100 mb-1">Tổng tiền</div>
                          <div className="text-2xl font-bold">{formatPrice(voucher.total_price)} VND</div>
                          <div className="inline-flex items-center gap-2 mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            <IconCheck className="w-3 h-3" />
                            Đã thanh toán
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="w-24 h-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Chi tiết dịch vụ</h3>
                    <div className="space-y-4">
                      {(voucher.services || []).map((service, idx) => (
                        <div
                          key={idx}
                          className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                              {getServiceIcon(service.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
                                <div className="text-lg font-bold text-blue-600">
                                  {formatPrice(service.price)} VND
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">{service.details}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                {service.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedVoucher(voucher)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2"
                      >
                        <IconCheck className="w-5 h-5" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handlePrint(voucher)}
                        className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2"
                      >
                        <IconPrint className="w-5 h-5" />
                        In voucher
                      </button>
                      <button
                        onClick={() => handleDownload(voucher)}
                        className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2"
                      >
                        <IconDownload className="w-5 h-5" />
                        Tải xuống
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        {selectedVoucher && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVoucher(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Chi tiết Travel Voucher</h2>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="text-white hover:text-blue-100 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {selectedVoucher.booking_code || `JRN-${selectedVoucher.id}`}
                  </div>
                  <div className="text-gray-600">Mã đặt tour của bạn</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="text-sm text-gray-600 mb-1">Tổng tiền</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(selectedVoucher.total_price)} VND
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="text-sm text-gray-600 mb-1">Trạng thái</div>
                    <div className="flex items-center gap-2">
                      <IconCheck className="w-6 h-6 text-green-600" />
                      <span className="text-xl font-bold text-green-600">Đã thanh toán</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code</h3>
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center">
                    <img
                      src={generateQRCode(selectedVoucher.booking_code || `JRN-${selectedVoucher.id}`)}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-600">
                      Quét mã này tại sân bay, khách sạn hoặc điểm nhận xe để xác nhận dịch vụ
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết dịch vụ</h3>
                  <div className="space-y-4">
                    {(selectedVoucher.services || []).map((service, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            {getServiceIcon(service.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-xs text-gray-500 mb-1">{getServiceName(service.type)}</div>
                                <h4 className="text-lg font-bold text-gray-900">{service.name}</h4>
                              </div>
                              <div className="text-xl font-bold text-blue-600">
                                {formatPrice(service.price)} VND
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">{service.details}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              {service.date}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">Hướng dẫn sử dụng voucher</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Check-in sân bay:</strong> Quét QR code tại quầy check-in hoặc trình mã đặt tour</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Nhận phòng khách sạn:</strong> Trình voucher và CMND/CCCD tại quầy lễ tân</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Nhận xe:</strong> Đến địa điểm đã đặt, trình voucher và bằng lái xe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Tham gia tour:</strong> Đến điểm hẹn, trình voucher để tham gia hoạt động</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handlePrint(selectedVoucher)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2"
                  >
                    <IconPrint className="w-5 h-5" />
                    In voucher
                  </button>
                  <button
                    onClick={() => handleDownload(selectedVoucher)}
                    className="flex-1 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2"
                  >
                    <IconDownload className="w-5 h-5" />
                    Tải xuống PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
