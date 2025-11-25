
import React from 'react';
import { Icon } from "@iconify/react";
import { UserProfile, Order } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface ProfileViewProps {
  user: UserProfile;
  orders: Order[];
  onNavigate: (view: any) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPrime?: () => void;
  onConfirmDelivery?: (orderId: string) => void; // NEW prop
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  orders, 
  onNavigate, 
  isDarkMode, 
  onToggleTheme,
  onOpenPrime,
  onConfirmDelivery
}) => {
  // Logic for Active Order
  const activeOrder = orders.find(o => ['new', 'processing', 'shipped', 'ready_to_ship'].includes(o.status));
  
  // Logic for Gamification
  const nextLevelThreshold = 5000;
  const currentSpent = 3500; // Mock data
  const progressPercent = Math.min(100, (currentSpent / nextLevelThreshold) * 100);
  const remaining = nextLevelThreshold - currentSpent;

  // Mock Pending Reviews (Items delivered but not reviewed)
  const pendingReviews = MOCK_PRODUCTS.slice(0, 3); 

  const getOrderStatusProgress = (status: string) => {
     if (status === 'new') return 25;
     if (status === 'processing') return 50;
     if (status === 'ready_to_ship') return 75;
     if (status === 'shipped') return 90;
     return 100;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 dark:bg-slate-950 animate-fade-in">
      
      {/* Header & Theme Toggle */}
      <div className="p-4 pt-6 flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Профиль</h1>
         <button onClick={onToggleTheme} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-600 dark:text-slate-300">
            <Icon icon={isDarkMode ? "solar:sun-bold" : "solar:moon-bold"} className="size-6" />
         </button>
      </div>

      <div className="px-4">
         {/* Digital Membership Card */}
         <div className="w-full aspect-[1.6] bg-gradient-to-br from-slate-800 to-black rounded-3xl p-6 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col justify-between group transition-transform active:scale-[0.98]">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="flex justify-between items-start relative z-10">
               <div className="flex items-center gap-4">
                  {/* Avatar with Edit */}
                  <div className="relative">
                     <div className="size-14 rounded-full border-2 border-white/20 overflow-hidden bg-white/10">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
                     </div>
                     <button className="absolute -bottom-1 -right-1 size-6 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-sm">
                        <Icon icon="solar:pen-bold" className="size-3" />
                     </button>
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Grand Member</div>
                     <div className="font-heading font-bold text-xl tracking-wide">{user.name}</div>
                  </div>
               </div>
               <div className="size-10 bg-white rounded-lg flex items-center justify-center">
                  <Icon icon="solar:qr-code-bold" className="size-6 text-slate-900" />
               </div>
            </div>

            <div className="relative z-10">
               <div className="flex justify-between items-end mb-1">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-400">Бонусный баланс</span>
                        <button className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80 hover:bg-white/20">История</button>
                     </div>
                     <div className="text-3xl font-mono font-bold text-primary">{user.bonusPoints} Б</div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs text-slate-400 mb-1">Ваш статус</div>
                     <div className="text-lg font-bold text-yellow-400 flex items-center gap-1">
                        <Icon icon="solar:medal-star-bold" />
                        Gold
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Level Progress */}
         <div className="mt-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between text-xs font-bold mb-2 dark:text-slate-300">
               <span>До статуса Platinum</span>
               <span className="text-slate-400">Осталось {remaining} с.</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
         </div>
      </div>

      {/* Prime Banner - NEW */}
      <div className="px-4 mt-6" onClick={onOpenPrime}>
         <div className="bg-slate-900 dark:bg-black p-4 rounded-2xl shadow-lg cursor-pointer flex items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 group-hover:scale-105 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4">
               <div className="size-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon icon="solar:crown-bold" className="text-white size-6" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-lg leading-none mb-1">Grand Prime</h3>
                  <p className="text-slate-400 text-xs">Бесплатная доставка и кэшбек</p>
               </div>
            </div>
            <div className="relative z-10 bg-white/10 p-2 rounded-full">
               <Icon icon="solar:alt-arrow-right-bold" className="text-white" />
            </div>
         </div>
      </div>

      {/* Active Order Widget */}
      {activeOrder && (
         <div className="px-4 mt-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 px-1">Активный заказ</h3>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="size-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                        <Icon icon="solar:box-bold-duotone" className="size-6" />
                     </div>
                     <div>
                        <div className="font-bold text-slate-800 dark:text-white text-sm">Заказ {activeOrder.id}</div>
                        <div className="text-xs text-slate-500">
                           {activeOrder.status === 'shipped' ? 'В пути к вам' : activeOrder.status === 'ready_to_ship' ? 'Ожидает курьера' : 'Сборка на складе'}
                        </div>
                     </div>
                  </div>
                  {activeOrder.status === 'shipped' && (
                     <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                        Где курьер?
                     </button>
                  )}
               </div>
               
               {/* Verification Code Display & Confirmation Button */}
               {(activeOrder.status === 'shipped' || activeOrder.status === 'ready_to_ship') && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mb-4 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center gap-3">
                     <div className="text-center w-full">
                        <p className="text-xs text-slate-500 mb-1">Код для курьера:</p>
                        <div className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-[0.2em] w-full text-center">
                           {activeOrder.verificationCode}
                        </div>
                     </div>
                     
                     {activeOrder.status === 'shipped' && onConfirmDelivery && (
                        <button 
                           onClick={() => onConfirmDelivery(activeOrder.id)}
                           className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                           <Icon icon="solar:check-circle-bold" className="size-5" />
                           Я получил заказ
                        </button>
                     )}
                  </div>
               )}
               
               {/* Tracker Bar */}
               <div className="relative h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
                  <div 
                     className="absolute top-0 left-0 h-full bg-green-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${getOrderStatusProgress(activeOrder.status)}%` }}
                  ></div>
               </div>
               <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Сборка</span>
                  <span>Курьер</span>
                  <span>Вручено</span>
               </div>
            </div>
         </div>
      )}

      {/* Referral Program (Growth) */}
      <div className="px-4 mt-6">
         <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white shadow-lg shadow-pink-500/20 relative overflow-hidden">
            <Icon icon="solar:gift-bold" className="absolute -right-4 -bottom-4 size-32 text-white/10 rotate-12" />
            <div className="relative z-10">
               <h3 className="font-bold text-lg mb-1">Пригласи друга</h3>
               <p className="text-sm text-white/90 mb-4 max-w-[70%]">Подари другу скидку 5% и получи <strong>50 баллов</strong> на счет!</p>
               <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md p-1 pr-4 rounded-xl border border-white/20 w-fit">
                  <div className="bg-white text-rose-600 px-3 py-1.5 rounded-lg font-mono font-bold text-sm">
                     {user.referralCode}
                  </div>
                  <button className="text-xs font-bold flex items-center gap-1 hover:text-white/80">
                     <Icon icon="solar:copy-bold" />
                     Копировать
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Pending Reviews (Engagement) */}
      <div className="mt-6">
         <h3 className="font-bold text-slate-900 dark:text-white mb-3 px-5">Ожидают отзыва <span className="text-orange-500 text-xs">+20б</span></h3>
         <div className="flex overflow-x-auto px-4 gap-3 pb-4 scrollbar-hide">
            {pendingReviews.map(item => (
               <div key={item.id} className="min-w-[260px] bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-3 items-center">
                  <div className="size-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                     <img src={item.images[0]} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                     <div className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 mb-1">{item.name}</div>
                     <div className="flex gap-1 mb-2">
                        {[1,2,3,4,5].map(star => (
                           <Icon key={star} icon="solar:star-linear" className="size-4 text-slate-300" />
                        ))}
                     </div>
                     <button className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg w-full">
                        Оценить
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Saved Card Visual */}
      <div className="px-4 mt-2 mb-6">
         <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
               {/* Mini Card Visual */}
               <div className="w-16 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg relative overflow-hidden shadow-sm flex flex-col justify-end p-1.5">
                  <div className="text-[6px] text-white font-mono tracking-widest">•••• 4242</div>
                  <Icon icon="logos:visa" className="h-2 w-auto absolute top-1 right-1 opacity-80" />
               </div>
               <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Visa Classic</div>
                  <div className="text-xs text-slate-500">Основная карта</div>
               </div>
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="text-slate-400" />
         </div>
      </div>

      {/* Dashboard Grid */}
      <div className="px-4 mb-6">
         <h3 className="font-bold text-slate-900 dark:text-white mb-3 px-1">Меню</h3>
         <div className="grid grid-cols-3 gap-3">
            {[
               { id: 'orders', label: 'Мои заказы', icon: 'solar:bag-check-bold', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
               { id: 'addresses', label: 'Адреса', icon: 'solar:map-point-bold', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
               { id: 'cards', label: 'Карты', icon: 'solar:card-bold', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
               { id: 'sizes', label: 'Мои размеры', icon: 'solar:ruler-pen-bold', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
               { id: 'support', label: 'Поддержка', icon: 'solar:chat-round-dots-bold', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
               { id: 'settings', label: 'Настройки', icon: 'solar:settings-bold', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
            ].map(item => (
               <button 
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform aspect-square"
               >
                  <div className={`size-10 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                     <Icon icon={item.icon} className="size-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">{item.label}</span>
               </button>
            ))}
         </div>
      </div>

      {/* My Sizes Widget */}
      <div className="px-4 mb-6">
         <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icon icon="solar:ruler-pen-bold" className="text-primary" />
                  Мои параметры
               </h3>
               <button className="text-xs font-bold text-slate-400 hover:text-primary">Изменить</button>
            </div>
            <div className="flex justify-between text-center divide-x divide-slate-100 dark:divide-slate-700">
               <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">Рост</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">175 см</div>
               </div>
               <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">Размер</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">M</div>
               </div>
               <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">Обувь</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">42</div>
               </div>
            </div>
         </div>
      </div>

      {/* Additional Links */}
      <div className="px-4 space-y-3 pb-8">
         <button 
            onClick={() => onNavigate({ name: 'admin' })} 
            className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-800"
         >
            <div className="flex items-center gap-3 font-bold text-slate-800 dark:text-white">
               <Icon icon="solar:shield-user-bold" className="text-slate-400" />
               Админ панель
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="text-slate-400" />
         </button>
         <button 
            onClick={() => onNavigate({ name: 'employee_portal' })}
            className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex items-center justify-between border border-slate-100 dark:border-slate-800"
         >
            <div className="flex items-center gap-3 font-bold text-slate-800 dark:text-white">
               <Icon icon="solar:user-id-bold" className="text-slate-400" />
               Вход для сотрудников
            </div>
            <Icon icon="solar:alt-arrow-right-linear" className="text-slate-400" />
         </button>
      </div>

      {/* Footer Info */}
      <div className="text-center pb-8 opacity-50">
         <div className="text-[10px] text-slate-400 mb-1">Grand Market App v1.0.0</div>
         <div className="flex justify-center gap-3 text-[10px] text-slate-400 font-medium">
            <button>Политика конфиденциальности</button>
            <span>•</span>
            <button>Публичная оферта</button>
         </div>
      </div>

    </div>
  );
};
