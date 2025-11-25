
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row max-h-[80vh]">
         <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-white text-slate-800">
            <Icon icon="solar:close-circle-bold" className="size-6" />
         </button>

         {/* Image Section */}
         <div className="w-full md:w-1/2 bg-slate-100 relative aspect-square md:aspect-auto">
            <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
            {product.oldPrice && (
               <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  SALE
               </div>
            )}
         </div>

         {/* Info Section */}
         <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
            <div className="mb-auto">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{product.category}</div>
               <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{product.name}</h2>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-black text-primary">{product.price} с.</span>
                  {product.oldPrice && <span className="text-sm text-slate-400 line-through">{product.oldPrice} с.</span>}
               </div>

               {/* Selectors */}
               <div className="space-y-4 mb-6">
                  <div>
                     <span className="text-xs font-bold text-slate-500 block mb-2">Цвет</span>
                     <div className="flex gap-2">
                        {product.colors.map(c => (
                           <button 
                              key={c}
                              onClick={() => setSelectedColor(c)}
                              className={`h-8 px-3 rounded-lg border text-xs font-bold ${selectedColor === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
                           >
                              {c}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div>
                     <span className="text-xs font-bold text-slate-500 block mb-2">Размер</span>
                     <div className="flex gap-2 flex-wrap">
                        {product.sizes.map(s => (
                           <button 
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              className={`h-10 w-10 rounded-lg border text-xs font-bold flex items-center justify-center ${selectedSize === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <button 
               onClick={() => {
                  onAddToCart(product, selectedSize, selectedColor);
                  onClose();
               }}
               className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
               <Icon icon="solar:bag-plus-bold" className="size-5" />
               В корзину
            </button>
         </div>
      </div>
    </div>
  );
};
