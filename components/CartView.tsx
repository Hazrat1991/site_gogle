
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product, CartItem, Language } from '../types';
import { DICTIONARY, MOCK_PRODUCTS } from '../constants';

interface CartViewProps {
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  favorites: number[];
  toggleFavorite: (product: Product) => void;
  onCheckout: () => void;
  onNavigate: (view: any) => void;
  bundleSavings: number;
  onBookingFitting: () => void;
  lang: Language;
}

export const CartView: React.FC<CartViewProps> = ({ 
  cart, 
  setCart, 
  favorites, 
  toggleFavorite, 
  onCheckout, 
  onNavigate,
  bundleSavings,
  onBookingFitting,
  lang 
}) => {
  const t = DICTIONARY[lang];
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [promoCode, setPromoCode] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  // Constants
  const FREE_SHIPPING_THRESHOLD = 500;
  
  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal - bundleSavings;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Upsell Products (Cheaper items not in cart)
  const upsellProducts = MOCK_PRODUCTS
    .filter(p => p.price < 200 && !cart.find(i => i.id === p.id))
    .slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleUpdateQty = (index: number, change: number) => {
    setCart(cart.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    }));
  };

  const handleRemoveClick = (item: CartItem) => {
    setItemToRemove(item);
  };

  const confirmRemove = (moveToFavorites: boolean) => {
    if (itemToRemove) {
      if (moveToFavorites && !favorites.includes(itemToRemove.id)) {
        toggleFavorite(itemToRemove);
      }
      setCart(cart.filter(i => i !== itemToRemove));
      setItemToRemove(null);
    }
  };

  const addUpsellItem = (product: Product) => {
    const newItem: CartItem = {
      ...product,
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: product.colors[0]
    };
    setCart([...cart, newItem]);
  };

  if (cart.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
         <div className="size-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 relative">
            <Icon icon="solar:cart-large-minimalistic-bold" className="size-10 text-slate-300" />
            <div className="absolute top-0 right-0 size-8 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
               <Icon icon="solar:sad-circle-bold" className="size-5 text-primary" />
            </div>
         </div>
         <h2 className="text-xl font-bold text-slate-900 mb-2">Ваша корзина пуста</h2>
         <p className="text-slate-500 mb-8 max-w-xs">Похоже, вы еще не выбрали свой идеальный образ. Давайте это исправим!</p>
         <button 
           onClick={() => onNavigate({ name: 'listing' })}
           className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
         >
           Перейти в каталог
         </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 relative">
      {/* Removal Confirmation Modal */}
      {itemToRemove && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center">
              <h3 className="font-bold text-lg mb-2">Удалить товар?</h3>
              <p className="text-sm text-slate-500 mb-6">Вы можете отложить его в избранное, чтобы не потерять.</p>
              <div className="flex flex-col gap-3">
                 <button 
                   onClick={() => confirmRemove(true)}
                   className="w-full py-3 bg-secondary text-white rounded-xl font-bold shadow-md"
                 >
                   <Icon icon="solar:heart-bold" className="inline mr-2" />
                   Отложить в избранное
                 </button>
                 <button 
                   onClick={() => confirmRemove(false)}
                   className="w-full py-3 bg-slate-100 text-red-500 rounded-xl font-bold"
                 >
                   Удалить навсегда
                 </button>
                 <button 
                   onClick={() => setItemToRemove(null)}
                   className="w-full py-2 text-slate-400 font-bold text-sm"
                 >
                   Отмена
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Reservation Timer Header */}
      <div className="bg-orange-50 text-orange-700 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-10 border-b border-orange-100">
         <Icon icon="solar:clock-circle-bold" className="animate-pulse" />
         Товары зарезервированы на {formatTime(timeLeft)}
      </div>

      <div className="px-4 py-4 space-y-4">
         <h1 className="text-2xl font-bold text-slate-900">{t.cart} <span className="text-slate-400 text-lg font-medium">({cart.length})</span></h1>

         {/* Free Shipping Bar */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between text-xs font-bold mb-2">
               {progress < 100 ? (
                  <span>До бесплатной доставки <span className="text-primary">{remainingForFreeShipping} с.</span></span>
               ) : (
                  <span className="text-green-600 flex items-center gap-1"><Icon icon="solar:box-bold" /> Доставка бесплатно!</span>
               )}
               <span className="text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div 
                  className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-green-500' : 'bg-primary'}`} 
                  style={{ width: `${progress}%` }}
               />
            </div>
         </div>

         {/* Cart Items */}
         <div className="space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3 animate-fade-in">
                <div className="w-20 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                   <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div>
                         <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.name}</h3>
                         <p className="text-xs text-slate-500 mt-0.5">{item.selectedSize} • {item.selectedColor}</p>
                      </div>
                      <button onClick={() => handleRemoveClick(item)} className="text-slate-300 hover:text-red-500 p-1">
                         <Icon icon="solar:trash-bin-trash-bold" className="size-5" />
                      </button>
                   </div>
                   
                   <div className="flex justify-between items-end">
                      <div className="font-bold text-lg text-slate-900">{item.price * item.quantity} с.</div>
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200">
                         <button onClick={() => handleUpdateQty(i, -1)} className="size-6 flex items-center justify-center text-slate-500 hover:text-primary active:scale-90 font-bold">-</button>
                         <span className="text-sm font-bold min-w-[12px] text-center">{item.quantity}</span>
                         <button onClick={() => handleUpdateQty(i, 1)} className="size-6 flex items-center justify-center text-slate-500 hover:text-primary active:scale-90 font-bold">+</button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
         </div>

         {/* Upsell Carousel */}
         <div className="py-2">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
               <Icon icon="solar:bag-heart-bold" className="text-red-500" />
               Не забудьте добавить
            </h3>
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide -mx-4 px-4">
               {upsellProducts.map(p => (
                  <div key={p.id} className="min-w-[140px] bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                     <div className="aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden">
                        <img src={p.images[0]} className="w-full h-full object-cover" />
                     </div>
                     <div className="font-bold text-xs line-clamp-1 mb-1">{p.name}</div>
                     <div className="flex justify-between items-center">
                        <div className="font-bold text-sm">{p.price} с.</div>
                        <button 
                           onClick={() => addUpsellItem(p)}
                           className="size-7 bg-slate-900 text-white rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                        >
                           <Icon icon="solar:add-circle-bold" className="size-4" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Promo Code & Bundle */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             {bundleSavings > 0 && (
                <div className="bg-green-50 p-3 flex justify-between items-center border-b border-green-100">
                   <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                      <Icon icon="solar:tag-price-bold" />
                      Скидка за комплект
                   </div>
                   <div className="font-bold text-green-700">- {bundleSavings} с.</div>
                </div>
             )}
             
             <div className="p-4">
                <button 
                   onClick={() => setIsPromoOpen(!isPromoOpen)}
                   className="flex justify-between items-center w-full text-sm font-bold text-slate-600"
                >
                   <span>Есть промокод?</span>
                   <Icon icon="solar:alt-arrow-down-linear" className={`transition-transform ${isPromoOpen ? 'rotate-180' : ''}`} />
                </button>
                {isPromoOpen && (
                   <div className="mt-3 flex gap-2 animate-fade-in">
                      <input 
                        type="text" 
                        placeholder="PROMO2024" 
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm uppercase font-bold outline-none focus:border-primary"
                      />
                      <button className="bg-slate-900 text-white px-4 rounded-xl font-bold text-sm">OK</button>
                   </div>
                )}
             </div>
         </div>

         {/* O2O Booking */}
         <button 
            onClick={onBookingFitting}
            className="w-full py-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl font-bold flex items-center justify-center gap-2"
         >
            <Icon icon="solar:hanger-2-bold" />
            Забронировать примерочную
         </button>

         {/* Summary & Checkout */}
         <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-slate-100 -mx-4 px-6 py-6 pb-safe mt-4">
            <div className="flex justify-between items-center mb-2 text-sm">
               <span className="text-slate-500">Товары ({cart.length})</span>
               <span className="font-bold text-slate-900">{subtotal} с.</span>
            </div>
            {bundleSavings > 0 && (
               <div className="flex justify-between items-center mb-4 text-sm text-green-600">
                  <span>Вы экономите</span>
                  <span className="font-bold">- {bundleSavings} с.</span>
               </div>
            )}
            
            <div className="flex justify-between items-end mb-6">
               <span className="text-lg font-bold text-slate-900">{t.total}</span>
               <span className="text-3xl font-black text-primary transition-all duration-300 key={total}">{total} с.</span>
            </div>

            <button 
               onClick={onCheckout}
               className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2 mb-6"
            >
               <Icon icon="solar:bag-check-bold" className="size-6" />
               {t.checkout}
            </button>

            {/* Trust Badges */}
            <div className="flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
               <Icon icon="logos:visa" className="h-6 w-auto" />
               <Icon icon="logos:mastercard" className="h-6 w-auto" />
               <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 border border-slate-300 rounded px-1.5 bg-white">
                  <Icon icon="solar:shield-check-bold" className="text-green-500" />
                  SECURE
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
