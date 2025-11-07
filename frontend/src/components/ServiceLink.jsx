import React from 'react';

export default function ServiceLink({ href, title, subtitle, emoji }) {
  return (
    <a href={href} className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex items-center gap-4">
      <div className="text-2xl">{emoji}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </a>
  );
}


