import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Professional Icon Components
const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const IconHotel = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875m3.75 0h3.375c.621 0 1.125-.504 1.125-1.125v-5.25c0-1.236-.84-2.232-2.025-2.51a48.308 48.308 0 00-1.927-.884 19.048 19.048 0 00-2.134-.377 19.116 19.116 0 00-2.134.377c-1.185.278-2.025 1.274-2.025 2.51v5.25c0 .621.504 1.125 1.125 1.125h3.75m-9.75 0H5.625c-.621 0-1.125.504-1.125 1.125v5.25c0 .621.504 1.125 1.125 1.125h3.75m-3.75 0h-3.75m9.75 0v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875m-9.75 0h-3.75" />
  </svg>
);

const IconHotelLarge = () => (
  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875m3.75 0h3.375c.621 0 1.125-.504 1.125-1.125v-5.25c0-1.236-.84-2.232-2.025-2.51a48.308 48.308 0 00-1.927-.884 19.048 19.048 0 00-2.134-.377 19.116 19.116 0 00-2.134.377c-1.185.278-2.025 1.274-2.025 2.51v5.25c0 .621.504 1.125 1.125 1.125h3.75m-9.75 0H5.625c-.621 0-1.125.504-1.125 1.125v5.25c0 .621.504 1.125 1.125 1.125h3.75m-3.75 0h-3.75m9.75 0v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875m-9.75 0h-3.75" />
  </svg>
);

const IconShield = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconStar = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconPhone = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconWifi = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
  </svg>
);

const IconBed = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export default function HotelsPage() {
  const [rows, setRows] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [q, setQ] = useState('');

  const load = async () => {
    try {
      const res = await axios.get(`${API}/hotels`, { params: { q } });
      const sanitized = (res.data || []).filter((hotel) => !hotel.status || hotel.status === 'approved');
      setRows(sanitized);
    } catch (error) {
      console.error('Error loading hotels:', error);
      setRows(sampleHotels);
    }
  };

  useEffect(() => { load(); }, [q]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  // Sample hotels data
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
    },
    {
      id: 2,
      name: 'Resort Đà Lạt Premium',
      location: 'Đà Lạt, Lâm Đồng',
      price: 1800000,
      rating: 4,
      image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      description: 'Resort nghỉ dưỡng cao cấp với view núi rừng, không gian yên tĩnh và không khí trong lành',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Spa', 'Nhà hàng', 'Golf', 'Parking'],
      rooms: 80,
      checkIn: '15:00',
      checkOut: '11:00',
      policies: {
        cancel: 'Miễn phí hủy trước 72 giờ',
        children: 'Trẻ em dưới 10 tuổi ở miễn phí',
        pets: 'Cho phép thú cưng (phí 200.000 VND/đêm)',
        smoking: 'Có khu vực hút thuốc'
      }
    },
    {
      id: 3,
      name: 'Boutique Hotel Hội An',
      location: 'Hội An, Quảng Nam',
      price: 1200000,
      rating: 4,
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      description: 'Khách sạn boutique nhỏ xinh với kiến trúc cổ điển, gần phố cổ Hội An',
      amenities: ['Wifi miễn phí', 'Nhà hàng', 'Xe đạp miễn phí', 'Tour booking'],
      rooms: 25,
      checkIn: '14:00',
      checkOut: '12:00',
      policies: {
        cancel: 'Miễn phí hủy trước 24 giờ',
        children: 'Trẻ em dưới 6 tuổi ở miễn phí',
        pets: 'Không cho phép thú cưng',
        smoking: 'Không hút thuốc'
      }
    },
    {
      id: 4,
      name: 'Beach Resort Nha Trang',
      location: 'Nha Trang, Khánh Hòa',
      price: 2200000,
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      description: 'Resort bãi biển 5 sao với bãi biển riêng, view biển tuyệt đẹp và nhiều hoạt động giải trí',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center'],
      rooms: 200,
      checkIn: '15:00',
      checkOut: '12:00',
      policies: {
        cancel: 'Miễn phí hủy trước 48 giờ',
        children: 'Trẻ em dưới 12 tuổi ở miễn phí',
        pets: 'Không cho phép thú cưng',
        smoking: 'Có khu vực hút thuốc'
      }
    },
    {
      id: 5,
      name: 'City Hotel Hà Nội',
      location: 'Hoàn Kiếm, Hà Nội',
      price: 1500000,
      rating: 4,
      image_url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      description: 'Khách sạn 4 sao hiện đại tại trung tâm Hà Nội, gần các điểm tham quan nổi tiếng',
      amenities: ['Wifi miễn phí', 'Nhà hàng', 'Fitness center', 'Parking', 'Business center'],
      rooms: 100,
      checkIn: '14:00',
      checkOut: '12:00',
      policies: {
        cancel: 'Miễn phí hủy trước 24 giờ',
        children: 'Trẻ em dưới 10 tuổi ở miễn phí',
        pets: 'Không cho phép thú cưng',
        smoking: 'Không hút thuốc'
      }
    },
    {
      id: 6,
      name: 'Mountain Lodge Sapa',
      location: 'Sapa, Lào Cai',
      price: 1600000,
      rating: 4,
      image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      description: 'Lodge nghỉ dưỡng trên núi với view ruộng bậc thang, không gian ấm cúng và ẩm thực địa phương',
      amenities: ['Wifi miễn phí', 'Lò sưởi', 'Nhà hàng', 'Tour trekking', 'Parking'],
      rooms: 40,
      checkIn: '14:00',
      checkOut: '11:00',
      policies: {
        cancel: 'Miễn phí hủy trước 48 giờ',
        children: 'Trẻ em dưới 8 tuổi ở miễn phí',
        pets: 'Cho phép thú cưng (phí 150.000 VND/đêm)',
        smoking: 'Có khu vực hút thuốc'
      }
    },
    {
      id: 7,
      name: 'Luxury Hotel Đà Nẵng',
      location: 'Sơn Trà, Đà Nẵng',
      price: 2800000,
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      description: 'Khách sạn 5 sao sang trọng với view biển, spa cao cấp và dịch vụ đẳng cấp',
      amenities: ['Wifi miễn phí', 'Bể bơi vô cực', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center', 'Parking'],
      rooms: 180,
      checkIn: '15:00',
      checkOut: '12:00',
      policies: {
        cancel: 'Miễn phí hủy trước 72 giờ',
        children: 'Trẻ em dưới 12 tuổi ở miễn phí',
        pets: 'Không cho phép thú cưng',
        smoking: 'Không hút thuốc'
      }
    },
    {
      id: 8,
      name: 'Eco Lodge Cần Thơ',
      location: 'Cần Thơ',
      price: 900000,
      rating: 3,
      image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      description: 'Lodge sinh thái gần sông, trải nghiệm văn hóa miền Tây và ẩm thực địa phương',
      amenities: ['Wifi miễn phí', 'Tour sông nước', 'Nhà hàng', 'Xe đạp miễn phí'],
      rooms: 30,
      checkIn: '14:00',
      checkOut: '12:00',
      policies: {
        cancel: 'Miễn phí hủy trước 24 giờ',
        children: 'Trẻ em dưới 8 tuổi ở miễn phí',
        pets: 'Cho phép thú cưng',
        smoking: 'Có khu vực hút thuốc'
      }
    },
    {
      id: 9,
      name: 'Beachfront Hotel Phú Quốc',
      location: 'Phú Quốc, Kiên Giang',
      price: 3200000,
      rating: 5,
      image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      description: 'Resort bãi biển 5 sao với villa riêng, bãi biển tuyệt đẹp và nhiều hoạt động giải trí',
      amenities: ['Wifi miễn phí', 'Bể bơi', 'Bãi biển riêng', 'Spa', 'Nhà hàng', 'Bar', 'Fitness center', 'Diving center'],
      rooms: 120,
      checkIn: '15:00',
      checkOut: '12:00',
      policies: {
        cancel: 'Miễn phí hủy trước 72 giờ',
        children: 'Trẻ em dưới 12 tuổi ở miễn phí',
        pets: 'Không cho phép thú cưng',
        smoking: 'Không hút thuốc'
      }
    }
  ];

  const hotels = rows.length > 0 ? rows : sampleHotels;

  const statistics = [
    { number: '100,000+', label: 'Khách hàng hài lòng', icon: <IconUsers /> },
    { number: '500+', label: 'Khách sạn đa dạng', icon: <IconHotel /> },
    { number: '99%', label: 'Tỷ lệ hài lòng', icon: <IconStar /> },
    { number: '24/7', label: 'Hỗ trợ đặt phòng', icon: <IconShield /> }
  ];

  const values = [
    {
      title: 'Vị trí đắc địa',
      description: 'Tất cả khách sạn đều được chọn lọc kỹ lưỡng về vị trí, thuận tiện cho du lịch và công tác',
      icon: <IconLocation />
    },
    {
      title: 'Giá cả hợp lý',
      description: 'Giá phòng minh bạch, không phát sinh chi phí ẩn, nhiều chương trình khuyến mãi hấp dẫn',
      icon: <IconCheck />
    },
    {
      title: 'Dịch vụ chuyên nghiệp',
      description: 'Đội ngũ nhân viên tận tâm, hỗ trợ 24/7 và đảm bảo trải nghiệm tốt nhất cho khách hàng',
      icon: <IconUsers />
    },
    {
      title: 'Tiện nghi đầy đủ',
      description: 'Tất cả khách sạn đều có đầy đủ tiện nghi hiện đại, wifi miễn phí và dịch vụ chất lượng',
      icon: <IconWifi />
    }
  ];

  const hotelTypes = [
    { name: 'Khách sạn 5 sao', icon: '🏨', count: hotels.filter(h => h.rating === 5).length },
    { name: 'Resort bãi biển', icon: '🏖️', count: hotels.filter(h => h.name?.toLowerCase().includes('resort') || h.name?.toLowerCase().includes('beach')).length },
    { name: 'Boutique Hotel', icon: '🏛️', count: hotels.filter(h => h.name?.toLowerCase().includes('boutique')).length },
    { name: 'Eco Lodge', icon: '🌲', count: hotels.filter(h => h.name?.toLowerCase().includes('eco') || h.name?.toLowerCase().includes('lodge')).length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8 shadow-lg">
              <IconShield className="w-4 h-4" />
              <span className="text-sm font-medium">Đặt phòng khách sạn chuyên nghiệp</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Khách Sạn & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Nghỉ Dưỡng</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Khám phá hàng trăm khách sạn và resort từ bình dân đến cao cấp tại mọi điểm đến.
              Jurni mang đến cho bạn những trải nghiệm nghỉ dưỡng đáng nhớ với giá cả hợp lý.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#khach-san" className="group relative bg-white text-blue-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Xem khách sạn
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-sky-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
              </a>
              <a href="#lien-he" className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50 shadow-xl">
                <span className="flex items-center gap-2">
                  <IconPhone className="w-5 h-5" />
                  Liên hệ ngay
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Thành Công Được <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Chứng Minh</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Những con số nói lên chất lượng dịch vụ của chúng tôi</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, idx) => (
              <div key={idx} className="group relative text-center p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Giá Trị & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Dịch Vụ</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Những lý do khiến khách hàng tin tưởng và lựa chọn Jurni cho chuyến đi của mình
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Focus Section */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-100 text-blue-700 rounded-full mb-6 font-semibold">
                <IconShield className="w-5 h-5" />
                <span>Chất lượng đảm bảo</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Cam Kết <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Chất Lượng</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Tất cả khách sạn trên Jurni đều được kiểm tra và đánh giá kỹ lưỡng. 
                Chúng tôi cam kết mang đến cho bạn trải nghiệm nghỉ dưỡng tốt nhất với giá cả hợp lý.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Kiểm tra chất lượng</h4>
                    <p className="text-gray-600">Tất cả khách sạn đều được kiểm tra định kỳ về tiện nghi và dịch vụ</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Đánh giá thực tế</h4>
                    <p className="text-gray-600">Đánh giá từ khách hàng thực tế, minh bạch và đáng tin cậy</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <IconCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Hỗ trợ 24/7</h4>
                    <p className="text-gray-600">Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-sky-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-100">
                <div className="text-center">
                  <IconHotelLarge />
                  <div className="mt-6 text-4xl font-extrabold text-gray-900 mb-2">
                    {hotels.length}+
                  </div>
                  <div className="text-lg font-semibold text-gray-600 mb-6">Khách sạn đa dạng</div>
                  <div className="grid grid-cols-2 gap-4">
                    {hotelTypes.slice(0, 4).map((type, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold text-gray-700">{type.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.count} khách sạn</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diverse Hotel Types Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Đa Dạng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Loại Khách Sạn</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Từ khách sạn bình dân đến resort 5 sao, chúng tôi có đủ loại khách sạn phù hợp với mọi nhu cầu và ngân sách
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hotelTypes.map((type, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{type.name}</h3>
                  <div className="text-blue-600 font-bold text-lg">{type.count} khách sạn</div>
                </div>
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-blue-500/10 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Listing Section */}
      <section id="khach-san" className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm khách sạn..."
                className="w-full px-6 py-4 pr-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
              />
              <IconLocation className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
            <button
              onClick={load}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/50"
            >
              Tìm kiếm
            </button>
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <IconHotelLarge />
                <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Không tìm thấy khách sạn</h3>
                <p className="text-gray-600 mb-6">
                  Vui lòng thử lại với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ.
                </p>
                <button
                  onClick={() => setQ('')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group bg-white rounded-3xl shadow-lg border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  {hotel.image_url && (
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                      <img
                        src={hotel.image_url}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                        <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-900">{hotel.rating || 4}</span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <IconLocation className="w-4 h-4" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-extrabold text-blue-600">
                            {formatPrice(hotel.price)} VND
                          </div>
                          <div className="text-xs text-gray-500">/ đêm</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <IconBed className="w-5 h-5 inline mr-1" />
                          {hotel.rooms || 'N/A'} phòng
                        </div>
                      </div>
                      {hotel.amenities && hotel.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                              +{hotel.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg mt-auto">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedHotel && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedHotel(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">Chi tiết khách sạn</h2>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-white hover:text-blue-100 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {selectedHotel.image_url && (
                <img
                  src={selectedHotel.image_url}
                  alt={selectedHotel.name}
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
              )}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-900">{selectedHotel.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-full">
                    <IconStar className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-900">{selectedHotel.rating || 4} sao</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <IconLocation className="w-5 h-5" />
                  <span>{selectedHotel.location}</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-600 mb-6">
                  {formatPrice(selectedHotel.price)} VND <span className="text-lg text-gray-500 font-normal">/ đêm</span>
                </div>
                {selectedHotel.description && (
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedHotel.description}</p>
                )}
              </div>

              {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Tiện nghi</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedHotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Check-in / Check-out</h4>
                  <div className="text-gray-700">
                    <div>Check-in: {selectedHotel.checkIn || '14:00'}</div>
                    <div>Check-out: {selectedHotel.checkOut || '12:00'}</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-2">Thông tin phòng</h4>
                  <div className="text-gray-700">
                    <div>Tổng số phòng: {selectedHotel.rooms || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {selectedHotel.policies && (
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Chính sách</h4>
                  <div className="space-y-3">
                    {selectedHotel.policies.cancel && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hủy đặt phòng</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.cancel}</div>
                        </div>
                      </div>
                    )}
                    {selectedHotel.policies.children && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Trẻ em</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.children}</div>
                        </div>
                      </div>
                    )}
                    {selectedHotel.policies.pets && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Thú cưng</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.pets}</div>
                        </div>
                      </div>
                    )}
                    {selectedHotel.policies.smoking && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Hút thuốc</div>
                          <div className="text-gray-600 text-sm">{selectedHotel.policies.smoking}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedHotel(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  Đóng
                </button>
                <a
                  href={`/hotels/${selectedHotel.id}`}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg text-center"
                >
                  Đặt phòng ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
