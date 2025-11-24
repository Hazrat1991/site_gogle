
import React from 'react';
import { Icon } from "@iconify/react";
import { Lookbook, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface LookbookViewProps {
  lookbooks: Lookbook[];
  onBack: () => void;
  onAddToCart: (p: Product) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({ lookbooks, onBack, onAddToCart }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full">
           <Icon icon="solar:arrow-left-linear" className="size-6" />
        </button>
        <h2 className="text-xl font-bold font-heading">Lookbook</h2>
      </div>

      <div className="p-4 space-y-8">
        {lookbooks.map(look => {
           const items = MOCK_PRODUCTS.filter(p => look.productIds.includes(p.id));
           const totalPrice = items.reduce((acc, i) => acc + i.price, 0);
           const discountPrice = look.discount ? Math.round(totalPrice * (1 - look.discount / 100)) : totalPrice;

           return (
              <div key={look.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                 <div className="relative aspect-[4/5] md:aspect-video">
                    <img src={look.mainImage} className="w-full h-full object-cover" alt={look.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                       <h3 className="text-2xl font-bold mb-1">{look.title}</h3>
                       <p className="text-white/80 text-sm mb-4">{look.description}</p>
                       <div className="flex items-center gap-3">
                          <button className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform">
                             Купить образ за {discountPrice} с.
                          </button>
                          {look.discount && (
                             <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{look.discount}%</span>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Items List */}
                 <div className="p-4">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Товары в образе</div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                       {items.map(item => (
                          <div key={item.id} className="min-w-[120px] w-[120px] flex flex-col gap-2">
                             <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
                                <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
                                <button 
                                  onClick={() => onAddToCart(item)}
                                  className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-800 shadow-sm"
                                >
                                   <Icon icon="solar:bag-plus-bold" className="size-4" />
                                </button>
                             </div>
                             <div>
                                <div className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</div>
                                <div className="text-xs text-primary font-bold">{item.price} с.</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           );
        })}
      </div>
    </div>
  );
};
