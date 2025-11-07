import React from 'react';

export function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {href && <a className="text-sky-600 text-sm" href={href}>See all</a>}
    </div>
  );
}

export function Card({ image, title, subtitle, price }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition">
      {image && <img src={image} className="w-full h-40 object-cover" />}
      <div className="p-3">
        <div className="font-semibold truncate" title={title}>{title}</div>
        {subtitle && <div className="text-sm text-gray-500 truncate">{subtitle}</div>}
        {price != null && <div className="mt-1 text-sky-700 font-bold">${Number(price).toFixed(2)}</div>}
      </div>
    </div>
  );
}


