
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
  const todaysOrders = orders.filter(o => o.date === new Date().toLocaleDateString()).length;
  const revenueToday = 15400; // Mock
  const activeCouriers = employees.filter(e => e.role === 'courier' && e.status === 'working').length;
  
  return (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold">Обзор</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Выручка сегодня</div>
                <div className="text-2xl font-black text-slate-800">{revenueToday} с.</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Заказов</div>
                <div className="text-2xl font-black text-slate-800">{todaysOrders + 5}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Курьеры</div>
                <div className="text-2xl font-black text-slate-800">{activeCouriers} на линии</div>
            </div>
        </div>
    </div>
  );
};

const TablesView: React.FC<{ employees: EmployeeExtended[], orders: Order[] }> = ({ employees, orders }) => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-bold">Столы сборки</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {MOCK_PACKING_TABLES.map(table => (
        <div key={table.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-800">{table.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${table.status === 'active' ? 'bg-green-100 text-green-700' : table.status === 'busy' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
              {table.status}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
             <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                {table.supervisorName[0]}
             </div>
             <div>
                <div className="font-bold text-sm">{table.supervisorName}</div>
                <div className="text-xs text-slate-400">Супервайзер</div>
             </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl text-center">
             <div className="text-xs text-slate-400 uppercase font-bold mb-1">Обработано заказов</div>
             <div className="text-2xl font-black text-slate-800">{table.totalOrdersProcessed}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductsView: React.FC<{ products: Product[], setProducts: (p: Product[]) => void, categories: Category[], suppliers: Supplier[] }> = ({ products, setProducts, categories, suppliers }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSave = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([product, ...products]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onSave={handleSave} 
          onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }} 
          categories={categories}
          suppliers={suppliers}
        />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Товары</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Добавить товар</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Название</th>
              <th className="p-4">Категория</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Остаток</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{p.name}</td>
                <td className="p-4 text-slate-500">{p.category}</td>
                <td className="p-4 font-bold">{p.price} с.</td>
                <td className="p-4">{p.stock} шт.</td>
                <td className="p-4">
                  <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} className="text-primary font-bold hover:underline">Ред.</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CategoriesView: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <h2 className="text-2xl font-bold">Категории</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {MOCK_CATEGORIES.map(cat => (
        <div key={cat.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
           <img src={cat.image} className="w-full h-32 object-cover rounded-lg mb-3" />
           <h3 className="font-bold text-lg">{cat.name}</h3>
           <div className="text-xs text-slate-500">{cat.subcategories.length} подкатегорий</div>
        </div>
      ))}
    </div>
  </div>
);

const DepartmentsView: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <h2 className="text-2xl font-bold">Отделы</h2>
    <div className="space-y-3">
      {MOCK_DEPARTMENTS.map(dep => (
        <div key={dep.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
           <div>
              <h3 className="font-bold text-lg">{dep.name}</h3>
              <p className="text-sm text-slate-500">{dep.description}</p>
           </div>
           <div className="text-right">
              <div className="text-2xl font-black text-slate-800">{dep.productCount}</div>
              <div className="text-xs text-slate-400 uppercase font-bold">Товаров</div>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const FinanceView: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-bold">Финансы</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase mb-1">Доход (мес)</div>
           <div className="text-2xl font-black text-green-600">+45,200 с.</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase mb-1">Расход (мес)</div>
           <div className="text-2xl font-black text-red-600">-12,500 с.</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase mb-1">Чистая прибыль</div>
           <div className="text-2xl font-black text-slate-800">32,700 с.</div>
        </div>
    </div>
    {/* Mock Chart Placeholder */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center">
       <SimpleLineChart data={[10, 25, 15, 40, 35, 50, 45, 60, 55, 70]} />
    </div>
  </div>
);

const CustomersView: React.FC<{ customers: Customer[] }> = ({ customers }) => (
  <div className="space-y-4 animate-fade-in">
    <h2 className="text-2xl font-bold">Клиенты</h2>
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-4">Имя</th>
            <th className="p-4">Телефон</th>
            <th className="p-4">Заказов</th>
            <th className="p-4">Потрачено</th>
            <th className="p-4">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {customers.map(c => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="p-4 font-bold text-slate-800">{c.name}</td>
              <td className="p-4 text-slate-600">{c.phone}</td>
              <td className="p-4">{c.ordersCount}</td>
              <td className="p-4 font-bold">{c.totalSpent} с.</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ShopsView: React.FC<{ suppliers: Supplier[], setSuppliers: (s: Supplier[]) => void }> = ({ suppliers }) => (
  <div className="space-y-4 animate-fade-in">
    <h2 className="text-2xl font-bold">Магазины (Партнеры)</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       {suppliers.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{s.name}</h3>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">ID: {s.id}</span>
             </div>
             <div className="text-sm text-slate-500 mb-4">{s.contactName} • {s.phone}</div>
             <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="text-xs font-bold text-slate-400">Рейтинг</div>
                <div className="flex text-orange-400 text-xs">
                   {[...Array(5)].map((_, i) => <Icon key={i} icon={i < Math.floor(s.rating) ? "solar:star-bold" : "solar:star-linear"} />)}
                </div>
             </div>
          </div>
       ))}
    </div>
  </div>
);

const SupplierManagementView: React.FC<{ suppliers: Supplier[], setSuppliers: (s: Supplier[]) => void }> = ({ suppliers }) => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex justify-between items-center">
       <h2 className="text-2xl font-bold">Управление поставщиками</h2>
       <button className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Добавить</button>
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="p-4">Название</th>
            <th className="p-4">Контакт</th>
            <th className="p-4">Баланс</th>
            <th className="p-4">Посл. поставка</th>
            <th className="p-4">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {suppliers.map(s => (
            <tr key={s.id} className="hover:bg-slate-50">
              <td className="p-4 font-bold text-slate-800">{s.name}</td>
              <td className="p-4 text-slate-600">
                 <div>{s.contactName}</div>
                 <div className="text-xs text-slate-400">{s.phone}</div>
              </td>
              <td className="p-4 font-bold text-slate-800">{s.balance} с.</td>
              <td className="p-4 text-slate-500">{s.lastDelivery}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.status}</span>
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
    <h2 className="text-2xl font-bold">Медиафайлы</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       {MOCK_MEDIA_FILES.map(file => (
          <div key={file.id} className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm group relative">
             <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2">
                {file.type === 'image' ? <img src={file.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Icon icon="solar:file-text-bold" className="size-10" /></div>}
             </div>
             <div className="px-1">
                <div className="font-bold text-sm truncate">{file.name}</div>
                <div className="text-xs text-slate-400">{file.size}</div>
             </div>
          </div>
       ))}
    </div>
  </div>
);

const LogsView: React.FC = () => (
  <div className="space-y-4 animate-fade-in">
    <h2 className="text-2xl font-bold">Логи действий</h2>
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
       <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
             <tr>
                <th className="p-4">Время</th>
                <th className="p-4">Пользователь</th>
                <th className="p-4">Действие</th>
                <th className="p-4">Модуль</th>
                <th className="p-4">IP</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {MOCK_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                   <td className="p-4 text-slate-500 font-mono text-xs">{log.timestamp}</td>
                   <td className="p-4 font-bold text-slate-800">
                      {log.userName}
                      <div className="text-[10px] text-slate-400 font-normal capitalize">{log.userRole}</div>
                   </td>
                   <td className="p-4">
                      <div className="font-bold text-slate-800">{log.actionTitle}</div>
                      <div className="text-xs text-slate-500">{log.details}</div>
                   </td>
                   <td className="p-4 text-slate-600">{log.module}</td>
                   <td className="p-4 text-slate-400 text-xs">{log.ip}</td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

const SettingsView: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-bold">Настройки магазина</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4">Общие</h3>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Название магазина</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue={MOCK_SETTINGS.general.storeName} />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Телефон</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue={MOCK_SETTINGS.general.phone} />
             </div>
          </div>
       </div>
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4">Доставка</h3>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Бесплатная доставка от</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue={MOCK_SETTINGS.shipping.freeShippingThreshold} />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Стоимость стандартной доставки</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue={MOCK_SETTINGS.shipping.standardShippingCost} />
             </div>
          </div>
       </div>
    </div>
    <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg">Сохранить настройки</button>
  </div>
);

// --- UPDATED FITTING ROOM VIEW ---

const FittingRoomView: React.FC<{ bookings: FittingBooking[], products: Product[] }> = ({ bookings, products }) => {
   // MOCK DATA FOR ROOMS (In real app, this would be in a DB)
   const [rooms, setRooms] = useState([
      { id: '1', name: 'Кабинка 1', status: 'free', client: '', timer: 0 },
      { id: '2', name: 'Кабинка 2', status: 'occupied', client: 'Манижа К.', timer: 12 * 60 + 30 }, // 12m 30s
      { id: '3', name: 'VIP Зал', status: 'cleaning', client: '', timer: 2 * 60 }, // 2m
   ]);

   const [activeModal, setActiveModal] = useState<'none' | 'prep' | 'checkout'>('none');
   const [selectedBooking, setSelectedBooking] = useState<FittingBooking | null>(null);
   const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
   const [checkoutItems, setCheckoutItems] = useState<{productId: number, status: 'pending' | 'bought' | 'rejected', reason?: string}[]>([]);

   // Timer Logic
   useEffect(() => {
      const interval = setInterval(() => {
         setRooms(prev => prev.map(r => {
            if (r.status === 'occupied' || r.status === 'cleaning') {
               return { ...r, timer: r.timer + 1 };
            }
            return r;
         }));
      }, 1000);
      return () => clearInterval(interval);
   }, []);

   const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
   };

   // Actions
   const handleStartPrep = (booking: FittingBooking) => {
      setSelectedBooking(booking);
      setActiveModal('prep');
   };

   const confirmPrep = (roomId: string) => {
      // Logic to move booking to room
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'occupied', client: selectedBooking?.customerName || 'Клиент', timer: 0 } : r));
      setActiveModal('none');
      setSelectedBooking(null);
   };

   const handleStartCheckout = (roomId: string) => {
      const room = rooms.find(r => r.id === roomId);
      setActiveRoomId(roomId);
      // Mock items for checkout (usually would come from booking)
      const items = bookings[0]?.items.map(id => ({ productId: id, status: 'pending' as const })) || [
         { productId: 1, status: 'pending' as const }, 
         { productId: 2, status: 'pending' as const }
      ];
      setCheckoutItems(items);
      setActiveModal('checkout');
   };

   const finishCheckout = () => {
      setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, status: 'cleaning', client: '', timer: 0 } : r));
      setActiveModal('none');
      setActiveRoomId(null);
   };

   const finishCleaning = (roomId: string) => {
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'free', timer: 0 } : r));
   };

   return (
      <div className="flex h-full gap-6 animate-fade-in">
         {/* LEFT: ROOMS DASHBOARD */}
         <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-800">Пульт Примерочной</h2>
               <div className="flex gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100">
                     <div className="size-2 rounded-full bg-green-500"></div> Свободно
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100">
                     <div className="size-2 rounded-full bg-red-500"></div> Занято
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 min-h-0">
               {rooms.map(room => (
                  <div 
                     key={room.id} 
                     className={`rounded-3xl p-6 flex flex-col justify-between relative border-2 transition-all ${
                        room.status === 'free' ? 'bg-white border-slate-200 border-dashed' :
                        room.status === 'occupied' ? 'bg-white border-red-500 shadow-xl shadow-red-500/10' :
                        'bg-purple-50 border-purple-200'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-black text-slate-800">{room.name}</h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                           room.status === 'free' ? 'bg-green-100 text-green-700' :
                           room.status === 'occupied' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                           {room.status === 'free' ? 'Свободно' : room.status === 'occupied' ? 'Занято' : 'Уборка'}
                        </span>
                     </div>

                     <div className="flex-1 flex flex-col items-center justify-center text-center">
                        {room.status === 'free' ? (
                           <div className="text-slate-300">
                              <Icon icon="solar:hanger-2-linear" className="size-16 mx-auto mb-2" />
                              <p className="text-sm font-medium">Ожидание клиента</p>
                           </div>
                        ) : (
                           <div>
                              <div className="text-5xl font-black font-mono text-slate-800 mb-2">
                                 {formatTime(room.timer)}
                              </div>
                              {room.client && (
                                 <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg inline-block">
                                    {room.client}
                                 </div>
                              )}
                           </div>
                        )}
                     </div>

                     <div className="mt-6 pt-6 border-t border-slate-100">
                        {room.status === 'free' ? (
                           <button disabled className="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
                              Выберите бронь из списка →
                           </button>
                        ) : room.status === 'occupied' ? (
                           <div className="flex gap-2">
                              <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200">
                                 +15 мин
                              </button>
                              <button 
                                 onClick={() => handleStartCheckout(room.id)}
                                 className="flex-[2] py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 hover:bg-red-600"
                              >
                                 Завершить (Checkout)
                              </button>
                           </div>
                        ) : (
                           <button 
                              onClick={() => finishCleaning(room.id)}
                              className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-600/30 hover:bg-purple-700 flex items-center justify-center gap-2"
                           >
                              <Icon icon="solar:broom-bold" />
                              Уборка завершена
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* RIGHT: QUEUE SIDEBAR */}
         <div className="w-80 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
               <h3 className="font-bold text-slate-800">Очередь (Сегодня)</h3>
               <div className="text-xs text-slate-500 mt-1">{bookings.length} записей ожидают</div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
               {bookings.map(booking => (
                  <div 
                     key={booking.id} 
                     onClick={() => handleStartPrep(booking)}
                     className="p-3 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all group"
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg text-slate-800">{booking.timeSlot}</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500 group-hover:bg-white">
                           {booking.status}
                        </span>
                     </div>
                     <div className="font-bold text-sm text-slate-700 mb-1">{booking.customerName}</div>
                     <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Icon icon="solar:t-shirt-bold" />
                        {booking.items.length} вещей
                     </div>
                  </div>
               ))}
               {bookings.length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                     <Icon icon="solar:calendar-mark-linear" className="size-10 mx-auto mb-2 opacity-30" />
                     <p className="text-sm">Нет записей на сегодня</p>
                  </div>
               )}
            </div>
         </div>

         {/* MODALS */}
         
         {/* 1. PREP MODAL */}
         {activeModal === 'prep' && selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <div>
                        <h3 className="text-xl font-bold text-slate-800">Подготовка к примерке</h3>
                        <p className="text-sm text-slate-500">{selectedBooking.customerName} • {selectedBooking.timeSlot}</p>
                     </div>
                     <button onClick={() => setActiveModal('none')} className="p-2 bg-white rounded-full hover:bg-slate-200"><Icon icon="solar:close-circle-bold" /></button>
                  </div>
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                     <div className="space-y-4 mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Чек-лист консьержа</h4>
                        <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary">
                           <input type="checkbox" className="size-5 accent-primary" />
                           <span className="font-bold text-sm text-slate-700">Вещи собраны со склада</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary">
                           <input type="checkbox" className="size-5 accent-primary" />
                           <span className="font-bold text-sm text-slate-700">Одежда отпарена (Steaming)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary">
                           <input type="checkbox" className="size-5 accent-primary" />
                           <span className="font-bold text-sm text-slate-700">Открытка подписана</span>
                        </label>
                     </div>
                     
                     <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Вещи в примерке</h4>
                     <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedBooking.items.map(itemId => {
                           const product = products.find(p => p.id === itemId);
                           if(!product) return null;
                           return (
                              <div key={itemId} className="size-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                                 <img src={product.images[0]} className="w-full h-full object-cover" />
                                 <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] font-bold text-center py-0.5">{product.sizes[0]}</div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-3">
                     <button onClick={() => setActiveModal('none')} className="py-3 bg-white text-slate-600 rounded-xl font-bold border border-slate-200">Отмена</button>
                     {/* Hardcoded to Room 2 for demo */}
                     <button onClick={() => confirmPrep('2')} className="py-3 bg-primary text-white rounded-xl font-bold shadow-lg">
                        Клиент пришел (Заселить)
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* 2. CHECKOUT MODAL */}
         {activeModal === 'checkout' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                     <h3 className="text-xl font-bold text-slate-800">Итоги примерки (Checkout)</h3>
                     <button onClick={() => setActiveModal('none')} className="p-2 bg-white rounded-full hover:bg-slate-200"><Icon icon="solar:close-circle-bold" /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                     <div className="space-y-3">
                        {checkoutItems.map((item, idx) => {
                           const product = products.find(p => p.id === item.productId);
                           if(!product) return null;
                           
                           return (
                              <div key={item.productId} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                 <div className="flex items-start gap-4">
                                    <div className="size-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                       <img src={product.images[0]} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                       <div className="font-bold text-slate-800 text-sm">{product.name}</div>
                                       <div className="text-xs text-slate-500 mb-2">{product.price} с.</div>
                                       <div className="flex gap-2">
                                          <button 
                                             onClick={() => {
                                                const newItems = [...checkoutItems];
                                                newItems[idx].status = 'bought';
                                                setCheckoutItems(newItems);
                                             }}
                                             className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${item.status === 'bought' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-slate-600 border-slate-200 hover:border-green-500'}`}
                                          >
                                             ✅ Купил
                                          </button>
                                          <button 
                                             onClick={() => {
                                                const newItems = [...checkoutItems];
                                                newItems[idx].status = 'rejected';
                                                setCheckoutItems(newItems);
                                             }}
                                             className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${item.status === 'rejected' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200 hover:border-red-500'}`}
                                          >
                                             ❌ Отказ
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                                 
                                 {/* Rejection Reason */}
                                 {item.status === 'rejected' && (
                                    <div className="pl-[80px] animate-fade-in">
                                       <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Причина отказа:</div>
                                       <div className="flex flex-wrap gap-2">
                                          {['Мало', 'Велико', 'Фасон', 'Качество', 'Дорого'].map(reason => (
                                             <button 
                                                key={reason}
                                                onClick={() => {
                                                   const newItems = [...checkoutItems];
                                                   newItems[idx].reason = reason;
                                                   setCheckoutItems(newItems);
                                                }}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold border ${item.reason === reason ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                                             >
                                                {reason}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-white flex justify-between items-center">
                     <div>
                        <div className="text-xs text-slate-500">Итого куплено:</div>
                        <div className="text-2xl font-black text-slate-900">
                           {checkoutItems.filter(i => i.status === 'bought').reduce((acc, i) => {
                              const p = products.find(prod => prod.id === i.productId);
                              return acc + (p?.price || 0);
                           }, 0)} с.
                        </div>
                     </div>
                     <button onClick={finishCheckout} className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                        Завершить сессию
                     </button>
                  </div>
               </div>
            </div>
         )}
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
    { id: 'approval', label: 'Модерация', icon: 'solar:check-circle-bold' },
    { id: 'reviews', label: 'Отзывы', icon: 'solar:star-bold' }, 
    { id: 'support', label: 'Поддержка', icon: 'solar:chat-round-dots-bold' }, 
    { id: 'categories', label: 'Категории', icon: 'solar:layers-bold' },
    { id: 'departments', label: 'Отделы', icon: 'solar:sitemap-bold' },
    { id: 'finance', label: 'Финансы', icon: 'solar:bill-list-bold' }, 
    { id: 'payouts', label: 'Выплаты', icon: 'solar:card-transfer-bold' },
    { id: 'customers', label: 'Клиенты', icon: 'solar:users-group-rounded-bold' },
    { id: 'returns', label: 'Возвраты (RMA)', icon: 'solar:restart-bold' },
    { id: 'shops', label: 'Магазины', icon: 'solar:shop-2-bold' },
    { id: 'suppliers_admin', label: 'Поставщики', icon: 'solar:shop-bold' },
    { id: 'employees', label: 'Сотрудники', icon: 'solar:user-id-bold' },
    { id: 'promotions', label: 'Акции', icon: 'solar:gift-bold' }, 
    { id: 'couriers', label: 'Карта курьеров', icon: 'solar:map-point-bold' },
    { id: 'delivery_zones', label: 'Зоны доставки', icon: 'solar:map-arrow-up-bold' }, 
    { id: 'notifications', label: 'Маркетинг', icon: 'solar:bell-bing-bold' }, 
    { id: 'cms', label: 'CMS', icon: 'solar:file-text-bold' }, 
    { id: 'media', label: 'Медиа', icon: 'solar:gallery-bold' },
    { id: 'attributes', label: 'Атрибуты', icon: 'solar:tag-bold' }, 
    { id: 'acl', label: 'Роли', icon: 'solar:shield-user-bold' }, 
    { id: 'logs', label: 'Логи', icon: 'solar:history-bold' },
    { id: 'settings', label: 'Настройки', icon: 'solar:settings-bold' },
  ];

  const renderContent = () => {
    switch(activeView) {
      case 'overview': return <OverviewView products={products} orders={orders} customers={customers} employees={employees} />;
      case 'orders': return <KanbanBoard orders={orders} onUpdateStatus={() => {}} />; 
      case 'tables': return <TablesView employees={employees} orders={orders} />; 
      case 'warehouse': return <WarehouseView products={products} setProducts={setProducts} />; 
      case 'fitting': return <FittingRoomView bookings={bookings} products={products} />;
      case 'products': return <ProductsView products={products} setProducts={setProducts} categories={categories} suppliers={suppliers} />;
      case 'approval': return <ProductApprovalView products={products} />;
      case 'reviews': return <ReviewsView />;
      case 'support': return <SupportView />;
      case 'categories': return <CategoriesView />;
      case 'departments': return <DepartmentsView />;
      case 'finance': return <FinanceView />;
      case 'payouts': return <PayoutsView />;
      case 'customers': return <CustomersView customers={customers} />;
      case 'returns': return <PlaceholderView title="Возвраты (RMA)" icon="solar:restart-bold" />;
      case 'shops': return <ShopsView suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'suppliers_admin': return <SupplierManagementView suppliers={suppliers} setSuppliers={setSuppliers} />;
      case 'employees': return <EmployeeManager employees={employees} setEmployees={setEmployees} shifts={shifts} setShifts={setShifts} financialRecords={financialRecords} setFinancialRecords={setFinancialRecords} />;
      case 'promotions': return <PromoBuilder />;
      case 'couriers': return <CourierMap />;
      case 'delivery_zones': return <DeliveryZonesView />;
      case 'notifications': return <NotificationsView />;
      case 'cms': return <CMSView />;
      case 'media': return <MediaView />;
      case 'attributes': return <AttributesView />;
      case 'acl': return <ACLView />;
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
