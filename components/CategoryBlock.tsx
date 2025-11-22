import React from 'react';
import { Icon } from "@iconify/react";
import { DICTIONARY } from '../constants';
import { Language } from '../types';

interface CategoryBlockProps {
  lang: Language;
  onSelectCategory: (id: string) => void;
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({ lang, onSelectCategory }) => {
  const t = DICTIONARY[lang];

  const categories = [
    { id: 'men', name: t.men, icon: 'solar:t-shirt-bold', color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'women', name: t.women, icon: 'solar:skirt-bold', color: 'text-secondary', bg: 'bg-blue-50' },
    { id: 'shoes', name: t.shoes, icon: 'mdi:shoe-sneaker', color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'hats', name: t.hats, icon: 'fa6-solid:hat-cowboy', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'socks', name: t.socks, icon: 'ph:socks-fill', color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'accessories', name: t.accessories, icon: 'solar:watch-square-bold', color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="font-heading font-bold text-lg text-foreground">{t.categories}</h2>
        <button onClick={() => onSelectCategory('all')} className="text-primary text-sm font-medium">
          {lang === 'ru' ? 'Все' : 'Ҳама'}
        </button>
      </div>
      <div className="flex overflow-x-auto px-4 gap-4 pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => onSelectCategory(cat.id)}
            className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer"
          >
            <div className={`size-16 rounded-full ${cat.bg} flex items-center justify-center ${cat.color}`}>
              <Icon icon={cat.icon} className="size-8" />
            </div>
            <span className="text-xs font-medium text-center text-foreground">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};