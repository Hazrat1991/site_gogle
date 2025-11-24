
import React from 'react';
import { Icon } from "@iconify/react";
import { Product } from '../types';

interface CompareDrawerProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
  onAddToCart: (p: Product) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ products, isOpen, onClose, onRemove, onAddToCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl pointer-events-auto shadow-2xl transform transition-transform animate-fade-in max-h-[90vh] flex flex-col pb-safe">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading flex items-center gap-2">
             <Icon icon="solar:scale-bold" className="text-primary" />
             Сравнение товаров
          </h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
            <Icon icon="solar:close-circle-bold" className="size-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-x-auto p-4">
           {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                 <Icon icon="solar:scale-linear" className="size-16 mb-2 opacity-50" />
                 <p>Выберите товары для сравнения</p>
              </div>
           ) : (
              <div className="grid grid-cols-2 gap-4 min-w-[300px]">
                 {products.map(p => (
                    <div key={p.id} className="space-y-4">
                       <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          <button 
                             onClick={() => onRemove(p.id)}
                             className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 shadow-sm"
                          >
                             <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                          </button>
                       </div>
                       <div>
                          <h4 className="font-bold text-sm line-clamp-2 min-h-[40px]">{p.name}</h4>
                          <div className="text-primary font-bold text-lg">{p.price} с.</div>
                       </div>
                       
                       <div className="space-y-2 text-sm">
                          <div className="bg-slate-50 p-2 rounded-lg">
                             <div className="text-xs text-slate-400">Категория</div>
                             <div className="font-medium capitalize">{p.category}</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg">
                             <div className="text-xs text-slate-400">Материал</div>
                             <div className="font-medium">{p.material || '-'}</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg">
                             <div className="text-xs text-slate-400">Рейтинг</div>
                             <div className="font-medium flex items-center gap-1 text-orange-500">
                                <Icon icon="solar:star-bold" className="size-3" />
                                {p.rating}
                             </div>
                          </div>
                       </div>
                       
                       <button 
                         onClick={() => onAddToCart(p)}
                         className="w-full py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg"
                       >
                         В корзину
                       </button>
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
