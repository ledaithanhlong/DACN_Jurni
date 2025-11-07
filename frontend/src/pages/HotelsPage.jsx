import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [q, setQ] = useState('');

  const load = async () => {
    const res = await axios.get(`${API}/hotels`, { params: { q } });
    setHotels(res.data);
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} className="border p-2 rounded w-full" placeholder="Search hotels" />
        <button onClick={load} className="bg-sky-600 text-white px-4 rounded">Search</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {hotels.map(h => (
          <a key={h.id} href={`/hotels/${h.id}`} className="bg-white rounded shadow">
            {h.image_url && <img className="w-full h-40 object-cover rounded-t" src={h.image_url} />}
            <div className="p-4">
              <div className="font-semibold">{h.name}</div>
              <div className="text-sm text-gray-500">{h.location}</div>
              <div className="text-sky-700 font-bold mt-1">${Number(h.price).toFixed(2)}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

