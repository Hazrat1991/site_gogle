

import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Product, Order, Customer, Category, Department, StoreSettings, Supplier, EmployeeExtended, Shift, StaffFinancialRecord, FittingBooking, MediaItem, ActivityLog, PackingTable, WarehouseDocument, Review, SupportChat, PayoutRequest, StaticPage, DeliveryZone, NotificationCampaign, Attribute, AdminUser } from '../types';
import { MOCK_DEPARTMENTS, MOCK_SETTINGS, MOCK_SUPPLIERS, MOCK_LOGS, MOCK_MEDIA_FILES, MOCK_CATEGORIES, MOCK_PACKING_TABLES, MOCK_WAREHOUSE_DOCUMENTS, MOCK_PENDING_REVIEWS, MOCK_SUPPORT_CHATS, MOCK_PAYOUTS, MOCK_PAGES, MOCK_ZONES, MOCK_NOTIFICATIONS, MOCK_ATTRIBUTES, MOCK_ADMIN_USERS } from '../constants';
import { EmployeeManager } from './admin/EmployeeManager';
import { KanbanBoard } from './admin/KanbanBoard';
import { CourierMap } from './admin/CourierMap';
import { PromoBuilder } from './admin/PromoBuilder';

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
  employees?: EmployeeExtended[];
  setEmployees?: (e: EmployeeExtended[]) => void;
  shifts?: Shift[];
  setShifts?: (s: Shift[]) => void;
  financialRecords?: StaffFinancialRecord[];
  setFinancialRecords?: (f: StaffFinancialRecord[]) => void;
  bookings?: FittingBooking[];
  suppliers?: Supplier[];
  setSuppliers?: (s: Supplier[]) => void;
}

// --- RESTORED & NEW VIEWS ---

const OverviewView: React.FC<{ products: Product[], orders: Order[], customers: Customer[] }> = ({ products, orders, customers }) => {
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStock = products.filter(p => (p.stock || 0) === 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-bold mb-6">Обзор</h2>
       
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="size-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Icon icon="solar:wallet-money-bold" className="size-6" />
             </div>
             <div>
                <div className="text-slate-400 text-xs font-bold uppercase">Продажи</div>
                <div className="text-2xl font-bold text-slate-800">{totalSales.toLocaleString()} c.</div>
             </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="size-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Icon icon="solar:bag-check-bold" className="size-6" />
             </div>
             <div>
                <div className="text-slate-400 text-xs font-bold uppercase">Заказы</div>
                <div className="text-2xl font-bold text-slate-800">{orders.length}</div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="size-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Icon icon="solar:users-group-rounded-bold" className="size-6" />
             </div>
             <div>
                <div className="text-slate-400 text-xs font-bold uppercase">Клиенты</div>
                <div className="text-2xl font-bold text-slate-800">{customers.length}</div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="size-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Icon icon="solar:t-shirt-bold" className="size-6" />
             </div>
             <div>
                <div className="text-slate-400 text-xs font-bold uppercase">Товары</div>
                <div className="text-2xl font-bold text-slate-800">{products.length}</div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-lg mb-4">Последние заказы</h3>
             <div className="space-y-4">
                {orders.slice(0, 4).map(order => (
                   <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                            {order.customerName?.[0] || 'G'}
                         </div>
                         <div>
                            <div className="font-bold text-slate-800">{order.customerName || 'Гость'}</div>
                            <div className="text-xs text-slate-400">Заказ {order.id}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-primary mb-1">{order.total} c.</div>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            order.status === 'new' ? 'bg-green-100 text-green-600' :
                            order.status === 'delivered' ? 'bg-slate-100 text-slate-600' :
                            'bg-orange-100 text-orange-600'
                         }`}>{order.status}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Stock Status */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
             <h3 className="font-bold text-lg mb-4">Статус склада</h3>
             <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                   <span className="text-slate-500 text-sm font-medium">Всего товаров</span>
                   <span className="font-bold text-slate-800">{products.length}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                   <span className="text-slate-500 text-sm font-medium">Общий остаток</span>
                   <span className="font-bold text-slate-800">{totalStock} шт.</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                   <span className="text-slate-500 text-sm font-medium">Товаров без остатка</span>
                   <span className="font-bold text-red-500">{outOfStock}</span>
                </div>
             </div>
             
             {outOfStock > 0 && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3">
                   <Icon icon="solar:info-circle-bold" className="text-orange-500 size-5 shrink-0" />
                   <p className="text-xs text-orange-700 leading-relaxed font-medium">
                      {outOfStock} товара заканчиваются. Рекомендуем пополнить запасы в категории "Обувь".
                   </p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

const ProductsView: React.FC<{ products: Product[], setProducts: (p: Product[]) => void }> = ({ products, setProducts }) => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex justify-between items-center">
       <h2 className="text-2xl font-bold">Товары</h2>
       <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
          <Icon icon="solar:add-circle-bold" />
          Добавить товар
       </button>
    </div>
    
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[800px]">
         <thead className="bg-slate-50 text-slate-500">
            <tr>
               <th className="p-4">Фото</th>
               <th className="p-4">Название</th>
               <th className="p-4">Категория</th>
               <th className="p-4">Цена</th>
               <th className="p-4">Остаток</th>
               <th className="p-4">Статус</th>
               <th className="p-4">Действия</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
            {products.map(p => (
               <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4">
                     <img src={p.images[0]} className="size-10 rounded-lg object-cover bg-slate-100" />
                  </td>
                  <td className="p-4 font-bold text-slate-800">{p.name}</td>
                  <td className="p-4 text-slate-500 capitalize">{p.category}</td>
                  <td className="p-4 font-bold">{p.price} с.</td>
                  <td className={`p-4 font-bold ${p.stock && p.stock < 5 ? 'text-red-500' : 'text-slate-800'}`}>{p.stock} шт.</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock && p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock && p.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                     </span>
                  </td>
                  <td className="p-4 flex gap-2">
                     <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><Icon icon="solar:pen-bold" /></button>
                     <button className="p-2 hover:bg-red-100 rounded-lg text-red-500"><Icon icon="solar:trash-bin-trash-bold" /></button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
    </div>
  </div>
);

const FinanceView: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
     <h2 className="text-2xl font-bold">Финансы</h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
           <div className="text-slate-400 text-sm font-bold uppercase mb-2">Общий баланс</div>
           <div className="text-3xl font-bold mb-4">124,500 с.</div>
           <div className="flex gap-2">
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">+12%</span>
              <span className="text-slate-400 text-xs flex items-center">за этот месяц</span>
           </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="text-slate-400 text-sm font-bold uppercase mb-2">Доходы</div>
           <div className="text-3xl font-bold text-green-600 mb-4">+45,200 с.</div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-green-500 rounded-full"></div>
           </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <div className="text-slate-400 text-sm font-bold uppercase mb-2">Расходы</div>
           <div className="text-3xl font-bold text-red-600 mb-4">-18,400 с.</div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[30%] bg-red-500 rounded-full"></div>
           </div>
        </div>
     </div>

     <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-lg mb-4">Последние транзакции</h3>
        <div className="space-y-4">
           {[
             { id: 1, title: 'Продажа #ORD-7782', date: 'Сегодня, 14:30', amount: '+1,200', type: 'in' },
             { id: 2, title: 'Закупка товара (Asia Textile)', date: 'Вчера, 10:00', amount: '-5,400', type: 'out' },
             { id: 3, title: 'Зарплата (Рустам А.)', date: '25 Окт, 09:00', amount: '-2,500', type: 'out' },
             { id: 4, title: 'Продажа #ORD-7780', date: '24 Окт, 16:45', amount: '+2,890', type: 'in' },
           ].map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                 <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center ${t.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       <Icon icon={t.type === 'in' ? "solar:arrow-left-down-bold" : "solar:arrow-right-up-bold"} />
                    </div>
                    <div>
                       <div className="font-bold text-slate-800">{t.title}</div>
                       <div className="text-xs text-slate-500">{t.date}</div>
                    </div>
                 </div>
                 <div className={`font-bold ${t.type === 'in' ? 'text-green-600' : 'text-slate-800'}`}>
                    {t.amount} c.
                 </div>
              </div>
           ))}
        </div>
     </div>
  </div>
);

const CustomersView: React.FC<{ customers: Customer[] }> = ({ customers }) => (
  <div className="space-y-4 animate-fade-in">
     <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Клиенты</h2>
        <div className="flex gap-2">
           <input type="text" placeholder="Поиск..." className="p-2 border rounded-xl text-sm w-64 bg-white" />
           <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm">Экспорт</button>
        </div>
     </div>
     
     <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
           <thead className="bg-slate-50 text-slate-500">
              <tr>
                 <th className="p-4">Клиент</th>
                 <th className="p-4">Телефон</th>
                 <th className="p-4">Заказов</th>
                 <th className="p-4">Потрачено</th>
                 <th className="p-4">Статус</th>
                 <th className="p-4">Дата регистрации</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {customers.map(c => (
                 <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{c.name}</td>
                    <td className="p-4 text-slate-600">{c.phone}</td>
                    <td className="p-4 font-bold">{c.ordersCount}</td>
                    <td className="p-4 text-green-600 font-bold">{c.totalSpent} с.</td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {c.status}
                       </span>
                    </td>
                    <td className="p-4 text-slate-500">{c.joinDate}</td>
                 </tr>
              ))}
           </tbody>
        </table>
     </div>
  </div>
);

const SettingsView: React.FC = () => (
   <div className="space-y-6 animate-fade-in max-w-4xl">
      <h2 className="text-2xl font-bold">Настройки магазина</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
         <h3 className="font-bold text-lg border-b border-slate-100 pb-2">Общие</h3>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Название магазина</label>
               <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="Grand Market" />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Валюта</label>
               <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <option>TJS (Сомони)</option>
                  <option>USD (Dollar)</option>
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Телефон поддержки</label>
               <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="+992 900 00 00 00" />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
               <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue="admin@grandmarket.tj" />
            </div>
         </div>

         <h3 className="font-bold text-lg border-b border-slate-100 pb-2 pt-4">Оплата и Доставка</h3>
         <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
               <span className="font-bold text-slate-700">Принимать наличные</span>
               <input type="checkbox" defaultChecked className="size-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
               <span className="font-bold text-slate-700">Принимать карты (POS-терминал)</span>
               <input type="checkbox" defaultChecked className="size-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
               <span className="font-bold text-slate-700">Бесплатная доставка от 500 с.</span>
               <input type="checkbox" defaultChecked className="size-5 accent-primary" />
            </label>
         </div>

         <div className="pt-4">
            <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90">
               Сохранить изменения
            </button>
         </div>
      </div>
   </div>
);

const FittingRoomView: React.FC<{ bookings: FittingBooking[] }> = ({ bookings }) => (
   <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Бронирование примерочной (VIP)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Клиент</th>
                  <th className="p-4">Дата / Время</th>
                  <th className="p-4">Товаров</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50">
                     <td className="p-4">
                        <div className="font-bold text-slate-800">{b.customerName}</div>
                        <div className="text-xs text-slate-500">{b.customerPhone}</div>
                     </td>
                     <td className="p-4">
                        <div className="font-bold text-primary">{b.timeSlot}</div>
                        <div className="text-xs text-slate-500">{b.date}</div>
                     </td>
                     <td className="p-4">{b.items.length} шт.</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {b.status}
                        </span>
                     </td>
                     <td className="p-4">
                        <button className="text-primary font-bold text-xs hover:underline">Подготовить вещи</button>
                     </td>
                  </tr>
               ))}
               {bookings.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-slate-400">Нет активных бронирований</td></tr>
               )}
            </tbody>
         </table>
      </div>
   </div>
);

const SupplierManagementView: React.FC<{ suppliers: Supplier[], setSuppliers: (s: Supplier[]) => void }> = ({ suppliers, setSuppliers }) => (
   <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Поставщики (B2B)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Поставщик</th>
                  <th className="p-4">Контакт</th>
                  <th className="p-4">Баланс</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Рейтинг</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{s.name}</td>
                     <td className="p-4">
                        <div>{s.contactName}</div>
                        <div className="text-xs text-slate-500">{s.phone}</div>
                     </td>
                     <td className={`p-4 font-bold ${s.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>{s.balance} с.</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.status === 'active' ? 'bg-green-100 text-green-700' : s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                           {s.status}
                        </span>
                     </td>
                     <td className="p-4 text-orange-400 font-bold">{s.rating} ★</td>
                     <td className="p-4 flex gap-2">
                        {s.status === 'pending' && (
                           <button onClick={() => setSuppliers(suppliers.map(sup => sup.id === s.id ? {...sup, status: 'active'} : sup))} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold">
                              Одобрить
                           </button>
                        )}
                        <button className="text-slate-400 hover:text-primary"><Icon icon="solar:pen-bold" /></button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

// --- NEW SHOPS VIEW FOR MARKETPLACE ---
const ShopsView: React.FC<{ suppliers: Supplier[], setSuppliers: (s: Supplier[]) => void }> = ({ suppliers, setSuppliers }) => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Магазины (Маркетплейс)</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
            <Icon icon="solar:shop-bold" />
            Добавить магазин
         </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Магазин</th>
                  <th className="p-4">Владелец</th>
                  <th className="p-4">Товаров</th>
                  <th className="p-4">Комиссия</th>
                  <th className="p-4">Баланс</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{s.name}</td>
                     <td className="p-4">
                        <div>{s.contactName}</div>
                        <div className="text-xs text-slate-500">{s.phone}</div>
                     </td>
                     <td className="p-4 font-bold">24</td>
                     <td className="p-4 font-bold text-slate-600">{s.commissionRate || 10}%</td>
                     <td className={`p-4 font-bold ${s.balance > 0 ? 'text-green-600' : 'text-slate-600'}`}>{s.balance} с.</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.status === 'active' ? 'bg-green-100 text-green-700' : s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                           {s.status}
                        </span>
                     </td>
                     <td className="p-4 flex gap-2">
                        {s.status === 'pending' && (
                           <button onClick={() => setSuppliers(suppliers.map(sup => sup.id === s.id ? {...sup, status: 'active'} : sup))} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold">Одобрить</button>
                        )}
                        <button className="text-slate-400 hover:text-primary"><Icon icon="solar:settings-bold" /></button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const DepartmentsView: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex justify-between items-center">
       <h2 className="text-2xl font-bold">Отделы</h2>
       <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
          <Icon icon="solar:add-circle-bold" />
          Добавить отдел
       </button>
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[600px]">
         <thead className="bg-slate-50 text-slate-500">
            <tr>
               <th className="p-4">Название</th>
               <th className="p-4">Описание</th>
               <th className="p-4">Товаров</th>
               <th className="p-4">Статус</th>
               <th className="p-4">Действия</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
            {MOCK_DEPARTMENTS.map(d => (
               <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{d.name}</td>
                  <td className="p-4 text-slate-600">{d.description}</td>
                  <td className="p-4">{d.productCount}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {d.status}
                     </span>
                  </td>
                  <td className="p-4 flex gap-2">
                     <button className="text-slate-400 hover:text-primary"><Icon icon="solar:pen-bold" /></button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
    </div>
  </div>
);

const CategoriesView: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex justify-between items-center">
       <h2 className="text-2xl font-bold">Категории</h2>
       <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
          <Icon icon="solar:add-circle-bold" />
          Добавить категорию
       </button>
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[600px]">
         <thead className="bg-slate-50 text-slate-500">
            <tr>
               <th className="p-4">Фото</th>
               <th className="p-4">Название</th>
               <th className="p-4">Подкатегории</th>
               <th className="p-4">Отдел</th>
               <th className="p-4">Действия</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
            {MOCK_CATEGORIES.map(c => (
               <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-4">
                     <img src={c.image} className="size-10 rounded-lg object-cover bg-slate-100" />
                  </td>
                  <td className="p-4 font-bold text-slate-800">{c.name}</td>
                  <td className="p-4 text-slate-600 text-xs max-w-[200px] truncate">{c.subcategories.join(', ')}</td>
                  <td className="p-4 text-slate-500">{MOCK_DEPARTMENTS.find(d => d.id === c.departmentId)?.name || '-'}</td>
                  <td className="p-4 flex gap-2">
                     <button className="text-slate-400 hover:text-primary"><Icon icon="solar:pen-bold" /></button>
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
    </div>
  </div>
);

const MediaView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Медиа библиотека</h2>
         <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
            <Icon icon="solar:upload-bold" />
            Загрузить
         </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         {MOCK_MEDIA_FILES.map(file => (
            <div key={file.id} className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm group cursor-pointer">
               <div className="aspect-square bg-slate-50 rounded-lg mb-2 overflow-hidden flex items-center justify-center relative">
                  {file.type === 'image' ? (
                     <img src={file.url} className="w-full h-full object-cover" />
                  ) : (
                     <Icon icon={file.type === 'video' ? "solar:videocamera-bold" : "solar:file-text-bold"} className="size-10 text-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button className="text-white"><Icon icon="solar:eye-bold" /></button>
                     <button className="text-red-400"><Icon icon="solar:trash-bin-trash-bold" /></button>
                  </div>
               </div>
               <div className="px-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                  <div className="text-xs text-slate-400">{file.size}</div>
               </div>
            </div>
         ))}
      </div>
   </div>
);

const LogsView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Журнал действий (Логи)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Время</th>
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Действие</th>
                  <th className="p-4">Модуль</th>
                  <th className="p-4">Детали</th>
                  <th className="p-4">IP</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_LOGS.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                     <td className="p-4 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                     <td className="p-4">
                        <div className="font-bold text-slate-800">{log.userName}</div>
                        <div className="text-xs text-slate-400 uppercase">{log.userRole}</div>
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                           log.actionType === 'create' ? 'bg-green-100 text-green-700' :
                           log.actionType === 'delete' ? 'bg-red-100 text-red-700' :
                           log.actionType === 'warning' ? 'bg-orange-100 text-orange-700' :
                           'bg-blue-100 text-blue-700'
                        }`}>
                           {log.actionType}
                        </span>
                     </td>
                     <td className="p-4 text-slate-600">{log.module}</td>
                     <td className="p-4 text-slate-600">{log.details}</td>
                     <td className="p-4 text-xs text-slate-400 font-mono">{log.ip}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

// --- NEW VIEWS FOR TABLES & WAREHOUSE ---

const TablesView: React.FC = () => {
   const [tables, setTables] = useState<PackingTable[]>(MOCK_PACKING_TABLES);
   
   return (
      <div className="space-y-4 animate-fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Столы упаковки (Сборка)</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
               <Icon icon="solar:add-circle-bold" />
               Добавить стол
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
               <div key={table.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-xl font-bold text-slate-800">{table.name}</h3>
                        <div className="text-xs text-slate-500 font-medium">ID: {table.id}</div>
                     </div>
                     <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${table.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {table.status}
                     </span>
                  </div>

                  <div className="space-y-4">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Старший смены</div>
                        <div className="flex items-center gap-2">
                           <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                              {table.supervisorName[0]}
                           </div>
                           <span className="font-bold text-sm">{table.supervisorName}</span>
                        </div>
                     </div>

                     <div className="flex gap-2">
                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                           <div className="text-xs text-slate-400 font-bold uppercase mb-1">Заказы</div>
                           <div className="text-xl font-bold text-primary">{table.currentOrderIds.length}</div>
                        </div>
                        <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                           <div className="text-xs text-slate-400 font-bold uppercase mb-1">Всего</div>
                           <div className="text-xl font-bold text-slate-800">{table.totalOrdersProcessed}</div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                     <button className="flex-1 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-700 transition-colors">
                        Назначить заказ
                     </button>
                     <button className="size-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50">
                        <Icon icon="solar:trash-bin-trash-bold" />
                     </button>
                  </div>
               </div>
            ))}
            
            {/* Add Table Placeholder */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-primary hover:text-primary hover:bg-slate-50 transition-all cursor-pointer h-full min-h-[200px]">
               <Icon icon="solar:add-circle-bold" className="size-10 mb-2" />
               <span className="font-bold">Добавить новый стол</span>
            </div>
         </div>
      </div>
   );
};

const WarehouseView: React.FC = () => {
   const [activeTab, setActiveTab] = useState<'all' | 'income' | 'writeoff' | 'transfer'>('all');
   
   return (
      <div className="space-y-4 animate-fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Складские документы</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
               <Icon icon="solar:file-text-bold" />
               Создать документ
            </button>
         </div>

         {/* Tabs */}
         <div className="flex gap-2 overflow-x-auto pb-2">
            {[
               { id: 'all', label: 'Все документы' },
               { id: 'income', label: 'Приходные' },
               { id: 'writeoff', label: 'Списания' },
               { id: 'transfer', label: 'Перемещения' }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
               <thead className="bg-slate-50 text-slate-500">
                  <tr>
                     <th className="p-4">№ Документа</th>
                     <th className="p-4">Тип</th>
                     <th className="p-4">Дата</th>
                     <th className="p-4">Контрагент / Причина</th>
                     <th className="p-4">Сумма</th>
                     <th className="p-4">Товаров</th>
                     <th className="p-4">Статус</th>
                     <th className="p-4">Действия</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {MOCK_WAREHOUSE_DOCUMENTS.filter(d => activeTab === 'all' || d.type === activeTab).map(doc => (
                     <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-slate-800">{doc.id}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              doc.type === 'income' ? 'bg-green-100 text-green-700' :
                              doc.type === 'writeoff' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                           }`}>
                              {doc.type === 'income' ? 'Приход' : doc.type === 'writeoff' ? 'Списание' : 'Перемещение'}
                           </span>
                        </td>
                        <td className="p-4 text-slate-500">{doc.date}</td>
                        <td className="p-4">
                           <div className="font-bold text-slate-800">{doc.supplierName || '-'}</div>
                           <div className="text-xs text-slate-400">{doc.comment}</div>
                        </td>
                        <td className="p-4 font-bold">{doc.totalAmount} с.</td>
                        <td className="p-4">{doc.itemCount} шт.</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${doc.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-yellow-100 text-yellow-700'}`}>
                              {doc.status === 'completed' ? 'Проведен' : 'Черновик'}
                           </span>
                        </td>
                        <td className="p-4 flex gap-2">
                           <button className="text-slate-400 hover:text-primary"><Icon icon="solar:eye-bold" /></button>
                           <button className="text-slate-400 hover:text-primary"><Icon icon="solar:printer-bold" /></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

// --- NEW VIEWS FOR REQUESTED MISSING SECTIONS ---

const ReviewsView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Модерация отзывов</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Пользователь</th>
                  <th className="p-4">Товар</th>
                  <th className="p-4">Оценка</th>
                  <th className="p-4">Комментарий</th>
                  <th className="p-4">Дата</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_PENDING_REVIEWS.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{r.user}</td>
                     <td className="p-4 text-primary font-medium">{r.productName}</td>
                     <td className="p-4 text-orange-400 font-bold">{r.rating} ★</td>
                     <td className="p-4 text-slate-600 max-w-xs">{r.comment}</td>
                     <td className="p-4 text-slate-500 text-xs">{r.date}</td>
                     <td className="p-4">
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold uppercase">Ожидает</span>
                     </td>
                     <td className="p-4 flex gap-2">
                        <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600">Одобрить</button>
                        <button className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100">Удалить</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const SupportView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Служба поддержки</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 overflow-y-auto">
            <h3 className="font-bold text-sm text-slate-500 uppercase mb-3">Активные чаты</h3>
            <div className="space-y-2">
               {MOCK_SUPPORT_CHATS.map(chat => (
                  <div key={chat.id} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer flex gap-3">
                     <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {chat.userName[0]}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                           <span className="font-bold text-slate-800 truncate">{chat.userName}</span>
                           <span className="text-[10px] text-slate-400">{chat.timestamp}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">{chat.lastMessage}</div>
                     </div>
                     {chat.unread > 0 && <div className="size-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{chat.unread}</div>}
                  </div>
               ))}
            </div>
         </div>
         <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400">
            <Icon icon="solar:chat-round-line-bold" className="size-16 mb-2 opacity-50" />
            <p>Выберите чат для просмотра</p>
         </div>
      </div>
   </div>
);

const PayoutsView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold">Выплаты продавцам</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Поставщик</th>
                  <th className="p-4">Сумма</th>
                  <th className="p-4">Метод</th>
                  <th className="p-4">Дата</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_PAYOUTS.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{p.supplierName}</td>
                     <td className="p-4 font-bold text-slate-800">{p.amount} с.</td>
                     <td className="p-4 text-slate-600">{p.method}</td>
                     <td className="p-4 text-slate-500">{p.date}</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {p.status}
                        </span>
                     </td>
                     <td className="p-4">
                        {p.status === 'pending' && <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600">Выплатить</button>}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const ProductApprovalView: React.FC<{ products: Product[] }> = ({ products }) => {
   const pendingProducts = products.filter(p => p.approvalStatus === 'pending');
   return (
      <div className="space-y-4 animate-fade-in">
         <h2 className="text-2xl font-bold">Модерация товаров</h2>
         {pendingProducts.length === 0 ? (
            <div className="p-10 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
               Нет товаров ожидающих проверки
            </div>
         ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
               <table className="w-full text-left text-sm min-w-[800px]">
                  <thead className="bg-slate-50 text-slate-500">
                     <tr>
                        <th className="p-4">Фото</th>
                        <th className="p-4">Название</th>
                        <th className="p-4">Цена</th>
                        <th className="p-4">Продавец</th>
                        <th className="p-4">Действия</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {pendingProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                           <td className="p-4"><img src={p.images[0]} className="size-12 rounded-lg bg-slate-100" /></td>
                           <td className="p-4 font-bold text-slate-800">{p.name}</td>
                           <td className="p-4">{p.price} с.</td>
                           <td className="p-4 text-slate-600">ID: {p.supplierId}</td>
                           <td className="p-4 flex gap-2">
                              <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold">Одобрить</button>
                              <button className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-bold">Отклонить</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
};

const CMSView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">CMS / Страницы</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Добавить страницу</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Заголовок</th>
                  <th className="p-4">Slug (URL)</th>
                  <th className="p-4">Обновлено</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_PAGES.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{p.title}</td>
                     <td className="p-4 text-slate-500 font-mono">/{p.slug}</td>
                     <td className="p-4 text-slate-500">{p.lastUpdated}</td>
                     <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Активна</span>
                     </td>
                     <td className="p-4">
                        <button className="text-primary font-bold hover:underline">Редактировать</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const DeliveryZonesView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Зоны доставки</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Добавить зону</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-3">
            {MOCK_ZONES.map(z => (
               <div key={z.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="size-4 rounded-full" style={{ backgroundColor: z.color }}></div>
                     <div>
                        <div className="font-bold text-slate-800">{z.name}</div>
                        <div className="text-xs text-slate-500">{z.description}</div>
                     </div>
                  </div>
                  <div className="font-bold text-primary">{z.cost} с.</div>
               </div>
            ))}
         </div>
         <div className="bg-slate-100 rounded-xl min-h-[300px] flex items-center justify-center text-slate-400 border border-slate-200">
            <Icon icon="solar:map-point-bold" className="size-12 mb-2" />
            <span className="text-sm">Интерактивная карта</span>
         </div>
      </div>
   </div>
);

const NotificationsView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Маркетинг (Push/SMS)</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Создать рассылку</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Заголовок</th>
                  <th className="p-4">Тип</th>
                  <th className="p-4">Получателей</th>
                  <th className="p-4">Дата</th>
                  <th className="p-4">Статус</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_NOTIFICATIONS.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{n.title}</td>
                     <td className="p-4 uppercase text-xs font-bold">{n.type}</td>
                     <td className="p-4">{n.recipientsCount}</td>
                     <td className="p-4 text-slate-500">{n.sentDate}</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${n.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                           {n.status}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

const AttributesView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Атрибуты и Справочники</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Добавить атрибут</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {MOCK_ATTRIBUTES.map(attr => (
            <div key={attr.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
               <div className="text-xs text-slate-400 font-bold uppercase mb-1">{attr.type}</div>
               <div className="font-bold text-slate-800 flex items-center gap-2">
                  {attr.type === 'color' && <div className="size-4 rounded-full border border-slate-200" style={{ backgroundColor: attr.value }}></div>}
                  {attr.name}
               </div>
            </div>
         ))}
      </div>
   </div>
);

const ACLView: React.FC = () => (
   <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Роли и Доступы</h2>
         <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Добавить пользователя</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                  <th className="p-4">Имя</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Роль</th>
                  <th className="p-4">Последний вход</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4">Действия</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {MOCK_ADMIN_USERS.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                     <td className="p-4 font-bold text-slate-800">{u.name}</td>
                     <td className="p-4 text-slate-500">{u.email}</td>
                     <td className="p-4 uppercase text-xs font-bold text-primary">{u.role}</td>
                     <td className="p-4 text-slate-500">{u.lastLogin}</td>
                     <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">{u.status}</span>
                     </td>
                     <td className="p-4 flex gap-2">
                        <button className="text-slate-400 hover:text-primary"><Icon icon="solar:pen-bold" /></button>
                        <button className="text-slate-400 hover:text-red-500"><Icon icon="solar:trash-bin-trash-bold" /></button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   </div>
);

// --- MAIN ADMIN DASHBOARD COMPONENT ---

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBack, products, setProducts, orders, setOrders, customers, setCustomers, categories, setCategories,
  employees = [], setEmployees = () => {}, shifts = [], setShifts = () => {}, financialRecords = [], setFinancialRecords = () => {},
  bookings = [], suppliers = MOCK_SUPPLIERS, setSuppliers = () => {}
}) => {
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Обзор', icon: 'solar:chart-square-bold' },
    { id: 'orders', label: 'Заказы', icon: 'solar:bag-check-bold' },
    { id: 'tables', label: 'Столы (Сборка)', icon: 'solar:box-minimalistic-bold' }, 
    { id: 'warehouse', label: 'Склад', icon: 'solar:clipboard-list-bold' }, 
    { id: 'fitting', label: 'Примерочная', icon: 'solar:hanger-2-bold' },
    { id: 'products', label: 'Товары', icon: 'solar:t-shirt-bold' },
    { id: 'approval', label: 'Модерация', icon: 'solar:check-circle-bold' }, // Added
    { id: 'reviews', label: 'Отзывы', icon: 'solar:star-bold' }, // Added
    { id: 'support', label: 'Поддержка', icon: 'solar:chat-round-dots-bold' }, // Added
    { id: 'categories', label: 'Категории', icon: 'solar:layers-bold' },
    { id: 'departments', label: 'Отделы', icon: 'solar:sitemap-bold' },
    { id: 'finance', label: 'Финансы', icon: 'solar:bill-list-bold' }, 
    { id: 'payouts', label: 'Выплаты', icon: 'solar:card-transfer-bold' }, // Added
    { id: 'customers', label: 'Клиенты', icon: 'solar:users-group-rounded-bold' },
    { id: 'returns', label: 'Возвраты (RMA)', icon: 'solar:restart-bold' },
    { id: 'shops', label: 'Магазины', icon: 'solar:shop-2-bold' },
    { id: 'suppliers_admin', label: 'Поставщики', icon: 'solar:shop-bold' },
    { id: 'employees', label: 'Сотрудники', icon: 'solar:user-id-bold' },
    { id: 'promotions', label: 'Акции', icon: 'solar:gift-bold' }, 
    { id: 'couriers', label: 'Карта курьеров', icon: 'solar:map-point-bold' },
    { id: 'delivery_zones', label: 'Зоны доставки', icon: 'solar:map-arrow-up-bold' }, // Added 
    { id: 'notifications', label: 'Маркетинг', icon: 'solar:bell-bing-bold' }, // Added
    { id: 'cms', label: 'CMS', icon: 'solar:file-text-bold' }, // Added
    { id: 'media', label: 'Медиа', icon: 'solar:gallery-bold' },
    { id: 'attributes', label: 'Атрибуты', icon: 'solar:tag-bold' }, // Added
    { id: 'acl', label: 'Роли', icon: 'solar:shield-user-bold' }, // Added
    { id: 'logs', label: 'Логи', icon: 'solar:history-bold' },
    { id: 'settings', label: 'Настройки', icon: 'solar:settings-bold' },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'overview': return <OverviewView products={products} orders={orders} customers={customers} />;
      case 'orders': return <KanbanBoard orders={orders} onUpdateStatus={() => {}} />; 
      case 'tables': return <TablesView />; 
      case 'warehouse': return <WarehouseView />; 
      case 'fitting': return <FittingRoomView bookings={bookings} />;
      case 'products': return <ProductsView products={products} setProducts={setProducts} />;
      case 'approval': return <ProductApprovalView products={products} />; // Added
      case 'reviews': return <ReviewsView />; // Added
      case 'support': return <SupportView />; // Added
      case 'categories': return <CategoriesView />;
      case 'departments': return <DepartmentsView />;
      case 'finance': return <FinanceView />;
      case 'payouts': return <PayoutsView />; // Added
      case 'customers': return <CustomersView customers={customers} />;
      case 'returns': return <div className="text-center p-10 text-slate-400">Возвраты (Демонстрация)</div>;
      case 'shops': return <ShopsView suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'suppliers_admin': return <SupplierManagementView suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'employees': return <EmployeeManager employees={employees} setEmployees={setEmployees} shifts={shifts} setShifts={setShifts} financialRecords={financialRecords} setFinancialRecords={setFinancialRecords} />;
      case 'promotions': return <PromoBuilder />;
      case 'couriers': return <CourierMap />;
      case 'delivery_zones': return <DeliveryZonesView />; // Added
      case 'notifications': return <NotificationsView />; // Added
      case 'cms': return <CMSView />; // Added
      case 'media': return <MediaView />;
      case 'attributes': return <AttributesView />; // Added
      case 'acl': return <ACLView />; // Added
      case 'logs': return <LogsView />;
      case 'settings': return <SettingsView />;
      default: return <div className="text-center p-10 text-slate-400">Выберите пункт меню</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      <aside className={`bg-white border-r border-slate-100 flex flex-col shrink-0 z-20 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`p-6 border-b border-slate-50 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
           {!isSidebarCollapsed && (
              <div className="flex flex-col">
                 <span className="text-xl font-extrabold text-primary tracking-tighter">
                   GRAND<span className="text-secondary">ADMIN</span>
                 </span>
                 <span className="text-[10px] uppercase tracking-widest text-slate-400">Panel v1.0</span>
              </div>
           )}
           <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="text-slate-400 hover:text-primary transition-colors">
               <Icon icon={isSidebarCollapsed ? "solar:double-alt-arrow-right-bold-duotone" : "solar:double-alt-arrow-left-bold-duotone"} className="size-6" />
           </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveView(item.id)}
               title={isSidebarCollapsed ? item.label : ''}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                 activeView === item.id 
                   ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                   : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
               } ${isSidebarCollapsed ? 'justify-center' : ''}`}
             >
               <Icon icon={item.icon} className="size-6 shrink-0" />
               {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
           <button 
             onClick={onBack}
             title={isSidebarCollapsed ? 'Выйти в магазин' : ''}
             className={`w-full flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors ${isSidebarCollapsed ? 'justify-center' : 'justify-center'}`}
           >
             <Icon icon="solar:logout-bold-duotone" className="size-5 shrink-0" />
             {!isSidebarCollapsed && <span className="whitespace-nowrap">Выйти в магазин</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
         <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-lg font-bold text-slate-800">{menuItems.find(i => i.id === activeView)?.label}</h1>
            <div className="flex items-center gap-4">
               <button className="size-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500 relative">
                  <Icon icon="solar:bell-bold" className="size-5" />
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
               </button>
               <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                  <div className="size-8 rounded-full bg-slate-200 overflow-hidden">
                     <Icon icon="solar:user-bold" className="size-full p-1 text-slate-500" />
                  </div>
                  <span className="text-sm font-bold">Admin</span>
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};
