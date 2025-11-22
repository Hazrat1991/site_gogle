
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  itemCount: number;
  onSubmit: (data: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalAmount, itemCount, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cash' // 'card'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 animate-[fadeIn_0.3s_ease-out] pb-safe max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading">Оформление заказа</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <Icon icon="solar:close-circle-bold" className="size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
             <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Сумма к оплате</p>
                <p className="text-2xl font-bold text-primary">{totalAmount} с.</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold">Товаров</p>
                <p className="text-lg font-bold text-slate-800">{itemCount} шт.</p>
             </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-3">
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Ваше Имя</label>
               <input 
                  required
                  type="text" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-primary outline-none text-sm font-medium"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
               />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Телефон</label>
               <input 
                  required
                  type="tel" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-primary outline-none text-sm font-medium"
                  placeholder="+992 00 000 00 00"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
               />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Адрес доставки</label>
               <textarea 
                  required
                  rows={2}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:border-primary outline-none text-sm font-medium resize-none"
                  placeholder="Улица, дом, квартира..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
               />
            </div>
          </div>

          {/* Payment Method */}
          <div>
             <label className="block text-xs font-bold text-slate-500 mb-2">Способ оплаты</label>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${formData.paymentMethod === 'cash' ? 'border-primary bg-orange-50 text-primary shadow-sm' : 'border-slate-200 text-slate-500'}`}
                >
                   <Icon icon="solar:wallet-money-bold" className="size-5" />
                   Наличными
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${formData.paymentMethod === 'card' ? 'border-primary bg-orange-50 text-primary shadow-sm' : 'border-slate-200 text-slate-500'}`}
                >
                   <Icon icon="solar:card-bold" className="size-5" />
                   Картой
                </button>
             </div>
          </div>

          <button 
             type="submit" 
             className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
             <Icon icon="solar:bag-check-bold" className="size-5" />
             Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  );
};
