
import React, { useState, useEffect, useMemo } from 'react';
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

// --- HELPER FOR CHARTS ---
const SimpleLineChart = ({ data, color = '#F97316', height = 60 }: { data: number[], color?: string, height?: number }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = 100 / (data.length - 1);
  
  const points = data.map((val, i) => {
    const x = i * stepX;
    // Normalize y (0 at bottom, 100 at top)
    const y = 100 - ((val - min) / range) * 100; 
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline 
         fill="none" 
         stroke={color} 
         strokeWidth="2" 
         points={points} 
         vectorEffect="non-scaling-stroke"
         strokeLinecap="round" 
         strokeLinejoin="round"
      />
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon 
         fill={`url(#grad-${color})`} 
         points={`0,100 ${points} 100,100`} 
      />
    </svg>
  );
};

// --- PRODUCT FORM COMPONENT ---

const ProductForm: React.FC<{ 
  product?: Product | null, 
  onSave: (p: Product) => void, 
  onCancel: () => void,
  categories: Category[],
  suppliers: Supplier[]
}> = ({ product, onSave, onCancel, categories, suppliers }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    buyPrice: 0,
    oldPrice: 0,
    stock: 0,
    category: categories[0]?.id || 'men',
    subCategory: '',
    images: [''],
    isNew: true,
    isTop: false,
    supplierId: suppliers[0]?.id || '',
    material: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      id: product?.id || Math.floor(Math.random() * 10000),
      rating: product?.rating || 0,
      reviews: product?.reviews || [],
      colors: product?.colors || ['Черный'],
      sizes: product?.sizes || ['M', 'L'],
      images: formData.images?.filter(i => i) || []
    } as Product;
    onSave(newProduct);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
       <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <h3 className="text-xl font-bold text-slate-800">
               {product ? 'Редактирование товара' : 'Новый товар'}
             </h3>
             <button onClick={onCancel} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm">
                <Icon icon="solar:close-circle-bold" className="size-6" />
             </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
             <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <Icon icon="solar:document-text-bold" className="text-primary" />
                         Основная информация
                      </h4>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Название товара</label>
                            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Напр: Куртка зимняя" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Описание</label>
                            <textarea rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Детальное описание..." />
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <Icon icon="solar:gallery-bold" className="text-blue-600" />
                         Медиа
                      </h4>
                      <div className="space-y-3">
                         <label className="block text-xs font-bold text-slate-500">Ссылки на изображения</label>
                         {formData.images?.map((img, idx) => (
                            <div key={idx} className="flex gap-2">
                               <input type="text" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl" value={img} onChange={e => {
                                  const newImages = [...(formData.images || [])];
                                  newImages[idx] = e.target.value;
                                  setFormData({...formData, images: newImages});
                               }} placeholder="https://..." />
                               {img && <img src={img} className="size-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />}
                            </div>
                         ))}
                         <button type="button" onClick={() => setFormData({...formData, images: [...(formData.images || []), '']})} className="text-sm font-bold text-primary hover:underline">
                            + Добавить фото
                         </button>
                      </div>
                   </div>

                   <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <Icon icon="solar:tag-price-bold" className="text-green-600" />
                         Цены и Склад
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Цена продажи (с.)</label>
                            <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Старая цена (с.)</label>
                            <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.oldPrice || ''} onChange={e => setFormData({...formData, oldPrice: Number(e.target.value)})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Закупочная цена (с.)</label>
                            <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.buyPrice || ''} onChange={e => setFormData({...formData, buyPrice: Number(e.target.value)})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Остаток на складе</label>
                            <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                   <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4">Классификация</h4>
                      <div className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Категория</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Подкатегория</label>
                            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Поставщик</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})}>
                               <option value="">Без поставщика</option>
                               {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-4">Метки</h4>
                      <div className="space-y-3">
                         <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                            <input type="checkbox" className="size-5 accent-primary" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} />
                            <span className="font-medium text-sm">Новинка (New)</span>
                         </label>
                         <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                            <input type="checkbox" className="size-5 accent-primary" checked={formData.isTop} onChange={e => setFormData({...formData, isTop: e.target.checked})} />
                            <span className="font-medium text-sm">Хит продаж (Top)</span>
                         </label>
                      </div>
                   </div>
                </div>
             </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
             <button onClick={onCancel} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Отмена</button>
             <button form="product-form" type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30">
                {product ? 'Сохранить изменения' : 'Создать товар'}
             </button>
          </div>
       </div>
    </div>
  );
};

// --- VIEW COMPONENTS ---

const OverviewView: React.FC<{ products: Product[], orders: Order[], customers: Customer[], employees: EmployeeExtended[] }> = ({ products, orders, customers, employees }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  // --- LOGIC FOR KPIS & CHARTS ---
  // In a real app, these would be calculated from backend data with real dates.
  // Here we simulate values based on timeRange for demonstration.
  
  const multiplier = timeRange === 'day' ? 1 : timeRange === 'week' ? 5 : 20;
  
  const stats = {
     revenue: 15400 * multiplier,
     revenueGrowth: 12,
     ordersCount: 24 * multiplier,
     avgCheck: Math.round(15400 / 24),
     profit: (15400 * 0.35) * multiplier, // Assuming 35% margin
     profitGrowth: 8,
  };

  // Mock data for charts
  const salesData = timeRange === 'day' 
     ? [1200, 2400, 1800, 3200, 4500, 2100, 15400] // Hourly-ish
     : timeRange === 'week'
     ? [15000, 18000, 12000, 22000, 25000, 30000, 15400] // Daily
     : [120000, 150000, 180000, 200000]; // Weekly

  const activeCouriers = employees.filter(e => e.role === 'courier' && e.status === 'working').length;
  const topProducts = products.filter(p => p.isTop).slice(0, 4);
  
  // Action Items Logic
  const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;
  const pendingOrders = orders.filter(o => o.status === 'new' || o.status === 'processing').length;
  const returnsCount = 2; // Mock

  const KPICard = ({ title, value, subtext, icon, color, bg, chartData }: any) => (
     <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
           <div className={`size-10 rounded-xl ${bg} ${color} flex items-center justify-center`}>
              <Icon icon={icon} className="size-5" />
           </div>
           {subtext && (
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${subtext.includes('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                 {subtext}
              </span>
           )}
        </div>
        <div>
           <div className="text-slate-400 text-xs font-bold uppercase mb-1">{title}</div>
           <div className="text-2xl font-black text-slate-800">{value}</div>
        </div>
        {chartData && (
           <div className="absolute bottom-0 right-0 w-1/2 h-12 opacity-20">
              <SimpleLineChart data={chartData} color={color.replace('text-', '').replace('-600', '') === 'green' ? '#16a34a' : '#F97316'} />
           </div>
        )}
     </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-slate-800">Обзор</h2>
             <p className="text-sm text-slate-500">Сводка ключевых показателей эффективности</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             {['day', 'week', 'month'].map((r) => (
                <button 
                   key={r}
                   onClick={() => setTimeRange(r as any)}
                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      timeRange === r ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                   }`}
                >
                   {r === 'day' ? 'Сегодня' : r === 'week' ? 'Неделя' : 'Месяц'}
                </button>
             ))}
          </div>
       </div>
       
       {/* 1. KPI Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
             title="Выручка" 
             value={`${stats.revenue.toLocaleString()} с.`} 
             subtext={`+${stats.revenueGrowth}%`} 
             icon="solar:wallet-money-bold" 
             color="text-green-600" bg="bg-green-50"
             chartData={salesData}
          />
          <KPICard 
             title="Заказы" 
             value={stats.ordersCount} 
             subtext="+5" 
             icon="solar:bag-check-bold" 
             color="text-blue-600" bg="bg-blue-50"
          />
          <KPICard 
             title="Чистая прибыль" 
             value={`${Math.round(stats.profit).toLocaleString()} с.`} 
             subtext={`+${stats.profitGrowth}%`} 
             icon="solar:chart-square-bold" 
             color="text-purple-600" bg="bg-purple-50"
          />
          <KPICard 
             title="Средний чек" 
             value={`${stats.avgCheck} с.`} 
             subtext="-2%" 
             icon="solar:bill-list-bold" 
             color="text-orange-600" bg="bg-orange-50"
          />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 2. Main Chart Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Динамика продаж</h3>
                <button className="text-slate-400 hover:text-primary"><Icon icon="solar:menu-dots-bold" /></button>
             </div>
             <div className="h-64 w-full flex items-end gap-2">
                {/* Simple Bar Chart Simulation */}
                {salesData.map((val, i) => {
                   const height = (val / Math.max(...salesData)) * 100;
                   return (
                      <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer">
                         <div className="text-[10px] text-center text-slate-500 opacity-0 group-hover:opacity-100 mb-1 font-bold">{val}</div>
                         <div 
                           className="w-full bg-primary/80 rounded-t-lg hover:bg-primary transition-all relative"
                           style={{ height: `${height}%` }}
                         ></div>
                      </div>
                   )
                })}
             </div>
             <div className="flex justify-between mt-4 text-xs text-slate-400 font-bold uppercase">
                {timeRange === 'day' 
                   ? ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'].map(t => <span key={t}>{t}</span>)
                   : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(t => <span key={t}>{t}</span>)
                }
             </div>
          </div>

          {/* 3. Action Center & Alerts */}
          <div className="space-y-6">
             {/* Action Needed */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                   <Icon icon="solar:bell-bing-bold" />
                   Требует внимания
                </h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                         <div className="size-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                            <Icon icon="solar:box-bold" />
                         </div>
                         <span className="text-sm font-bold text-slate-700">Новые заказы</span>
                      </div>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">{pendingOrders}</span>
                   </div>

                   <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-3">
                         <div className="size-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                            <Icon icon="solar:danger-circle-bold" />
                         </div>
                         <span className="text-sm font-bold text-slate-700">Заканчивается</span>
                      </div>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">{lowStockCount}</span>
                   </div>

                   <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-3">
                         <div className="size-8 bg-white rounded-full flex items-center justify-center text-orange-600 shadow-sm">
                            <Icon icon="solar:restart-bold" />
                         </div>
                         <span className="text-sm font-bold text-slate-700">Возвраты</span>
                      </div>
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">{returnsCount}</span>
                   </div>
                </div>
             </div>

             {/* Logistics Status */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4">Логистика</h3>
                <div className="flex items-center justify-between mb-4">
                   <div className="text-sm text-slate-500">Активных курьеров</div>
                   <div className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                      {activeCouriers} чел.
                   </div>
                </div>
                <div className="bg-slate-100 rounded-xl p-4 text-center">
                   <div className="text-2xl font-black text-slate-800 mb-1">12 мин</div>
                   <div className="text-xs text-slate-500 font-bold uppercase">Среднее время доставки</div>
                </div>
             </div>
          </div>
       </div>

       {/* 4. Recent Lists Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Последние заказы</h3>
                <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">Все заказы</button>
             </div>
             <div className="space-y-3">
                {orders.slice(0, 4).map(order => (
                   <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-500 text-xs shadow-sm">
                            {order.id.slice(-3)}
                         </div>
                         <div>
                            <div className="font-bold text-slate-800 text-sm">{order.customerName}</div>
                            <div className="text-[10px] text-slate-400">{order.items.length} товаров • {order.date}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="font-bold text-slate-800 text-sm">{order.total} c.</div>
                         <div className={`text-[10px] font-bold uppercase ${
                            order.status === 'new' ? 'text-blue-600' : 
                            order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'
                         }`}>{order.status}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-lg mb-4">Топ товары</h3>
             <div className="space-y-4">
                {topProducts.map((p, i) => (
                   <div key={p.id} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="size-6 bg-slate-800 text-white rounded-lg flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                      <img src={p.images[0]} className="size-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                         <div className="text-sm font-bold text-slate-800 truncate">{p.name}</div>
                         <div className="text-xs text-slate-400">Остаток: {p.stock} шт.</div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-bold text-green-600">{p.price} с.</div>
                         <div className="text-[10px] text-slate-400">{Math.floor(Math.random() * 50) + 10} продаж</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const ProductsView: React.FC<{ 
  products: Product[], 
  setProducts: (p: Product[]) => void, 
  categories: Category[], 
  suppliers: Supplier[] 
}> = ({ products, setProducts, categories, suppliers }) => {
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedIds, setSelectedIds] = useState<number[]>([]);
   const [filterCategory, setFilterCategory] = useState('all');
   const [filterStatus, setFilterStatus] = useState('all');
   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);

   // KPIs
   const totalProducts = products.length;
   const totalValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
   const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;
   
   // Computed Products
   const filteredProducts = useMemo(() => {
      let result = products;
      if (searchQuery) {
         const q = searchQuery.toLowerCase();
         result = result.filter(p => p.name.toLowerCase().includes(q) || String(p.id).includes(q));
      }
      if (filterCategory !== 'all') {
         result = result.filter(p => p.category === filterCategory);
      }
      if (filterStatus === 'in_stock') {
         result = result.filter(p => (p.stock || 0) > 0);
      } else if (filterStatus === 'out_of_stock') {
         result = result.filter(p => (p.stock || 0) === 0);
      }
      return result;
   }, [products, searchQuery, filterCategory, filterStatus]);

   const toggleSelect = (id: number) => {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
   };

   const toggleSelectAll = () => {
      if (selectedIds.length === filteredProducts.length) {
         setSelectedIds([]);
      } else {
         setSelectedIds(filteredProducts.map(p => p.id));
      }
   };

   const handleDeleteSelected = () => {
      if (confirm(`Удалить ${selectedIds.length} товаров?`)) {
         setProducts(products.filter(p => !selectedIds.includes(p.id)));
         setSelectedIds([]);
      }
   };

   const handleSaveProduct = (product: Product) => {
      if (editingProduct) {
         setProducts(products.map(p => p.id === product.id ? product : p));
      } else {
         setProducts([product, ...products]);
      }
      setIsFormOpen(false);
      setEditingProduct(null);
   };

   const KPICard = ({ icon, title, value, color, bg }: any) => (
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
         <div className={`size-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
            <Icon icon={icon} className="size-6" />
         </div>
         <div>
            <div className="text-xs font-bold text-slate-400 uppercase">{title}</div>
            <div className="text-2xl font-black text-slate-800">{value}</div>
         </div>
      </div>
   );

   return (
      <div className="space-y-6 animate-fade-in pb-10">
         {isFormOpen && (
            <ProductForm 
               product={editingProduct} 
               onSave={handleSaveProduct} 
               onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
               categories={categories}
               suppliers={suppliers}
            />
         )}

         {/* 1. KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard icon="solar:t-shirt-bold" title="Всего товаров" value={totalProducts} color="text-blue-600" bg="bg-blue-50" />
            <KPICard icon="solar:wallet-money-bold" title="На складе (Цена)" value={`${(totalValue / 1000).toFixed(1)}k c.`} color="text-green-600" bg="bg-green-50" />
            <KPICard icon="solar:danger-circle-bold" title="Низкий остаток" value={lowStockCount} color="text-red-500" bg="bg-red-50" />
            <KPICard icon="solar:layers-bold" title="Категорий" value={categories.length} color="text-purple-600" bg="bg-purple-50" />
         </div>

         {/* 2. Toolbar */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
               <div className="relative group w-full md:w-64">
                  <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Название, артикул..." 
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-all"
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                  />
               </div>
               <select 
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-primary cursor-pointer"
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
               >
                  <option value="all">Все категории</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               <select 
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-primary cursor-pointer"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
               >
                  <option value="all">Любой статус</option>
                  <option value="in_stock">В наличии</option>
                  <option value="out_of_stock">Нет в наличии</option>
               </select>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
               <button 
                  onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                  className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/30 flex items-center gap-2 hover:bg-primary/90 transition-colors active:scale-95"
               >
                  <Icon icon="solar:add-circle-bold" />
                  Добавить
               </button>
            </div>
         </div>

         {/* 3. Bulk Actions Bar */}
         {selectedIds.length > 0 && (
            <div className="bg-slate-900 text-white p-3 rounded-xl flex justify-between items-center animate-fade-in shadow-lg">
               <div className="flex items-center gap-4 px-2">
                  <span className="font-bold text-sm">Выбрано: {selectedIds.length}</span>
                  <div className="h-4 w-px bg-slate-700"></div>
                  <button className="text-xs font-bold hover:text-slate-300">Изменить статус</button>
               </div>
               <button 
                  onClick={handleDeleteSelected}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
               >
                  <Icon icon="solar:trash-bin-trash-bold" />
                  Удалить
               </button>
            </div>
         )}

         {/* 4. Products Table */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[900px]">
               <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                     <th className="p-4 w-10">
                        <input type="checkbox" className="size-4 accent-primary cursor-pointer" checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0} onChange={toggleSelectAll} />
                     </th>
                     <th className="p-4">Товар</th>
                     <th className="p-4">Цена / Закуп</th>
                     <th className="p-4 w-48">Склад</th>
                     <th className="p-4">Категория</th>
                     <th className="p-4">Поставщик</th>
                     <th className="p-4">Статус</th>
                     <th className="p-4 text-right">Действия</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredProducts.map(p => {
                     const isSelected = selectedIds.includes(p.id);
                     const stock = p.stock || 0;
                     const maxStock = 20; 
                     const stockPercent = Math.min(100, (stock / maxStock) * 100);
                     const stockColor = stock === 0 ? 'bg-slate-200' : stock < 5 ? 'bg-red-500' : 'bg-green-500';

                     return (
                        <tr key={p.id} className={`group transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                           <td className="p-4">
                              <input type="checkbox" className="size-4 accent-primary cursor-pointer" checked={isSelected} onChange={() => toggleSelect(p.id)} />
                           </td>
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="size-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                    <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-slate-800 line-clamp-1">{p.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: GM-{p.id}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-4">
                              <div className="font-bold text-slate-800">{p.price} с.</div>
                              <div className="text-[10px] text-slate-400">Закуп: {p.buyPrice || '-'} с.</div>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className={`text-xs font-bold ${stock < 5 ? 'text-red-500' : 'text-slate-700'}`}>{stock} шт.</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${stockColor}`} style={{ width: `${stockPercent}%` }}></div>
                              </div>
                           </td>
                           <td className="p-4 text-slate-600 font-medium capitalize">
                              {p.category}
                           </td>
                           <td className="p-4 text-xs text-slate-500">
                              {suppliers.find(s => s.id === p.supplierId)?.name || 'Собственный'}
                           </td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {stock > 0 ? 'В наличии' : 'Нет на складе'}
                              </span>
                           </td>
                           <td className="p-4 text-right">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                    onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"
                                 >
                                    <Icon icon="solar:pen-bold" />
                                 </button>
                                 <button 
                                    onClick={() => {
                                       if(confirm('Удалить товар?')) {
                                          setProducts(products.filter(pr => pr.id !== p.id));
                                       }
                                    }}
                                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 text-red-500"
                                 >
                                    <Icon icon="solar:trash-bin-trash-bold" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
};

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

const TablesView: React.FC<{ 
  employees: EmployeeExtended[], 
  orders: Order[] 
}> = ({ employees, orders }) => {
   const [tables, setTables] = useState<PackingTable[]>(MOCK_PACKING_TABLES);
   const [activeTable, setActiveTable] = useState<PackingTable | null>(null);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [currentTable, setCurrentTable] = useState<Partial<PackingTable>>({});

   const handleSave = () => {
      if (currentTable.id) {
         setTables(tables.map(t => t.id === currentTable.id ? { ...t, ...currentTable } as PackingTable : t));
      } else {
         const newTable: PackingTable = {
            id: `tbl-${Date.now()}`,
            name: currentTable.name || 'New Table',
            supervisorId: currentTable.supervisorId || '',
            supervisorName: employees.find(e => e.id === currentTable.supervisorId)?.fullName || 'Unknown',
            status: 'active',
            currentOrderIds: [],
            totalOrdersProcessed: 0
         };
         setTables([...tables, newTable]);
      }
      setIsEditOpen(false);
   };

   const handleDelete = (id: string) => {
      if(confirm('Удалить этот стол?')) {
         setTables(tables.filter(t => t.id !== id));
      }
   };

   if (activeTable) {
      // WORKSTATION MODE
      return (
         <div className="space-y-4 animate-fade-in h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <button onClick={() => setActiveTable(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <Icon icon="solar:arrow-left-linear" className="size-6" />
               </button>
               <div>
                  <h2 className="text-xl font-bold">{activeTable.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                     <Icon icon="solar:user-id-bold" className="size-4" />
                     {activeTable.supervisorName}
                  </div>
               </div>
               <div className="ml-auto flex gap-3">
                  <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm flex items-center gap-2">
                     <Icon icon="solar:box-bold" />
                     В очереди: {activeTable.currentOrderIds.length}
                  </div>
                  <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm flex items-center gap-2">
                     <Icon icon="solar:check-circle-bold" />
                     Собрано: {activeTable.totalOrdersProcessed}
                  </div>
               </div>
            </div>

            {/* Workstation Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
               {/* Left: Queue */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100 font-bold text-slate-700">Очередь заказов</div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                     {activeTable.currentOrderIds.map(oid => {
                        const order = orders.find(o => o.id === oid) || { id: oid, customerName: 'Unknown', items: [] };
                        return (
                           <div key={oid} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer group">
                              <div className="flex justify-between mb-1">
                                 <span className="font-bold text-sm">{oid}</span>
                                 <span className="text-xs font-bold text-orange-500">Express</span>
                              </div>
                              <div className="text-xs text-slate-500 mb-2">{(order as Order).customerName}</div>
                              <div className="flex gap-1">
                                 {(order as Order).items?.slice(0, 4).map((item, i) => (
                                    <div key={i} className={`size-8 rounded-md border flex items-center justify-center ${item.pickedStatus === 'picked' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-red-50 border-red-100 text-red-300'}`}>
                                       <Icon icon="solar:t-shirt-bold" className="size-4" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )
                     })}
                     <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors">
                        + Сканировать заказ
                     </button>
                  </div>
               </div>

               {/* Right: Active Workspace */}
               <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                  {/* Active Order Detail Mockup */}
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                     <Icon icon="solar:box-minimalistic-bold" className="size-24 opacity-20 mb-4" />
                     <p>Выберите заказ из очереди или сканируйте штрих-код</p>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // OVERVIEW MODE
   return (
      <div className="space-y-6 animate-fade-in">
         {/* Modal */}
         {isEditOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">{currentTable.id ? 'Редактировать стол' : 'Новый стол'}</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Название</label>
                        <input type="text" className="w-full p-3 bg-slate-50 border rounded-xl" value={currentTable.name || ''} onChange={e => setCurrentTable({...currentTable, name: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Ответственный</label>
                        <select className="w-full p-3 bg-slate-50 border rounded-xl" value={currentTable.supervisorId || ''} onChange={e => setCurrentTable({...currentTable, supervisorId: e.target.value})}>
                           <option value="">Выберите сотрудника</option>
                           {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Статус</label>
                        <select className="w-full p-3 bg-slate-50 border rounded-xl" value={currentTable.status || 'active'} onChange={e => setCurrentTable({...currentTable, status: e.target.value as any})}>
                           <option value="active">Активен</option>
                           <option value="busy">Занят (Перегруз)</option>
                           <option value="closed">Закрыт</option>
                        </select>
                     </div>
                     <div className="flex gap-2 pt-2">
                        <button onClick={() => setIsEditOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-slate-600">Отмена</button>
                        <button onClick={handleSave} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold">Сохранить</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-2xl font-bold text-slate-800">Столы упаковки</h2>
               <p className="text-sm text-slate-500">Управление зоной комплектации заказов</p>
            </div>
            <button 
               onClick={() => { setCurrentTable({}); setIsEditOpen(true); }}
               className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/30 flex items-center gap-2 hover:scale-105 transition-transform"
            >
               <Icon icon="solar:add-circle-bold" className="size-5" />
               Добавить стол
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
               <div key={table.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="text-xl font-black text-slate-800">{table.name}</h3>
                           <div className={`size-3 rounded-full ${table.status === 'active' ? 'bg-green-500 animate-pulse' : table.status === 'busy' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                        </div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{table.status === 'active' ? 'Активен' : table.status === 'busy' ? 'Перегружен' : 'Закрыт'}</div>
                     </div>
                     <div className="flex gap-1">
                        <button onClick={() => { setCurrentTable(table); setIsEditOpen(true); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                           <Icon icon="solar:pen-bold" />
                        </button>
                        <button onClick={() => handleDelete(table.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                           <Icon icon="solar:trash-bin-trash-bold" />
                        </button>
                     </div>
                  </div>

                  <div className="space-y-4 mb-6">
                     <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3 border border-slate-100">
                        <div className="size-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-500 border border-slate-200 shadow-sm">
                           {table.supervisorName[0]}
                        </div>
                        <div>
                           <div className="text-xs text-slate-400 font-bold uppercase">Супервайзер</div>
                           <div className="font-bold text-sm text-slate-800">{table.supervisorName}</div>
                        </div>
                     </div>

                     <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                           <span className="text-slate-500">Загрузка ({table.currentOrderIds.length})</span>
                           <span className={table.currentOrderIds.length > 5 ? 'text-red-500' : 'text-green-500'}>{table.currentOrderIds.length > 5 ? 'Высокая' : 'Норма'}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full ${table.currentOrderIds.length > 5 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${Math.min(100, table.currentOrderIds.length * 10)}%`}}></div>
                        </div>
                     </div>
                  </div>

                  <button 
                     onClick={() => setActiveTable(table)}
                     className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                     <Icon icon="solar:monitor-bold" />
                     Открыть терминал
                  </button>
               </div>
            ))}
            
            {/* Add Placeholder */}
            <button 
               onClick={() => { setCurrentTable({}); setIsEditOpen(true); }}
               className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-primary hover:text-primary hover:bg-orange-50/50 transition-all cursor-pointer min-h-[280px]"
            >
               <div className="size-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <Icon icon="solar:add-circle-bold" className="size-8" />
               </div>
               <span className="font-bold text-lg">Добавить стол</span>
            </button>
         </div>
      </div>
   );
};

const WarehouseView: React.FC<{ products: Product[], setProducts: (p: Product[]) => void }> = ({ products, setProducts }) => {
   const [mode, setMode] = useState<'inventory' | 'stocktake' | 'documents'>('inventory');
   const [docType, setDocType] = useState<'all' | 'income' | 'writeoff' | 'transfer'>('all');
   const [search, setSearch] = useState('');
   
   // KPI Calculations
   const totalValue = products.reduce((acc, p) => acc + (p.buyPrice || p.price * 0.6) * (p.stock || 0), 0);
   const totalItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
   const lowStock = products.filter(p => (p.stock || 0) < 5).length;
   
   // Handlers
   const handleUpdateStock = (id: number, delta: number) => {
      setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p));
   };

   const handleManualStockChange = (id: number, value: string) => {
      const num = parseInt(value) || 0;
      setProducts(products.map(p => p.id === id ? { ...p, stock: num } : p));
   };

   return (
      <div className="space-y-6 animate-fade-in pb-10">
         
         {/* Top KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="size-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center"><Icon icon="solar:wallet-money-bold" className="size-6" /></div>
               <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Стоимость склада</div>
                  <div className="text-2xl font-black text-slate-800">{totalValue.toLocaleString()} с.</div>
               </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="size-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center"><Icon icon="solar:box-bold" className="size-6" /></div>
               <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Всего единиц</div>
                  <div className="text-2xl font-black text-slate-800">{totalItems} шт.</div>
               </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="size-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"><Icon icon="solar:danger-circle-bold" className="size-6" /></div>
               <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Дефицит (Low Stock)</div>
                  <div className="text-2xl font-black text-red-500">{lowStock} товаров</div>
               </div>
            </div>
         </div>

         {/* Tabs & Actions */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
               <button onClick={() => setMode('inventory')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'inventory' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Остатки</button>
               <button onClick={() => setMode('documents')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'documents' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Документы</button>
            </div>

            {mode === 'inventory' && (
               <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                     <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                        type="text" 
                        placeholder="Поиск товара..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-primary" 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                     />
                  </div>
                  <button 
                     onClick={() => setMode(mode === 'stocktake' ? 'inventory' : 'stocktake')} 
                     className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${mode === 'stocktake' ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                     <Icon icon="solar:checklist-minimalistic-bold" />
                     {mode === 'stocktake' ? 'Завершить ревизию' : 'Ревизия'}
                  </button>
                  <button onClick={() => alert('Эмуляция сканера штрих-кода')} className="size-11 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform">
                     <Icon icon="solar:scanner-bold" className="size-5" />
                  </button>
               </div>
            )}
            
            {mode === 'documents' && (
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                   <Icon icon="solar:file-text-bold" />
                   Создать документ
                </button>
            )}
         </div>

         {/* INVENTORY / STOCKTAKE MODE */}
         {(mode === 'inventory' || mode === 'stocktake') && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                     <tr>
                        <th className="p-4">Товар</th>
                        <th className="p-4">Категория</th>
                        <th className="p-4 w-1/4">Текущий остаток</th>
                        <th className="p-4">Статус</th>
                        <th className="p-4 text-right">Действия</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => {
                        const stock = p.stock || 0;
                        const maxStock = 20; // Mock max for bar
                        const percentage = Math.min(100, (stock / maxStock) * 100);
                        const color = stock === 0 ? 'bg-slate-300' : stock < 5 ? 'bg-red-500' : 'bg-green-500';

                        return (
                           <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 flex items-center gap-3">
                                 <div className="size-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                    <img src={p.images[0]} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <div className="font-bold text-slate-800">{p.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">SKU: {p.id}</div>
                                 </div>
                              </td>
                              <td className="p-4 text-slate-500 capitalize">{p.category}</td>
                              <td className="p-4">
                                 {mode === 'stocktake' ? (
                                    <div className="flex items-center gap-2">
                                       <button onClick={() => handleUpdateStock(p.id, -1)} className="size-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center font-bold hover:bg-red-100">-</button>
                                       <input 
                                          type="number" 
                                          className="w-20 text-center font-bold text-lg border-b-2 border-slate-200 focus:border-primary outline-none bg-transparent" 
                                          value={stock} 
                                          onChange={(e) => handleManualStockChange(p.id, e.target.value)}
                                       />
                                       <button onClick={() => handleUpdateStock(p.id, 1)} className="size-8 bg-green-50 text-green-500 rounded-lg flex items-center justify-center font-bold hover:bg-green-100">+</button>
                                    </div>
                                 ) : (
                                    <div>
                                       <div className="flex justify-between text-xs font-bold mb-1">
                                          <span>{stock} шт.</span>
                                          <span className="text-slate-400">из {maxStock}</span>
                                       </div>
                                       <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{width: `${percentage}%`}}></div>
                                       </div>
                                    </div>
                                 )}
                              </td>
                              <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${stock > 5 ? 'bg-green-100 text-green-700' : stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {stock > 5 ? 'Норма' : stock > 0 ? 'Мало' : 'Пусто'}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button 
                                       onClick={() => handleUpdateStock(p.id, -1)} 
                                       title="Списать брак"
                                       className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center gap-1"
                                    >
                                       <Icon icon="solar:fire-bold" /> Брак
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-primary bg-slate-50 rounded-lg">
                                       <Icon icon="solar:history-bold" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         )}

         {/* DOCUMENTS MODE */}
         {mode === 'documents' && (
            <div className="space-y-4">
               <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                     { id: 'all', label: 'Все' },
                     { id: 'income', label: 'Приход' },
                     { id: 'writeoff', label: 'Списания' },
                     { id: 'transfer', label: 'Перемещения' }
                  ].map(tab => (
                     <button 
                        key={tab.id}
                        onClick={() => setDocType(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${docType === tab.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
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
                        {MOCK_WAREHOUSE_DOCUMENTS.filter(d => docType === 'all' || d.type === docType).map(doc => (
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
         )}
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

const PlaceholderView: React.FC<{ title: string, icon: string }> = ({ title, icon }) => (
   <div className="flex flex-col items-center justify-center h-[500px] text-slate-400 animate-fade-in">
      <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
         <Icon icon={icon} className="size-10 opacity-50" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="max-w-md text-center">Раздел находится в разработке</p>
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
      case 'overview': return <OverviewView products={products} orders={orders} customers={customers} employees={employees} />;
      case 'orders': return <KanbanBoard orders={orders} onUpdateStatus={() => {}} />; 
      case 'tables': return <TablesView employees={employees} orders={orders} />; 
      case 'warehouse': return <WarehouseView products={products} setProducts={setProducts} />; 
      case 'fitting': return <FittingRoomView bookings={bookings} />;
      case 'products': return <ProductsView products={products} setProducts={setProducts} categories={categories} suppliers={suppliers} />;
      case 'approval': return <ProductApprovalView products={products} />; // Added
      case 'reviews': return <ReviewsView />; // Added
      case 'support': return <SupportView />; // Added
      case 'categories': return <CategoriesView />;
      case 'departments': return <DepartmentsView />;
      case 'finance': return <FinanceView />;
      case 'payouts': return <PayoutsView />; // Added
      case 'customers': return <CustomersView customers={customers} />;
      case 'returns': return <PlaceholderView title="Возвраты (RMA)" icon="solar:restart-bold" />;
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
