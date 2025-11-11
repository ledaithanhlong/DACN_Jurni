import React from 'react';

export default function ServiceLink({ href, title, subtitle, emoji }) {
  return (
    <a 
      href={href} 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col items-center text-center group hover:border-orange-500 border border-transparent"
    >
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{emoji}</div>
      <div className="font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition">{title}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </a>
  );
}


