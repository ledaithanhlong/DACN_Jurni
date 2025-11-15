import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    const printWindow = window.open('', '_blank');
    const qrCodeUrl = generateQRCode(voucher.booking_code || `JRN-${voucher.id}`);
    const services = voucher.services || [];
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Travel Voucher - ${voucher.booking_code || `JRN-${voucher.id}`}</title>
        <style>
          @page {
            size: A4;
            margin: 8mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background: white;
            padding: 0;
            color: #1f2937;
            font-size: 11px;
            line-height: 1.4;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .voucher-container {
            width: 100%;
            max-width: 100%;
            background: white;
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
          }
          .voucher-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
            color: white;
            padding: 16px 12px;
            text-align: center;
            flex-shrink: 0;
            position: relative;
            overflow: hidden;
          }
          .voucher-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
          }
          .voucher-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
            border-radius: 50%;
          }
          .voucher-header h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .voucher-header .subtitle {
            font-size: 10px;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          .voucher-body {
            padding: 12px;
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: #fafbfc;
          }
          .top-section {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
            flex-shrink: 0;
          }
          .booking-info {
            padding: 12px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 8px;
            border: 2px solid #3b82f6;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
          }
          .info-item {
            text-align: center;
            margin-bottom: 8px;
          }
          .info-item:last-child {
            margin-bottom: 0;
          }
          .info-label {
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin-bottom: 4px;
            font-weight: 700;
          }
          .info-value {
            font-size: 13px;
            font-weight: 800;
            color: #1e40af;
            letter-spacing: 0.5px;
          }
          .booking-code {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #1e40af;
            text-align: center;
            padding: 10px;
            background: white;
            border: 2.5px dashed #3b82f6;
            border-radius: 8px;
            margin-top: 10px;
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
          }
          .qr-section {
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 8px;
            border: 2px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .qr-title {
            font-size: 11px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .qr-code {
            display: inline-block;
            padding: 12px;
            background: white;
            border-radius: 8px;
            margin: 8px 0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border: 2px solid #e5e7eb;
          }
          .qr-code img {
            width: 95px;
            height: 95px;
            display: block;
          }
          .qr-note {
            font-size: 8px;
            color: #64748b;
            margin-top: 8px;
            font-style: italic;
            line-height: 1.3;
            padding: 0 4px;
          }
          .services-section {
            margin-top: 10px;
            flex: 1;
            overflow: hidden;
          }
          .section-title {
            font-size: 14px;
            font-weight: 800;
            color: #1e40af;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 3px solid #3b82f6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .services-list {
            max-height: 200px;
            overflow-y: auto;
          }
          .service-item {
            background: white;
            border: 1.5px solid #e5e7eb;
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            transition: all 0.2s;
          }
          .service-item:hover {
            border-color: #3b82f6;
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
          }
          .service-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 6px;
          }
          .service-type {
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            font-weight: 700;
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
          }
          .service-name {
            font-size: 13px;
            font-weight: 700;
            color: #1f2937;
            margin-top: 4px;
            line-height: 1.3;
            letter-spacing: 0.2px;
          }
          .service-price {
            font-size: 14px;
            font-weight: 800;
            color: #1e40af;
            text-align: right;
            letter-spacing: 0.3px;
          }
          .service-details {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 4px;
            line-height: 1.4;
          }
          .service-date {
            font-size: 9px;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 500;
          }
          .bottom-section {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 12px;
            margin-top: 10px;
            flex-shrink: 0;
          }
          .total-section {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(30, 58, 138, 0.2);
            position: relative;
            overflow: hidden;
          }
          .total-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
            border-radius: 50%;
          }
          .total-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            opacity: 0.95;
            margin-bottom: 6px;
            font-weight: 600;
            position: relative;
            z-index: 1;
          }
          .total-amount {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
            margin-bottom: 6px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
            position: relative;
            z-index: 1;
          }
          .instructions {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 10px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1);
          }
          .instructions h4 {
            color: #92400e;
            font-size: 11px;
            font-weight: 800;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .instructions ul {
            list-style: none;
            padding: 0;
          }
          .instructions li {
            padding: 3px 0;
            color: #78350f;
            font-size: 9px;
            display: flex;
            align-items: start;
            gap: 6px;
            line-height: 1.4;
            font-weight: 500;
          }
          .instructions li::before {
            content: '✓';
            color: #10b981;
            font-weight: 800;
            font-size: 11px;
            flex-shrink: 0;
            background: white;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          .footer {
            text-align: center;
            padding: 10px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 8px;
            margin-top: 10px;
            flex-shrink: 0;
          }
          .footer-logo {
            font-size: 14px;
            font-weight: 900;
            color: #1e40af;
            margin-bottom: 4px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .footer div {
            margin: 2px 0;
            line-height: 1.3;
            font-weight: 500;
          }
          @media print {
            body {
              background: white;
              padding: 0;
              margin: 0;
            }
            .voucher-container {
              box-shadow: none;
              border-radius: 0;
              height: auto;
              min-height: 100vh;
            }
            .voucher-header::before,
            .voucher-header::after,
            .total-section::before {
              display: none;
            }
            .services-list {
              max-height: none;
              overflow: visible;
            }
            .service-item {
              page-break-inside: avoid;
            }
            .top-section, .bottom-section {
              page-break-inside: avoid;
            }
            .service-item:hover {
              border-color: #e5e7eb;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
          }
        </style>
      </head>
      <body>
        <div class="voucher-container">
          <div class="voucher-header">
            <h1>Travel Voucher</h1>
            <div class="subtitle">Xác nhận dịch vụ đã thanh toán</div>
          </div>
          
          <div class="voucher-body">
            <div class="top-section">
              <div class="booking-info">
                <div class="info-item">
                  <div class="info-label">Mã đặt tour</div>
                  <div class="info-value">${voucher.booking_code || `JRN-${voucher.id}`}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Ngày đặt</div>
                  <div class="info-value">${formatDate(voucher.created_at)}</div>
                </div>
                <div class="booking-code" style="margin-top: 10px;">
                  ${voucher.booking_code || `JRN-${voucher.id}`}
                </div>
              </div>

              <div class="qr-section">
                <div class="qr-title">
                  Mã QR Code
                </div>
                <div class="qr-code">
                  <img src="${qrCodeUrl}" alt="QR Code" />
                </div>
                <div class="qr-note">
                  Quét mã này tại sân bay, khách sạn hoặc điểm nhận xe để xác nhận dịch vụ
                </div>
              </div>
            </div>

            <div class="services-section">
              <div class="section-title">Chi tiết dịch vụ</div>
              <div class="services-list">
                ${services.map((service, idx) => `
                  <div class="service-item">
                    <div class="service-header">
                      <div>
                        <div class="service-type">${getServiceName(service.type)}</div>
                        <div class="service-name">${service.name}</div>
                      </div>
                      <div class="service-price">${formatPrice(service.price)} VND</div>
                    </div>
                    <div class="service-details">${service.details}</div>
                    <div class="service-date">
                      📅 ${service.date}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="bottom-section">
              <div class="instructions">
                <h4>📋 Hướng dẫn sử dụng voucher</h4>
                <ul>
                  <li><strong>Check-in sân bay:</strong> Quét QR code tại quầy check-in hoặc trình mã đặt tour</li>
                  <li><strong>Nhận phòng khách sạn:</strong> Trình voucher và CMND/CCCD tại quầy lễ tân</li>
                  <li><strong>Nhận xe:</strong> Đến địa điểm đã đặt, trình voucher và bằng lái xe</li>
                  <li><strong>Tham gia tour:</strong> Đến điểm hẹn, trình voucher để tham gia hoạt động</li>
                </ul>
              </div>

              <div class="total-section">
                <div class="total-label">Tổng tiền thanh toán</div>
                <div class="total-amount">${formatPrice(voucher.total_price)} VND</div>
                <div class="status-badge">✓ Đã thanh toán</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-logo">JURNI TRAVEL</div>
            <div>123 Đường ABC, Quận XYZ, TP.HCM</div>
            <div>Hotline: 1900 123 456 | Email: support@jurni.com</div>
            <div style="margin-top: 10px; font-size: 11px;">
              Voucher này là tài liệu chính thức xác nhận việc đặt và thanh toán dịch vụ du lịch
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleDownload = async (voucher) => {
    try {
      // Tạo một iframe ẩn thay vì window để tránh popup blocker
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);
      
      const qrCodeUrl = generateQRCode(voucher.booking_code || `JRN-${voucher.id}`);
      const services = voucher.services || [];
      
      iframe.contentDocument.open();
      iframe.contentDocument.write(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Travel Voucher - ${voucher.booking_code || `JRN-${voucher.id}`}</title>
          <style>
            @page {
              size: A4;
              margin: 8mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              background: white;
              padding: 0;
              color: #1f2937;
              font-size: 11px;
              line-height: 1.4;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .voucher-container {
              width: 100%;
              max-width: 100%;
              background: white;
              overflow: hidden;
              height: 100vh;
              display: flex;
              flex-direction: column;
              box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
            }
            .voucher-header {
              background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
              color: white;
              padding: 16px 12px;
              text-align: center;
              flex-shrink: 0;
              position: relative;
              overflow: hidden;
            }
            .voucher-header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -20%;
              width: 200px;
              height: 200px;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              border-radius: 50%;
            }
            .voucher-header::after {
              content: '';
              position: absolute;
              bottom: -30%;
              left: -10%;
              width: 150px;
              height: 150px;
              background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
              border-radius: 50%;
            }
            .voucher-header h1 {
              font-size: 24px;
              font-weight: 800;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 1px;
              position: relative;
              z-index: 1;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .voucher-header .subtitle {
              font-size: 10px;
              opacity: 0.95;
              position: relative;
              z-index: 1;
              font-weight: 500;
              letter-spacing: 0.5px;
            }
            .voucher-body {
              padding: 12px;
              flex: 1;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              background: #fafbfc;
            }
            .top-section {
              display: grid;
              grid-template-columns: 1.2fr 1fr;
              gap: 12px;
              margin-bottom: 12px;
              flex-shrink: 0;
            }
            .booking-info {
              padding: 12px;
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              border-radius: 8px;
              border: 2px solid #3b82f6;
              box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
            }
            .info-item {
              text-align: center;
              margin-bottom: 8px;
            }
            .info-item:last-child {
              margin-bottom: 0;
            }
            .info-label {
              font-size: 8px;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #64748b;
              margin-bottom: 4px;
              font-weight: 700;
            }
            .info-value {
              font-size: 13px;
              font-weight: 800;
              color: #1e40af;
              letter-spacing: 0.5px;
            }
            .booking-code {
              font-size: 18px;
              font-weight: 900;
              letter-spacing: 2px;
              color: #1e40af;
              text-align: center;
              padding: 10px;
              background: white;
              border: 2.5px dashed #3b82f6;
              border-radius: 8px;
              margin-top: 10px;
              box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
            }
            .qr-section {
              text-align: center;
              padding: 12px;
              background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
              border-radius: 8px;
              border: 2px solid #e2e8f0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .qr-title {
              font-size: 11px;
              font-weight: 700;
              color: #1e40af;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .qr-code {
              display: inline-block;
              padding: 12px;
              background: white;
              border-radius: 8px;
              margin: 8px 0;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              border: 2px solid #e5e7eb;
            }
            .qr-code img {
              width: 95px;
              height: 95px;
              display: block;
            }
            .qr-note {
              font-size: 8px;
              color: #64748b;
              margin-top: 8px;
              font-style: italic;
              line-height: 1.3;
              padding: 0 4px;
            }
            .services-section {
              margin-top: 10px;
              flex: 1;
              overflow: hidden;
            }
            .section-title {
              font-size: 14px;
              font-weight: 800;
              color: #1e40af;
              margin-bottom: 10px;
              padding-bottom: 6px;
              border-bottom: 3px solid #3b82f6;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .services-list {
              max-height: 200px;
              overflow-y: auto;
            }
            .service-item {
              background: white;
              border: 1.5px solid #e5e7eb;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
              transition: all 0.2s;
            }
            .service-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 6px;
            }
            .service-type {
              font-size: 8px;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #64748b;
              font-weight: 700;
              background: #f1f5f9;
              padding: 2px 6px;
              border-radius: 4px;
              display: inline-block;
            }
            .service-name {
              font-size: 13px;
              font-weight: 700;
              color: #1f2937;
              margin-top: 4px;
              line-height: 1.3;
              letter-spacing: 0.2px;
            }
            .service-price {
              font-size: 14px;
              font-weight: 800;
              color: #1e40af;
              text-align: right;
              letter-spacing: 0.3px;
            }
            .service-details {
              font-size: 10px;
              color: #64748b;
              margin-bottom: 4px;
              line-height: 1.4;
            }
            .service-date {
              font-size: 9px;
              color: #94a3b8;
              display: flex;
              align-items: center;
              gap: 4px;
              font-weight: 500;
            }
            .bottom-section {
              display: grid;
              grid-template-columns: 1.5fr 1fr;
              gap: 12px;
              margin-top: 10px;
              flex-shrink: 0;
            }
            .total-section {
              background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
              color: white;
              padding: 12px;
              border-radius: 8px;
              text-align: center;
              box-shadow: 0 4px 8px rgba(30, 58, 138, 0.2);
              position: relative;
              overflow: hidden;
            }
            .total-section::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -20%;
              width: 100px;
              height: 100px;
              background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
              border-radius: 50%;
            }
            .total-label {
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              opacity: 0.95;
              margin-bottom: 6px;
              font-weight: 600;
              position: relative;
              z-index: 1;
            }
            .total-amount {
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 1px;
              margin-bottom: 6px;
              position: relative;
              z-index: 1;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .status-badge {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 8px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
              position: relative;
              z-index: 1;
            }
            .instructions {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-left: 4px solid #f59e0b;
              padding: 10px;
              border-radius: 6px;
              box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1);
            }
            .instructions h4 {
              color: #92400e;
              font-size: 11px;
              font-weight: 800;
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .instructions ul {
              list-style: none;
              padding: 0;
            }
            .instructions li {
              padding: 3px 0;
              color: #78350f;
              font-size: 9px;
              display: flex;
              align-items: start;
              gap: 6px;
              line-height: 1.4;
              font-weight: 500;
            }
            .instructions li::before {
              content: '✓';
              color: #10b981;
              font-weight: 800;
              font-size: 11px;
              flex-shrink: 0;
              background: white;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            .footer {
              text-align: center;
              padding: 10px;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-top: 2px solid #e2e8f0;
              color: #64748b;
              font-size: 8px;
              margin-top: 10px;
              flex-shrink: 0;
            }
            .footer-logo {
              font-size: 14px;
              font-weight: 900;
              color: #1e40af;
              margin-bottom: 4px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .footer div {
              margin: 2px 0;
              line-height: 1.3;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="voucher-container" id="voucher-content">
            <div class="voucher-header">
              <h1>Travel Voucher</h1>
              <div class="subtitle">Xác nhận dịch vụ đã thanh toán</div>
            </div>
            
            <div class="voucher-body">
              <div class="top-section">
                <div class="booking-info">
                  <div class="info-item">
                    <div class="info-label">Mã đặt tour</div>
                    <div class="info-value">${voucher.booking_code || `JRN-${voucher.id}`}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Ngày đặt</div>
                    <div class="info-value">${formatDate(voucher.created_at)}</div>
                  </div>
                  <div class="booking-code" style="margin-top: 10px;">
                    ${voucher.booking_code || `JRN-${voucher.id}`}
                  </div>
                </div>

                <div class="qr-section">
                  <div class="qr-title">
                    Mã QR Code
                  </div>
                  <div class="qr-code">
                    <img src="${qrCodeUrl}" alt="QR Code" />
                  </div>
                  <div class="qr-note">
                    Quét mã này tại sân bay, khách sạn hoặc điểm nhận xe để xác nhận dịch vụ
                  </div>
                </div>
              </div>

              <div class="services-section">
                <div class="section-title">Chi tiết dịch vụ</div>
                <div class="services-list">
                  ${services.map((service, idx) => `
                    <div class="service-item">
                      <div class="service-header">
                        <div>
                          <div class="service-type">${getServiceName(service.type)}</div>
                          <div class="service-name">${service.name}</div>
                        </div>
                        <div class="service-price">${formatPrice(service.price)} VND</div>
                      </div>
                      <div class="service-details">${service.details}</div>
                      <div class="service-date">
                        📅 ${service.date}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="bottom-section">
                <div class="instructions">
                  <h4>📋 Hướng dẫn sử dụng voucher</h4>
                  <ul>
                    <li><strong>Check-in sân bay:</strong> Quét QR code tại quầy check-in hoặc trình mã đặt tour</li>
                    <li><strong>Nhận phòng khách sạn:</strong> Trình voucher và CMND/CCCD tại quầy lễ tân</li>
                    <li><strong>Nhận xe:</strong> Đến địa điểm đã đặt, trình voucher và bằng lái xe</li>
                    <li><strong>Tham gia tour:</strong> Đến điểm hẹn, trình voucher để tham gia hoạt động</li>
                  </ul>
                </div>

                <div class="total-section">
                  <div class="total-label">Tổng tiền thanh toán</div>
                  <div class="total-amount">${formatPrice(voucher.total_price)} VND</div>
                  <div class="status-badge">✓ Đã thanh toán</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-logo">JURNI TRAVEL</div>
              <div>123 Đường ABC, Quận XYZ, TP.HCM</div>
              <div>Hotline: 1900 123 456 | Email: support@jurni.com</div>
              <div style="margin-top: 10px; font-size: 11px;">
                Voucher này là tài liệu chính thức xác nhận việc đặt và thanh toán dịch vụ du lịch
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      iframe.contentDocument.close();

      // Đợi nội dung và hình ảnh load xong
      await new Promise((resolve) => {
        setTimeout(() => {
          const doc = iframe.contentDocument;
          const images = doc.querySelectorAll('img');
          let loadedImages = 0;
          const totalImages = images.length;

          if (totalImages === 0) {
            resolve();
            return;
          }

          images.forEach((img) => {
            if (img.complete) {
              loadedImages++;
              if (loadedImages === totalImages) resolve();
            } else {
              img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages) resolve();
              };
              img.onerror = () => {
                loadedImages++;
                if (loadedImages === totalImages) resolve();
              };
            }
          });
        }, 1000);
      });

      // Chụp màn hình bằng html2canvas
      const element = iframe.contentDocument.getElementById('voucher-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      // Tạo PDF từ canvas
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Tính toán kích thước để vừa với trang A4
      const ratio = Math.min((pdfWidth - 16) / (imgWidth * 0.264583), (pdfHeight - 16) / (imgHeight * 0.264583));
      const imgScaledWidth = imgWidth * 0.264583 * ratio;
      const imgScaledHeight = imgHeight * 0.264583 * ratio;
      const xOffset = (pdfWidth - imgScaledWidth) / 2;
      const yOffset = (pdfHeight - imgScaledHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgScaledWidth, imgScaledHeight);
      
      // Tạo tên file tự động với format: Voucher-{booking_code}-{timestamp}.pdf
      const bookingCode = (voucher.booking_code || `JRN-${voucher.id}`).replace(/[^a-zA-Z0-9-]/g, '_');
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
      const fileName = `Voucher-${bookingCode}-${timestamp}.pdf`;
      
      // Tải file PDF về máy tự động với tên đã generate
      pdf.save(fileName);

      // Xóa iframe sau khi tải xong
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.');
    }
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
