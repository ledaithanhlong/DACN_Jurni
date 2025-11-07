import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => { (async () => {
    const res = await axios.get(`${API}/hotels/${id}`);
    setHotel(res.data);
  })(); }, [id]);

  const book = async () => {
    const token = await getToken();
    await axios.post(`${API}/bookings`, { service_type: 'hotel', service_id: Number(id), total_price: hotel.price }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Booked!');
  };

  if (!hotel) return 'Loading...';
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        {hotel.image_url && <img className="w-full rounded" src={hotel.image_url} />}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <div className="text-gray-600">{hotel.location}</div>
        <div className="mt-2">{hotel.description}</div>
        <div className="text-sky-700 font-bold mt-3 text-xl">${Number(hotel.price).toFixed(2)}</div>
        <button onClick={book} className="mt-4 bg-sky-600 text-white px-4 py-2 rounded">Book now</button>
      </div>
    </div>
  );
}

