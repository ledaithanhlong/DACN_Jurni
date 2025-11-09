import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminCars() {
  const { getToken } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    company: '',
    type: '',
    seats: '',
    price_per_day: '',
    available: true,
    image_url: ''
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const res = await axios.get(`${API}/cars`);
      setCars(res.data);
    } catch (error) {
      console.error('Error loading cars:', error);
      alert('Lỗi khi tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const data = {
        ...form,
        seats: Number(form.seats),
        price_per_day: Number(form.price_per_day),
        available: form.available === true || form.available === 'true'
      };
      
      if (editing) {
        await axios.put(`${API}/cars/${editing}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Cập nhật thành công!');
      } else {
        await axios.post(`${API}/cars`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Tạo thành công!');
      }
      setShowForm(false);
      setEditing(null);
      setForm({
        company: '',
        type: '',
        seats: '',
        price_per_day: '',
        available: true,
        image_url: ''
      });
      loadCars();
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Lỗi khi lưu xe');
    }
  };

  const handleEdit = (car) => {
    setEditing(car.id);
    setForm({
      company: car.company,
      type: car.type,
      seats: car.seats,
      price_per_day: car.price_per_day,
      available: car.available,
      image_url: car.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa xe này?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Xóa thành công!');
      loadCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Lỗi khi xóa xe');
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quản lý Xe cho thuê</h2>
            <p className="text-sm text-gray-600 mt-1">Tổng số: {cars.length} xe</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm({
                company: '',
                type: '',
                seats: '',
                price_per_day: '',
                available: true,
                image_url: ''
              });
            }}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            + Thêm xe
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-semibold mb-4">{editing ? 'Sửa xe' : 'Thêm xe mới'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số ghế</label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá/ngày (VNĐ)</label>
                <input
                  type="number"
                  value={form.price_per_day}
                  onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value={true}>Có sẵn</option>
                  <option value={false}>Không có sẵn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editing ? 'Cập nhật' : 'Tạo mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Công ty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số ghế</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá/ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.seats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Number(car.price_per_day).toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {car.available ? 'Có sẵn' : 'Không có sẵn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
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

