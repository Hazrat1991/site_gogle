import React from 'react';
import { Language } from '../types';

interface HeroProps {
  lang: Language;
  onShopNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onShopNow }) => {
  return (
    <div className="mt-4 mx-4 rounded-2xl overflow-hidden relative h-48 shadow-lg">
      <img
        alt="Fashion Banner"
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent flex flex-col justify-center px-6">
        <h1 className="text-white font-heading font-bold text-2xl max-w-[70%] leading-tight mb-2">
          Grand Market Fashion
        </h1>
        <p className="text-white/90 text-sm mb-4 font-medium">
          {lang === 'ru' ? 'Стиль для всех' : 'Услуб барои ҳама'}
        </p>
        <button 
          onClick={onShopNow}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold w-fit shadow-md active:scale-95 transition-transform"
        >
          {lang === 'ru' ? 'Смотреть каталог' : 'Каталогро бинед'}
        </button>
      </div>
    </div>
  );
};