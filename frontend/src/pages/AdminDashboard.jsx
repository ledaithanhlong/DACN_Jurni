import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({ name: '', location: '', price: '' });
  const submit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    await axios.post(`${API}/hotels`, { ...form, price: Number(form.price) }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Hotel created');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold mb-2">Create Hotel</div>
        <form onSubmit={submit} className="grid gap-2">
          <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
          <input className="border p-2 rounded" placeholder="Location" value={form.location} onChange={e=>setForm(f=>({...f, location: e.target.value}))} />
          <input className="border p-2 rounded" placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f, price: e.target.value}))} />
          <button className="bg-sky-600 text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>
    </div>
  );
}

