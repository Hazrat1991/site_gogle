import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Language } from '../types';
import { DICTIONARY } from '../constants';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
  lang: Language;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose, onApply, currentFilters, lang }) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const t = DICTIONARY[lang];

  // Update local state when drawer opens with current filters
  useEffect(() => {
    if (isOpen) {
        setLocalFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Drawer */}
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl pointer-events-auto shadow-2xl transform transition-transform animate-fade-in max-h-[90vh] flex flex-col pb-safe">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold font-heading">Фильтры</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
            <Icon icon="solar:close-circle-bold" className="size-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sort */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Сортировка</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'popular', label: 'По популярности' },
                { id: 'price_asc', label: 'Цена ↑' },
                { id: 'price_desc', label: 'Цена ↓' },
                { id: 'newest', label: 'Новинки' },
                { id: 'rating', label: 'По рейтингу' },
                { id: 'discount', label: 'По скидке' }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 has-[:checked]:border-primary has-[:checked]:bg-orange-50 cursor-pointer transition-all">
                  <span className="text-xs font-bold text-slate-700">{opt.label}</span>
                  <input 
                    type="radio" 
                    name="sort" 
                    checked={localFilters.sort === opt.id} 
                    onChange={() => setLocalFilters({...localFilters, sort: opt.id})}
                    className="accent-primary size-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Switches for Sale/Stock */}
          <div className="space-y-3">
             <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                   <Icon icon="solar:sale-bold" className="text-red-500 size-5" />
                   <span className="text-sm font-bold text-slate-800">Только со скидкой</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={localFilters.onlySale}
                  onChange={e => setLocalFilters({...localFilters, onlySale: e.target.checked})}
                  className="size-5 accent-primary"
                />
             </label>
             <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                   <Icon icon="solar:box-bold" className="text-green-600 size-5" />
                   <span className="text-sm font-bold text-slate-800">В наличии</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={localFilters.onlyStock}
                  onChange={e => setLocalFilters({...localFilters, onlyStock: e.target.checked})}
                  className="size-5 accent-primary"
                />
             </label>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">{t.price} (c.)</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-xs text-slate-400 mb-1 block">От</span>
                <input 
                  type="number" 
                  value={localFilters.minPrice || ''} 
                  onChange={e => setLocalFilters({...localFilters, minPrice: Number(e.target.value)})}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-primary"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs text-slate-400 mb-1 block">До</span>
                <input 
                  type="number" 
                  value={localFilters.maxPrice || ''} 
                  onChange={e => setLocalFilters({...localFilters, maxPrice: Number(e.target.value)})}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-primary"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
             <h4 className="text-sm font-bold text-slate-900 mb-3">{t.color}</h4>
             <div className="flex gap-3 flex-wrap">
                {['Черный', 'Белый', 'Синий', 'Красный', 'Хаки', 'Коричневый', 'Бежевый'].map(c => (
                   <button
                      key={c}
                      onClick={() => setLocalFilters({...localFilters, color: localFilters.color === c ? null : c})}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${localFilters.color === c ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'}`}
                   >
                      {c}
                   </button>
                ))}
             </div>
          </div>

          {/* Sizes */}
           <div>
             <h4 className="text-sm font-bold text-slate-900 mb-3">{t.size}</h4>
             <div className="flex gap-2 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '44'].map(s => (
                   <button
                      key={s}
                      onClick={() => setLocalFilters({...localFilters, size: localFilters.size === s ? null : s})}
                      className={`size-10 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${localFilters.size === s ? 'bg-secondary text-white border-secondary' : 'bg-white text-slate-600 border-slate-200'}`}
                   >
                      {s}
                   </button>
                ))}
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
           <button 
             onClick={handleApply}
             className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
           >
             Применить
           </button>
           <button 
             onClick={() => {
               setLocalFilters({ category: currentFilters.category, sort: 'popular' });
               onApply({ category: currentFilters.category, sort: 'popular' });
               onClose();
             }}
             className="w-full py-3 text-slate-400 text-sm font-medium mt-1"
           >
             Сбросить все
           </button>
        </div>
      </div>
    </div>
  );
};