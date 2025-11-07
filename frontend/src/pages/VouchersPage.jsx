import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function VouchersPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => { (async () => { const res = await axios.get(`${API}/vouchers`); setRows(res.data); })(); }, []);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {rows.map(v => (
        <div key={v.id} className="bg-white rounded shadow p-4">
          <div className="font-semibold">{v.code}</div>
          <div className="text-sm">Discount: {v.discount_percent}%</div>
          <div className="text-sm text-gray-500">Expires: {new Date(v.expiry_date).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}

