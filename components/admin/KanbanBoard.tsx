
import React, { useState, useMemo } from 'react';
import { Icon } from "@iconify/react";
import { Order } from '../../types';

interface KanbanBoardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const COLUMNS: { id: Order['status'], label: string, color: string, bg: string, icon: string }[] = [
  { id: 'new', label: 'Новые', color: 'text-blue-700', bg: 'bg-blue-50', icon: 'solar:star-bold' },
  { id: 'processing', label: 'В сборке', color: 'text-yellow-700', bg: 'bg-yellow-50', icon: 'solar:box-minimalistic-bold' },
  { id: 'ready_to_ship', label: 'Готовы к отгрузке', color: 'text-orange-700', bg: 'bg-orange-50', icon: 'solar:box-bold' },
  { id: 'shipped', label: 'Доставка', color: 'text-purple-700', bg: 'bg-purple-50', icon: 'solar:bicycling-bold' },
  { id: 'delivered', label: 'Вручено', color: 'text-green-700', bg: 'bg-green-50', icon: 'solar:check-circle-bold' },
];

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
   const config = COLUMNS.find(c => c.id === status) || COLUMNS[0];
   return (
      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${config.bg} ${config.color} border-transparent`}>
         {config.label}
      </span>
   );
};

const SLABadge = ({ status, date }: { status: string, date: string }) => {
   if (status !== 'new') return null;
   // Mock logic: randomly show "Late" for demo
   const isLate = Math.random() > 0.7; 
   
   if (isLate) {
      return (
         <div className="flex items-center gap-1 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse">
            <Icon icon="solar:alarm-bold" />
            &gt; 30 мин
         </div>
      );
   }
   return (
      <div className="flex items-center gap-1 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
         <Icon icon="solar:clock-circle-bold" />
         12 мин
      </div>
   );
};

const OrderCard: React.FC<{ order: Order, onSelect: (o: Order) => void }> = ({ order, onSelect }) => {
   return (
      <div 
        onClick={() => onSelect(order)}
        className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer group hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden"
      >
         {/* Status Line */}
         <div className={`absolute left-0 top-0 bottom-0 w-1 ${
            order.status === 'new' ? 'bg-blue-500' : 
            order.status === 'processing' ? 'bg-yellow-500' :
            order.status === 'ready_to_ship' ? 'bg-orange-500' :
            order.status === 'shipped' ? 'bg-purple-500' : 'bg-green-500'
         }`} />

         <div className="pl-2">
            {/* Top Row */}
            <div className="flex justify-between items-start mb-2">
               <div className="flex flex-col">
                  <div className="font-bold text-slate-800 text-sm hover:text-primary transition-colors">
                     {order.id}
                  </div>
                  <div className="text-[10px] text-slate-400">{order.date}</div>
               </div>
               <SLABadge status={order.status} date={order.date} />
            </div>

            {/* Customer Row */}
            <div className="flex items-center gap-2 mb-3 bg-slate-50 p-1.5 rounded-lg">
               <div className="size-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                  {order.customerName?.[0] || 'G'}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-700 truncate">{order.customerName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{order.address || 'Самовывоз'}</div>
               </div>
               <button 
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${order.customerPhone}`, '_blank') }}
                  className="size-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                  title="WhatsApp"
               >
                  <Icon icon="logos:whatsapp-icon" className="size-4" />
               </button>
            </div>

            {/* Items Thumbnails */}
            <div className="flex gap-1 mb-3 h-10">
               {order.items.slice(0, 3).map((item, i) => (
                  <img 
                     key={i} 
                     src={item.images[0]} 
                     className="w-10 h-10 rounded-lg object-cover border border-slate-100 bg-slate-50" 
                     alt="item" 
                  />
               ))}
               {order.items.length > 3 && (
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                     +{order.items.length - 3}
                  </div>
               )}
            </div>

            {/* Bottom Row (Money & Payment) */}
            <div className="flex justify-between items-center border-t border-slate-50 pt-2">
               <div className="flex items-center gap-1">
                  <div className={`size-2 rounded-full ${order.paymentMethod === 'card' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                     {order.paymentMethod === 'card' ? 'Оплачено' : 'Наличные'}
                  </span>
               </div>
               <span className="font-black text-slate-900 text-sm">{order.total} с.</span>
            </div>
         </div>
      </div>
   );
};

const OrderRow: React.FC<{ order: Order, onSelect: (o: Order) => void }> = ({ order, onSelect }) => (
   <tr 
      onClick={() => onSelect(order)}
      className="hover:bg-slate-50 cursor-pointer transition-colors group border-b border-slate-50 last:border-none"
   >
      <td className="p-4">
         <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{order.id}</span>
      </td>
      <td className="p-4 text-xs text-slate-500">
         <div>{order.date}</div>
         <SLABadge status={order.status} date={order.date} />
      </td>
      <td className="p-4">
         <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
               {order.customerName?.[0]}
            </div>
            <div>
               <div className="font-bold text-sm text-slate-800">{order.customerName}</div>
               <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
            </div>
         </div>
      </td>
      <td className="p-4">
         <div className="flex -space-x-2 hover:space-x-1 transition-all">
            {order.items.slice(0, 3).map((item, i) => (
               <img key={i} src={item.images[0]} className="size-8 rounded-full border-2 border-white object-cover bg-slate-100" />
            ))}
            {order.items.length > 3 && (
               <div className="size-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  +{order.items.length-3}
               </div>
            )}
         </div>
      </td>
      <td className="p-4">
         <div className="font-bold text-slate-900">{order.total} с.</div>
         <div className={`text-[10px] font-medium ${order.paymentMethod === 'card' ? 'text-green-600' : 'text-orange-500'}`}>
            {order.paymentMethod === 'card' ? 'Оплачено (Карта)' : 'Не оплачено (Нал)'}
         </div>
      </td>
      <td className="p-4">
         <StatusBadge status={order.status} />
      </td>
      <td className="p-4 text-right">
         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 text-slate-400 hover:text-green-600 bg-white border border-slate-200 rounded-lg shadow-sm" title="WhatsApp">
               <Icon icon="logos:whatsapp-icon" />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-lg shadow-sm" title="Печать">
               <Icon icon="solar:printer-bold" />
            </button>
         </div>
      </td>
   </tr>
);

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ orders, onUpdateStatus }) => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Filters
  const [filterPayment, setFilterPayment] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week'>('all');

  const filteredOrders = useMemo(() => {
    let res = orders;

    // Search
    if (searchQuery) {
       const q = searchQuery.toLowerCase();
       res = res.filter(o => 
         o.id.toLowerCase().includes(q) ||
         o.customerName?.toLowerCase().includes(q) ||
         o.customerPhone?.includes(q) ||
         o.items.some(i => i.name.toLowerCase().includes(q))
       );
    }

    // Filter Payment
    if (filterPayment !== 'all') {
       res = res.filter(o => {
          const isPaid = o.paymentMethod === 'card'; // Mock logic
          return filterPayment === 'paid' ? isPaid : !isPaid;
       });
    }

    // Filter Date (Mock)
    if (filterDate === 'today') {
       // In a real app, compare dates. Here we just simulate.
       // res = res.filter(...) 
    }

    return res;
  }, [orders, searchQuery, filterPayment, filterDate]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      {/* 1. Toolbar & Filters */}
      <div className="mb-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
         {/* Search */}
         <div className="relative w-full xl:w-96 group">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
               type="text" 
               placeholder="Поиск по ID, телефону, товару..." 
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
            />
         </div>
         
         {/* Filters & Actions */}
         <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scrollbar-hide items-center">
            <select 
               className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-primary cursor-pointer"
               value={filterDate}
               onChange={e => setFilterDate(e.target.value as any)}
            >
               <option value="all">За все время</option>
               <option value="today">За сегодня</option>
               <option value="week">За неделю</option>
            </select>
            
            <select 
               className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-primary cursor-pointer"
               value={filterPayment}
               onChange={e => setFilterPayment(e.target.value as any)}
            >
               <option value="all">Любая оплата</option>
               <option value="paid">Оплачено (Карта)</option>
               <option value="unpaid">Наличные</option>
            </select>

            {/* ADD ORDER BUTTON */}
            <button 
               onClick={() => alert('Функционал создания заказа в разработке')}
               className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform whitespace-nowrap flex items-center gap-2"
            >
               <Icon icon="solar:bag-plus-bold" />
               Добавить заказ
            </button>

            <div className="w-px h-10 bg-slate-200 mx-2 hidden xl:block"></div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
               <button 
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <Icon icon="solar:kanban-bold" />
                  <span className="hidden sm:inline">Доска</span>
               </button>
               <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <Icon icon="solar:list-bold" />
                  <span className="hidden sm:inline">Список</span>
               </button>
            </div>
         </div>
      </div>

      {/* 2. Content Area */}
      {viewMode === 'board' ? (
         <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max h-full">
               {COLUMNS.map(col => {
                  const colOrders = filteredOrders.filter(o => o.status === col.id);
                  return (
                     <div key={col.id} className="w-80 flex flex-col h-full">
                        {/* Column Header */}
                        <div className={`p-3 rounded-t-xl border-x border-t border-slate-200 ${col.bg} flex justify-between items-center sticky top-0 z-10 shadow-sm`}>
                           <div className="flex items-center gap-2">
                              <Icon icon={col.icon} className={`size-5 ${col.color}`} />
                              <span className={`font-bold text-sm uppercase ${col.color}`}>{col.label}</span>
                           </div>
                           <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-bold text-slate-700 shadow-sm">{colOrders.length}</span>
                        </div>
                        
                        {/* Column Body */}
                        <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-xl p-3 flex-1 overflow-y-auto space-y-3 scrollbar-hide">
                           {colOrders.map(order => (
                              <OrderCard key={order.id} order={order} onSelect={setSelectedOrder} />
                           ))}
                           {colOrders.length === 0 && (
                              <div className="text-center py-10 text-slate-400 text-xs font-medium dashed-border flex flex-col items-center gap-2 opacity-50">
                                 <Icon icon="solar:box-minimalistic-linear" className="size-8" />
                                 Нет заказов
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      ) : (
         <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="overflow-auto scrollbar-hide">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold sticky top-0 z-10">
                     <tr>
                        <th className="p-4">ID Заказа</th>
                        <th className="p-4">Дата / Статус</th>
                        <th className="p-4">Клиент</th>
                        <th className="p-4">Товары</th>
                        <th className="p-4">Финансы</th>
                        <th className="p-4">Этап</th>
                        <th className="p-4 text-right">Действия</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredOrders.map(order => (
                        <OrderRow key={order.id} order={order} onSelect={setSelectedOrder} />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* 3. Detailed Modal (Invoice Style) */}
      {selectedOrder && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
               
               {/* Modal Header */}
               <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                  <div className="flex gap-4">
                     <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Icon icon="solar:bag-check-bold" className="size-8" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h2 className="text-2xl font-bold text-slate-900">Заказ {selectedOrder.id}</h2>
                           <StatusBadge status={selectedOrder.status} />
                        </div>
                        <div className="text-sm text-slate-500 flex gap-3 items-center">
                           <Icon icon="solar:calendar-date-bold" className="size-4" />
                           <span>{selectedOrder.date}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <Icon icon="solar:clock-circle-bold" className="size-4" />
                           <span>14:30</span> (Создан)
                        </div>
                     </div>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                     <Icon icon="solar:close-circle-bold" className="size-8" />
                  </button>
               </div>

               {/* Modal Body */}
               <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     
                     {/* Left Column: Items */}
                     <div className="lg:col-span-2 space-y-6">
                        {/* Items List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                           <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                              <h4 className="font-bold text-slate-800">Состав заказа</h4>
                              <span className="text-xs font-bold text-slate-400">{selectedOrder.items.length} позиций</span>
                           </div>
                           <div className="divide-y divide-slate-50">
                              {selectedOrder.items.map((item, i) => (
                                 <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                    <div className="size-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                       <img src={item.images[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <div className="font-bold text-slate-900 text-sm truncate">{item.name}</div>
                                       <div className="text-xs text-slate-500 mt-1 flex gap-2">
                                          <span className="bg-slate-100 px-2 py-0.5 rounded">Размер: {item.selectedSize}</span>
                                          <span className="bg-slate-100 px-2 py-0.5 rounded">Цвет: {item.selectedColor}</span>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="font-bold text-slate-900">{item.price} с.</div>
                                       <div className="text-xs text-slate-400">x{item.quantity}</div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="p-4 bg-slate-50 flex justify-between items-center border-t border-slate-100">
                              <div className="text-sm font-medium text-slate-500">Итого товаров:</div>
                              <div className="font-bold text-slate-900">{selectedOrder.total} с.</div>
                           </div>
                        </div>

                        {/* Timeline (Mock) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                           <h4 className="font-bold text-slate-800 mb-4">История заказа</h4>
                           <div className="space-y-6 pl-2">
                              <div className="flex gap-4 relative">
                                 <div className="absolute top-0 left-[7px] bottom-[-24px] w-0.5 bg-slate-200"></div>
                                 <div className="size-4 rounded-full bg-green-500 ring-4 ring-green-100 z-10 relative"></div>
                                 <div>
                                    <div className="text-sm font-bold text-slate-900">Заказ создан</div>
                                    <div className="text-xs text-slate-500">Сегодня, 14:30 • Клиент (App)</div>
                                 </div>
                              </div>
                              <div className="flex gap-4 relative">
                                 <div className="size-4 rounded-full bg-blue-500 ring-4 ring-blue-100 z-10 relative"></div>
                                 <div>
                                    <div className="text-sm font-bold text-slate-900">Назначен на сборку</div>
                                    <div className="text-xs text-slate-500">Сегодня, 14:35 • Система</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Right Column: Customer & Actions */}
                     <div className="space-y-6">
                        {/* Customer Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-2 opacity-10">
                              <Icon icon="solar:user-bold" className="size-24 text-primary" />
                           </div>
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Клиент</h4>
                           <div className="flex items-center gap-3 mb-4">
                              <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                                 {selectedOrder.customerName?.[0]}
                              </div>
                              <div>
                                 <div className="font-bold text-slate-900">{selectedOrder.customerName}</div>
                                 <div className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded w-fit mt-1">Постоянный клиент</div>
                              </div>
                           </div>
                           <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-2 rounded-lg">
                                 <Icon icon="solar:phone-bold" className="text-slate-400" />
                                 {selectedOrder.customerPhone}
                              </div>
                              <div className="flex items-start gap-3 text-slate-600 bg-slate-50 p-2 rounded-lg">
                                 <Icon icon="solar:map-point-bold" className="text-slate-400 mt-0.5" />
                                 <span className="line-clamp-2">{selectedOrder.address || 'Самовывоз'}</span>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2 mt-4">
                              <button className="py-2 bg-green-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-600">
                                 <Icon icon="logos:whatsapp-icon" /> WhatsApp
                              </button>
                              <button className="py-2 bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600">
                                 <Icon icon="solar:phone-calling-bold" /> Позвонить
                              </button>
                           </div>
                        </div>

                        {/* Logistics Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Логистика</h4>
                           <div className="space-y-4">
                              <div>
                                 <label className="text-xs font-bold text-slate-500 block mb-1">Курьер</label>
                                 <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none">
                                    <option value="">Не назначен</option>
                                    <option value="daler" selected={!!selectedOrder.courierId}>Далер Валиев (На линии)</option>
                                    <option value="amir">Амир Т.</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="text-xs font-bold text-slate-500 block mb-1">Код подтверждения</label>
                                 <div className="flex items-center gap-2">
                                    <div className="flex-1 p-2 bg-slate-100 rounded-lg font-mono font-bold text-center tracking-widest text-slate-800">
                                       {selectedOrder.verificationCode || '----'}
                                    </div>
                                    <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-500" title="Скопировать">
                                       <Icon icon="solar:copy-bold" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Payment Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Оплата</h4>
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-slate-700">К оплате</span>
                              <span className="font-black text-xl text-primary">{selectedOrder.total} с.</span>
                           </div>
                           <div className={`p-2 rounded-lg text-center text-xs font-bold uppercase border ${
                              selectedOrder.paymentMethod === 'card' 
                              ? 'bg-green-50 text-green-700 border-green-100' 
                              : 'bg-orange-50 text-orange-700 border-orange-100'
                           }`}>
                              {selectedOrder.paymentMethod === 'card' ? 'Оплачено (Карта)' : 'Оплата при получении'}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                  <div className="flex gap-2">
                     <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 flex items-center gap-2">
                        <Icon icon="solar:printer-bold" /> Печать накладной
                     </button>
                     <button className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100">
                        Отменить
                     </button>
                  </div>
                  {selectedOrder.status !== 'delivered' && (
                     <button 
                        onClick={() => {
                           onUpdateStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                           setSelectedOrder(null);
                        }}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                     >
                        Следующий этап <Icon icon="solar:arrow-right-bold" />
                     </button>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

const getNextStatus = (current: Order['status']): Order['status'] => {
   const flow: Order['status'][] = ['new', 'processing', 'ready_to_ship', 'shipped', 'delivered'];
   const idx = flow.indexOf(current);
   return idx < flow.length - 1 ? flow[idx + 1] : current;
};
