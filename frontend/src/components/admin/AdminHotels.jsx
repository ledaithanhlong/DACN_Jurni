import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AMENITIES = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'pool', label: 'Hồ bơi' },
  { id: 'restaurant', label: 'Nhà hàng' },
  { id: 'parking', label: 'Bãi đậu xe' },
  { id: 'gym', label: 'Gym' },
  { id: 'spa', label: 'Spa' },
  { id: 'bar', label: 'Bar' },
  { id: 'meeting', label: 'Phòng họp' }
];

const HOTEL_TYPES = ['Resort', 'Hotel', 'Homestay', 'Villa', 'Boutique'];

export default function AdminHotels() {
  const { getToken } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    stars: '',
    type: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website: '',
    amenities: [],
    checkIn: '',
    checkOut: '',
    policyCancel: '',
    policyChildren: '',
    policyPet: '',
    thumbnail: null,
    thumbnailUrl: '',
    gallery: [],
    galleryUrls: [],
    status: 'pending',
    price: '',
    rating: ''
  });

  useEffect(() => {
    loadHotels();
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API}/auth/sync-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(res.data.user?.role || 'user');
    } catch (error) {
      console.error('Error loading user role:', error);
    }
  };

  const loadHotels = async () => {
    try {
      const res = await axios.get(`${API}/hotels`);
      setHotels(res.data);
    } catch (error) {
      console.error('Error loading hotels:', error);
      alert('Lỗi khi tải danh sách khách sạn');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return res.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    try {
      const url = await handleImageUpload(file);
      setForm({ ...form, thumbnailUrl: url, thumbnail: file });
    } catch (error) {
      alert('Lỗi khi upload ảnh đại diện');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert('Một số file vượt quá 5MB đã bị bỏ qua');
    }

    setUploading(true);
    try {
      const uploadPromises = validFiles.map(file => handleImageUpload(file));
      const urls = await Promise.all(uploadPromises);
      setForm({ ...form, galleryUrls: [...form.galleryUrls, ...urls], gallery: [...form.gallery, ...validFiles] });
    } catch (error) {
      alert('Lỗi khi upload ảnh gallery');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newUrls = form.galleryUrls.filter((_, i) => i !== index);
    const newFiles = form.gallery.filter((_, i) => i !== index);
    setForm({ ...form, galleryUrls: newUrls, gallery: newFiles });
  };

  const handleAmenityChange = (amenityId) => {
    const newAmenities = form.amenities.includes(amenityId)
      ? form.amenities.filter(id => id !== amenityId)
      : [...form.amenities, amenityId];
    setForm({ ...form, amenities: newAmenities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.description || !form.address || !form.city || !form.phone || !form.email) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert('Email không hợp lệ');
      return;
    }

    try {
      const token = await getToken();
      const data = {
        name: form.name,
        description: form.description,
        stars: form.stars ? parseInt(form.stars) : null,
        type: form.type || null,
        address: form.address,
        city: form.city,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        phone: form.phone,
        email: form.email,
        website: form.website || null,
        amenities: form.amenities,
        checkIn: form.checkIn || null,
        checkOut: form.checkOut || null,
        policyCancel: form.policyCancel || null,
        policyChildren: form.policyChildren || null,
        policyPet: form.policyPet || null,
        images: {
          thumbnail: form.thumbnailUrl,
          gallery: form.galleryUrls
        },
        status: userRole === 'admin' ? form.status : 'pending',
        price: form.price ? Number(form.price) : 0,
        rating: form.rating ? Number(form.rating) : null
      };

      if (editing) {
        await axios.put(`${API}/hotels/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/hotels`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công!');
      }

      setShowForm(false);
      setEditing(null);
      resetForm();
      loadHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
      const message = error.response?.data?.message || error.response?.data?.error || 'Lỗi khi lưu khách sạn';
      alert(message);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      stars: '',
      type: '',
      address: '',
      city: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      website: '',
      amenities: [],
      checkIn: '',
      checkOut: '',
      policyCancel: '',
      policyChildren: '',
      policyPet: '',
      thumbnail: null,
      thumbnailUrl: '',
      gallery: [],
      galleryUrls: [],
      status: 'pending',
      price: '',
      rating: ''
    });
  };

  const handleEdit = (hotel) => {
    setEditing(hotel.id);
    setForm({
      name: hotel.name || '',
      description: hotel.description || '',
      stars: hotel.stars || '',
      type: hotel.type || '',
      address: hotel.address || '',
      city: hotel.city || hotel.location || '',
      latitude: hotel.latitude || '',
      longitude: hotel.longitude || '',
      phone: hotel.phone || '',
      email: hotel.email || '',
      website: hotel.website || '',
      amenities: hotel.amenities || [],
      checkIn: hotel.check_in || '',
      checkOut: hotel.check_out || '',
      policyCancel: hotel.policy_cancel || '',
      policyChildren: hotel.policy_children || '',
      policyPet: hotel.policy_pet || '',
      thumbnail: null,
      thumbnailUrl: hotel.thumbnail_url || hotel.image_url || '',
      gallery: [],
      galleryUrls: hotel.gallery_urls || [],
      status: hotel.status || 'pending',
      price: hotel.price || '',
      rating: hotel.rating || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa thành công!');
      loadHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Lỗi khi xóa khách sạn');
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quản lý Khách sạn</h2>
            <p className="text-sm text-gray-600 mt-1">Tổng số: {hotels.length} khách sạn</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              resetForm();
            }}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            + Thêm khách sạn
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">{editing ? 'Sửa khách sạn' : 'Thêm khách sạn mới'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-4 text-gray-700">Thông tin cơ bản</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách sạn *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hạng sao (1-5)</label>
                    <input
                      type="number"
                      value={form.stars}
                      onChange={(e) => setForm({ ...form, stars: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      min="1"
                      max="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Chọn loại</option>
                      {HOTEL_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="4"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Địa chỉ và liên hệ */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-4 text-gray-700">Địa chỉ và liên hệ</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ *</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố / Tỉnh *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="-90 đến 90"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="-180 đến 180"
                    />
                  </div>
                </div>
              </div>

              {/* Tiện ích */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-4 text-gray-700">Tiện ích</h4>
                <div className="grid grid-cols-4 gap-3">
                  {AMENITIES.map(amenity => (
                    <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(amenity.id)}
                        onChange={() => handleAmenityChange(amenity.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ảnh */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-4 text-gray-700">Ảnh</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="w-full border rounded px-3 py-2"
                      disabled={uploading}
                    />
                    {form.thumbnailUrl && (
                      <div className="mt-2">
                        <img src={form.thumbnailUrl} alt="Thumbnail" className="h-32 w-auto rounded" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gallery (nhiều ảnh)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      className="w-full border rounded px-3 py-2"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-1">Đang upload...</p>}
                    {form.galleryUrls.length > 0 && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {form.galleryUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img src={url} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Giờ và chính sách */}
              <div className="bg-white p-4 rounded border">
                <h4 className="font-semibold mb-4 text-gray-700">Giờ và chính sách</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ check-in</label>
                    <input
                      type="text"
                      value={form.checkIn}
                      onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: 14:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ check-out</label>
                    <input
                      type="text"
                      value={form.checkOut}
                      onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="VD: 12:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách hủy</label>
                    <textarea
                      value={form.policyCancel}
                      onChange={(e) => setForm({ ...form, policyCancel: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách trẻ em</label>
                    <textarea
                      value={form.policyChildren}
                      onChange={(e) => setForm({ ...form, policyChildren: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách thú cưng</label>
                    <textarea
                      value={form.policyPet}
                      onChange={(e) => setForm({ ...form, policyPet: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Status (chỉ Admin) */}
              {userRole === 'admin' && (
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold mb-4 text-gray-700">Trạng thái</h4>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  disabled={uploading}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành phố</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạng sao</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{hotel.city || hotel.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Number(hotel.price).toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.stars ? `${hotel.stars}⭐` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      hotel.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {hotel.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
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
