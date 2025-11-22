
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Product, Order, Customer, Category, Supplier, Employee, FinanceRecord, ActivityLog, PromoCode, SupportChat } from '../types';
import { MOCK_SUPPLIERS, MOCK_EMPLOYEES, MOCK_FINANCE, MOCK_LOGS, MOCK_PROMOS, MOCK_SUPPORT_CHATS } from '../constants';

interface AdminDashboardProps {
  onBack: () => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  orders: Order[];
  setOrders: (o: Order[]) => void;
  customers: Customer[];
  setCustomers: (c: Customer[]) => void;
  categories: Category[];
  setCategories: (c: Category[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBack, products, setProducts, orders, setOrders, customers, setCustomers, categories, setCategories
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // New State for modules
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [finance, setFinance] = useState<FinanceRecord[]>(MOCK_FINANCE);
  const [logs, setLogs] = useState<ActivityLog[]>(MOCK_LOGS);
  const [promos, setPromos] = useState<PromoCode[]>(MOCK_PROMOS);
  const [supportChats, setSupportChats] = useState<SupportChat[]>(MOCK_SUPPORT_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@grand.com' && password === 'admin') {
       setIsAuthenticated(true);
       setError('');
    } else {
       setError('Неверный email или пароль');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Главная', icon: 'solar:home-smile-bold' },
    { id: 'reports', label: 'Отчеты', icon: 'solar:chart-square-bold' },
    { id: 'products', label: 'Товары', icon: 'solar:t-shirt-bold' },
    { id: 'categories', label: 'Категории', icon: 'solar:layers-minimalistic-bold' },
    { id: 'orders', label: 'Заказы', icon: 'solar:bag-heart-bold' },
    { id: 'finance', label: 'Финансы', icon: 'solar:wallet-money-bold' },
    { id: 'coupons', label: 'Купоны', icon: 'solar:ticket-sale-bold' },
    { id: 'support', label: 'Поддержка', icon: 'solar:chat-round-dots-bold' },
    { id: 'suppliers', label: 'Поставщики', icon: 'solar:delivery-bold' },
    { id: 'inventory', label: 'Склад', icon: 'solar:box-bold' },
    { id: 'employees', label: 'Сотрудники', icon: 'solar:users-group-two-rounded-bold' },
    { id: 'customers', label: 'Клиенты', icon: 'solar:users-group-rounded-bold' },
    { id: 'marketing', label: 'Маркетинг', icon: 'solar:sale-bold' },
    { id: 'reviews', label: 'Отзывы', icon: 'solar:chat-square-like-bold' },
    { id: 'media', label: 'Медиа', icon: 'solar:gallery-bold' },
    { id: 'logs', label: 'Логи', icon: 'solar:shield-warning-bold' },
    { id: 'settings', label: 'Настройки', icon: 'solar:settings-bold' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
           <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">Grand Market</h2>
              <p className="text-slate-400">Вход для администратора</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                   placeholder="admin@grand.com"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                 <input 
                   type="password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                   placeholder="admin"
                 />
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">
                 Войти
              </button>
           </form>
           <button onClick={onBack} className="w-full mt-4 text-slate-400 text-sm hover:text-slate-600">Вернуться в магазин</button>
        </div>
      </div>
    );
  }

  // --- Sub-Components for Views ---

  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Выручка', value: '3,450 с.', icon: 'solar:wallet-money-bold', color: 'text-primary bg-orange-50' },
            { label: 'Прибыль', value: '1,200 с.', icon: 'solar:graph-new-up-bold', color: 'text-green-600 bg-green-50' },
            { label: 'Заказы', value: orders.length, icon: 'solar:bag-bold', color: 'text-blue-600 bg-blue-50' },
            { label: 'Склад (min)', value: products.filter(p => (p.stock || 0) < 5).length, icon: 'solar:danger-circle-bold', color: 'text-red-600 bg-red-50' },
          ].map((stat, i) => (
             <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start justify-between gap-2">
                <div className={`size-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                   <Icon icon={stat.icon} className="size-5" />
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{stat.label}</p>
                   <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                </div>
             </div>
          ))}
       </div>
       
       {/* Short Logs */}
       <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Последние действия</h3>
          <div className="space-y-3">
             {logs.slice(0, 3).map(log => (
               <div key={log.id} className="flex gap-3 items-start text-sm">
                  <div className={`mt-1 size-2 rounded-full ${log.type === 'danger' ? 'bg-red-500' : log.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                  <div>
                    <span className="font-bold text-slate-700">{log.user}</span>: {log.action}
                    <div className="text-xs text-slate-400">{log.date}</div>
                  </div>
               </div>
             ))}
          </div>
          <button onClick={() => setView('logs')} className="w-full mt-4 py-2 text-primary text-sm font-bold">Все логи</button>
       </div>
    </div>
  );

  const ReportsView = () => (
     <div className="space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold">Аналитика и Отчеты</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">ТОП Товар</h3>
              <div className="flex items-center gap-3">
                 <img src={products[0].images[0]} className="size-12 rounded-lg object-cover" alt="Product" />
                 <div>
                    <div className="font-bold line-clamp-1">{products[0].name}</div>
                    <div className="text-xs text-green-600 font-bold">120 продаж</div>
                 </div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">ТОП Клиент</h3>
               <div className="flex items-center gap-3">
                 <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">A</div>
                 <div>
                    <div className="font-bold">{customers[0].name}</div>
                    <div className="text-xs text-green-600 font-bold">{customers[0].totalSpent} с. покупок</div>
                 </div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Маржинальность</h3>
               <div className="text-3xl font-bold text-slate-800">35%</div>
               <div className="text-xs text-slate-400">Средняя по магазину</div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-lg mb-4">Финансовый результат (Октябрь)</h3>
           <table className="w-full text-sm">
              <tbody>
                 <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-500">Оборот (Выручка)</td>
                    <td className="py-3 text-right font-bold">45,200 с.</td>
                 </tr>
                 <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-500">Себестоимость продаж</td>
                    <td className="py-3 text-right font-bold text-red-400">- 28,400 с.</td>
                 </tr>
                 <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-500">Расходы (Аренда, ЗП)</td>
                    <td className="py-3 text-right font-bold text-red-400">- 5,000 с.</td>
                 </tr>
                 <tr>
                    <td className="py-3 font-bold text-lg">Чистая прибыль</td>
                    <td className="py-3 text-right font-bold text-lg text-green-600">+ 11,800 с.</td>
                 </tr>
              </tbody>
           </table>
        </div>
     </div>
  );

  const FinanceView = () => (
     <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold">Финансы</h2>
           <button className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-200">
             <Icon icon="solar:minus-circle-bold" /> Расход
           </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
           <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-50 text-slate-500">
                 <tr>
                    <th className="p-4">Дата</th>
                    <th className="p-4">Тип</th>
                    <th className="p-4">Категория</th>
                    <th className="p-4">Описание</th>
                    <th className="p-4 text-right">Сумма</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {finance.map(rec => (
                    <tr key={rec.id}>
                       <td className="p-4 text-slate-500">{rec.date}</td>
                       <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${rec.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {rec.type === 'income' ? 'Доход' : 'Расход'}
                          </span>
                       </td>
                       <td className="p-4 capitalize">{rec.category}</td>
                       <td className="p-4 text-slate-600">{rec.description}</td>
                       <td className={`p-4 text-right font-bold ${rec.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {rec.type === 'income' ? '+' : '-'} {rec.amount} с.
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  const CouponsView = () => (
     <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold">Купоны и Промокоды</h2>
           <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
              <Icon icon="solar:ticket-sale-bold" /> Создать промокод
           </button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
           {promos.map(promo => (
              <div key={promo.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${promo.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       {promo.active ? 'Активен' : 'Неактивен'}
                    </span>
                 </div>
                 <div className="text-3xl font-bold tracking-wider text-slate-800 mb-1">{promo.code}</div>
                 <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-bold text-primary">{promo.discount}%</span>
                    <span className="text-sm text-slate-400 font-medium mb-1">скидка</span>
                 </div>
                 <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
                    <span>Использовано: {promo.usageCount} раз</span>
                    <button className="text-blue-600 font-bold hover:underline">Изменить</button>
                 </div>
                 <div className="absolute -bottom-6 -right-6 size-24 bg-primary/5 rounded-full" />
              </div>
           ))}
        </div>
     </div>
  );

  const SupportView = () => {
    const activeChat = supportChats.find(c => c.id === selectedChatId);

    return (
      <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
         {/* Sidebar List */}
         <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 bg-slate-50">
               <h3 className="font-bold text-lg mb-2">Сообщения</h3>
               <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-slate-200 rounded-lg py-1 text-xs font-bold text-slate-600 shadow-sm">Все</button>
                  <button className="flex-1 bg-transparent border border-transparent rounded-lg py-1 text-xs font-bold text-slate-400 hover:bg-slate-100">Клиенты</button>
                  <button className="flex-1 bg-transparent border border-transparent rounded-lg py-1 text-xs font-bold text-slate-400 hover:bg-slate-100">Сотрудники</button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto">
               {supportChats.map(chat => (
                  <div 
                     key={chat.id} 
                     onClick={() => setSelectedChatId(chat.id)}
                     className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedChatId === chat.id ? 'bg-slate-50' : ''}`}
                  >
                     <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-sm text-slate-800">{chat.userName}</div>
                        <div className="text-xs text-slate-400">{chat.timestamp}</div>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500 line-clamp-1 pr-2">{chat.lastMessage}</div>
                        {chat.unread > 0 && (
                           <div className="size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {chat.unread}
                           </div>
                        )}
                     </div>
                     <div className="mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                           chat.userRole === 'customer' ? 'bg-blue-100 text-blue-600' : 
                           chat.userRole === 'seller' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                           {chat.userRole === 'customer' ? 'Клиент' : chat.userRole === 'seller' ? 'Продавец' : 'Менеджер'}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Chat Window */}
         <div className={`flex-1 flex flex-col bg-slate-50 ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
               <>
                  <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3 shadow-sm">
                     <button onClick={() => setSelectedChatId(null)} className="md:hidden p-1">
                        <Icon icon="solar:arrow-left-linear" className="size-6 text-slate-500" />
                     </button>
                     <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                        {activeChat.userName[0]}
                     </div>
                     <div>
                        <div className="font-bold text-slate-800">{activeChat.userName}</div>
                        <div className="text-xs text-green-600 flex items-center gap-1">
                           <div className="size-1.5 rounded-full bg-green-600"></div> Онлайн
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {activeChat.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                              msg.sender === 'me' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                           }`}>
                              {msg.text}
                              <div className={`text-[10px] text-right mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-slate-300'}`}>
                                 {msg.time}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="p-4 bg-white border-t border-slate-100">
                     <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg">
                           <Icon icon="solar:paperclip-bold" className="size-5" />
                        </button>
                        <input 
                           type="text" 
                           placeholder="Напишите сообщение..." 
                           className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                        <button className="p-2 bg-primary text-white rounded-xl shadow-md hover:bg-orange-600 transition-colors">
                           <Icon icon="solar:plain-bold" className="size-5" />
                        </button>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Icon icon="solar:chat-round-dots-linear" className="size-16 mb-4 opacity-20" />
                  <p>Выберите чат для начала общения</p>
               </div>
            )}
         </div>
      </div>
    );
  };

  const SuppliersView = () => (
     <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold">Поставщики</h2>
           <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">+ Поставщик</button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
           {suppliers.map(s => (
              <div key={s.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{s.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.balance > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                       Долг: {s.balance} с.
                    </span>
                 </div>
                 <p className="text-sm text-slate-500 mb-1">Контакт: {s.contactName}</p>
                 <p className="text-sm text-slate-500 mb-4">{s.phone}</p>
                 <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">История</button>
                    <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20">Поставка</button>
                 </div>
              </div>
           ))}
        </div>
     </div>
  );

  const EmployeesView = () => (
     <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold">Сотрудники</h2>
           <button className="bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">+ Сотрудник</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
           <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-slate-50 text-slate-500">
                 <tr>
                    <th className="p-4">Имя</th>
                    <th className="p-4">Роль</th>
                    <th className="p-4">Статус</th>
                    <th className="p-4">Активность</th>
                    <th className="p-4 text-right">Действия</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {employees.map(emp => (
                    <tr key={emp.id}>
                       <td className="p-4 font-bold">{emp.name}</td>
                       <td className="p-4">
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs uppercase font-bold text-slate-500">{emp.role}</span>
                       </td>
                       <td className="p-4">
                          <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                             <div className="size-2 bg-green-600 rounded-full"></div> {emp.status}
                          </span>
                       </td>
                       <td className="p-4 text-slate-500">{emp.lastActive}</td>
                       <td className="p-4 text-right">
                          <button className="text-blue-600 font-bold hover:underline">Изм.</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  const InventoryView = () => (
     <div className="space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold">Склад и Учет</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
           <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <h4 className="text-red-600 font-bold text-sm mb-1">Заканчивается</h4>
              <p className="text-2xl font-bold text-red-800">12 <span className="text-sm font-normal">товаров</span></p>
           </div>
           <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <h4 className="text-orange-600 font-bold text-sm mb-1">Общая стоимость</h4>
              <p className="text-2xl font-bold text-orange-800">1.2M <span className="text-sm font-normal">сомони</span></p>
           </div>
           <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h4 className="text-blue-600 font-bold text-sm mb-1">Поступления</h4>
              <p className="text-2xl font-bold text-blue-800">+45 <span className="text-sm font-normal">на этой неделе</span></p>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
           <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-50 text-slate-500">
                 <tr>
                    <th className="p-4">Товар</th>
                    <th className="p-4">Категория</th>
                    <th className="p-4 text-right">Закуп (с.)</th>
                    <th className="p-4 text-right">Продажа (с.)</th>
                    <th className="p-4 text-right">Маржа</th>
                    <th className="p-4 text-right">Остаток</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {products.map(p => {
                    const margin = p.buyPrice ? Math.round(((p.price - p.buyPrice) / p.price) * 100) : 0;
                    return (
                    <tr key={p.id}>
                       <td className="p-4 font-medium">{p.name}</td>
                       <td className="p-4 text-slate-500 text-xs">{p.category}</td>
                       <td className="p-4 text-right text-slate-500">{p.buyPrice || '-'}</td>
                       <td className="p-4 text-right font-bold">{p.price}</td>
                       <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${margin > 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                             {margin}%
                          </span>
                       </td>
                       <td className="p-4 text-right font-bold">
                          {p.stock} шт.
                       </td>
                    </tr>
                 )})}
              </tbody>
           </table>
        </div>
     </div>
  );

  const MarketingView = () => (
     <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold">Маркетинг</h2>
        
        {/* Banners */}
        <div>
           <h3 className="font-bold text-lg mb-3">Баннеры на главной</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-[2/1] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center flex-col cursor-pointer hover:bg-slate-50">
                 <Icon icon="solar:upload-square-bold" className="size-8 text-slate-400 mb-2" />
                 <span className="text-sm text-slate-500 font-medium">Загрузить баннер</span>
              </div>
              <div className="aspect-[2/1] relative rounded-xl overflow-hidden shadow-sm group">
                 <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" className="w-full h-full object-cover" alt="Banner" />
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold text-sm">Удалить</button>
                 </div>
              </div>
           </div>
        </div>
     </div>
  );

  const LogsView = () => (
     <div className="space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold">История действий (Логи)</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="divide-y divide-slate-100">
              {logs.map(log => (
                 <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="text-xs text-slate-400 font-mono w-32">{log.date}</div>
                    <div className="flex-1">
                       <span className="font-bold text-slate-800">{log.user}</span>
                       <span className="text-slate-600 mx-2">→</span>
                       <span className="text-slate-700">{log.action}</span>
                    </div>
                    <div>
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          log.type === 'danger' ? 'bg-red-100 text-red-600' : 
                          log.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                       }`}>
                          {log.type}
                       </span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );
  
  const ReviewsView = () => (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Отзывы клиентов</h2>
      <div className="space-y-3">
        {products.flatMap(p => p.reviews.map(r => ({...r, productName: p.name}))).map((review, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between mb-2">
               <h4 className="font-bold text-sm">{review.productName}</h4>
               <div className="flex text-yellow-400">
                 {[...Array(5)].map((_, i) => (
                   <Icon key={i} icon={i < review.rating ? "solar:star-bold" : "solar:star-linear"} className="size-3" />
                 ))}
               </div>
            </div>
            <p className="text-sm text-slate-600 italic mb-2">"{review.comment}"</p>
            <div className="flex justify-between items-center text-xs text-slate-400">
               <span>{review.user} • {review.date}</span>
               <button className="text-primary hover:underline">Ответить</button>
            </div>
          </div>
        ))}
        {products.every(p => p.reviews.length === 0) && (
           <div className="text-center py-10 text-slate-400">Нет отзывов</div>
        )}
      </div>
    </div>
  );

  // New Components for Missing Modules

  const CategoriesView = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Категории</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">+ Категория</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         {categories.map(cat => (
            <div key={cat.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-primary cursor-pointer group">
               <div className="flex justify-between items-start mb-3">
                  <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                     <Icon icon="solar:folder-bold" className="size-6" />
                  </div>
                  <button className="text-slate-400 hover:text-red-500"><Icon icon="solar:trash-bin-minimalistic-bold" /></button>
               </div>
               <h3 className="font-bold text-lg">{cat.name}</h3>
               <p className="text-xs text-slate-400">{cat.subcategories.length} подкатегорий</p>
               <div className="mt-3 flex gap-1 flex-wrap">
                  {cat.subcategories.slice(0, 3).map(sub => (
                     <span key={sub} className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-500">{sub}</span>
                  ))}
                  {cat.subcategories.length > 3 && <span className="text-[10px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-500">+{cat.subcategories.length - 3}</span>}
               </div>
            </div>
         ))}
      </div>
    </div>
  );

  const MediaView = () => (
      <div className="space-y-4 animate-fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Медиа библиотека</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
               <Icon icon="solar:upload-minimalistic-bold" /> Загрузить
            </button>
         </div>
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.flatMap(p => p.images).slice(0, 12).map((img, i) => (
               <div key={i} className="aspect-square bg-white p-1 rounded-xl border border-slate-100 shadow-sm relative group">
                  <img src={img} className="w-full h-full object-cover rounded-lg" alt="Media" />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                     <button className="text-white p-1 hover:scale-110"><Icon icon="solar:eye-bold" /></button>
                     <button className="text-red-400 p-1 hover:scale-110"><Icon icon="solar:trash-bin-trash-bold" /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>
  );

  const SettingsView = () => (
      <div className="space-y-6 animate-fade-in max-w-2xl">
         <h2 className="text-2xl font-bold">Настройки магазина</h2>
         
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b border-slate-50 pb-2">Общие</h3>
            <div className="grid gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Название магазина</label>
                  <input type="text" className="w-full p-2 border rounded-lg bg-slate-50" defaultValue="Grand Market Fashion" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Валюта</label>
                  <select className="w-full p-2 border rounded-lg bg-slate-50">
                     <option>Сомони (TJS)</option>
                     <option>Доллар (USD)</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-lg border-b border-slate-50 pb-2">Уведомления</h3>
            <div className="space-y-2">
               <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">Уведомлять о новых заказах (Email)</span>
                  <input type="checkbox" defaultChecked className="accent-primary size-5" />
               </label>
               <label className="flex items-center justify-between">
                  <span className="text-sm font-medium">Уведомлять о низком остатке</span>
                  <input type="checkbox" defaultChecked className="accent-primary size-5" />
               </label>
            </div>
         </div>
         
         <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg w-full md:w-auto">Сохранить изменения</button>
      </div>
  );

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
         <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <div className="text-xl font-extrabold text-primary">GM<span className="text-secondary">ADMIN</span></div>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
               <Icon icon="solar:close-circle-bold" className="size-6 text-slate-400" />
            </button>
         </div>
         <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)] pb-20">
            {navItems.map(item => (
               <button 
                 key={item.id}
                 onClick={() => { setView(item.id); setSidebarOpen(false); }}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${view === item.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                  <Icon icon={item.icon} className="size-5" />
                  {item.label}
               </button>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-50">
               <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                  <Icon icon="solar:logout-bold-duotone" className="size-5" />
                  Выйти в магазин
               </button>
            </div>
         </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
         {/* Mobile Header */}
         <header className="md:hidden bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
             <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-50 rounded-lg">
                <Icon icon="solar:hamburger-menu-bold" className="size-6 text-slate-600" />
             </button>
             <span className="font-bold text-slate-800">Админ Панель</span>
             <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">A</div>
         </header>

         <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pb-safe">
            {view === 'dashboard' && <DashboardView />}
            {view === 'reports' && <ReportsView />}
            {view === 'products' && (
               <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Товары</h2>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm">+ Добавить</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-100 flex gap-3">
                        <img src={p.images[0]} className="size-16 rounded-lg object-cover bg-slate-100" alt={p.name} />
                        <div className="flex-1">
                          <div className="font-bold text-sm line-clamp-1">{p.name}</div>
                          <div className="text-xs text-slate-400 mb-1">Ост: {p.stock} шт.</div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">{p.price} с.</span>
                            <button className="text-blue-600 text-xs font-bold">Изм.</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}
            {view === 'orders' && (
               <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4">Заказы</h2>
                  <div className="space-y-3">
                     {orders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                           <div>
                              <div className="font-bold text-lg">{order.id} <span className="text-sm font-normal text-slate-400">от {order.date}</span></div>
                              <div className="text-sm text-slate-600">{order.customerName} • {order.customerPhone}</div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="font-bold text-lg">{order.total} с.</div>
                              <select 
                                value={order.status}
                                onChange={(e) => {
                                   const newStatus = e.target.value as any;
                                   setOrders(orders.map(o => o.id === order.id ? {...o, status: newStatus} : o));
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold border-none outline-none cursor-pointer ${
                                   order.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                   order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                 <option value="new">Новый</option>
                                 <option value="processing">В работе</option>
                                 <option value="shipped">Отправлен</option>
                                 <option value="delivered">Доставлен</option>
                                 <option value="cancelled">Отменен</option>
                              </select>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            {view === 'customers' && (
               <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4">Клиенты</h2>
                  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[500px]">
                       <thead className="bg-slate-50 text-slate-500">
                          <tr>
                             <th className="p-4">Имя</th>
                             <th className="p-4">Телефон</th>
                             <th className="p-4">Заказов</th>
                             <th className="p-4">Сумма</th>
                             <th className="p-4">Статус</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {customers.map(c => (
                             <tr key={c.id}>
                                <td className="p-4 font-bold">{c.name}</td>
                                <td className="p-4 text-slate-500">{c.phone}</td>
                                <td className="p-4">{c.ordersCount}</td>
                                <td className="p-4 font-bold text-green-600">{c.totalSpent} с.</td>
                                <td className="p-4">
                                   <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                      {c.status}
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
               </div>
            )}
            {view === 'categories' && <CategoriesView />}
            {view === 'suppliers' && <SuppliersView />}
            {view === 'finance' && <FinanceView />}
            {view === 'inventory' && <InventoryView />}
            {view === 'employees' && <EmployeesView />}
            {view === 'marketing' && <MarketingView />}
            {view === 'coupons' && <CouponsView />}
            {view === 'support' && <SupportView />}
            {view === 'reviews' && <ReviewsView />}
            {view === 'media' && <MediaView />}
            {view === 'logs' && <LogsView />}
            {view === 'settings' && <SettingsView />}
         </main>
      </div>
    </div>
  );
};