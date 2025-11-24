
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Promotion } from '../../types';
import { MOCK_PROMOTIONS } from '../../constants';

export const PromoBuilder: React.FC = () => {
  const [promos, setPromos] = useState<Promotion[]>(MOCK_PROMOTIONS);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* List of Promos */}
       <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold">Активные акции</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {promos.map(promo => (
                <div key={promo.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                   <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase ${promo.color}`}>
                      {promo.type}
                   </div>
                   <h4 className="font-bold text-lg mb-1">{promo.title}</h4>
                   <p className="text-sm text-slate-500 mb-3">
                      {promo.startDate} — {promo.endDate}
                   </p>
                   {promo.condition && (
                      <div className="inline-block bg-slate-50 px-2 py-1 rounded text-xs font-medium text-slate-600 mb-3">
                         Условие: {promo.condition}
                      </div>
                   )}
                   <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 bg-slate-50 rounded-lg text-sm font-bold hover:bg-slate-100">Редактировать</button>
                      <button className="size-9 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                         <Icon icon="solar:trash-bin-trash-bold" />
                      </button>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Builder Form */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
             <Icon icon="solar:magic-stick-3-bold" className="text-primary" />
             Конструктор акций
          </h3>
          <form className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Название акции</label>
                <input type="text" placeholder="Напр: Распродажа футболок" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Тип</label>
                   <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <option value="discount">Скидка %</option>
                      <option value="bogo">1+1=3</option>
                      <option value="shipping">Бесплатная доставка</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Значение</label>
                   <input type="number" placeholder="20" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Условие (опционально)</label>
                <input type="text" placeholder="Сумма > 500с или Время 18:00-21:00" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Начало</label>
                   <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Конец</label>
                   <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
             </div>

             <button className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg mt-2">
                Создать акцию
             </button>
          </form>
       </div>
    </div>
  );
};
