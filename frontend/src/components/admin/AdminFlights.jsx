import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_API = `${API}/upload`;

// Định nghĩa các loại vé và tiện ích/chính sách mặc định
const FLIGHT_TYPES = {
  economy: {
    label: 'Hạng Phổ thông',
    icon: '✈️',
    defaultAmenities: ['Hành lý xách tay 7kg', 'Chỗ ngồi tiêu chuẩn', 'Đồ uống miễn phí'],
    defaultPolicies: {
      baggage: 'Hành lý xách tay: 7kg, Hành lý ký gửi: 20kg (phụ phí)',
      cancellation: 'Hủy vé: Phí 30% giá vé',
      refund: 'Hoàn tiền: 70% giá vé',
      meal: 'Bữa ăn: Có (phụ phí)',
      priority_boarding: 'Ưu tiên lên máy bay: Không',
      seat_selection: 'Chọn chỗ ngồi: Có (phụ phí)'
    }
  },
  premium_economy: {
    label: 'Hạng Phổ thông Đặc biệt',
    icon: '🛫',
    defaultAmenities: ['Hành lý xách tay 10kg', 'Chỗ ngồi rộng rãi hơn', 'Ưu tiên lên máy bay', 'Đồ uống miễn phí'],
    defaultPolicies: {
      baggage: 'Hành lý xách tay: 10kg, Hành lý ký gửi: 25kg',
      cancellation: 'Hủy vé: Phí 20% giá vé',
      refund: 'Hoàn tiền: 80% giá vé',
      meal: 'Bữa ăn: Có (miễn phí)',
      priority_boarding: 'Ưu tiên lên máy bay: Có',
      seat_selection: 'Chọn chỗ ngồi: Có (miễn phí)'
    }
  },
  business: {
    label: 'Hạng Thương gia',
    icon: '🛩️',
    defaultAmenities: ['Hành lý xách tay 12kg', 'Ghế ngả phẳng', 'Ưu tiên lên máy bay', 'Phòng chờ VIP', 'Bữa ăn cao cấp', 'Đồ uống đặc biệt'],
    defaultPolicies: {
      baggage: 'Hành lý xách tay: 12kg, Hành lý ký gửi: 30kg',
      cancellation: 'Hủy vé: Phí 10% giá vé',
      refund: 'Hoàn tiền: 90% giá vé',
      meal: 'Bữa ăn: Có (cao cấp, miễn phí)',
      priority_boarding: 'Ưu tiên lên máy bay: Có',
      seat_selection: 'Chọn chỗ ngồi: Có (miễn phí)'
    }
  },
  first_class: {
    label: 'Hạng Nhất',
    icon: '✈️✨',
    defaultAmenities: ['Hành lý xách tay 15kg', 'Khoang riêng tư', 'Ghế giường ngủ', 'Ưu tiên tối đa', 'Phòng chờ riêng', 'Bữa ăn đặc biệt', 'Dịch vụ cá nhân'],
    defaultPolicies: {
      baggage: 'Hành lý xách tay: 15kg, Hành lý ký gửi: 40kg',
      cancellation: 'Hủy vé: Miễn phí',
      refund: 'Hoàn tiền: 100% giá vé',
      meal: 'Bữa ăn: Có (đặc biệt, miễn phí)',
      priority_boarding: 'Ưu tiên lên máy bay: Có',
      seat_selection: 'Chọn chỗ ngồi: Có (miễn phí)'
    }
  }
};

const emptyForm = {
  airline: '',
  flight_number: '',
  departure_city: '',
  arrival_city: '',
  departure_time: '',
  arrival_time: '',
  price: '',
  image_url: '',
  flight_type: 'economy',
  amenities: [],
  policies: {},
  available_seats: 180
};

export default function AdminFlights() {
  const { getToken } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(5);
  const [flightNumberPrefix, setFlightNumberPrefix] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const res = await axios.get(`${API}/flights`);
      setFlights(res.data || []);
    } catch (error) {
      console.error('Error loading flights:', error);
      alert('Lỗi khi tải danh sách chuyến bay');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Lỗi khi upload hình ảnh');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setBulkMode(false);
    setBulkCount(5);
    setFlightNumberPrefix('');
  };

  // Cập nhật tiện ích và chính sách khi thay đổi loại vé
  const handleFlightTypeChange = (type) => {
    const typeConfig = FLIGHT_TYPES[type];
    setForm({
      ...form,
      flight_type: type,
      amenities: typeConfig.defaultAmenities,
      policies: typeConfig.defaultPolicies
    });
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const updatePolicy = (key, value) => {
    setForm((prev) => ({
      ...prev,
      policies: {
        ...prev.policies,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      
      // Validation trước khi submit
      if (!form.departure_time) {
        alert('Vui lòng chọn giờ khởi hành!');
        return;
      }

      if (form.departure_city === form.arrival_city) {
        alert('Thành phố đi và đến không được giống nhau!');
        return;
      }

      if (form.price <= 0) {
        alert('Giá vé phải lớn hơn 0!');
        return;
      }

      // Tính arrival_time
      let arrivalTime;
      if (bulkMode) {
        // Bulk mode: tự động tính = departure_time + 2h30p
        const depTime = new Date(form.departure_time);
        arrivalTime = new Date(depTime.getTime() + 2.5 * 60 * 60 * 1000).toISOString();
      } else {
        // Normal mode: dùng giá trị đã nhập
        if (!form.arrival_time) {
          alert('Vui lòng chọn giờ đến!');
          return;
        }
        arrivalTime = new Date(form.arrival_time).toISOString();
        
        // Kiểm tra giờ đến phải sau giờ khởi hành
        if (new Date(form.departure_time) >= new Date(form.arrival_time)) {
          alert('Giờ đến phải sau giờ khởi hành!');
          return;
        }
      }
      
      const data = {
        ...form,
        price: Number(form.price),
        departure_time: new Date(form.departure_time).toISOString(),
        arrival_time: arrivalTime,
        amenities: form.amenities.length > 0 ? form.amenities : null,
        policies: Object.keys(form.policies).length > 0 ? form.policies : null,
        available_seats: Number(form.available_seats) || 180
      };
      
      if (editing) {
        await axios.put(`${API}/flights/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else if (bulkMode) {
        // Tạo hàng loạt - chỉ cần departure_time, arrival_time sẽ tự động tính
        const bulkData = {
          airline: form.airline,
          flight_number_prefix: flightNumberPrefix || null,
          departure_city: form.departure_city,
          arrival_city: form.arrival_city,
          departure_time: data.departure_time,
          price: data.price,
          image_url: form.image_url || null,
          flight_type: form.flight_type || 'economy',
          amenities: form.amenities.length > 0 ? form.amenities : null,
          policies: Object.keys(form.policies).length > 0 ? form.policies : null,
          available_seats: Number(form.available_seats) || 180,
          count: bulkCount,
          interval_hours: 2,
          interval_minutes: 10,
          flight_duration_hours: 2,
          flight_duration_minutes: 30
        };
        const res = await axios.post(`${API}/flights/bulk`, bulkData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Tạo thành công ${res.data.flights.length} chuyến bay!`);
      } else {
        await axios.post(`${API}/flights`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công!');
      }
      setShowForm(false);
      resetForm();
      loadFlights();
    } catch (error) {
      console.error('Error saving flight:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi khi lưu chuyến bay';
      alert(errorMessage);
    }
  };

  const handleEdit = (flight) => {
    setEditing(flight.id);
    setForm({
      airline: flight.airline || '',
      flight_number: flight.flight_number || '',
      departure_city: flight.departure_city || '',
      arrival_city: flight.arrival_city || '',
      departure_time: flight.departure_time ? new Date(flight.departure_time).toISOString().slice(0, 16) : '',
      arrival_time: flight.arrival_time ? new Date(flight.arrival_time).toISOString().slice(0, 16) : '',
      price: flight.price || '',
      image_url: flight.image_url || '',
      flight_type: flight.flight_type || 'economy',
      amenities: Array.isArray(flight.amenities) ? flight.amenities : [],
      policies: flight.policies || {},
      available_seats: flight.available_seats || 180
    });
    setBulkMode(false);
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
      const errorMessage = error.response?.data?.error || error.message || 'Lỗi khi xóa chuyến bay';
      alert(errorMessage);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/80">Quản lý chuyến bay</p>
            <h2 className="text-2xl font-bold mt-1">Danh sách Chuyến bay</h2>
            <p className="text-white/80 mt-1 text-sm">Tổng số: {flights.length} chuyến bay</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              resetForm();
            }}
            className="bg-white text-sky-600 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            + Thêm chuyến bay
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100">

        {showForm && (
          <div className="p-6 bg-white rounded-2xl shadow border border-gray-100 mb-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-xl mb-6">
              {editing ? 'Cập nhật thông tin chuyến bay' : 'Thêm chuyến bay mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hãng hàng không *
                  </label>
                  <select
                    value={form.airline}
                    onChange={(e) => setForm({ ...form, airline: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  >
                    <option value="">Chọn hãng hàng không</option>
                    <option value="Vietnam Airlines">Vietnam Airlines</option>
                    <option value="VietJet Air">VietJet Air</option>
                    <option value="Bamboo Airways">Bamboo Airways</option>
                    <option value="Jetstar Pacific">Jetstar Pacific</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố đi *
                  </label>
                  <input
                    type="text"
                    value={form.departure_city}
                    onChange={(e) => setForm({ ...form, departure_city: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Ví dụ: Hà Nội"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thành phố đến *
                  </label>
                  <input
                    type="text"
                    value={form.arrival_city}
                    onChange={(e) => setForm({ ...form, arrival_city: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Ví dụ: Đà Nẵng"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ khởi hành *
                  </label>
                  <input
                    type="datetime-local"
                    value={form.departure_time}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => {
                      const newDepTime = e.target.value;
                      if (bulkMode && newDepTime) {
                        // Tính giờ đến = giờ đi + 2h30p
                        const depDate = new Date(newDepTime);
                        const arrDate = new Date(depDate.getTime() + 2.5 * 60 * 60 * 1000);
                        // Format về datetime-local (YYYY-MM-DDTHH:mm)
                        const arrTimeStr = arrDate.toISOString().slice(0, 16);
                        setForm({ 
                          ...form, 
                          departure_time: newDepTime,
                          arrival_time: arrTimeStr
                        });
                      } else {
                        setForm({ 
                          ...form, 
                          departure_time: newDepTime
                        });
                        // Nếu có arrival_time và arrival_time < departure_time, tự động cập nhật
                        if (form.arrival_time && new Date(newDepTime) >= new Date(form.arrival_time)) {
                          const depDate = new Date(newDepTime);
                          const arrDate = new Date(depDate.getTime() + 2.5 * 60 * 60 * 1000);
                          setForm(prev => ({
                            ...prev,
                            departure_time: newDepTime,
                            arrival_time: arrDate.toISOString().slice(0, 16)
                          }));
                        }
                      }
                    }}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
                {!bulkMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ đến *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.arrival_time}
                      min={form.departure_time || new Date().toISOString().slice(0, 16)}
                      onChange={(e) => {
                        const newArrTime = e.target.value;
                        // Đảm bảo giờ đến phải sau giờ khởi hành
                        if (form.departure_time && new Date(newArrTime) <= new Date(form.departure_time)) {
                          alert('Giờ đến phải sau giờ khởi hành!');
                          return;
                        }
                        setForm({ ...form, arrival_time: newArrTime });
                      }}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      required
                    />
                    {form.departure_time && form.arrival_time && new Date(form.arrival_time) <= new Date(form.departure_time) && (
                      <p className="text-xs text-red-500 mt-1">⚠️ Giờ đến phải sau giờ khởi hành!</p>
                    )}
                  </div>
                )}
                {bulkMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ đến (tự động)
                    </label>
                    <input
                      type="datetime-local"
                      value={form.arrival_time || (form.departure_time 
                        ? new Date(new Date(form.departure_time).getTime() + 2.5 * 60 * 60 * 1000).toISOString().slice(0, 16)
                        : '')}
                      className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      disabled
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ Tự động tính: Giờ khởi hành + 2 giờ 30 phút
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá vé (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Ví dụ: 1500000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã chuyến bay
                  </label>
                  <input
                    type="text"
                    value={form.flight_number}
                    onChange={(e) => setForm({ ...form, flight_number: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Ví dụ: VN123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số ghế còn lại
                  </label>
                  <input
                    type="number"
                    value={form.available_seats}
                    onChange={(e) => setForm({ ...form, available_seats: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    min="0"
                    defaultValue={180}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại vé *
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(FLIGHT_TYPES).map(([key, config]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleFlightTypeChange(key)}
                        className={`p-4 border-2 rounded-lg text-center transition ${
                          form.flight_type === key
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{config.icon}</div>
                        <div className="text-sm font-semibold">{config.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tạo hàng loạt - chỉ hiển thị khi không edit */}
              {!editing && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="bulkMode"
                      checked={bulkMode}
                      onChange={(e) => {
                        const isBulk = e.target.checked;
                        setBulkMode(isBulk);
                        // Khi bật bulk mode, tự động tính giờ đến
                        if (isBulk && form.departure_time) {
                          const depDate = new Date(form.departure_time);
                          const autoArrTime = new Date(depDate.getTime() + 2.5 * 60 * 60 * 1000);
                          setForm({ 
                            ...form, 
                            arrival_time: autoArrTime.toISOString().slice(0, 16) 
                          });
                        } else if (!isBulk && form.departure_time) {
                          // Khi tắt bulk mode, đảm bảo arrival_time hợp lệ
                          if (!form.arrival_time || new Date(form.arrival_time) <= new Date(form.departure_time)) {
                            const depDate = new Date(form.departure_time);
                            const defaultArrTime = new Date(depDate.getTime() + 2.5 * 60 * 60 * 1000);
                            setForm({ 
                              ...form, 
                              arrival_time: defaultArrTime.toISOString().slice(0, 16) 
                            });
                          }
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <label htmlFor="bulkMode" className="font-semibold text-gray-800">
                      Tạo hàng loạt (mỗi chuyến cách nhau 2 giờ 10 phút, thời gian bay 2 giờ 30 phút)
                    </label>
                  </div>
                  {bulkMode && (
                    <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số lượng chuyến bay (1-50)
                        </label>
                        <input
                          type="number"
                          value={bulkCount}
                          onChange={(e) => setBulkCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          min="1"
                          max="50"
                          required={bulkMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tiền tố mã chuyến bay (tùy chọn)
                        </label>
                        <input
                          type="text"
                          value={flightNumberPrefix}
                          onChange={(e) => setFlightNumberPrefix(e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          placeholder="Ví dụ: VN"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Mã sẽ tự động: {flightNumberPrefix || 'VN'}001, {flightNumberPrefix || 'VN'}002, ...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tiện ích */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-800">Tiện ích</h4>
                <div className="space-y-2 mb-3">
                  {form.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                      <span className="flex-1 text-sm">{amenity}</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(idx)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Thêm tiện ích..."
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Chính sách */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-800">Chính sách</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hành lý</label>
                    <input
                      type="text"
                      value={form.policies.baggage || ''}
                      onChange={(e) => updatePolicy('baggage', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Ví dụ: Hành lý xách tay: 7kg, Hành lý ký gửi: 20kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hủy vé</label>
                    <input
                      type="text"
                      value={form.policies.cancellation || ''}
                      onChange={(e) => updatePolicy('cancellation', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Ví dụ: Hủy vé: Phí 30% giá vé"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hoàn tiền</label>
                    <input
                      type="text"
                      value={form.policies.refund || ''}
                      onChange={(e) => updatePolicy('refund', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Ví dụ: Hoàn tiền: 70% giá vé"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bữa ăn</label>
                    <input
                      type="text"
                      value={form.policies.meal || ''}
                      onChange={(e) => updatePolicy('meal', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Ví dụ: Bữa ăn: Có (phụ phí)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ưu tiên lên máy bay</label>
                    <input
                      type="text"
                      value={form.policies.priority_boarding || ''}
                      onChange={(e) => updatePolicy('priority_boarding', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Ví dụ: Ưu tiên lên máy bay: Không"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn chỗ ngồi</label>
                    <input
                      type="text"
                      value={form.policies.seat_selection || ''}
                      onChange={(e) => updatePolicy('seat_selection', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="Ví dụ: Chọn chỗ ngồi: Có (phụ phí)"
                    />
                  </div>
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-800">Hình ảnh chuyến bay</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL hình ảnh hoặc upload file
                    </label>
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      placeholder="https://..."
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        disabled={uploading}
                      />
                      {uploading && (
                        <p className="text-sm text-sky-600 mt-1 flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          Đang upload hình ảnh...
                        </p>
                      )}
                    </div>
                  </div>
                  {form.image_url && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Xem trước:</p>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x300?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
                >
                  {editing ? 'Cập nhật' : bulkMode ? `Tạo ${bulkCount} chuyến bay` : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 font-semibold transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden border border-gray-100 rounded-2xl">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hãng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tuyến</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Loại vé</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giờ đi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giờ đến</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ghế</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flights.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Chưa có chuyến bay nào. Hãy thêm chuyến bay mới!
                  </td>
                </tr>
              ) : (
                flights.map((flight) => {
                  const flightType = flight.flight_type || 'economy';
                  const typeConfig = FLIGHT_TYPES[flightType] || FLIGHT_TYPES.economy;
                  return (
                    <tr key={flight.id} className="hover:bg-blue-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {flight.image_url && (
                            <img
                              src={flight.image_url}
                              alt={flight.airline}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{flight.airline}</p>
                            <p className="text-xs text-gray-500">
                              {flight.flight_number || `#${flight.id}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{flight.departure_city}</p>
                          <p className="text-xs text-gray-500">→ {flight.arrival_city}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          <span>{typeConfig.icon}</span>
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(flight.departure_time).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(flight.arrival_time).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {Number(flight.price).toLocaleString('vi-VN')} <span className="text-xs text-gray-500">VNĐ</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {flight.available_seats || 180} ghế
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(flight)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(flight.id)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

