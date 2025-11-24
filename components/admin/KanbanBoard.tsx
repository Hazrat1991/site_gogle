
import React from 'react';
import { Icon } from "@iconify/react";
import { Order } from '../../types';

interface KanbanBoardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const COLUMNS: { id: Order['status'], label: string, color: string }[] = [
  { id: 'new', label: 'Новые', color: 'bg-blue-100 text-blue-700' },
  { id: 'processing', label: 'В сборке', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'shipped', label: 'Доставка', color: 'bg-purple-100 text-purple-700' },
  { id: 'delivered', label: 'Вручено', color: 'bg-green-100 text-green-700' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ orders, onUpdateStatus }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)] min-w-[1000px]">
      {COLUMNS.map(col => {
         const colOrders = orders.filter(o => o.status === col.id);
         return (
            <div key={col.id} className="flex-1 bg-slate-100 rounded-2xl p-4 flex flex-col min-w-[280px]">
               <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold uppercase ${col.color}`}>
                     {col.label}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">{colOrders.length}</span>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
                  {colOrders.map(order => (
                     <div key={order.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-move group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <div className="font-bold text-slate-800 text-sm">{order.id}</div>
                              <div className="text-xs text-slate-500">{order.customerName || 'Гость'}</div>
                           </div>
                           <div className="font-bold text-primary text-sm">{order.total} с.</div>
                        </div>
                        <div className="text-xs text-slate-400 mb-3">
                           {order.items.length} товаров • {order.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
                        </div>
                        
                        {/* Move Actions */}
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                           {col.id !== 'new' && (
                              <button 
                                onClick={() => onUpdateStatus(order.id, getPrevStatus(col.id))}
                                className="flex-1 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                              >
                                 ← Назад
                              </button>
                           )}
                           {col.id !== 'delivered' && (
                              <button 
                                onClick={() => onUpdateStatus(order.id, getNextStatus(col.id))}
                                className="flex-1 py-1.5 bg-primary/10 rounded-lg text-xs font-bold text-primary hover:bg-primary/20"
                              >
                                 Вперед →
                              </button>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         );
      })}
    </div>
  );
};

const getNextStatus = (current: Order['status']): Order['status'] => {
   const flow: Order['status'][] = ['new', 'processing', 'shipped', 'delivered'];
   const idx = flow.indexOf(current);
   return idx < flow.length - 1 ? flow[idx + 1] : current;
};

const getPrevStatus = (current: Order['status']): Order['status'] => {
   const flow: Order['status'][] = ['new', 'processing', 'shipped', 'delivered'];
   const idx = flow.indexOf(current);
   return idx > 0 ? flow[idx - 1] : current;
};
