import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CarsPage() {
  const [rows, setRows] = useState([]);
  const load = async () => { const res = await axios.get(`${API}/cars`); setRows(res.data); };
  useEffect(() => { load(); }, []);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {rows.map(c => (
        <div key={c.id} className="bg-white rounded shadow">
          {c.image_url && <img className="w-full h-40 object-cover rounded-t" src={c.image_url} />}
          <div className="p-4">
            <div className="font-semibold">{c.company} - {c.type}</div>
            <div className="text-sm text-gray-500">{c.seats} seats</div>
            <div className="text-sky-700 font-bold mt-1">${Number(c.price_per_day).toFixed(2)}/day</div>
          </div>
        </div>
      ))}
    </div>
  );
}

