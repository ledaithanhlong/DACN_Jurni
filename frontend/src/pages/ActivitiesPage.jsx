import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Professional Icon Components
const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const IconActivity = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const IconActivityLarge = () => (
  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
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

const IconMail = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconClock = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ActivitiesPage() {
  const [rows, setRows] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/activities`);
      setRows(res.data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      setRows(sampleActivities);
    }
  };

  useEffect(() => { load(); }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  // Sample activities data
  const sampleActivities = [
    {
      id: 1,
      name: 'Tour Tham Quan Phố Cổ Hà Nội',
      city: 'Hà Nội',
      price: 350000,
      image_url: 'https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800',
      description: 'Khám phá 36 phố phường cổ kính, thưởng thức ẩm thực đường phố và tìm hiểu văn hóa lịch sử Hà Nội',
      duration: '4 giờ',
      category: 'Văn hóa & Lịch sử',
      includes: ['Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm du lịch', 'Nước uống'],
      meetingPoint: 'Nhà hát lớn Hà Nội, 1 Tràng Tiền, Hoàn Kiếm',
      policies: {
        cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
        change: 'Có thể đổi ngày tham gia, vui lòng liên hệ trước ít nhất 24 giờ.',
        weather: 'Tour vẫn diễn ra trong điều kiện thời tiết nhẹ. Hủy miễn phí nếu thời tiết cực đoan.',
        children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
      }
    },
    {
      id: 2,
      name: 'Tham Quan Vịnh Hạ Long',
      city: 'Quảng Ninh',
      price: 1200000,
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      description: 'Trải nghiệm vẻ đẹp kỳ vĩ của Di sản Thế giới UNESCO, tham quan hang động và tắm biển',
      duration: '1 ngày',
      category: 'Thiên nhiên & Du lịch',
      includes: ['Tàu tham quan', 'Bữa trưa trên tàu', 'Hướng dẫn viên', 'Bảo hiểm'],
      meetingPoint: 'Bến tàu Tuần Châu, Hạ Long',
      policies: {
        cancel: 'Miễn phí hủy trước 72 giờ. Hủy trong vòng 72 giờ: phí 50% giá trị đơn hàng.',
        change: 'Có thể đổi ngày, vui lòng liên hệ trước 48 giờ.',
        weather: 'Tour có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
        children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-10 tuổi giảm 30%.'
      }
    },
    {
      id: 3,
      name: 'Công Viên Nước Vinpearl',
      city: 'Nha Trang',
      price: 650000,
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      description: 'Vui chơi tại công viên nước lớn nhất Việt Nam với hơn 20 trò chơi cảm giác mạnh',
      duration: 'Cả ngày',
      category: 'Giải trí & Vui chơi',
      includes: ['Vé vào cửa', 'Sử dụng tất cả trò chơi', 'Áo phao', 'Két đồ'],
      meetingPoint: 'Công viên Vinpearl, Đảo Hòn Tre, Nha Trang',
      policies: {
        cancel: 'Miễn phí hủy trước 24 giờ. Hủy trong vòng 24 giờ: không hoàn tiền.',
        change: 'Có thể đổi ngày, vui lòng liên hệ trước 12 giờ.',
        weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu mưa to.',
        children: 'Trẻ em dưới 1m miễn phí. Trẻ em 1m-1.4m giảm 30%.'
      }
    },
    {
      id: 4,
      name: 'Show Diễn Nhạc Nước',
      city: 'Đà Nẵng',
      price: 200000,
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      description: 'Xem show diễn nhạc nước đầy màu sắc tại Cầu Rồng, một trong những điểm đến nổi tiếng nhất Đà Nẵng',
      duration: '1 giờ',
      category: 'Giải trí & Vui chơi',
      includes: ['Vé xem show', 'Ghế ngồi VIP'],
      meetingPoint: 'Cầu Rồng, Đà Nẵng',
      policies: {
        cancel: 'Miễn phí hủy trước 2 giờ. Hủy trong vòng 2 giờ: không hoàn tiền.',
        change: 'Có thể đổi giờ xem, vui lòng liên hệ trước 1 giờ.',
        weather: 'Show có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
        children: 'Trẻ em dưới 3 tuổi miễn phí.'
      }
    },
    {
      id: 5,
      name: 'Tour Tham Quan Chùa Một Cột',
      city: 'Hà Nội',
      price: 250000,
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      description: 'Tham quan biểu tượng văn hóa nổi tiếng của Hà Nội và tìm hiểu lịch sử Phật giáo Việt Nam',
      duration: '2 giờ',
      category: 'Văn hóa & Lịch sử',
      includes: ['Hướng dẫn viên', 'Vé vào cửa', 'Nước uống'],
      meetingPoint: 'Chùa Một Cột, Đội Cấn, Ba Đình, Hà Nội',
      policies: {
        cancel: 'Miễn phí hủy trước 24 giờ.',
        change: 'Có thể đổi giờ, vui lòng liên hệ trước 12 giờ.',
        weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết.',
        children: 'Trẻ em dưới 6 tuổi miễn phí.'
      }
    },
    {
      id: 6,
      name: 'Lặn Biển Ngắm San Hô',
      city: 'Phú Quốc',
      price: 850000,
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      description: 'Trải nghiệm lặn biển ngắm san hô đầy màu sắc và các loài cá nhiệt đới',
      duration: 'Nửa ngày',
      category: 'Thể thao & Mạo hiểm',
      includes: ['Thiết bị lặn', 'Hướng dẫn viên chuyên nghiệp', 'Bảo hiểm', 'Bữa trưa'],
      meetingPoint: 'Bến tàu An Thới, Phú Quốc',
      policies: {
        cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 40% giá trị đơn hàng.',
        change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
        weather: 'Tour có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
        children: 'Trẻ em từ 10 tuổi trở lên mới được tham gia.'
      }
    },
    {
      id: 7,
      name: 'Tham Quan Làng Gốm Bát Tràng',
      city: 'Hà Nội',
      price: 300000,
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      description: 'Tìm hiểu nghề làm gốm truyền thống, tự tay làm gốm và mua sắm đồ lưu niệm',
      duration: '3 giờ',
      category: 'Văn hóa & Lịch sử',
      includes: ['Hướng dẫn viên', 'Trải nghiệm làm gốm', 'Nước uống'],
      meetingPoint: 'Làng Gốm Bát Tràng, Gia Lâm, Hà Nội',
      policies: {
        cancel: 'Miễn phí hủy trước 24 giờ.',
        change: 'Có thể đổi giờ, vui lòng liên hệ trước 12 giờ.',
        weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết.',
        children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
      }
    },
    {
      id: 8,
      name: 'Công Viên Chủ Đề Sun World',
      city: 'Đà Nẵng',
      price: 750000,
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      description: 'Vui chơi tại công viên giải trí lớn với các trò chơi cảm giác mạnh và show biểu diễn',
      duration: 'Cả ngày',
      category: 'Giải trí & Vui chơi',
      includes: ['Vé vào cửa', 'Sử dụng tất cả trò chơi', 'Show biểu diễn', 'Két đồ'],
      meetingPoint: 'Sun World Ba Na Hills, Đà Nẵng',
      policies: {
        cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
        change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
        weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu thời tiết cực đoan.',
        children: 'Trẻ em dưới 1m miễn phí. Trẻ em 1m-1.4m giảm 30%.'
      }
    },
    {
      id: 9,
      name: 'Tour Ẩm Thực Đường Phố',
      city: 'Hồ Chí Minh',
      price: 450000,
      image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      description: 'Khám phá ẩm thực đường phố Sài Gòn với các món ăn địa phương nổi tiếng',
      duration: '3 giờ',
      category: 'Văn hóa & Lịch sử',
      includes: ['Hướng dẫn viên', 'Tất cả các món ăn', 'Nước uống', 'Bảo hiểm'],
      meetingPoint: 'Chợ Bến Thành, Quận 1, TP.HCM',
      policies: {
        cancel: 'Miễn phí hủy trước 12 giờ. Hủy trong vòng 12 giờ: không hoàn tiền.',
        change: 'Có thể đổi giờ, vui lòng liên hệ trước 6 giờ.',
        weather: 'Tour vẫn diễn ra trong mọi điều kiện thời tiết.',
        children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
      }
    },
    {
      id: 10,
      name: 'Tham Quan Đảo Khỉ Cần Giờ',
      city: 'Hồ Chí Minh',
      price: 550000,
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      description: 'Tham quan đảo khỉ, tìm hiểu về động vật hoang dã và thưởng thức hải sản tươi sống',
      duration: 'Nửa ngày',
      category: 'Thiên nhiên & Du lịch',
      includes: ['Tàu tham quan', 'Hướng dẫn viên', 'Bữa trưa hải sản', 'Bảo hiểm'],
      meetingPoint: 'Bến tàu Cần Giờ, TP.HCM',
      policies: {
        cancel: 'Miễn phí hủy trước 48 giờ. Hủy trong vòng 48 giờ: phí 30% giá trị đơn hàng.',
        change: 'Có thể đổi ngày, vui lòng liên hệ trước 24 giờ.',
        weather: 'Tour có thể bị hủy do thời tiết, hoàn tiền 100% nếu hủy.',
        children: 'Trẻ em dưới 5 tuổi miễn phí. Trẻ em 5-12 tuổi giảm 50%.'
      }
    },
    {
      id: 11,
      name: 'Xe Đạp Tham Quan Phố Cổ Hội An',
      city: 'Hội An',
      price: 200000,
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      description: 'Đạp xe tham quan phố cổ Hội An, khám phá kiến trúc cổ và văn hóa địa phương',
      duration: '2 giờ',
      category: 'Thiên nhiên & Du lịch',
      includes: ['Xe đạp', 'Hướng dẫn viên', 'Nước uống', 'Bảo hiểm'],
      meetingPoint: 'Phố cổ Hội An, Quảng Nam',
      policies: {
        cancel: 'Miễn phí hủy trước 12 giờ.',
        change: 'Có thể đổi giờ, vui lòng liên hệ trước 6 giờ.',
        weather: 'Tour vẫn diễn ra trong mưa nhẹ. Hủy miễn phí nếu mưa to.',
        children: 'Trẻ em dưới 10 tuổi cần người lớn đi kèm.'
      }
    },
    {
      id: 12,
      name: 'Spa & Massage Thư Giãn',
      city: 'Đà Nẵng',
      price: 500000,
      image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      description: 'Thư giãn với dịch vụ spa và massage chuyên nghiệp, phục hồi năng lượng sau chuyến du lịch',
      duration: '2 giờ',
      category: 'Giải trí & Vui chơi',
      includes: ['Massage body', 'Tắm thảo dược', 'Trà thảo mộc', 'Phòng thay đồ'],
      meetingPoint: 'Spa & Wellness Center, Đà Nẵng',
      policies: {
        cancel: 'Miễn phí hủy trước 6 giờ. Hủy trong vòng 6 giờ: phí 50% giá trị đơn hàng.',
        change: 'Có thể đổi giờ, vui lòng liên hệ trước 3 giờ.',
        weather: 'Không ảnh hưởng bởi thời tiết.',
        children: 'Dịch vụ dành cho người từ 16 tuổi trở lên.'
      }
    }
  ];

  const activities = rows.length > 0 ? rows : sampleActivities;

  const statistics = [
    { number: '50,000+', label: 'Khách hàng hài lòng', icon: <IconUsers /> },
    { number: '500+', label: 'Hoạt động đa dạng', icon: <IconActivity /> },
    { number: '99%', label: 'Tỷ lệ hài lòng', icon: <IconStar /> },
    { number: '24/7', label: 'Hỗ trợ đặt tour', icon: <IconShield /> }
  ];

  const values = [
    {
      title: 'Trải nghiệm độc đáo',
      description: 'Mỗi hoạt động đều được tuyển chọn kỹ lưỡng để mang đến trải nghiệm đáng nhớ nhất',
      icon: <IconStar />
    },
    {
      title: 'Giá cả hợp lý',
      description: 'Giá cả minh bạch, không phát sinh chi phí ẩn, nhiều chương trình khuyến mãi hấp dẫn',
      icon: <IconCheck />
    },
    {
      title: 'Hướng dẫn chuyên nghiệp',
      description: 'Đội ngũ hướng dẫn viên giàu kinh nghiệm, nhiệt tình và am hiểu văn hóa địa phương',
      icon: <IconUsers />
    },
    {
      title: 'An toàn tuyệt đối',
      description: 'Tất cả hoạt động đều được đảm bảo an toàn với bảo hiểm du lịch đầy đủ',
      icon: <IconShield />
    }
  ];

  const categories = [
    { name: 'Văn hóa & Lịch sử', icon: '🏛️', count: activities.filter(a => a.category?.includes('Văn hóa')).length },
    { name: 'Thiên nhiên & Du lịch', icon: '🌴', count: activities.filter(a => a.category?.includes('Thiên nhiên')).length },
    { name: 'Giải trí & Vui chơi', icon: '🎢', count: activities.filter(a => a.category?.includes('Giải trí')).length },
    { name: 'Thể thao & Mạo hiểm', icon: '🏄', count: activities.filter(a => a.category?.includes('Thể thao')).length }
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
              <span className="text-sm font-medium">Trải nghiệm đáng nhớ</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Hoạt Động & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Vui Chơi</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              Khám phá hàng trăm hoạt động thú vị từ tour văn hóa, giải trí đến thể thao mạo hiểm. 
              Jurni mang đến cho bạn những trải nghiệm độc đáo và đáng nhớ tại mọi điểm đến.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#hoat-dong" className="group relative bg-white text-blue-700 px-8 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Xem hoạt động
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
                
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Giá Trị & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Dịch Vụ</span> Của Jurni
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi không chỉ tổ chức tour, mà còn mang đến những trải nghiệm đáng nhớ với những giá trị cốt lõi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="group relative bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
                
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-blue-500/10 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Focus Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="absolute top-0 left-0 w-32 h-32 border-t-[3px] border-l-[3px] border-white/20 rounded-tl-[2.5rem]"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-[3px] border-r-[3px] border-white/20 rounded-br-[2.5rem]"></div>
            
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                  <IconShield className="w-5 h-5" />
                  <span className="text-sm font-semibold">Cam kết chất lượng</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  Chất Lượng - <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-200">Mục Tiêu Hàng Đầu</span>
                </h2>
                <p className="text-lg text-blue-100/90 mb-8 leading-relaxed">
                  Tại Jurni, mỗi hoạt động đều được tuyển chọn kỹ lưỡng và đảm bảo:
                </p>
                <ul className="space-y-4">
                  {[
                    'Đối tác uy tín, được kiểm định chất lượng',
                    'Hướng dẫn viên chuyên nghiệp, giàu kinh nghiệm',
                    'An toàn tuyệt đối với bảo hiểm đầy đủ',
                    'Dịch vụ hỗ trợ 24/7, luôn sẵn sàng giúp đỡ',
                    'Giá cả minh bạch, không phát sinh chi phí ẩn'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                        <IconCheck className="w-5 h-5 text-green-300" />
                      </div>
                      <span className="text-blue-100/90 text-base leading-relaxed pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border-2 border-white/20 shadow-2xl">
                  <div className="text-center">
                    <div className="text-7xl font-extrabold mb-4 bg-gradient-to-br from-white to-blue-200 text-transparent bg-clip-text">
                      100%
                    </div>
                    <div className="text-2xl font-bold text-white mb-6">Hoạt động đạt chuẩn</div>
                    <div className="text-base text-blue-100/90 leading-relaxed max-w-sm mx-auto">
                      Tất cả hoạt động đều được kiểm tra và chứng nhận an toàn trước khi đưa vào sử dụng
                    </div>
                  </div>
                  
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-2xl rotate-12"></div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sky-400/20 rounded-2xl -rotate-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diverse Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Đa Dạng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Loại Hoạt Động</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Từ tour văn hóa, giải trí đến thể thao mạo hiểm, chúng tôi có đủ loại hoạt động phù hợp với mọi sở thích
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div key={idx} className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-sky-50/0 group-hover:from-blue-50 group-hover:to-sky-50 transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <div className="text-blue-600 font-semibold">{category.count} hoạt động</div>
                </div>
                
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-blue-500/10 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Listing */}
      <section id="hoat-dong" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Danh Sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">Hoạt Động</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Khám phá các hoạt động thú vị và đặt tour ngay hôm nay
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  {activity.image_url ? (
                    <img
                      src={activity.image_url}
                      alt={activity.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center">
                      <IconActivityLarge />
                    </div>
                  )}
                  {activity.category && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {activity.category}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{activity.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <IconLocation className="w-4 h-4" />
                    <span>{activity.city}</span>
                  </div>
                  {activity.duration && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <IconClock className="w-4 h-4" />
                      <span>{activity.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(activity.price)} VND
                      </div>
                      <div className="text-xs text-gray-500">/ người</div>
                    </div>
                    <button
                      onClick={() => setSelectedActivity(activity)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedActivity(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedActivity.name}</h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              {selectedActivity.image_url && (
                <img
                  src={selectedActivity.image_url}
                  alt={selectedActivity.name}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}
              <div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(selectedActivity.price)} VND
                  </div>
                  <div className="text-gray-600">/ người</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <IconLocation className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Địa điểm: {selectedActivity.city}</span>
                  </div>
                  {selectedActivity.duration && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <IconClock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Thời gian: {selectedActivity.duration}</span>
                    </div>
                  )}
                  {selectedActivity.category && (
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedActivity.category}
                      </span>
                    </div>
                  )}
                </div>
                {selectedActivity.description && (
                  <p className="text-gray-700 mb-4">{selectedActivity.description}</p>
                )}
              </div>

              {/* Includes */}
              {selectedActivity.includes && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bao gồm</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedActivity.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                        <IconCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meeting Point */}
              {selectedActivity.meetingPoint && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Điểm hẹn</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <IconLocation className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">{selectedActivity.meetingPoint}</div>
                        <div className="text-sm text-gray-600 mt-1">Vui lòng có mặt trước 15 phút</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Policies */}
              {selectedActivity.policies && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Chính Sách</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <div className="font-semibold text-gray-900 mb-1">Hủy đặt tour</div>
                      <div className="text-sm text-gray-600">{selectedActivity.policies.cancel}</div>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="font-semibold text-gray-900 mb-1">Đổi ngày</div>
                      <div className="text-sm text-gray-600">{selectedActivity.policies.change}</div>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <div className="font-semibold text-gray-900 mb-1">Thời tiết</div>
                      <div className="text-sm text-gray-600">{selectedActivity.policies.weather}</div>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <div className="font-semibold text-gray-900 mb-1">Trẻ em</div>
                      <div className="text-sm text-gray-600">{selectedActivity.policies.children}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact */}
              <div id="lien-he" className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Liên Hệ Đặt Tour</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <a href="tel:1900123456" className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition">
                    <IconPhone />
                    <div>
                      <div className="text-sm text-blue-100">Hotline</div>
                      <div className="font-semibold">1900 123 456</div>
                    </div>
                  </a>
                  <a href="mailto:activities@jurni.com" className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition">
                    <IconMail />
                    <div>
                      <div className="text-sm text-blue-100">Email</div>
                      <div className="font-semibold">activities@jurni.com</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <IconLocation />
                    <div>
                      <div className="text-sm text-blue-100">Địa chỉ</div>
                      <div className="font-semibold">123 Đường ABC, Quận XYZ, TP.HCM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <IconShield />
                    <div>
                      <div className="text-sm text-blue-100">Hỗ trợ</div>
                      <div className="font-semibold">24/7 - Tất cả các ngày</div>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
                  Đặt tour ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
