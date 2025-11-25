
import React, { useState, useMemo } from 'react';
import { Icon } from "@iconify/react";
import { Order, CartItem } from '../../types';

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

const TimelineItem = ({ active, title, date, subtext, isLast }: { active: boolean, title: string, date: string, subtext: string, isLast?: boolean }) => (
   <div className="relative pl-6 pb-6 last:pb-0">
      {/* Line */}
      {!isLast && (
         <div className={`absolute left-[7px] top-2 bottom-0 w-0.5 ${active ? 'bg-slate-300' : 'bg-slate-100'}`}></div>
      )}
      {/* Dot */}
      <div className={`absolute left-0 top-1.5 size-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-green-500 bg-white' : 'border-slate-200 bg-slate-50'}`}>
         {active && <div className="size-2 bg-green-500 rounded-full"></div>}
      </div>
      
      <div>
         <div className={`text-sm font-bold ${active ? 'text-slate-800' : 'text-slate-400'}`}>{title}</div>
         <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{date}</span>
            <span>•</span>
            <span>{subtext}</span>
         </div>
      </div>
   </div>
);

const SLABadge = ({ status, date }: { status: string, date: string }) => {
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
               <SLABadge status={order.status} date={order.date} />
            </div>

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
  
  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Order>>({});

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
            return orderDate === today; // Simplified logic for demo
        });
    }

    return res;
  }, [orders, searchQuery, filterPayment, filterDate]);

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

  const removeEditFormItem = (index: number) => {
     if (!editForm.items) return;
     const newItems = editForm.items.filter((_, i) => i !== index);
     setEditForm({ ...editForm, items: newItems });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
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
               <button 
                  onClick={() => setViewMode('board')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <Icon icon="solar:kanban-bold" />
               </button>
               <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <Icon icon="solar:list-bold" />
               </button>
            </div>
         </div>
      </div>

      {/* 2. Content Area */}
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

      {/* 3. Detailed Modal (With Reference Design) */}
      {selectedOrder && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
               
               {/* Modal Header */}
               <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
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
                           <span className="flex items-center gap-1"><Icon icon="solar:clock-circle-bold" /> 14:30 (Создан)</span>
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

               {/* Modal Body */}
               <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     
                     {/* Left Column: Items & Timeline */}
                     <div className="lg:col-span-2 space-y-6">
                        
                        {/* Items List */}
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
                           
                           <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                              <span className="text-slate-500 text-sm font-medium">Итого товаров:</span>
                              <span className="font-bold text-lg text-slate-900">{selectedOrder.total} с.</span>
                           </div>
                        </div>

                        {/* Order History Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                           <h4 className="font-bold text-slate-800 mb-6">История заказа</h4>
                           <div className="ml-2">
                              <TimelineItem active title="Заказ создан" date="Сегодня, 14:30" subtext="Клиент (App)" />
                              <TimelineItem active title="Назначен на сборку" date="Сегодня, 14:35" subtext="Система" />
                              <TimelineItem active={false} title="Передан курьеру" date="-" subtext="Ожидается" />
                              <TimelineItem active={false} title="Доставлен" date="-" subtext="" isLast />
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
                              <div className="ml-auto size-8 bg-orange-50 rounded-full flex items-center justify-center">
                                 <Icon icon="solar:user-id-bold" className="text-orange-400" />
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
                           </div>

                           {!isEditing && (
                              <div className="grid grid-cols-2 gap-2">
                                 <button className="py-2.5 bg-green-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-sm">
                                    <Icon icon="logos:whatsapp-icon" /> WhatsApp
                                 </button>
                                 <button className="py-2.5 bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm">
                                    <Icon icon="solar:phone-calling-bold" /> Позвонить
                                 </button>
                              </div>
                           )}
                        </div>

                        {/* Logistics Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Логистика</h4>
                           
                           <div className="mb-4">
                              <div className="text-xs font-bold text-slate-500 mb-1">Курьер</div>
                              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-700 flex justify-between items-center">
                                 {isEditing ? (
                                    <select className="bg-transparent w-full outline-none">
                                       <option>Не назначен</option>
                                       <option>Далер Валиев</option>
                                    </select>
                                 ) : (
                                    <span>{selectedOrder.courierId ? 'Далер Валиев' : 'Не назначен'}</span>
                                 )}
                                 <Icon icon="solar:alt-arrow-down-linear" className="text-slate-400" />
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

                        {/* Payment Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                           <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Оплата</h4>
                           <div className="flex justify-between items-end mb-2">
                              <span className="text-sm font-bold text-slate-700">К оплате</span>
                              <span className="text-xl font-black text-orange-500">{selectedOrder.total} с.</span>
                           </div>
                           <div className="w-full py-2 bg-orange-50 text-orange-700 text-xs font-bold uppercase text-center rounded-lg tracking-wide border border-orange-100">
                              {selectedOrder.paymentMethod === 'cash' ? 'Оплата при получении' : 'Оплачено картой'}
                           </div>
                        </div>

                     </div>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center gap-4">
                  <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                     <Icon icon="solar:printer-bold" /> Печать накладной
                  </button>
                  <div className="flex gap-2">
                     <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                        Отменить
                     </button>
                     {!isEditing && (
                        <button 
                           onClick={() => {
                              onUpdateStatus(selectedOrder.id, 'processing'); 
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
