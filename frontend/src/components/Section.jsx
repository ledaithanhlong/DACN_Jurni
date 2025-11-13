import React from 'react';

export function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-blue-900">{title}</h2>
      {href && <a className="text-blue-600 hover:text-blue-700 text-sm font-semibold" href={href}>Xem tất cả →</a>}
    </div>
  );
}

export function Card({ image, title, subtitle, price, rating, discount }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer group border border-blue-50">
      <div className="relative">
        {image && (
          <img 
            src={image} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
            alt={title}
          />
        )}
        {discount && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}
          </div>
        )}
        {rating && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
            <span>⭐</span>
            <span>{rating}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition" title={title}>
          {title}
        </div>
        {subtitle && (
          <div className="text-sm text-blue-800/70 truncate mb-2">{subtitle}</div>
        )}
        {price != null && (
          <div className="mt-2">
            <div className="text-blue-600 font-bold text-lg">
              {formatPrice(price)} VND
            </div>
            {discount && (
              <div className="text-xs text-gray-400 line-through mt-1">
                {formatPrice(price * 1.2)} VND
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


