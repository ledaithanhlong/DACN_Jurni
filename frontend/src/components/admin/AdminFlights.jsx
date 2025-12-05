import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;

export default function AdminFlights() {
  const { getToken } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [customServices, setCustomServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [flightClasses, setFlightClasses] = useState([
    { 
      class: 'ECONOMY', 
      price: '', 
      total_seats: '', 
      available_seats: '',
      meal_included: false,
      wifi_available: false,
      entertainment: false,
      seat_selection: false,
      custom_services: []
    }
  ]);
  const [form, setForm] = useState({
    // Thông tin cơ bản
    airline: '',
    departure_city: '',
    departure_airport: '',
    departure_airport_code: '',
    arrival_city: '',
    arrival_airport: '',
    arrival_airport_code: '',
    departure_date: '', // Chỉ chọn ngày
    // Cấu hình tự động
    first_flight_time: '06:00', // Giờ chuyến bay đầu tiên
    flight_interval: 130, // Khoảng cách giữa các chuyến (phút) - 2h10p = 130 phút
    duration: 120, // Thời gian bay mặc định (phút)
    // Thông tin chung
    aircraft_type: '',
    baggage_allowance: '',
    hand_luggage: '',
    refundable: false,
    changeable: false,
    image_url: '',
    description: '',
    amenities: '',
    policies: {
      refund: '',
      change: '',
      cancel: ''
    }
  });

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const res = await axios.get(`${API}/flights`);
      setFlights(res.data);
    } catch (error) {
      console.error('Error loading flights:', error);
      alert('Lỗi khi tải danh sách chuyến bay');
    } finally {
      setLoading(false);
    }
  };

  const generateFlights = () => {
    if (!form.departure_date || !form.first_flight_time) return [];

    const flights = [];
    const baseDate = new Date(form.departure_date);
    const [hours, minutes] = form.first_flight_time.split(':').map(Number);
    baseDate.setHours(hours, minutes, 0, 0);

    const intervalMinutes = Number(form.flight_interval) || 130; // 2h10p = 130 phút
    const durationMinutes = Number(form.duration) || 120; // Thời gian bay
    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 0, 0);

    let currentTime = new Date(baseDate);
    let flightNumber = 1;

    while (currentTime <= endOfDay) {
      const departureTime = new Date(currentTime);
      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);

      // Chỉ tạo chuyến bay nếu thời gian đến không vượt quá 23:59
      if (arrivalTime <= endOfDay) {
        // Tạo một chuyến bay cho mỗi hạng vé
        flightClasses.forEach((flightClass) => {
          if (flightClass.class && flightClass.price) {
            // Tạo amenities từ dịch vụ của hạng vé
            const amenities = [];
            if (flightClass.meal_included) amenities.push('Bữa ăn');
            if (flightClass.wifi_available) amenities.push('WiFi');
            if (flightClass.entertainment) amenities.push('Giải trí');
            if (flightClass.seat_selection) amenities.push('Chọn ghế');
            if (Array.isArray(flightClass.custom_services)) {
              amenities.push(...flightClass.custom_services);
            }
            
            flights.push({
              departure_time: departureTime.toISOString(),
              arrival_time: arrivalTime.toISOString(),
              flight_number: `${form.airline.substring(0, 2).toUpperCase()}${String(flightNumber).padStart(3, '0')}`,
              class: flightClass.class,
              price: Number(flightClass.price),
              total_seats: flightClass.total_seats ? Number(flightClass.total_seats) : null,
              available_seats: flightClass.available_seats ? Number(flightClass.available_seats) : (flightClass.total_seats ? Number(flightClass.total_seats) : null),
              meal_included: flightClass.meal_included || false,
              wifi_available: flightClass.wifi_available || false,
              entertainment: flightClass.entertainment || false,
              seat_selection: flightClass.seat_selection || false,
              amenities: amenities.length > 0 ? amenities : null
            });
          }
        });
        flightNumber++;
      }

      // Chuyển sang chuyến bay tiếp theo
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }

    return flights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      
      // Tạo dữ liệu chung cho tất cả chuyến bay
      const baseData = {
        airline: form.airline,
        departure_city: form.departure_city,
        departure_airport: form.departure_airport,
        departure_airport_code: form.departure_airport_code,
        arrival_city: form.arrival_city,
        arrival_airport: form.arrival_airport,
        arrival_airport_code: form.arrival_airport_code,
        duration: Number(form.duration) || 120,
        aircraft_type: form.aircraft_type || null,
        baggage_allowance: form.baggage_allowance || null,
        hand_luggage: form.hand_luggage || null,
        refundable: form.refundable,
        changeable: form.changeable,
        image_url: form.image_url || null,
        description: form.description || null,
        policies: (() => {
          const policies = {};
          if (form.policies.refund) policies.refund = form.policies.refund;
          if (form.policies.change) policies.change = form.policies.change;
          if (form.policies.cancel) policies.cancel = form.policies.cancel;
          return Object.keys(policies).length > 0 ? policies : null;
        })()
      };
      
      if (editing) {
        // Sửa chuyến bay đơn lẻ (giữ nguyên logic cũ)
        const data = {
          ...baseData,
          flight_number: form.flight_number,
          departure_time: new Date(form.departure_time).toISOString(),
          arrival_time: new Date(form.arrival_time).toISOString(),
          class: form.class,
          price: Number(form.price),
          available_seats: form.available_seats ? Number(form.available_seats) : null,
          total_seats: form.total_seats ? Number(form.total_seats) : null
        };
        await axios.put(`${API}/flights/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        // Kiểm tra có ít nhất 1 hạng vé được cấu hình
        const validClasses = flightClasses.filter(fc => fc.class && fc.price);
        if (validClasses.length === 0) {
          alert('Vui lòng thêm ít nhất một hạng vé với giá.');
          return;
        }

        // Tạo nhiều chuyến bay tự động
        const flights = generateFlights();
        if (flights.length === 0) {
          alert('Không thể tạo chuyến bay. Vui lòng kiểm tra lại ngày và giờ khởi hành.');
          return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const flight of flights) {
          try {
            await axios.post(`${API}/flights`, {
              ...baseData,
              ...flight
            }, {
          headers: { Authorization: `Bearer ${token}` }
        });
            successCount++;
          } catch (error) {
            console.error('Error creating flight:', error);
            failCount++;
          }
        }

        if (successCount > 0) {
          alert(`Tạo thành công ${successCount} chuyến bay${failCount > 0 ? ` (${failCount} chuyến lỗi)` : ''}!`);
        } else {
          alert('Không thể tạo chuyến bay. Vui lòng thử lại.');
        }
      }
      
      setShowForm(false);
      setEditing(null);
      resetForm();
      loadFlights();
    } catch (error) {
      console.error('Error saving flight:', error);
      alert('Lỗi khi lưu chuyến bay: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setForm({
      airline: '',
      departure_city: '',
      departure_airport: '',
      departure_airport_code: '',
      arrival_city: '',
      arrival_airport: '',
      arrival_airport_code: '',
      departure_date: '',
      first_flight_time: '06:00',
      flight_interval: 130,
      duration: 120,
      aircraft_type: '',
      baggage_allowance: '',
      hand_luggage: '',
      meal_included: false,
      wifi_available: false,
      entertainment: false,
      seat_selection: false,
      refundable: false,
      changeable: false,
      image_url: '',
      description: '',
      amenities: '',
      policies: {
        refund: '',
        change: '',
        cancel: ''
      }
    });
    setCustomServices([]);
    setNewService('');
    setFlightClasses([{ 
      class: 'ECONOMY', 
      price: '', 
      total_seats: '', 
      available_seats: '',
      meal_included: false,
      wifi_available: false,
      entertainment: false,
      seat_selection: false,
      custom_services: []
    }]);
  };

  const handleEdit = (flight) => {
    setEditing(flight.id);
    const departureDate = flight.departure_time ? new Date(flight.departure_time) : new Date();
    const departureTime = flight.departure_time ? new Date(flight.departure_time) : new Date();
    
    setForm({
      airline: flight.airline || '',
      flight_number: flight.flight_number || '',
      departure_city: flight.departure_city || '',
      departure_airport: flight.departure_airport || '',
      departure_airport_code: flight.departure_airport_code || '',
      arrival_city: flight.arrival_city || '',
      arrival_airport: flight.arrival_airport || '',
      arrival_airport_code: flight.arrival_airport_code || '',
      departure_date: departureDate.toISOString().split('T')[0],
      departure_time: departureTime.toISOString().slice(0, 16),
      arrival_time: flight.arrival_time ? new Date(flight.arrival_time).toISOString().slice(0, 16) : '',
      first_flight_time: departureTime.toTimeString().slice(0, 5),
      flight_interval: 130,
      duration: flight.duration || 120,
      class: flight.class || 'ECONOMY',
      price: flight.price || '',
      aircraft_type: flight.aircraft_type || '',
      baggage_allowance: flight.baggage_allowance || '',
      hand_luggage: flight.hand_luggage || '',
      refundable: flight.refundable || false,
      changeable: flight.changeable || false,
      image_url: flight.image_url || '',
      description: flight.description || '',
      amenities: Array.isArray(flight.amenities) ? flight.amenities.join(', ') : '',
      policies: flight.policies && typeof flight.policies === 'object' ? {
        refund: flight.policies.refund || '',
        change: flight.policies.change || '',
        cancel: flight.policies.cancel || ''
      } : {
        refund: '',
        change: '',
        cancel: ''
      }
    });
    
    // Khi edit, chỉ hiển thị 1 hạng vé (hạng vé của chuyến bay đang edit)
    const editCustomServices = [];
    if (Array.isArray(flight.amenities)) {
      const standardServices = ['Bữa ăn', 'WiFi', 'Giải trí', 'Chọn ghế'];
      editCustomServices.push(...flight.amenities.filter(a => !standardServices.some(s => a.toLowerCase().includes(s.toLowerCase()))));
    }
    
    setFlightClasses([{
      class: flight.class || 'ECONOMY',
      price: flight.price || '',
      total_seats: flight.total_seats || '',
      available_seats: flight.available_seats || '',
      meal_included: flight.meal_included || false,
      wifi_available: flight.wifi_available || false,
      entertainment: flight.entertainment || false,
      seat_selection: flight.seat_selection || false,
      custom_services: editCustomServices
    }]);
    
    // Tách amenities thành base và custom services
    if (Array.isArray(flight.amenities)) {
      const standardServices = ['Bữa ăn', 'WiFi', 'Giải trí', 'Chọn ghế'];
      const allAmenities = flight.amenities;
      const custom = allAmenities.filter(a => !standardServices.some(s => a.toLowerCase().includes(s.toLowerCase())));
      setCustomServices(custom);
    } else {
      setCustomServices([]);
    }
    setNewService('');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/flights/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa thành công!');
      loadFlights();
    } catch (error) {
      console.error('Error deleting flight:', error);
      alert('Lỗi khi xóa chuyến bay');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(UPLOAD_API, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.url) {
        setForm((prev) => ({
          ...prev,
          image_url: res.data.url
        }));
        alert('Upload hình ảnh thành công!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Lỗi khi upload hình ảnh: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quản lý Chuyến bay</h2>
            <p className="text-sm text-gray-600 mt-1">Tổng số: {flights.length} chuyến bay</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              resetForm();
            }}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            + Thêm chuyến bay
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">{editing ? 'Sửa chuyến bay' : 'Thêm chuyến bay mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Thông tin cơ bản */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Thông tin cơ bản *</h4>
                <div className="grid grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hãng hàng không *</label>
                <input
                  type="text"
                  value={form.airline}
                  onChange={(e) => setForm({ ...form, airline: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                      placeholder="VD: Vietnam Airlines"
                />
                  </div>
                </div>
              </div>

              {/* Điểm đi và điểm đến */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Điểm đi và điểm đến *</h4>
                <div className="grid grid-cols-2 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố đi *</label>
                <input
                  type="text"
                  value={form.departure_city}
                  onChange={(e) => setForm({ ...form, departure_city: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                      placeholder="VD: Hồ Chí Minh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sân bay đi</label>
                    <input
                      type="text"
                      value={form.departure_airport}
                      onChange={(e) => setForm({ ...form, departure_airport: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: Sân bay Tân Sơn Nhất"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sân bay đi</label>
                    <input
                      type="text"
                      value={form.departure_airport_code}
                      onChange={(e) => setForm({ ...form, departure_airport_code: e.target.value.toUpperCase() })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: SGN"
                      maxLength="3"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố đến *</label>
                <input
                  type="text"
                  value={form.arrival_city}
                  onChange={(e) => setForm({ ...form, arrival_city: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                      placeholder="VD: Hà Nội"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sân bay đến</label>
                    <input
                      type="text"
                      value={form.arrival_airport}
                      onChange={(e) => setForm({ ...form, arrival_airport: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: Sân bay Nội Bài"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sân bay đến</label>
                <input
                      type="text"
                      value={form.arrival_airport_code}
                      onChange={(e) => setForm({ ...form, arrival_airport_code: e.target.value.toUpperCase() })}
                  className="w-full border rounded px-3 py-2"
                      placeholder="VD: HAN"
                      maxLength="3"
                />
                  </div>
                </div>
              </div>

              {/* Ngày và thời gian */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Ngày và thời gian *</h4>
                <div className="grid grid-cols-3 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khởi hành *</label>
                <input
                      type="date"
                      value={form.departure_date}
                      onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ chuyến bay đầu tiên</label>
                    <input
                      type="time"
                      value={form.first_flight_time}
                      onChange={(e) => setForm({ ...form, first_flight_time: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mặc định: 06:00</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách giữa các chuyến (phút)</label>
                    <input
                      type="number"
                      value={form.flight_interval}
                      onChange={(e) => setForm({ ...form, flight_interval: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      min="60"
                      step="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mặc định: 130 phút (2h10p)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bay (phút)</label>
                    <input
                      type="number"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      min="30"
                      step="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mặc định: 120 phút (2h)</p>
                  </div>
                </div>
                {!editing && form.departure_date && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Hệ thống sẽ tự động tạo nhiều chuyến bay trong ngày {form.departure_date} 
                      với khoảng cách {form.flight_interval || 130} phút giữa các chuyến, bắt đầu từ {form.first_flight_time || '06:00'}.
                    </p>
                  </div>
                )}
              </div>

              {/* Hạng vé và máy bay */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Hạng vé và máy bay</h4>
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setFlightClasses([...flightClasses, { 
                          class: 'ECONOMY', 
                          price: '', 
                          total_seats: '', 
                          available_seats: '',
                          meal_included: false,
                          wifi_available: false,
                          entertainment: false,
                          seat_selection: false,
                          custom_services: []
                        }]);
                      }}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      + Thêm hạng vé
                    </button>
                  )}
                </div>
                
                {/* Danh sách hạng vé */}
                <div className="space-y-4 mb-4">
                  {flightClasses.map((flightClass, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-700">Hạng vé {index + 1}</h5>
                        {!editing && flightClasses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFlightClasses(flightClasses.filter((_, i) => i !== index));
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hạng vé *</label>
                          <select
                            value={flightClass.class}
                            onChange={(e) => {
                              const newClasses = [...flightClasses];
                              newClasses[index].class = e.target.value;
                              setFlightClasses(newClasses);
                            }}
                            className="w-full border rounded px-3 py-2"
                            required
                          >
                            <option value="ECONOMY">Phổ thông</option>
                            <option value="PREMIUM_ECONOMY">Phổ thông đặc biệt</option>
                            <option value="BUSINESS">Thương gia</option>
                            <option value="FIRST">Hạng nhất</option>
                          </select>
              </div>
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Giá vé (VNĐ) *</label>
                <input
                  type="number"
                            value={flightClass.price}
                            onChange={(e) => {
                              const newClasses = [...flightClasses];
                              newClasses[index].price = e.target.value;
                              setFlightClasses(newClasses);
                            }}
                  className="w-full border rounded px-3 py-2"
                  required
                            min="0"
                            placeholder="VD: 2000000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số ghế</label>
                          <input
                            type="number"
                            value={flightClass.total_seats}
                            onChange={(e) => {
                              const newClasses = [...flightClasses];
                              newClasses[index].total_seats = e.target.value;
                              setFlightClasses(newClasses);
                            }}
                            className="w-full border rounded px-3 py-2"
                            min="0"
                            placeholder="Tùy chọn"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ghế còn trống</label>
                          <input
                            type="number"
                            value={flightClass.available_seats}
                            onChange={(e) => {
                              const newClasses = [...flightClasses];
                              newClasses[index].available_seats = e.target.value;
                              setFlightClasses(newClasses);
                            }}
                            className="w-full border rounded px-3 py-2"
                            min="0"
                            placeholder="Tự động = tổng ghế nếu để trống"
                          />
                        </div>
                      </div>

                      {/* Dịch vụ cho hạng vé này */}
                      <div className="mt-4 pt-4 border-t">
                        <h6 className="text-sm font-semibold text-gray-700 mb-3">Dịch vụ cho hạng vé này</h6>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={flightClass.meal_included || false}
                              onChange={(e) => {
                                const newClasses = [...flightClasses];
                                newClasses[index].meal_included = e.target.checked;
                                setFlightClasses(newClasses);
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">Bao gồm bữa ăn</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={flightClass.wifi_available || false}
                              onChange={(e) => {
                                const newClasses = [...flightClasses];
                                newClasses[index].wifi_available = e.target.checked;
                                setFlightClasses(newClasses);
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">WiFi miễn phí</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={flightClass.entertainment || false}
                              onChange={(e) => {
                                const newClasses = [...flightClasses];
                                newClasses[index].entertainment = e.target.checked;
                                setFlightClasses(newClasses);
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">Giải trí trên máy bay</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={flightClass.seat_selection || false}
                              onChange={(e) => {
                                const newClasses = [...flightClasses];
                                newClasses[index].seat_selection = e.target.checked;
                                setFlightClasses(newClasses);
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-700">Chọn ghế trước</span>
                          </label>
                        </div>

                        {/* Dịch vụ tùy chỉnh cho hạng vé này */}
                        <div className="border-t pt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dịch vụ tùy chỉnh</label>
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={flightClass.newService || ''}
                              onChange={(e) => {
                                const newClasses = [...flightClasses];
                                newClasses[index].newService = e.target.value;
                                setFlightClasses(newClasses);
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const service = flightClass.newService?.trim();
                                  if (service && !(flightClass.custom_services || []).includes(service)) {
                                    const newClasses = [...flightClasses];
                                    newClasses[index].custom_services = [...(newClasses[index].custom_services || []), service];
                                    newClasses[index].newService = '';
                                    setFlightClasses(newClasses);
                                  }
                                }
                              }}
                              className="flex-1 border rounded px-3 py-2 text-sm"
                              placeholder="Nhập dịch vụ mới..."
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const service = flightClass.newService?.trim();
                                if (service && !(flightClass.custom_services || []).includes(service)) {
                                  const newClasses = [...flightClasses];
                                  newClasses[index].custom_services = [...(newClasses[index].custom_services || []), service];
                                  newClasses[index].newService = '';
                                  setFlightClasses(newClasses);
                                }
                              }}
                              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                            >
                              Thêm
                            </button>
                          </div>
                          {(flightClass.custom_services || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {(flightClass.custom_services || []).map((service, serviceIdx) => (
                                <span
                                  key={serviceIdx}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                  {service}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newClasses = [...flightClasses];
                                      newClasses[index].custom_services = newClasses[index].custom_services.filter((_, i) => i !== serviceIdx);
                                      setFlightClasses(newClasses);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Loại máy bay (chung cho tất cả hạng vé) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại máy bay</label>
                  <input
                    type="text"
                    value={form.aircraft_type}
                    onChange={(e) => setForm({ ...form, aircraft_type: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="VD: Airbus A321"
                  />
                </div>
              </div>

              {/* Hành lý */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Hành lý</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hành lý xách tay</label>
                    <input
                      type="text"
                      value={form.hand_luggage}
                      onChange={(e) => setForm({ ...form, hand_luggage: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: 7kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hành lý ký gửi</label>
                    <input
                      type="text"
                      value={form.baggage_allowance}
                      onChange={(e) => setForm({ ...form, baggage_allowance: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: 20kg"
                    />
                  </div>
                </div>
              </div>


              {/* Chính sách */}
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Chính sách vé</h4>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.refundable}
                        onChange={(e) => setForm({ ...form, refundable: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Có thể hoàn tiền</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.changeable}
                        onChange={(e) => setForm({ ...form, changeable: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Có thể đổi vé</span>
                    </label>
                  </div>
                  
                  {/* Chi tiết chính sách */}
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chi tiết chính sách hoàn tiền
                      </label>
                      <input
                        type="text"
                        value={form.policies.refund}
                        onChange={(e) => setForm({
                          ...form,
                          policies: { ...form.policies, refund: e.target.value }
                        })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="VD: Có thể hoàn tiền trong 24h với phí 10%"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chi tiết chính sách đổi vé
                      </label>
                      <input
                        type="text"
                        value={form.policies.change}
                        onChange={(e) => setForm({
                          ...form,
                          policies: { ...form.policies, change: e.target.value }
                        })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="VD: Có thể đổi vé với phí 10%"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chi tiết chính sách hủy vé
                      </label>
                      <input
                        type="text"
                        value={form.policies.cancel}
                        onChange={(e) => setForm({
                          ...form,
                          policies: { ...form.policies, cancel: e.target.value }
                        })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="VD: Hủy vé trước 24h được hoàn 80%"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô tả và tiện ích */}
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Mô tả và tiện ích</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                      placeholder="Mô tả về chuyến bay..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiện ích khác (phân cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={form.amenities}
                      onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: Điều hòa, TV, Ổ cắm điện"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lưu ý: Dịch vụ tùy chỉnh ở trên sẽ được tự động thêm vào danh sách tiện ích</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh hãng hàng không</label>
                    <div className="space-y-2">
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                        placeholder="Hoặc nhập URL hình ảnh..."
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full border rounded px-3 py-2"
                          disabled={uploading}
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <div className="text-center">
                              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                              <p className="text-sm text-gray-600">Đang upload...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {form.image_url && (
                        <div className="mt-2">
                          <img
                            src={form.image_url}
                            alt="Preview"
                            className="max-w-full h-32 object-contain border rounded p-2 bg-gray-50"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, image_url: '' })}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hãng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số hiệu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuyến</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ đi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ đến</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ghế</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {flights.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.airline}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {flight.flight_number || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flight.departure_airport_code || flight.departure_city} → {flight.arrival_airport_code || flight.arrival_city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {flight.class === 'ECONOMY' ? 'Phổ thông' : 
                       flight.class === 'PREMIUM_ECONOMY' ? 'PT ĐB' :
                       flight.class === 'BUSINESS' ? 'Thương gia' :
                       flight.class === 'FIRST' ? 'Hạng nhất' : flight.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(flight.departure_time).toLocaleString('vi-VN', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(flight.arrival_time).toLocaleString('vi-VN', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Number(flight.price).toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {flight.available_seats !== null ? (
                      <span className={flight.available_seats < 5 ? 'text-red-600 font-semibold' : ''}>
                        {flight.available_seats}/{flight.total_seats || '-'}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(flight)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(flight.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

