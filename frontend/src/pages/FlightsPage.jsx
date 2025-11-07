import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function FlightsPage() {
  const [rows, setRows] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const load = async () => {
    const res = await axios.get(`${API}/flights`, { params: { from, to } });
    setRows(res.data);
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 rounded" value={from} onChange={e=>setFrom(e.target.value)} placeholder="From" />
        <input className="border p-2 rounded" value={to} onChange={e=>setTo(e.target.value)} placeholder="To" />
        <button onClick={load} className="bg-sky-600 text-white px-4 rounded">Search</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {rows.map(f => (
          <div key={f.id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{f.airline}</div>
            <div className="text-sm text-gray-500">{f.departure_city} → {f.arrival_city}</div>
            <div className="text-sky-700 font-bold mt-1">${Number(f.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

