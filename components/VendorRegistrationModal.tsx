
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    category: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fade-in shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <Icon icon="solar:close-circle-bold" className="size-6" />
        </button>

        <div className="mb-6">
           <h3 className="text-xl font-bold font-heading mb-1">Стать продавцом</h3>
           <p className="text-sm text-slate-500">Продавайте свои товары на Grand Market</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Название магазина</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
              placeholder="Zara Dushanbe"
              value={form.shopName}
              onChange={e => setForm({...form, shopName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Имя владельца</label>
            <input 
              required
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
              placeholder="Иван Иванов"
              value={form.ownerName}
              onChange={e => setForm({...form, ownerName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Телефон</label>
            <input 
              required
              type="tel" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
              placeholder="+992 900 00 00 00"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Категория товаров</label>
            <select 
               className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary"
               value={form.category}
               onChange={e => setForm({...form, category: e.target.value})}
            >
               <option value="">Выберите...</option>
               <option value="clothing">Одежда</option>
               <option value="shoes">Обувь</option>
               <option value="accessories">Аксессуары</option>
               <option value="electronics">Электроника</option>
               <option value="home">Товары для дома</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg mt-4"
          >
            Отправить заявку
          </button>
        </form>
      </div>
    </div>
  );
};
