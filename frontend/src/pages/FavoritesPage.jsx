import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function FavoritesPage() {
  const [rows, setRows] = useState([]);
  const { getToken } = useAuth();
  useEffect(() => { (async () => {
    const token = await getToken();
    const res = await axios.get(`${API}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
    setRows(res.data);
  })(); }, []);
  return (
    <div className="space-y-3">
      {rows.map(f => (
        <div key={f.id} className="bg-white p-4 rounded shadow">
          <div>{f.service_type} #{f.service_id}</div>
        </div>
      ))}
    </div>
  );
}

