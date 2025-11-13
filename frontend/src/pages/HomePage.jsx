import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JurniHero from '../components/JurniHero.jsx';
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
    {
      title: 'Giảm đến 50.000đ cho lần đặt vé máy bay đầu tiên',
      desc: 'Ưu đãi chỉ dành riêng cho khách hàng mới của Jurni',
      code: 'JRNBANMOI',
      discount: '50.000đ'
    },
    {
      title: 'Giảm 8% cho lần đặt phòng khách sạn đầu tiên',
      desc: 'Khám phá hàng nghìn khách sạn được tuyển chọn kỹ lưỡng',
      code: 'JRNBANMOI',
      discount: '8%'
    },
    {
      title: 'Giảm 8% vé tham quan/hoạt động',
      desc: 'Book ngay những trải nghiệm đặc sắc ở điểm đến của bạn',
      code: 'JRNBANMOI',
      discount: '8%'
    },
    {
      title: 'Ưu đãi 12% cho dịch vụ đưa đón sân bay',
      desc: 'Đặt trước, đón tận nơi với đối tác uy tín của Jurni',
      code: 'JRNBANMOI',
      discount: '12%'
    },
    {
      title: 'Giảm 10% khi thuê xe tự lái',
      desc: 'Linh hoạt hành trình với nhiều dòng xe chất lượng',
      code: 'JRNBANMOI',
      discount: '10%'
    },
  ];

  const upgradeOptions = [
    {
      title: 'Tour & Danh thắng',
      description: 'Đặt trước những trải nghiệm nổi bật, không bỏ lỡ điểm đến hot.',
      icon: '🧭',
      href: '#',
      accent: 'from-blue-500 via-sky-500 to-cyan-400'
    },
    {
      title: 'Hoạt động giải trí',
      description: 'Chọn hoạt động phù hợp sở thích, từ thư giãn đến khám phá.',
      icon: '🎡',
      href: '#',
      accent: 'from-sky-500 via-blue-500 to-indigo-500'
    },
    {
      title: 'Bảo hiểm du lịch',
      description: 'An tâm trọn hành trình với gói bảo hiểm được thiết kế riêng.',
      icon: '🛡️',
      href: '#',
      accent: 'from-indigo-500 via-blue-500 to-sky-400'
    },
    {
      title: 'Đặt trước · Trả sau',
      description: 'Chủ động dòng tiền với phương thức thanh toán linh hoạt.',
      icon: '💳',
      href: '#',
      accent: 'from-blue-600 via-indigo-500 to-purple-500'
    },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép mã: ${text}`);
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-white">
      <JurniHero />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="space-y-10 pb-16">
          {/* Service Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ServiceLink href="/hotels" title="Khách sạn" subtitle="Ưu đãi mỗi ngày" iconType="hotels" />
            <ServiceLink href="/flights" title="Vé máy bay" subtitle="Bay mọi điểm đến" iconType="flights" />
            <ServiceLink href="/cars" title="Cho thuê xe" subtitle="Linh hoạt hành trình" iconType="cars" />
            <ServiceLink href="/activities" title="Hoạt động & Vui chơi" subtitle="Trải nghiệm đa dạng" iconType="activities" />
          </div>

      {/* Promotional Codes Section */}
      <section className="bg-gradient-to-br from-white to-blue-50/60 border border-blue-100 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Mã ưu đãi tặng bạn mới</h2>
            <p className="text-sm text-blue-700/80 mt-1">Đăng nhập và áp dụng tại bước thanh toán để kích hoạt ưu đãi.</p>
          </div>
          <a
            href="/promotions"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
          >
            Khám phá thêm ưu đãi
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promoCodes.map((promo, idx) => (
            <div
              key={idx}
              className="border border-blue-100 rounded-xl bg-white/80 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm text-blue-900 mb-1">{promo.title}</div>
                  <div className="text-xs text-blue-800/70 mb-3">{promo.desc}</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {promo.discount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-50 rounded-lg px-3 py-2 font-mono text-sm font-semibold text-blue-800">
                  {promo.code}
                </div>
                <button
                  onClick={() => copyToClipboard(promo.code)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
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
            <p className="text-sm text-blue-700/80 mt-1">Vô vàn điểm đến hot</p>
          </div>
          <a href="/flights" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
            Xem tất cả ưu đãi bay →
          </a>
        </div>
        <div className="bg-white/90 backdrop-blur rounded-2xl border border-blue-100 shadow-sm p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, idx) => (
              <a
                key={idx}
                href="/flights"
                className="border border-blue-100 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition group bg-white"
              >
                <div className="text-xs text-blue-700/70 mb-1 tracking-wide">{route.type}</div>
                <div className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {route.from} - {route.to}
                </div>
                <div className="text-blue-600 font-bold text-lg">
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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_45%)]" />
        <div className="relative z-10 grid gap-10 p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:p-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold leading-tight">
              Nâng tầm chuyến đi theo cách bạn muốn
            </h2>
            <p className="mt-4 text-sm text-blue-100">
              Lên kế hoạch thông minh với các dịch vụ bổ sung được Jurni tuyển chọn riêng cho từng hành trình. Linh hoạt hơn, an tâm hơn và tối ưu ngân sách.
            </p>
            <a
              href="/upgrade-your-trip"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
            >
              Khám phá các gói nâng hạng
              <span aria-hidden>→</span>
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {upgradeOptions.map((option, idx) => (
              <a
                key={idx}
                href={option.href}
                className="group relative flex h-full flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20"
              >
                <span className="relative inline-flex h-12 w-12 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${option.accent} opacity-90 blur-[2px]`}
                    aria-hidden
                  />
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-lg ring-1 ring-white/50">
                    {option.icon}
                  </span>
                </span>
                <div>
                  <div className="text-base font-semibold">{option.title}</div>
                  <p className="mt-2 text-sm text-blue-100/90">
                    {option.description}
                  </p>
                </div>
                <span className="mt-auto inline-flex items-center text-sm font-semibold text-blue-100/90 transition group-hover:text-white">
                  Tìm hiểu thêm
                  <span className="ml-2 transition group-hover:translate-x-1">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}

