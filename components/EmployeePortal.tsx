

import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { EmployeeExtended, Shift, StaffFinancialRecord, Order } from '../types';
import { MOCK_ORDERS } from '../constants';

interface EmployeePortalProps {
  onBack: () => void;
  employees: EmployeeExtended[];
  shifts: Shift[];
  onClockIn: (employeeId: string, location: string) => void;
  onClockOut: (employeeId: string) => void;
  financialRecords: StaffFinancialRecord[];
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  onBack, employees, shifts, onClockIn, onClockOut, financialRecords
}) => {
  const [currentUser, setCurrentUser] = useState<EmployeeExtended | null>(null);
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');
  
  // Mock Order State Management inside Employee Portal for demonstration
  const [localOrders, setLocalOrders] = useState<Order[]>(MOCK_ORDERS);

  // Find active shift for current user
  const activeShift = currentUser ? shifts.find(s => s.employeeId === currentUser.id && s.status === 'active') : null;

  const handleLogin = (e: React.FormEvent) => {
     e.preventDefault();
     const found = employees.find(emp => emp.loginCode === loginCode);
     if (found) {
        setCurrentUser(found);
        setError('');
        setLoginCode('');
     } else {
        setError('Неверный код доступа');
     }
  };

  // --- SUB-VIEWS BASED ON ROLE ---

  // 1. PICKER VIEW (Сборщик - Step 3)
  // Picks items from department -> Moves to Assembly Table
  const PickerView = () => {
     // Filter orders that have pending items for this user's department
     const myTasks = localOrders.filter(o => 
        o.status === 'new' && 
        o.items.some(i => i.departmentId === currentUser?.departmentId && i.pickedStatus !== 'picked')
     );

     const handlePickItem = (orderId: string, itemId: number) => {
        setLocalOrders(prev => prev.map(o => {
           if (o.id === orderId) {
              const updatedItems = o.items.map(i => {
                 if (i.id === itemId) return { ...i, pickedStatus: 'picked' as const };
                 return i;
              });
              // Check if all items in this order are picked, if so, it remains 'new' until Supervisor approves
              return { ...o, items: updatedItems };
           }
           return o;
        }));
     };

     return (
        <div className="space-y-4 animate-fade-in">
           <h3 className="font-bold text-lg text-slate-800 px-2">Задания на сборку</h3>
           {myTasks.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl text-center text-slate-400 shadow-sm">
                 <Icon icon="solar:check-circle-bold" className="size-16 mx-auto mb-2 text-green-200" />
                 <p>Все заказы в вашем отделе собраны!</p>
              </div>
           ) : (
              myTasks.map(order => {
                 const myItems = order.items.filter(i => i.departmentId === currentUser?.departmentId && i.pickedStatus !== 'picked');
                 if (myItems.length === 0) return null;

                 return (
                    <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                       <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
                          <div>
                             <div className="font-bold text-lg text-slate-800">Заказ {order.id}</div>
                             <div className="text-xs text-slate-500">Отнести на: <span className="font-bold text-primary text-sm">{order.tableId || 'Стол 1'}</span></div>
                          </div>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                             {myItems.length} шт.
                          </span>
                       </div>
                       <div className="space-y-3">
                          {myItems.map(item => (
                             <div key={item.id} className="flex items-center gap-3">
                                <div className="size-14 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                   <img src={item.images?.[0] || 'https://via.placeholder.com/60'} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="flex-1">
                                   <div className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</div>
                                   <div className="text-xs text-slate-500">{item.selectedSize} • {item.selectedColor}</div>
                                </div>
                                <button 
                                   onClick={() => handlePickItem(order.id, item.id)}
                                   className="size-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                                >
                                   <Icon icon="solar:check-read-bold" className="size-5" />
                                </button>
                             </div>
                          ))}
                       </div>
                    </div>
                 );
              })
           )}
        </div>
     );
  };

  // 2. SUPERVISOR VIEW (Старший смены - Step 4)
  // Checks Assembly Table -> Moves to Ready to Ship
  const SupervisorView = () => {
     const activeOrders = localOrders.filter(o => o.status === 'new' || o.status === 'processing');

     const handleApproveOrder = (orderId: string) => {
        setLocalOrders(prev => prev.map(o => 
           o.id === orderId ? { ...o, status: 'ready_to_ship' } : o
        ));
     };

     return (
        <div className="space-y-4 animate-fade-in">
           <h3 className="font-bold text-lg text-slate-800 px-2">Контроль столов сборки</h3>
           {activeOrders.length === 0 && (
              <div className="text-center text-slate-400 py-8">Нет активных заказов в сборке</div>
           )}
           {activeOrders.map(order => {
              const totalItems = order.items.length;
              const pickedItems = order.items.filter(i => i.pickedStatus === 'picked').length;
              const progress = totalItems > 0 ? Math.round((pickedItems / totalItems) * 100) : 0;
              const isReady = progress === 100;

              return (
                 <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                       <div className="font-bold text-lg">Заказ {order.id}</div>
                       <div className={`text-sm font-bold ${isReady ? 'text-green-600' : 'text-orange-500'}`}>
                          {progress}%
                       </div>
                    </div>
                    
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                       <div className={`h-full transition-all duration-500 ${isReady ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                       <span>Собрано: {pickedItems} из {totalItems}</span>
                       <span>{order.tableId || 'Стол 1'}</span>
                    </div>

                    {isReady && order.status !== 'ready_to_ship' && (
                       <button 
                          onClick={() => handleApproveOrder(order.id)}
                          className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                       >
                          <Icon icon="solar:box-check-bold" />
                          Готов к отгрузке
                       </button>
                    )}
                    {order.status === 'ready_to_ship' && (
                        <div className="bg-green-50 text-green-700 text-center py-2 rounded-xl font-bold text-sm border border-green-200">
                           Ожидает курьера
                        </div>
                    )}
                 </div>
              );
           })}
        </div>
     );
  };

  // 3. COURIER VIEW (Курьер - Steps 5 & 6)
  // Accepts "Ready to Ship" -> Delivers -> Verify
  const CourierView = () => {
     const myDeliveries = localOrders.filter(o => o.courierId === currentUser?.id || o.status === 'ready_to_ship');
     const [verifyCode, setVerifyCode] = useState('');
     const [verifyingOrderId, setVerifyingOrderId] = useState<string | null>(null);

     const handleAcceptOrder = (orderId: string) => {
        setLocalOrders(prev => prev.map(o => 
           o.id === orderId ? { ...o, status: 'shipped', courierId: currentUser?.id } : o
        ));
     };

     const handleVerifyDelivery = (orderId: string) => {
        const order = localOrders.find(o => o.id === orderId);
        if (order && order.verificationCode === verifyCode) {
           setLocalOrders(prev => prev.map(o => 
              o.id === orderId ? { ...o, status: 'delivered' } : o
           ));
           setVerifyingOrderId(null);
           setVerifyCode('');
           alert('Код принят! Заказ доставлен.');
        } else {
           alert('Неверный код!');
        }
     };

     const handlePhotoProof = (orderId: string) => {
        // Simulate photo upload
        setTimeout(() => {
           setLocalOrders(prev => prev.map(o => 
              o.id === orderId ? { ...o, status: 'delivered' } : o
           ));
           alert('Фото загружено! Заказ доставлен.');
        }, 1000);
     };

     return (
        <div className="space-y-4 animate-fade-in">
           <h3 className="font-bold text-lg text-slate-800 px-2">Мои доставки</h3>
           
           {/* Available Orders (Step 5: Dispatch) */}
           <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Доступные заказы (Готовы к отгрузке)</h4>
              {localOrders.filter(o => o.status === 'ready_to_ship' && !o.courierId).map(order => (
                 <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-2 flex justify-between items-center">
                    <div>
                       <div className="font-bold text-slate-800">{order.address}</div>
                       <div className="text-xs text-slate-500">Заказ {order.id} • {order.total} с.</div>
                    </div>
                    <button 
                       onClick={() => handleAcceptOrder(order.id)}
                       className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary/90"
                    >
                       Взять заказ
                    </button>
                 </div>
              ))}
              {localOrders.filter(o => o.status === 'ready_to_ship' && !o.courierId).length === 0 && (
                 <div className="text-center text-slate-400 text-sm py-4 bg-slate-100 rounded-xl border border-dashed border-slate-200">Нет новых заказов</div>
              )}
           </div>

           {/* Active Deliveries (Step 6: Delivery & Handover) */}
           <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">В пути</h4>
           {myDeliveries.filter(o => o.status === 'shipped').map(order => (
              <div key={order.id} className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100 relative">
                 <div className="absolute top-4 right-4 size-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Icon icon="solar:map-point-bold" />
                 </div>
                 <h3 className="font-bold text-xl text-slate-800 pr-10 mb-1">{order.address}</h3>
                 <div className="text-sm text-slate-500 mb-4">{order.customerName} • {order.customerPhone}</div>
                 
                 <div className="bg-slate-50 p-3 rounded-xl mb-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">К оплате:</span>
                    <span className="text-xl font-black text-slate-900">{order.paymentMethod === 'cash' ? `${order.total} с.` : 'Оплачено'}</span>
                 </div>

                 {/* Delivery Confirmation Options */}
                 <h5 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Подтверждение вручения</h5>
                 
                 {verifyingOrderId === order.id ? (
                    <div className="space-y-3 animate-fade-in">
                       <input 
                          type="text" 
                          placeholder="Код клиента (4 цифры)" 
                          className="w-full p-3 border-2 border-primary rounded-xl text-center text-lg font-bold tracking-widest outline-none"
                          maxLength={4}
                          value={verifyCode}
                          onChange={e => setVerifyCode(e.target.value)}
                       />
                       <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => handleVerifyDelivery(order.id)} className="py-3 bg-green-600 text-white rounded-xl font-bold">Подтвердить</button>
                          <button onClick={() => setVerifyingOrderId(null)} className="py-3 bg-slate-200 text-slate-600 rounded-xl font-bold">Отмена</button>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => setVerifyingOrderId(order.id)} className="py-3 bg-primary text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                              Ввести код (А)
                           </button>
                           <button onClick={() => handlePhotoProof(order.id)} className="py-3 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                              <Icon icon="solar:camera-bold" />
                              Фото (Б)
                           </button>
                        </div>
                        {order.clientConfirmed && (
                           <div className="w-full py-2 bg-green-100 text-green-700 rounded-xl text-center font-bold text-sm border border-green-200">
                              Клиент подтвердил получение! (В)
                           </div>
                        )}
                        {order.clientConfirmed && (
                           <button 
                              onClick={() => setLocalOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'delivered' } : o))}
                              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold"
                           >
                              Завершить заказ
                           </button>
                        )}
                    </div>
                 )}
              </div>
           ))}
        </div>
     );
  };

  // MAIN RENDER
  if (!currentUser) {
     return (
        <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white animate-fade-in">
           <div className="w-full max-w-sm bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
              <div className="text-center mb-8">
                 <div className="size-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/40">
                    <Icon icon="solar:user-id-bold" className="size-10 text-white" />
                 </div>
                 <h1 className="text-2xl font-bold">Сотрудник</h1>
                 <p className="text-slate-400 text-sm">Вход в личный кабинет</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                 <input 
                    type="password" 
                    placeholder="Введите ваш код (4 цифры)" 
                    className="w-full text-center text-2xl tracking-[1em] font-mono p-4 bg-slate-900 border border-slate-600 rounded-xl focus:border-primary outline-none transition-colors"
                    maxLength={4}
                    value={loginCode}
                    onChange={e => setLoginCode(e.target.value)}
                 />
                 {error && <div className="text-red-500 text-center text-sm font-bold bg-red-900/20 p-2 rounded-lg">{error}</div>}
                 <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 active:scale-95 transition-all">
                    Войти
                 </button>
              </form>
              <div className="text-center mt-4 text-xs text-slate-500">
                 <p>Демо коды:</p>
                 <p>1111 - Старший смены (Супервайзер)</p>
                 <p>2222 - Сборщик (Отдел одежды)</p>
                 <p>3333 - Курьер</p>
              </div>
              <button onClick={onBack} className="w-full mt-4 text-slate-500 text-sm hover:text-white transition-colors">
                 Вернуться в магазин
              </button>
           </div>
        </div>
     );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
       {/* Header */}
       <header className="bg-white p-4 shadow-sm z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={currentUser.avatar} alt="Avatar" className="size-12 rounded-full border-2 border-slate-100 object-cover" />
             <div>
                <h2 className="font-bold text-slate-800 leading-tight">{currentUser.fullName}</h2>
                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded w-fit capitalize">{currentUser.role}</div>
             </div>
          </div>
          <button onClick={() => setCurrentUser(null)} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100">
             <Icon icon="solar:logout-bold-duotone" className="size-6" />
          </button>
       </header>

       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {/* Main Status/Action Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-full h-1 ${activeShift ? 'bg-green-500' : 'bg-slate-200'}`} />
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Смена</h3>
             
             {activeShift ? (
                <div className="animate-fade-in">
                   <div className="text-4xl font-black text-slate-800 mb-2">{activeShift.startTime}</div>
                   <div className="text-green-600 font-bold mb-6 flex items-center justify-center gap-2">
                      <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                      Активна
                   </div>
                   <button 
                      onClick={() => onClockOut(currentUser.id)}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                   >
                      Закончить работу
                   </button>
                </div>
             ) : (
                <div className="animate-fade-in">
                   <button 
                      onClick={() => onClockIn(currentUser.id, 'Main Store')}
                      className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                   >
                      <Icon icon="solar:play-circle-bold" className="size-6" />
                      Начать смену
                   </button>
                </div>
             )}
          </div>

          {/* Dynamic View Based on Role */}
          {activeShift && (
             <>
                {currentUser.role === 'seller' && <PickerView />}
                {currentUser.role === 'supervisor' && <SupervisorView />}
                {currentUser.role === 'courier' && <CourierView />}
             </>
          )}

          {/* Stats Grid (Visible for everyone) */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Отработано</div>
                <div className="text-2xl font-bold text-slate-800">{currentUser.hoursWorkedMonth} <span className="text-sm text-slate-400">ч.</span></div>
             </div>
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Заработано</div>
                <div className="text-2xl font-bold text-green-600">{currentUser.earnedMonth} с.</div>
             </div>
          </div>
       </div>
    </div>
  );
};