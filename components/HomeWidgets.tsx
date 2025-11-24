import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product, Brand, Occasion } from '../types';

export const GreetingHeader: React.FC<{ name: string }> = ({ name }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
  
  return (
    <div className="px-4 py-4 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-slate-800">
        {greeting}, <span className="text-primary">{name}!</span>
      </h1>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
         <Icon icon="solar:cloud-sun-2-bold-duotone" className="text-orange-400 size-4" />
         <span>Душанбе +15°C, солнечно</span>
      </div>
    </div>
  );
};

export const DailyBonus: React.FC = () => (
   <div className="px-4 mb-4">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95 transition-transform">
         <div className="flex items-center gap-3">
            <div className="size-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
               <Icon icon="solar:gift-bold" className="size-6 text-white" />
            </div>
            <div>
               <div className="font-bold text-sm">Ежедневный бонус</div>
               <div className="text-xs opacity-90">Заберите +50 баллов</div>
            </div>
         </div>
         <Icon icon="solar:alt-arrow-right-bold" className="size-5" />
      </div>
   </div>
);

export const FlashSale: React.FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => {
   const [timeLeft, setTimeLeft] = useState(15120); // ~4 hours in seconds

   useEffect(() => {
      const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
      return () => clearInterval(timer);
   }, []);

   const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
   };

   return (
      <div className="px-4 mb-6" onClick={onClick}>
         <div className="bg-red-500 rounded-2xl overflow-hidden shadow-xl shadow-red-500/20 text-white relative">
            <div className="absolute top-0 right-0 p-4 z-10">
               <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-white/20">
                  <Icon icon="solar:clock-circle-bold" />
                  {formatTime(timeLeft)}
               </div>
            </div>
            <div className="flex">
               <div className="w-1/2 p-4 flex flex-col justify-center z-10">
                  <span className="bg-yellow-400 text-red-600 text-[10px] font-black px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-wide">Flash Sale</span>
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black">{product.price} с.</span>
                     <span className="text-sm opacity-70 line-through">{product.oldPrice || product.price * 1.5} с.</span>
                  </div>
               </div>
               <div className="w-1/2 relative h-40">
                  <img src={product.images[0]} className="absolute inset-0 w-full h-full object-cover" alt={product.name} />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-transparent to-transparent"></div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const BrandWall: React.FC<{ brands: Brand[] }> = ({ brands }) => (
   <div className="mb-6">
      <div className="px-4 mb-2 flex justify-between items-center">
         <h2 className="font-heading font-bold text-lg text-slate-800">Популярные бренды</h2>
      </div>
      <div className="flex overflow-x-auto px-4 gap-4 pb-2 scrollbar-hide">
         {brands.map(brand => (
            <div key={brand.id} className="size-16 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center p-3 shrink-0 cursor-pointer">
               <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain opacity-80" />
            </div>
         ))}
      </div>
   </div>
);

export const OccasionList: React.FC<{ occasions: Occasion[] }> = ({ occasions }) => (
   <div className="mb-6 px-4">
      <h2 className="font-heading font-bold text-lg text-slate-800 mb-3">Подборки по ситуациям</h2>
      <div className="grid grid-cols-2 gap-3">
         {occasions.map(occ => (
            <div key={occ.id} className="relative h-24 rounded-xl overflow-hidden cursor-pointer group">
               <img src={occ.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={occ.name} />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-sm tracking-wide">{occ.name}</span>
               </div>
            </div>
         ))}
      </div>
   </div>
);

export const MasonryGrid: React.FC<{ products: Product[], onProductClick: (p: Product) => void }> = ({ products, onProductClick }) => {
   // Ensure we have at least 3 products
   if (products.length < 3) return null;
   const [big, small1, small2] = products;

   return (
      <div className="px-4 mb-6">
         <h2 className="font-heading font-bold text-lg text-slate-800 mb-3">Тренды недели</h2>
         <div className="grid grid-cols-2 grid-rows-2 gap-3 h-64">
            <div 
               className="row-span-2 relative rounded-2xl overflow-hidden cursor-pointer"
               onClick={() => onProductClick(big)}
            >
               <img src={big.images[0]} className="w-full h-full object-cover" alt={big.name} />
               <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <div className="text-xs font-bold line-clamp-1">{big.name}</div>
                  <div className="font-bold text-sm">{big.price} с.</div>
               </div>
            </div>
            <div 
               className="relative rounded-2xl overflow-hidden cursor-pointer"
               onClick={() => onProductClick(small1)}
            >
               <img src={small1.images[0]} className="w-full h-full object-cover" alt={small1.name} />
               <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {small1.price} с.
               </div>
            </div>
            <div 
               className="relative rounded-2xl overflow-hidden cursor-pointer"
               onClick={() => onProductClick(small2)}
            >
               <img src={small2.images[0]} className="w-full h-full object-cover" alt={small2.name} />
               <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {small2.price} с.
               </div>
            </div>
         </div>
      </div>
   );
};

export const LiveTicker: React.FC = () => (
   <div className="bg-slate-900 text-white text-[10px] py-1.5 px-4 overflow-hidden whitespace-nowrap">
      <div className="animate-[marquee_15s_linear_infinite] inline-block">
         🔥 Алишер из Худжанда только что купил Nike Air Max &nbsp;&bull;&nbsp; ⚡️ Зарина из Душанбе оформила заказ на 1200с &nbsp;&bull;&nbsp; 📦 15 человек смотрят "Зимнюю Куртку" прямо сейчас
      </div>
   </div>
);