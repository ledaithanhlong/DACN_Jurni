import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ActivitiesPage() {
  const [rows, setRows] = useState([]);
  const load = async () => { const res = await axios.get(`${API}/activities`); setRows(res.data); };
  useEffect(() => { load(); }, []);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {rows.map(a => (
        <div key={a.id} className="bg-white rounded shadow">
          {a.image_url && <img className="w-full h-40 object-cover rounded-t" src={a.image_url} />}
          <div className="p-4">
            <div className="font-semibold">{a.name}</div>
            <div className="text-sm text-gray-500">{a.city}</div>
            <div className="text-sky-700 font-bold mt-1">${Number(a.price).toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

