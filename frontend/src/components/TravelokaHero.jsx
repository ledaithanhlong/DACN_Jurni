import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TravelokaHero() {
  const navigate = useNavigate();
  const [service, setService] = useState('hotels');
  const [search, setSearch] = useState({ from: '', to: '', date: '', time: '' });

  const handleSearch = () => {
    if (service === 'hotels') navigate('/hotels');
    else if (service === 'flights') navigate('/flights');
    else if (service === 'cars') navigate('/cars');
    else if (service === 'activities') navigate('/activities');
  };

  return (
    <div className="relative -mx-4 md:-mx-8 lg:-mx-12">
      <div className="relative h-[500px] bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920')] bg-cover bg-center opacity-30" />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center text-white mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                App du lịch hàng đầu, một chạm đi bất cứ đâu
              </h1>
            </div>
          </div>

          <div className="pb-8 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl p-4">
                <div className="flex flex-wrap gap-2 mb-4 border-b pb-3">
                  {[
                    { id: 'hotels', label: 'Khách sạn', icon: '🏨' },
                    { id: 'flights', label: 'Vé máy bay', icon: '✈️' },
                    { id: 'cars', label: 'Cho thuê xe', icon: '🚗' },
                    { id: 'activities', label: 'Hoạt động', icon: '🎟️' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setService(s.id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                        service === s.id
                          ? 'bg-sky-100 text-sky-700 font-semibold border border-sky-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-5 gap-3">
                  {service === 'flights' ? (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Từ</label>
                        <input
                          type="text"
                          placeholder="Thành phố hoặc sân bay"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.from}
                          onChange={e => setSearch({ ...search, from: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Đến</label>
                        <input
                          type="text"
                          placeholder="Thành phố hoặc sân bay"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.to}
                          onChange={e => setSearch({ ...search, to: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">Ngày</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.date}
                          onChange={e => setSearch({ ...search, date: e.target.value })}
                        />
                      </div>
                    </>
                  ) : service === 'hotels' ? (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Địa điểm</label>
                        <input
                          type="text"
                          placeholder="Thành phố, địa điểm"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.from}
                          onChange={e => setSearch({ ...search, from: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">Nhận phòng</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.date}
                          onChange={e => setSearch({ ...search, date: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">Trả phòng</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.time}
                          onChange={e => setSearch({ ...search, time: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">&nbsp;</label>
                        <button
                          onClick={handleSearch}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Địa điểm</label>
                        <input
                          type="text"
                          placeholder="Tìm kiếm..."
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.from}
                          onChange={e => setSearch({ ...search, from: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">Ngày</label>
                        <input
                          type="date"
                          className="w-full border rounded-lg px-4 py-2"
                          value={search.date}
                          onChange={e => setSearch({ ...search, date: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">&nbsp;</label>
                        <button
                          onClick={handleSearch}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Tìm kiếm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

