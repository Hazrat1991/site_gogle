
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Order, CartItem } from '../../types';
import { MOCK_EMPLOYEES_EXTENDED } from '../../constants';

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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
   const config = COLUMNS.find(c => c.id === status) || COLUMNS[0];
   return (
      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${config.bg} ${config.color} border-transparent`}>
         {config.label}
      </span>
   );
};

const TimelineItem: React.FC<{ active: boolean, title: string, date: string, subtext: string, isLast?: boolean, icon?: string }> = ({ active, title, date, subtext, isLast, icon }) => (
   <div className="relative pl-8 pb-8 last:pb-0">
      {/* Line */}
      {!isLast && (
         <div className={`absolute left-[11px] top-3 bottom-0 w-0.5 ${active ? 'bg-slate-300' : 'bg-slate-100'}`}></div>
      )}
      {/* Dot */}
      <div className={`absolute left-0 top-1 size-6 rounded-full border-2 flex items-center justify-center ${active ? 'border-green-500 bg-white text-green-600' : 'border-slate-200 bg-slate-50 text-slate-300'}`}>
         {icon ? <Icon icon={icon} className="size-3" /> : (active && <div className="size-2 bg-green-500 rounded-full"></div>)}
      </div>
      
      <div>
         <div className={`text-sm font-bold ${active ? 'text-slate-800' : 'text-slate-400'}`}>{title}</div>
         <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span className="font-mono">{date}</span>
            <span>•</span>
            <span>{subtext}</span>
         </div>
      </div>
   </div>
);

const SLABadge: React.FC<{ status: string, date: string }> = ({ status, date }) => {
   if (status !== 'new' && status !== 'processing') return null;
   
   const orderDate = new Date(date);
   const today = new Date();
   const isLate = orderDate.getDate() !== today.getDate(); 
   
   if (isLate) {
      return (
         <div className="flex items-center gap-1 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse border border-red-200">
            <Icon icon="solar:alarm-bold" />
            Просрочен
         </div>
      );
   }
   return (
      <div className="flex items-center gap-1 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-green-200">
         <Icon icon="solar:clock-circle-bold" />
         В норме
      </div>
   );
};

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
   const colors: Record<string, string> = {
      vip: 'bg-purple-100 text-purple-700 border-purple-200',
      urgent: 'bg-red-100 text-red-700 border-red-200',
      gift: 'bg-pink-100 text-pink-700 border-pink-200',
      new: 'bg-blue-100 text-blue-700 border-blue-200'
   };
   const style = colors[tag] || 'bg-slate-100 text-slate-600 border-slate-200';
   return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${style}`}>
         {tag}
      </span>
   );
};

const OrderCard: React.FC<{ 
   order: Order, 
   onSelect: (o: Order) => void,
   isSelected: boolean,
   onToggleSelect: (id: string) => void,
   onDragStart: (e: React.DragEvent, id: string) => void
}> = ({ order, onSelect, isSelected, onToggleSelect, onDragStart }) => {
   
   return (
      <div 
        draggable
        onDragStart={(e) => onDragStart(e, order.id)}
        onClick={() => onSelect(order)}
        className={`bg-white p-3 rounded-xl shadow-sm border cursor-pointer group hover:shadow-md transition-all relative overflow-hidden ${isSelected ? 'border-primary ring-1 ring-primary' : 'border-slate-200 hover:-translate-y-1'}`}
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
               <div className="flex items-center gap-2">
                  <input 
                     type="checkbox" 
                     checked={isSelected}
                     onClick={(e) => { e.stopPropagation(); onToggleSelect(order.id); }}
                     className="size-4 accent-primary rounded cursor-pointer"
                  />
                  <div className="flex flex-col">
                     <div className="font-bold text-slate-800 text-sm hover:text-primary transition-colors">
                        {order.id}
                     </div>
                     <div className="text-[10px] text-slate-400">{order.date}</div>
                  </div>
               </div>
               <div className="flex flex-col items-end gap-1">
                  <SLABadge status={order.status} date={order.date} />
               </div>
            </div>

            {/* Tags Row */}
            {order.tags && order.tags.length > 0 && (
               <div className="flex flex-wrap gap-1 mb-2">
                  {order.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
               </div>
            )}

            {/* Customer Row */}
            <div className="flex items-center gap-2 mb-3 bg-slate-50 p-1.5 rounded-lg">
               <div className="size-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm shrink-0">
                  {order.customerName?.[0] || 'G'}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-700 truncate">{order.customerName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{order.address || 'Самовывоз'}</div>
               </div>
               <button 
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${order.customerPhone}`, '_blank') }}
                  className="size-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors shrink-0"
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

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ orders, onUpdateStatus }) => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Filters
  const [filterPayment, setFilterPayment] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week'>('all');
  const [filterCourier, setFilterCourier] = useState<string>('all');
  
  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Editing & Detail State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Order>>({});
  const [modalTab, setModalTab] = useState<'details' | 'chat' | 'history'>('details');
  const [chatMessage, setChatMessage] = useState('');

  // Sound Effect Simulation
  useEffect(() => {
     const newOrdersCount = orders.filter(o => o.status === 'new').length;
     if (newOrdersCount > 0) {
        // In real app: new Audio('/sound.mp3').play();
        // console.log('Ding! New order notification');
     }
  }, [orders]);

  // --- FILTERS LOGIC ---
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
          const isPaid = o.paymentMethod === 'card'; 
          return filterPayment === 'paid' ? isPaid : !isPaid;
       });
    }

    // Filter Date
    if (filterDate !== 'all') {
        const today = new Date().toDateString();
        res = res.filter(o => {
            const orderDate = new Date(o.date).toDateString();
            return orderDate === today; 
        });
    }

    // Filter Courier
    if (filterCourier !== 'all') {
        res = res.filter(o => o.courierId === filterCourier);
    }

    return res;
  }, [orders, searchQuery, filterPayment, filterDate, filterCourier]);

  // --- ANALYTICS WIDGETS LOGIC ---
  const analytics = useMemo(() => {
     const today = new Date().toLocaleDateString(); // Should match order date format approx
     // For demo we assume MOCK_ORDERS has varied dates, but we calculate based on 'all' for now or simple logic
     const delivered = orders.filter(o => o.status === 'delivered').length;
     const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'returned').length;
     const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
     
     return {
        count: orders.length,
        sales: totalSales,
        delivered,
        cancelled,
        avgTime: '45 мин' // Mock
     };
  }, [orders]);

  // --- HANDLERS ---

  const handleDragStart = (e: React.DragEvent, id: string) => {
     e.dataTransfer.setData("orderId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
     e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Order['status']) => {
     const id = e.dataTransfer.getData("orderId");
     if (id) {
        onUpdateStatus(id, status);
     }
  };

  const toggleSelectOrder = (id: string) => {
     setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = (action: string) => {
     if (action === 'print') {
        alert(`Печать накладных для ${selectedIds.length} заказов`);
     } else if (action === 'status_shipped') {
        selectedIds.forEach(id => onUpdateStatus(id, 'shipped'));
        setSelectedIds([]);
     }
  };

  // --- EDIT ORDER LOGIC ---
  const openEditOrder = (order: Order) => {
     setSelectedOrder(order);
     setEditForm(JSON.parse(JSON.stringify(order))); // Deep copy
     setIsEditing(false);
     setModalTab('details');
  };

  const toggleEditMode = () => {
     if (isEditing) {
        // Save logic would go here in real app
        setIsEditing(false);
        alert('Изменения сохранены (демо)');
     } else {
        setEditForm(JSON.parse(JSON.stringify(selectedOrder)));
        setIsEditing(true);
     }
  };

  const updateEditFormItem = (index: number, field: keyof CartItem, value: any) => {
     if (!editForm.items) return;
     const newItems = [...editForm.items];
     newItems[index] = { ...newItems[index], [field]: value };
     setEditForm({ ...editForm, items: newItems });
  };

  const handleSendNote = () => {
     if (!chatMessage.trim() || !selectedOrder) return;
     const newNote = { author: 'Вы', text: chatMessage, date: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) };
     const updatedOrder = { 
        ...selectedOrder, 
        managerNotes: [newNote, ...(selectedOrder.managerNotes || [])] 
     };
     setSelectedOrder(updatedOrder);
     setChatMessage('');
  };

  const handleAddTag = () => {
     const tag = prompt('Введите тег (vip, urgent, gift, new):');
     if (tag && selectedOrder) {
        const updatedOrder = { ...selectedOrder, tags: [...(selectedOrder.tags || []), tag] };
        setSelectedOrder(updatedOrder);
     }
  };

  const handleAssignCourier = (courierId: string) => {
     if (selectedOrder) {
        alert(`Курьер назначен! Push-уведомление отправлено.`);
        // In real app, update order via callback
        setSelectedOrder({...selectedOrder, courierId: courierId, status: 'ready_to_ship'});
     }
  };

  const handleMarkPaid = () => {
     if (selectedOrder) {
        setSelectedOrder({...selectedOrder, paymentMethod: 'card'});
     }
  }

  // Profit Calculation
  const profit = selectedOrder ? selectedOrder.items.reduce((acc, item) => {
     const cost = item.buyPrice || (item.price * 0.6); // Fallback cost
     return acc + (item.price - cost) * item.quantity;
  }, 0) : 0;

  const couriers = MOCK_EMPLOYEES_EXTENDED.filter(e => e.role === 'courier');

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
      {/* 1. Analytics Widgets (Top Bar) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Icon icon="solar:bag-check-bold" /></div>
            <div><div className="text-xs text-slate-400 uppercase font-bold">Сегодня</div><div className="font-black text-slate-800">{analytics.count}</div></div>
         </div>
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Icon icon="solar:wallet-money-bold" /></div>
            <div><div className="text-xs text-slate-400 uppercase font-bold">Продажи</div><div className="font-black text-slate-800">{analytics.sales.toLocaleString()} c.</div></div>
         </div>
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Icon icon="solar:box-check-bold" /></div>
            <div><div className="text-xs text-slate-400 uppercase font-bold">Доставлено</div><div className="font-black text-slate-800">{analytics.delivered}</div></div>
         </div>
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><Icon icon="solar:close-circle-bold" /></div>
            <div><div className="text-xs text-slate-400 uppercase font-bold">Отменено</div><div className="font-black text-slate-800">{analytics.cancelled}</div></div>
         </div>
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="size-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><Icon icon="solar:clock-circle-bold" /></div>
            <div><div className="text-xs text-slate-400 uppercase font-bold">Время</div><div className="font-black text-slate-800">{analytics.avgTime}</div></div>
         </div>
      </div>

      {/* 2. Toolbar & Filters */}
      <div className="mb-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
         {/* Search */}
         <div className="relative w-full xl:w-80 group">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
               type="text" 
               placeholder="Поиск по ID, клиенту..." 
               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
            />
         </div>
         
         {/* Filters & Actions */}
         <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scrollbar-hide items-center">
            <select className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none" value={filterDate} onChange={e => setFilterDate(e.target.value as any)}>
               <option value="all">Все даты</option>
               <option value="today">Сегодня</option>
               <option value="week">Неделя</option>
            </select>
            
            <select className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none" value={filterPayment} onChange={e => setFilterPayment(e.target.value as any)}>
               <option value="all">Оплата</option>
               <option value="paid">Карта</option>
               <option value="unpaid">Наличные</option>
            </select>

            <select className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none" value={filterCourier} onChange={e => setFilterCourier(e.target.value as any)}>
               <option value="all">Курьеры</option>
               {couriers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>

            <button 
               onClick={() => alert('Функционал создания заказа в разработке')}
               className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform whitespace-nowrap flex items-center gap-2"
            >
               <Icon icon="solar:bag-plus-bold" />
               Создать
            </button>

            <div className="w-px h-10 bg-slate-200 mx-2 hidden xl:block"></div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
               <button onClick={() => setViewMode('board')} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Icon icon="solar:kanban-bold" />
               </button>
               <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Icon icon="solar:list-bold" />
               </button>
            </div>
         </div>
      </div>

      {/* 3. Content Area */}
      {viewMode === 'board' ? (
         <div className="flex-1 overflow-x-auto pb-24">
            <div className="flex gap-4 min-w-max h-full">
               {COLUMNS.map(col => {
                  const colOrders = filteredOrders.filter(o => o.status === col.id);
                  const colTotal = colOrders.reduce((sum, o) => sum + o.total, 0);

                  return (
                     <div 
                        key={col.id} 
                        className="w-80 flex flex-col h-full"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                     >
                        {/* Column Header */}
                        <div className={`p-3 rounded-t-xl border-x border-t border-slate-200 ${col.bg} flex flex-col sticky top-0 z-10 shadow-sm`}>
                           <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                 <Icon icon={col.icon} className={`size-5 ${col.color}`} />
                                 <span className={`font-bold text-sm uppercase ${col.color}`}>{col.label}</span>
                              </div>
                              <span className="bg-white/60 px-2 py-0.5 rounded text-xs font-bold text-slate-700 shadow-sm">{colOrders.length}</span>
                           </div>
                           <div className={`text-xs font-bold ${col.color} opacity-70 text-right`}>
                              {colTotal.toLocaleString()} с.
                           </div>
                        </div>
                        
                        {/* Column Body */}
                        <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-xl p-3 flex-1 overflow-y-auto space-y-3 scrollbar-hide min-h-[200px]">
                           {colOrders.map(order => (
                              <OrderCard 
                                 key={order.id} 
                                 order={order} 
                                 onSelect={openEditOrder} 
                                 isSelected={selectedIds.includes(order.id)}
                                 onToggleSelect={toggleSelectOrder}
                                 onDragStart={handleDragStart}
                              />
                           ))}
                           {colOrders.length === 0 && (
                              <div className="text-center py-10 text-slate-400 text-xs font-medium dashed-border flex flex-col items-center gap-2 opacity-50">
                                 <Icon icon="solar:box-minimalistic-linear" className="size-8" />
                                 Перетащите сюда
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      ) : (
         <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col pb-20">
            <div className="overflow-auto scrollbar-hide">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold sticky top-0 z-10">
                     <tr>
                        <th className="p-4 w-10"><input type="checkbox" className="size-4" /></th>
                        <th className="p-4">ID Заказа</th>
                        <th className="p-4">Дата / Статус</th>
                        <th className="p-4">Клиент</th>
                        <th className="p-4">Товары</th>
                        <th className="p-4">Финансы</th>
                        <th className="p-4">Курьер</th>
                        <th className="p-4">Этап</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => openEditOrder(order)}>
                           <td className="p-4" onClick={e => e.stopPropagation()}>
                              <input 
                                 type="checkbox" 
                                 checked={selectedIds.includes(order.id)}
                                 onChange={() => toggleSelectOrder(order.id)}
                                 className="size-4 accent-primary"
                              />
                           </td>
                           <td className="p-4 font-mono text-xs font-bold">{order.id}</td>
                           <td className="p-4 text-xs">{order.date}</td>
                           <td className="p-4 text-sm font-bold">{order.customerName}</td>
                           <td className="p-4 text-xs text-slate-500">{order.items.length} поз.</td>
                           <td className="p-4 font-bold">{order.total} с.</td>
                           <td className="p-4 text-xs">{order.courierId ? couriers.find(c => c.id === order.courierId)?.fullName : '-'}</td>
                           <td className="p-4"><StatusBadge status={order.status} /></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2 px-4 rounded-2xl shadow-2xl flex items-center gap-4 z-40 animate-fade-in border border-slate-700">
            <span className="font-bold text-sm px-2">Выбрано: {selectedIds.length}</span>
            <div className="h-6 w-px bg-slate-700"></div>
            <button onClick={() => handleBulkAction('print')} className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors px-2">
               <Icon icon="solar:printer-bold" /> Печать
            </button>
            <button onClick={() => handleBulkAction('status_shipped')} className="flex items-center gap-2 text-sm font-bold hover:text-green-400 transition-colors px-2">
               <Icon icon="solar:box-bold" /> Отправить все
            </button>
            <button onClick={() => setSelectedIds([])} className="bg-white/20 rounded-full p-1 hover:bg-white/30">
               <Icon icon="solar:close-circle-bold" />
            </button>
         </div>
      )}

      {/* 3. Detailed Modal (With Tabs & CRM Features) */}
      {selectedOrder && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
               
               {/* Modal Header */}
               <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="size-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <Icon icon="solar:bag-check-bold" className="size-6" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h2 className="text-xl font-black text-slate-900">Заказ {selectedOrder.id}</h2>
                           <StatusBadge status={selectedOrder.status} />
                        </div>
                        <div className="text-sm text-slate-500 flex gap-3 items-center font-medium">
                           <span className="flex items-center gap-1"><Icon icon="solar:calendar-date-bold" /> {selectedOrder.date}</span>
                           <span>•</span>
                           <span className="flex items-center gap-1"><Icon icon="solar:clock-circle-bold" /> 14:30</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={toggleEditMode} className={`p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-all ${isEditing ? 'bg-primary/10 text-primary' : ''}`}>
                        <Icon icon="solar:pen-bold" className="size-5" />
                     </button>
                     <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all">
                        <Icon icon="solar:close-circle-bold" className="size-5" />
                     </button>
                  </div>
               </div>

               {/* Tabs */}
               <div className="px-6 flex gap-6 border-b border-slate-100 bg-white shrink-0">
                  <button 
                     onClick={() => setModalTab('details')} 
                     className={`py-3 text-sm font-bold border-b-2 transition-colors ${modalTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
                  >
                     Детали заказа
                  </button>
                  <button 
                     onClick={() => setModalTab('chat')} 
                     className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${modalTab === 'chat' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
                  >
                     Чат команды 
                     <span className="bg-slate-100 px-1.5 rounded-md text-[10px] text-slate-600">{selectedOrder.managerNotes?.length || 0}</span>
                  </button>
                  <button 
                     onClick={() => setModalTab('history')} 
                     className={`py-3 text-sm font-bold border-b-2 transition-colors ${modalTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
                  >
                     История
                  </button>
               </div>

               {/* Modal Body */}
               <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                  
                  {/* DETAILS TAB */}
                  {modalTab === 'details' && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Items */}
                        <div className="lg:col-span-2 space-y-6">
                           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                              <div className="flex justify-between items-center mb-4">
                                 <h4 className="font-bold text-slate-800">Состав заказа</h4>
                                 <span className="text-xs font-bold text-slate-400">{selectedOrder.items.length} позиций</span>
                              </div>
                              
                              <div className="space-y-4 mb-4">
                                 {(isEditing ? editForm.items : selectedOrder.items)?.map((item, i) => (
                                    <div key={i} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                       <div className="size-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                          <img src={item.images[0]} className="w-full h-full object-cover" />
                                       </div>
                                       <div className="flex-1 min-w-0 py-1">
                                          <div className="font-bold text-slate-900 text-sm mb-1">{item.name}</div>
                                          <div className="flex gap-2 text-xs font-medium text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-lg">
                                             <span>Размер: {item.selectedSize}</span>
                                             <span className="w-px h-3 bg-slate-300"></span>
                                             <span>Цвет: {item.selectedColor}</span>
                                          </div>
                                       </div>
                                       <div className="text-right py-1">
                                          <div className="font-bold text-slate-900">{item.price} с.</div>
                                          {isEditing ? (
                                             <div className="flex items-center gap-2 mt-1 justify-end">
                                                <button onClick={() => updateEditFormItem(i, 'quantity', Math.max(1, item.quantity - 1))} className="size-5 bg-slate-100 rounded flex items-center justify-center">-</button>
                                                <span className="text-xs font-bold">{item.quantity}</span>
                                                <button onClick={() => updateEditFormItem(i, 'quantity', item.quantity + 1)} className="size-5 bg-slate-100 rounded flex items-center justify-center">+</button>
                                             </div>
                                          ) : (
                                             <div className="text-xs text-slate-400 font-medium">x{item.quantity}</div>
                                          )}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                              
                              <div className="pt-4 border-t border-slate-100 space-y-2">
                                 {selectedOrder.referralCodeUsed && (
                                    <div className="flex justify-between items-center text-green-600">
                                       <span className="text-sm font-medium">Скидка (Промокод {selectedOrder.referralCodeUsed}):</span>
                                       <span className="font-bold">- 50 с.</span>
                                    </div>
                                 )}
                                 <div className="flex justify-between items-center">
                                    <span className="text-slate-500 text-sm font-medium">Итого к оплате:</span>
                                    <span className="font-bold text-xl text-slate-900">{selectedOrder.total} с.</span>
                                 </div>
                              </div>
                           </div>

                           {/* Tags Management */}
                           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-4">
                              <span className="text-xs font-bold text-slate-400 uppercase">Теги:</span>
                              <div className="flex flex-wrap gap-2">
                                 {selectedOrder.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
                                 <button onClick={handleAddTag} className="px-2 py-0.5 border border-dashed border-slate-300 rounded text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary">+ Тег</button>
                              </div>
                           </div>
                        </div>

                        {/* Right Column: Client, Logistics, Payment */}
                        <div className="space-y-4">
                           {/* Client Card */}
                           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                              <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Клиент</h4>
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                    {selectedOrder.customerName?.[0] || 'C'}
                                 </div>
                                 <div>
                                    {isEditing ? (
                                       <input className="font-bold text-slate-900 border-b border-slate-300 w-full outline-none text-sm" value={editForm.customerName} onChange={e => setEditForm({...editForm, customerName: e.target.value})} />
                                    ) : (
                                       <div className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</div>
                                    )}
                                    <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mt-0.5">Постоянный клиент</div>
                                 </div>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-3 space-y-2 mb-4">
                                 <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <Icon icon="solar:phone-bold" className="text-slate-400 size-4" />
                                    {isEditing ? <input className="bg-transparent w-full" value={editForm.customerPhone} onChange={e => setEditForm({...editForm, customerPhone: e.target.value})} /> : selectedOrder.customerPhone}
                                 </div>
                                 <div className="flex items-start gap-2 text-slate-600 text-sm">
                                    <Icon icon="solar:map-point-bold" className="text-slate-400 size-4 mt-0.5" />
                                    {isEditing ? <textarea className="bg-transparent w-full resize-none" rows={2} value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} /> : <span className="leading-snug">{selectedOrder.address}</span>}
                                 </div>
                                 
                                 {/* Maps Links */}
                                 {!isEditing && selectedOrder.address && (
                                    <div className="flex gap-2 pt-1">
                                       <a href={`https://yandex.ru/maps/?text=${selectedOrder.address}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1">
                                          <Icon icon="mdi:yandex" /> Яндекс
                                       </a>
                                       <a href={`https://www.google.com/maps/search/?api=1&query=${selectedOrder.address}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1">
                                          <Icon icon="logos:google-maps" /> Google
                                       </a>
                                    </div>
                                 )}
                              </div>
                              {!isEditing && (
                                 <div className="grid grid-cols-3 gap-2">
                                    <button className="py-2.5 bg-green-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-sm">
                                       <Icon icon="logos:whatsapp-icon" />
                                    </button>
                                    <button className="py-2.5 bg-blue-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-sm">
                                       <Icon icon="logos:telegram" />
                                    </button>
                                    <button className="py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                                       <Icon icon="solar:phone-calling-bold" />
                                    </button>
                                 </div>
                              )}
                           </div>

                           {/* Logistics Card */}
                           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                              <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Логистика</h4>
                              <div className="mb-4">
                                 <div className="text-xs font-bold text-slate-500 mb-1">Курьер</div>
                                 <div className="relative">
                                    <select 
                                       className="w-full p-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-700 outline-none appearance-none"
                                       value={selectedOrder.courierId || ''}
                                       onChange={(e) => handleAssignCourier(e.target.value)}
                                    >
                                       <option value="">Не назначен</option>
                                       {couriers.map(c => (
                                          <option key={c.id} value={c.id}>
                                             {c.fullName} (Активных: {orders.filter(o => o.courierId === c.id && o.status !== 'delivered').length})
                                          </option>
                                       ))}
                                    </select>
                                    <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                                 </div>
                              </div>
                              <div>
                                 <div className="text-xs font-bold text-slate-500 mb-1">Код подтверждения</div>
                                 <div className="flex gap-2">
                                    <div className="flex-1 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center font-mono font-bold text-lg tracking-widest text-slate-800">
                                       {selectedOrder.verificationCode || '4590'}
                                    </div>
                                    <button className="size-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200">
                                       <Icon icon="solar:copy-bold" />
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* Payment & Profit Card */}
                           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                              <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Финансы</h4>
                              <div className="flex justify-between items-end mb-2">
                                 <span className="text-sm font-bold text-slate-700">К оплате</span>
                                 <span className="text-xl font-black text-orange-500">{selectedOrder.total} с.</span>
                              </div>
                              <div className="flex justify-between items-center mb-4 pt-2 border-t border-dashed border-slate-200">
                                 <span className="text-xs font-bold text-slate-400">Прибыль (маржа)</span>
                                 <span className="text-sm font-bold text-green-600">+{profit.toLocaleString()} с.</span>
                              </div>
                              
                              {selectedOrder.paymentMethod === 'cash' ? (
                                 <button 
                                    onClick={handleMarkPaid}
                                    className="w-full py-2 bg-orange-50 text-orange-700 text-xs font-bold uppercase text-center rounded-lg tracking-wide border border-orange-100 hover:bg-orange-100 transition-colors"
                                 >
                                    Пометить как оплачено
                                 </button>
                              ) : (
                                 <div className="w-full py-2 bg-green-50 text-green-700 text-xs font-bold uppercase text-center rounded-lg tracking-wide border border-green-100 flex items-center justify-center gap-2">
                                    <Icon icon="solar:check-circle-bold" /> Оплачено картой
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* CHAT TAB */}
                  {modalTab === 'chat' && (
                     <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                           {(!selectedOrder.managerNotes || selectedOrder.managerNotes.length === 0) && (
                              <div className="text-center text-slate-400 text-sm py-10">Нет заметок. Напишите что-нибудь команде.</div>
                           )}
                           {selectedOrder.managerNotes?.map((note, i) => (
                              <div key={i} className={`flex flex-col ${note.author === 'Вы' ? 'items-end' : 'items-start'}`}>
                                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${note.author === 'Вы' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                                    <div className={`text-[10px] font-bold mb-1 opacity-70 ${note.author === 'Вы' ? 'text-white' : 'text-slate-500'}`}>{note.author}</div>
                                    {note.text}
                                 </div>
                                 <div className="text-[10px] text-slate-400 mt-1 px-1">{note.date}</div>
                              </div>
                           ))}
                        </div>
                        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                           <input 
                              type="text" 
                              placeholder="Внутренняя заметка..." 
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                              value={chatMessage}
                              onChange={e => setChatMessage(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendNote()}
                           />
                           <button onClick={handleSendNote} className="size-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90">
                              <Icon icon="solar:plain-bold" />
                           </button>
                        </div>
                     </div>
                  )}

                  {/* HISTORY TAB */}
                  {modalTab === 'history' && (
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h4 className="font-bold text-slate-800 mb-6">Полная хронология</h4>
                        <div className="ml-2">
                           {selectedOrder.history ? selectedOrder.history.map((event, i) => (
                              <TimelineItem 
                                 key={i}
                                 active={i === 0} // First one is latest
                                 title={event.description} 
                                 date={event.date} 
                                 subtext={event.status} 
                                 icon={event.icon}
                                 isLast={i === selectedOrder.history!.length - 1}
                              />
                           )) : (
                              <>
                                 <TimelineItem active title="Заказ создан" date="Сегодня, 14:30" subtext="Клиент (App)" />
                                 <TimelineItem active title="Назначен на сборку" date="Сегодня, 14:35" subtext="Система" />
                                 <TimelineItem active={false} title="Ожидает курьера" date="-" subtext="Склад" isLast />
                              </>
                           )}
                        </div>
                     </div>
                  )}
               </div>

               {/* Modal Footer */}
               <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center gap-4 shrink-0">
                  <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                     <Icon icon="solar:printer-bold" /> Печать накладной
                  </button>
                  <div className="flex gap-2">
                     {selectedOrder.status === 'new' && (
                        <button 
                           onClick={() => { onUpdateStatus(selectedOrder.id, 'processing'); setSelectedOrder(null); }}
                           className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                           <Icon icon="solar:check-circle-bold" /> Принять заказ
                        </button>
                     )}
                     <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                        Отменить
                     </button>
                     {!isEditing && modalTab === 'details' && selectedOrder.status !== 'new' && (
                        <button 
                           onClick={() => {
                              // Simply move to next standard stage based on current
                              const nextStage = selectedOrder.status === 'processing' ? 'ready_to_ship' : selectedOrder.status === 'ready_to_ship' ? 'shipped' : 'delivered';
                              onUpdateStatus(selectedOrder.id, nextStage); 
                              setSelectedOrder(null);
                           }}
                           className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                        >
                           Следующий этап <Icon icon="solar:arrow-right-bold" />
                        </button>
                     )}
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
