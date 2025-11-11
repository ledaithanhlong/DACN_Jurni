import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TravelokaHero from '../components/TravelokaHero.jsx';
import ServiceLink from '../components/ServiceLink.jsx';
import { SectionHeader, Card } from '../components/Section.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [h, f, a] = await Promise.all([
          axios.get(`${API}/hotels`),
          axios.get(`${API}/flights`),
          axios.get(`${API}/activities`)
        ]);
        setHotels(h.data.slice(0, 6));
        setFlights(f.data.slice(0, 6));
        setActivities(a.data.slice(0, 6));
      } catch (e) {
        // ignore for homepage best-effort
      }
    })();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const popularRoutes = [
    { from: 'TP HCM', to: 'Hà Nội', price: 896600, type: 'MỘT CHIỀU' },
    { from: 'Hà Nội', to: 'TP HCM', price: 896600, type: 'MỘT CHIỀU' },
    { from: 'TP HCM', to: 'Đà Nẵng', price: 680600, type: 'MỘT CHIỀU' },
    { from: 'Hà Nội', to: 'Nha Trang', price: 896600, type: 'MỘT CHIỀU' },
    { from: 'TP HCM', to: 'Phú Quốc', price: 680600, type: 'MỘT CHIỀU' },
    { from: 'TP HCM', to: 'Đà Lạt', price: 692265, type: 'MỘT CHIỀU' },
  ];

  const promoCodes = [
    { title: 'Giảm đến 50,000 cho lần đặt vé máy bay đầu tiên', desc: 'Áp dụng cho lần đặt đầu tiên trên ứng dụng Traveloka', code: 'TVLKBANMOI', discount: '50,000' },
    { title: 'Giảm đến 8% cho lần đặt phòng khách sạn đầu tiên', desc: 'Áp dụng cho lần đặt đầu tiên trên ứng dụng Traveloka', code: 'TVLKBANMOI', discount: '8%' },
    { title: 'Giảm đến 8% cho lần đặt vé tham quan/hoạt động đầu tiên', desc: 'Áp dụng cho lần đặt đầu tiên trên ứng dụng Traveloka', code: 'TVLKBANMOI', discount: '8%' },
    { title: '12% giảm Đưa đón sân bay', desc: 'Áp dụng cho lần đặt đầu tiên trên ứng dụng Traveloka', code: 'TVLKBANMOI', discount: '12%' },
    { title: '10% giảm Thuê xe', desc: 'Áp dụng cho lần đặt đầu tiên trên ứng dụng Traveloka', code: 'TVLKBANMOI', discount: '10%' },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép mã: ${text}`);
  };

  return (
    <div>
      <TravelokaHero />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-8 pb-12">
          {/* Service Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ServiceLink href="/hotels" title="Khách sạn" subtitle="Great deals every day" iconType="hotels" />
            <ServiceLink href="/flights" title="Vé máy bay" subtitle="Fly to anywhere" iconType="flights" />
            <ServiceLink href="/cars" title="Cho thuê xe" subtitle="Daily rentals" iconType="cars" />
            <ServiceLink href="/activities" title="Hoạt động & Vui chơi" subtitle="Things to do" iconType="activities" />
          </div>

      {/* Promotional Codes Section */}
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Mã Ưu Đãi Tặng Bạn Mới</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promoCodes.map((promo, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="font-semibold text-sm mb-2">{promo.title}</div>
              <div className="text-xs text-gray-600 mb-3">{promo.desc}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded px-3 py-2 font-mono text-sm font-semibold">{promo.code}</div>
                <button
                  onClick={() => copyToClipboard(promo.code)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Flight Routes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Vé máy bay giá tốt nhất</h2>
            <p className="text-sm text-gray-600 mt-1">Vô vàn điểm đến hot</p>
          </div>
          <a href="/flights" className="text-orange-500 hover:text-orange-600 text-sm font-semibold">
            Xem tất cả ưu đãi bay →
          </a>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, idx) => (
              <a
                key={idx}
                href="/flights"
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-md transition group"
              >
                <div className="text-xs text-gray-500 mb-1">{route.type}</div>
                <div className="font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                  {route.from} - {route.to}
                </div>
                <div className="text-orange-500 font-bold text-lg">
                  Giá tốt nhất từ {formatPrice(route.price)} VND
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Hotels */}
      <section>
        <SectionHeader title="Nhiều lựa chọn khách sạn" href="/hotels" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {hotels.map(h => (
            <a key={h.id} href={`/hotels/${h.id}`} className="block">
              <Card 
                image={h.image_url} 
                title={h.name} 
                subtitle={h.location} 
                price={h.price} 
              />
            </a>
          ))}
        </div>
      </section>

      {/* Top Flights */}
      <section>
        <SectionHeader title="Vé máy bay phổ biến" href="/flights" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {flights.map(f => (
            <a key={f.id} href={`/flights/${f.id}`} className="block">
              <Card 
                image={f.image_url} 
                title={f.airline} 
                subtitle={`${f.departure_city} → ${f.arrival_city}`} 
                price={f.price} 
              />
            </a>
          ))}
        </div>
      </section>

      {/* Things to do */}
      <section>
        <SectionHeader title="Hoạt động & Vui chơi" href="/activities" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activities.map(a => (
            <a key={a.id} href={`/activities/${a.id}`} className="block">
              <Card 
                image={a.image_url} 
                title={a.name} 
                subtitle={a.city} 
                price={a.price} 
              />
            </a>
          ))}
        </div>
      </section>

      {/* Upgrade Your Trip Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Nâng tầm chuyến đi theo cách bạn muốn</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🎫</div>
            <div className="font-semibold mb-1">Chuyến đi và Danh thắng</div>
            <div className="text-sm text-gray-600">Khám phá thêm</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🎪</div>
            <div className="font-semibold mb-1">Fun Activities</div>
            <div className="text-sm text-gray-600">Khám phá thêm</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-semibold mb-1">Travel Insurance</div>
            <div className="text-sm text-gray-600">Khám phá thêm</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-semibold mb-1">Đặt trước, trả sau</div>
            <div className="text-sm text-gray-600">Khám phá thêm</div>
          </div>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}

