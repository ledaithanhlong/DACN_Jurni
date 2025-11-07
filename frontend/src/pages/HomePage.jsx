import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TravelokaHero from '../components/TravelokaHero.jsx';
import ServiceLink from '../components/ServiceLink.jsx';
import { SectionHeader, Card } from '../components/Section.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [h, f, a] = await Promise.all([
          axios.get(`${API}/hotels`),
          axios.get(`${API}/flights`),
          axios.get(`${API}/activities`)
        ]);
        setHotels(h.data.slice(0, 6));
        setFlights(f.data.slice(0, 6));
        setActivities(a.data.slice(0, 6));
      } catch (e) {
        // ignore for homepage best-effort
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <TravelokaHero />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ServiceLink href="/hotels" title="Hotels" subtitle="Great deals every day" emoji="🏨" />
        <ServiceLink href="/flights" title="Flights" subtitle="Fly to anywhere" emoji="✈️" />
        <ServiceLink href="/cars" title="Cars" subtitle="Daily rentals" emoji="🚗" />
        <ServiceLink href="/activities" title="Activities" subtitle="Things to do" emoji="🎟️" />
      </div>

      <section>
        <SectionHeader title="Popular Hotels" href="/hotels" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {hotels.map(h => (
            <a key={h.id} href={`/hotels/${h.id}`}><Card image={h.image_url} title={h.name} subtitle={h.location} price={h.price} /></a>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Top Flights" href="/flights" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {flights.map(f => (
            <Card key={f.id} image={f.image_url} title={f.airline} subtitle={`${f.departure_city} → ${f.arrival_city}`} price={f.price} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Things to do" href="/activities" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {activities.map(a => (
            <Card key={a.id} image={a.image_url} title={a.name} subtitle={a.city} price={a.price} />
          ))}
        </div>
      </section>
    </div>
  );
}

