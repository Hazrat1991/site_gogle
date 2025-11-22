
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product, CartItem, Language, Order, Customer, Category, UserProfile } from './types';
import { MOCK_PRODUCTS, DICTIONARY, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_CATEGORIES, MOCK_USER_PROFILE } from './constants';
import { BottomNav } from './components/BottomNav';
import { TopHeader } from './components/TopHeader';
import { Hero } from './components/Hero';
import { CategoryBlock } from './components/CategoryBlock';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { FilterDrawer } from './components/FilterDrawer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { CheckoutModal } from './components/CheckoutModal';
import { Onboarding } from './components/Onboarding';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ru');
  const [view, setView] = useState<{ name: string, data?: any }>({ name: 'home' });
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Features State
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check LocalStorage for Onboarding & DarkMode
  useEffect(() => {
    const hasSeen = localStorage.getItem('grand_onboarding_complete');
    if (!hasSeen) {
      setShowOnboarding(true);
    }

    const storedTheme = localStorage.getItem('grand_theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Simulated Push Notification
  useEffect(() => {
    if (userProfile.notifications.push) {
      const timer = setTimeout(() => {
        addToast('🎁 Вам доступен промокод: GRAND20 (-20%)', 'info');
      }, 5000); // Simulate push after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('grand_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('grand_theme', 'light');
      }
      return newVal;
    });
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('grand_onboarding_complete', 'true');
    setShowOnboarding(false);
  };
  
  // Lifted state for Admin management
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);

  // Expanded Filter State
  const [filters, setFilters] = useState({ 
    category: 'all', 
    subCategory: null as string | null,
    search: '',
    sort: 'popular', // popular, price_asc, price_desc, newest, rating, discount
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    color: null as string | null,
    size: null as string | null,
    onlyNew: false,
    onlySale: false,
    onlyTop: false,
    onlyStock: false,
    maxPriceLimit: undefined as number | undefined // for chip filters
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const t = DICTIONARY[lang];

  // Helpers
  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleFavorite = (product: Product) => {
    if (favorites.includes(product.id)) {
      setFavorites(prev => prev.filter(id => id !== product.id));
      addToast('Удалено из избранного', 'info');
    } else {
      setFavorites(prev => [...prev, product.id]);
      addToast('Добавлено в избранное', 'success');
    }
  };

  const handlePlaceOrder = (data: any) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
       id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
       customerName: data.name,
       customerPhone: data.phone,
       address: data.address,
       paymentMethod: data.paymentMethod,
       date: new Date().toLocaleDateString(),
       total: total,
       status: 'new',
       shippingMethod: 'delivery',
       items: [...cart]
    };

    setOrders([newOrder, ...orders]);
    setCart([]); // Clear cart
    setIsCheckoutOpen(false);
    addToast('Заказ успешно оформлен!', 'success');
    setTimeout(() => setView({ name: 'home' }), 1500);
  };

  // Complex Filtering Logic
  const filteredProducts = useMemo(() => {
    let res = products;
    
    // Category Filter
    if (filters.category !== 'all') {
      res = res.filter(p => p.category === filters.category);
    }
    
    // Subcategory Filter
    if (filters.subCategory) {
      res = res.filter(p => 
        (p.subCategory && p.subCategory.toLowerCase().includes(filters.subCategory!.toLowerCase())) ||
        p.description.toLowerCase().includes(filters.subCategory!.toLowerCase())
      );
    }

    // Search
    if (filters.search) {
      res = res.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    }

    // Price Range
    if (filters.minPrice) res = res.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice) res = res.filter(p => p.price <= filters.maxPrice!);
    if (filters.maxPriceLimit) res = res.filter(p => p.price <= filters.maxPriceLimit!);

    // Attributes
    if (filters.color) res = res.filter(p => p.colors.includes(filters.color!));
    if (filters.size) res = res.filter(p => p.sizes.includes(filters.size!));

    // Toggles
    if (filters.onlyNew) res = res.filter(p => p.isNew);
    if (filters.onlySale) res = res.filter(p => (p.oldPrice || 0) > p.price);
    if (filters.onlyTop) res = res.filter(p => p.isTop);
    if (filters.onlyStock) res = res.filter(p => (p.stock || 0) > 0);

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        res = [...res].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        res = [...res].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        res = [...res].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        res = [...res].sort((a, b) => b.rating - a.rating);
        break;
       case 'discount':
        res = [...res].sort((a, b) => {
           const discA = a.oldPrice ? (a.oldPrice - a.price) : 0;
           const discB = b.oldPrice ? (b.oldPrice - b.price) : 0;
           return discB - discA;
        });
        break;
      default: // popular
        res = [...res].sort((a, b) => b.rating - a.rating);
    }

    return res;
  }, [products, filters]);

  const addToCart = (product: Product, size?: string, color?: string, quantity?: number) => {
    const s = size || product.sizes[0];
    const c = color || product.colors[0];
    const qty = quantity || 1;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === s && item.selectedColor === c);
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty, selectedSize: s, selectedColor: c }];
    });
    addToast('Товар добавлен в корзину');
  };

  const handleBuyNow = (product: Product, size?: string, color?: string, quantity?: number) => {
    addToCart(product, size, color, quantity);
    setIsCheckoutOpen(true);
  };

  const handleSelectCategory = (catId: string) => {
    setFilters({ ...filters, category: catId, subCategory: null });
  };

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background">
      <Hero lang={lang} onShopNow={() => setView({ name: 'listing' })} />
      <CategoryBlock lang={lang} onSelectCategory={(id) => { handleSelectCategory(id); setView({ name: 'listing' }); }} />
      
      {/* New Arrivals */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="font-heading font-bold text-lg text-foreground">{t.newArrivals}</h2>
          </div>
          <button onClick={() => setView({ name: 'listing' })} className="text-muted-foreground/80 text-sm">См. все</button>
        </div>
        <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
          {products.filter(p => p.isNew).map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onClick={() => setView({ name: 'product', data: p })} 
              onAddToCart={addToCart}
              isFullWidth
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>

      {/* Top Sellers */}
      <div className="mt-4 mb-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-secondary rounded-full" />
            <h2 className="font-heading font-bold text-lg text-foreground">{t.topSellers}</h2>
          </div>
          <button onClick={() => setView({ name: 'listing' })} className="text-muted-foreground/80 text-sm">См. все</button>
        </div>
        <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
          {products.filter(p => p.isTop).map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onClick={() => setView({ name: 'product', data: p })} 
              onAddToCart={addToCart}
              isFullWidth
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>

      {/* Sales Banner matching design */}
      <div className="mt-4 mb-6">
         <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-red-500 rounded-full" />
               <h2 className="font-heading font-bold text-lg text-foreground">Скидки и акции</h2>
            </div>
            <button className="text-muted-foreground/80 text-sm">См. все</button>
         </div>
         <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
            {products.slice(0, 3).map(p => (
               <ProductCard 
                 key={p.id + 'sale'} 
                 product={p} 
                 onClick={() => setView({ name: 'product', data: p })} 
                 onAddToCart={addToCart}
                 isFullWidth
                 isFavorite={favorites.includes(p.id)}
                 onToggleFavorite={toggleFavorite}
               />
            ))}
             <div className="min-w-[120px] w-[120px] snap-start flex flex-col items-center justify-center text-center gap-3 bg-accent/50 rounded-xl border border-dashed border-secondary/30">
                <div className="size-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                   <Icon icon="solar:arrow-right-linear" className="size-6" />
                </div>
                <span className="text-sm font-medium text-secondary">Смотреть все скидки</span>
             </div>
         </div>
      </div>
    </div>
  );

  const renderListing = () => {
    const currentCategory = categories.find(c => c.id === filters.category);
    const subcategories = currentCategory ? currentCategory.subcategories : [];
    
    // Icons map for the All Categories Grid
    const catIcons: Record<string, string> = {
      men: 'solar:t-shirt-bold',
      women: 'solar:skirt-bold',
      shoes: 'mdi:shoe-sneaker',
      hats: 'fa6-solid:hat-cowboy',
      socks: 'ph:socks-fill',
      accessories: 'solar:watch-square-bold'
    };
    const catColors: Record<string, string> = {
      men: 'bg-primary/10 text-primary',
      women: 'bg-blue-50 text-secondary',
      shoes: 'bg-orange-50 text-orange-600',
      hats: 'bg-indigo-50 text-indigo-600',
      socks: 'bg-pink-50 text-pink-600',
      accessories: 'bg-teal-50 text-teal-600'
    };

    return (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background">
         {/* 1. Filter Chips */}
         <div className="px-4 py-3 bg-white dark:bg-card border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
              {[
                { id: 'all', label: 'Все', active: !filters.onlyNew && !filters.onlySale && !filters.onlyTop && !filters.maxPriceLimit, onClick: () => setFilters({...filters, onlyNew: false, onlySale: false, onlyTop: false, maxPriceLimit: undefined}) },
                { id: 'new', label: '🔶 Новинки', active: filters.onlyNew, onClick: () => setFilters({...filters, onlyNew: !filters.onlyNew}) },
                { id: 'sale', label: '🔶 Скидки', active: filters.onlySale, onClick: () => setFilters({...filters, onlySale: !filters.onlySale}) },
                { id: 'top', label: '🔶 Хиты', active: filters.onlyTop, onClick: () => setFilters({...filters, onlyTop: !filters.onlyTop}) },
                { id: 'cheap', label: '🔶 До 500 с.', active: !!filters.maxPriceLimit, onClick: () => setFilters({...filters, maxPriceLimit: filters.maxPriceLimit ? undefined : 500}) },
              ].map((chip, i) => (
                <button 
                  key={i} 
                  onClick={chip.onClick} 
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${chip.active ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
         </div>

         {/* 2. Category Navigation & Subcategories */}
         {filters.category === 'all' ? (
            /* Grid for "All Categories" */
            <div className="p-4 animate-fade-in">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <Icon icon="solar:widget-bold" className="text-primary" />
                 {t.categories}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    onClick={() => handleSelectCategory(cat.id)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition-all group active:scale-95"
                  >
                    <div className={`size-14 rounded-full flex items-center justify-center transition-colors ${catColors[cat.id] || 'bg-slate-100 text-slate-600'} group-hover:scale-110`}>
                       <Icon icon={catIcons[cat.id] || 'solar:box-bold'} className="size-8" />
                    </div>
                    <div className="text-center">
                       <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block group-hover:text-primary">{cat.name}</span>
                       <span className="text-[10px] text-slate-400 font-medium">{cat.subcategories.length} разделов</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         ) : (
            /* Subcategories Pills for Specific Category */
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 animate-fade-in">
               <div className="flex items-center justify-between mb-3">
                  <button onClick={() => handleSelectCategory('all')} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-primary px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-800">
                    <Icon icon="solar:arrow-left-linear" /> Назад
                  </button>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{categories.find(c => c.id === filters.category)?.name}</h3>
               </div>
               <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                  <button 
                    onClick={() => setFilters({...filters, subCategory: null})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${!filters.subCategory ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                  >
                    Все
                  </button>
                  {subcategories.map(sub => (
                    <button 
                      key={sub} 
                      onClick={() => setFilters({...filters, subCategory: sub})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shadow-sm ${filters.subCategory === sub ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                    >
                      {sub}
                    </button>
                  ))}
               </div>
            </div>
         )}

         {/* 3. Results & Sort Bar */}
         <div className="px-4 py-3 flex items-center justify-between bg-white/50 dark:bg-card/50 backdrop-blur-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
               {lang === 'ru' ? `Найдено: ${filteredProducts.length} шт.` : `${filteredProducts.length} дона`}
            </span>
            <button 
              onClick={() => setIsFilterOpen(true)} 
              className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:border-primary transition-colors"
            >
              <Icon icon="solar:sort-from-top-to-bottom-bold" className="size-4 text-primary" />
              {filters.sort === 'popular' && 'По популярности'}
              {filters.sort === 'price_asc' && 'Сначала дешевые'}
              {filters.sort === 'price_desc' && 'Сначала дорогие'}
              {filters.sort === 'newest' && 'Сначала новинки'}
              {filters.sort === 'rating' && 'По рейтингу'}
              {filters.sort === 'discount' && 'По скидке'}
            </button>
         </div>

         {/* 4. Product Grid */}
         <div className="p-4 pt-2 grid grid-cols-2 gap-4">
           {filteredProducts.length > 0 ? filteredProducts.map(p => (
             <ProductCard 
              key={p.id} 
              product={p} 
              onClick={() => setView({ name: 'product', data: p })} 
              onAddToCart={addToCart}
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={toggleFavorite}
             />
           )) : (
             <div className="col-span-2 flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Icon icon="solar:box-linear" className="size-10 opacity-30" />
                </div>
                <p className="font-medium">Товары не найдены</p>
                <p className="text-xs text-slate-400 mb-4">Попробуйте изменить фильтры</p>
                <button onClick={() => setFilters({...filters, search: '', minPrice: undefined, maxPrice: undefined, color: null, size: null, subCategory: null})} className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg">
                   Сбросить фильтры
                </button>
             </div>
           )}
           {filteredProducts.length > 0 && (
             <div className="col-span-2 text-center py-4 text-xs text-slate-400">
                Показано {filteredProducts.length} из {products.length} товаров
             </div>
           )}
         </div>
      </div>
    );
  };

  const renderFavorites = () => {
    const favProducts = products.filter(p => favorites.includes(p.id));
    
    return (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">{t.favorites}</h1>
        {favProducts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
             <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Icon icon="solar:heart-broken-bold" className="size-10" />
             </div>
             <p className="text-muted-foreground">Список избранного пуст</p>
             <button onClick={() => setView({ name: 'listing' })} className="mt-4 text-primary font-bold text-sm">Перейти в каталог</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favProducts.map(p => (
               <ProductCard 
                 key={p.id} 
                 product={p} 
                 onClick={() => setView({ name: 'product', data: p })} 
                 onAddToCart={addToCart}
                 isFavorite={true}
                 onToggleFavorite={toggleFavorite}
               />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCart = () => (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background px-4 py-4">
       <h1 className="text-2xl font-bold mb-4">{t.cart}</h1>
       {cart.length === 0 ? (
         <div className="text-center text-muted-foreground py-20">Корзина пуста</div>
       ) : (
         <div className="space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="bg-card p-4 rounded-xl border border-border shadow-sm flex gap-4">
                <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                   <img src={item.images[0]} className="w-full h-full object-cover"/>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                    <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-destructive"><Icon icon="solar:trash-bin-trash-bold" className="size-4"/></button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{item.selectedSize} • {item.selectedColor}</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="font-bold text-primary">{item.price} c.</div>
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                      <button onClick={() => setCart(cart.map((c, idx) => idx === i ? {...c, quantity: Math.max(1, c.quantity - 1)} : c))}>-</button>
                      <span className="text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => setCart(cart.map((c, idx) => idx === i ? {...c, quantity: c.quantity + 1} : c))}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border">
               <div className="flex justify-between text-lg font-bold mb-4">
                 <span>{t.total}</span>
                 <span>{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)} c.</span>
               </div>
               {/* Ensure this button click reaches the handler */}
               <button 
                 onClick={() => setIsCheckoutOpen(true)} 
                 className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
               >
                 {t.checkout}
               </button>
            </div>
         </div>
       )}
    </div>
  );

  // --- Complete User Profile/Cabinet View ---
  const renderProfile = () => {
    // Mock finding specific user orders
    const myOrders = orders.filter(o => o.customerName === userProfile.name);

    const MenuItem = ({ icon, label, subLabel, onClick, toggle, toggleValue }: any) => (
      <div 
        onClick={!toggle ? onClick : undefined}
        className="w-full p-4 bg-card border-b border-slate-50 dark:border-slate-800 last:border-0 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="size-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Icon icon={icon} className="size-5" />
          </div>
          <div className="text-left">
            <div className="font-bold text-sm text-foreground">{label}</div>
            {subLabel && <div className="text-xs text-muted-foreground">{subLabel}</div>}
          </div>
        </div>
        {toggle ? (
           <div 
             onClick={onClick}
             className={`w-10 h-6 rounded-full p-1 transition-colors ${toggleValue ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
           >
              <div className={`size-4 bg-white rounded-full shadow-sm transition-transform ${toggleValue ? 'translate-x-4' : ''}`} />
           </div>
        ) : (
           <Icon icon="solar:alt-arrow-right-linear" className="size-4 text-slate-300" />
        )}
      </div>
    );

    return (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 dark:bg-slate-950">
        {/* 1. Header Info */}
        <div className="bg-white dark:bg-card p-6 pb-8 rounded-b-3xl shadow-sm relative">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md flex items-center justify-center">
                   {userProfile.avatar ? (
                     <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <Icon icon="solar:user-bold" className="size-10 text-slate-300" />
                   )}
                 </div>
                 <button className="absolute bottom-0 right-0 size-7 bg-primary text-white rounded-full border-2 border-white dark:border-slate-700 flex items-center justify-center shadow-sm">
                    <Icon icon="solar:camera-bold" className="size-3" />
                 </button>
              </div>
              <div>
                 <h1 className="text-xl font-bold text-slate-800 dark:text-white">{userProfile.name}</h1>
                 <p className="text-sm text-slate-400 font-medium mb-1">{userProfile.email}</p>
                 <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Редактировать
                 </button>
              </div>
           </div>
        </div>

        {/* 2. Bonus Card - Floating over header */}
        <div className="px-4 -mt-6 relative z-10">
           <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-5 shadow-xl text-white flex justify-between items-center">
              <div>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{t.bonuses}</p>
                 <h2 className="text-3xl font-bold">{userProfile.bonusPoints} <span className="text-lg font-normal text-slate-400">Б</span></h2>
              </div>
              <div className="text-right">
                 <div className="size-12 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 font-bold text-lg mb-1">
                    {userProfile.cashbackLevel}%
                 </div>
                 <p className="text-[10px] text-slate-400">Cashback</p>
              </div>
           </div>
        </div>

        {/* 3. Quick Actions */}
        <div className="grid grid-cols-4 gap-2 px-4 mt-6 mb-6">
           {[
             { label: t.favorites, icon: 'solar:heart-bold', color: 'text-red-500 bg-red-50 dark:bg-red-900/20', onClick: () => setView({ name: 'favorites' }) },
             { label: 'Купоны', icon: 'solar:ticket-sale-bold', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', onClick: () => {} },
             { label: t.support, icon: 'solar:chat-round-dots-bold', color: 'text-green-600 bg-green-50 dark:bg-green-900/20', onClick: () => alert('Чат с поддержкой') },
             { label: 'История', icon: 'solar:history-bold', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20', onClick: () => {} }
           ].map((action, i) => (
             <button key={i} onClick={action.onClick} className="flex flex-col items-center gap-2">
                <div className={`size-14 rounded-2xl flex items-center justify-center shadow-sm ${action.color}`}>
                   <Icon icon={action.icon} className="size-7" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 text-center leading-tight">{action.label}</span>
             </button>
           ))}
        </div>

        {/* 4. Order History Preview */}
        <div className="px-4 mb-6">
           <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t.myOrders}</h3>
              <button className="text-primary text-sm font-medium">Все</button>
           </div>
           <div className="space-y-3">
              {myOrders.length > 0 ? myOrders.slice(0, 3).map(order => (
                 <div key={order.id} className="bg-white dark:bg-card p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between mb-2">
                       <span className="font-bold text-sm">Заказ {order.id}</span>
                       <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {order.status}
                       </span>
                    </div>
                    <div className="flex justify-between items-end">
                       <div className="text-xs text-slate-400">
                          {order.date} • {order.items.length} товара
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{order.total} с.</span>
                          <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">Инфо</button>
                       </div>
                    </div>
                 </div>
              )) : (
                 <div className="text-center py-8 bg-white dark:bg-card rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-400">У вас пока нет заказов</p>
                 </div>
              )}
           </div>
        </div>

        {/* 5. Settings Sections */}
        <div className="px-4 space-y-6">
           {/* Personal Info Block */}
           <div>
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2 px-2">{t.settings}</h3>
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                 <MenuItem 
                    icon="solar:map-point-bold" 
                    label={t.addresses} 
                    subLabel={`${userProfile.addresses.length} адреса`} 
                    onClick={() => {}} 
                 />
                 <MenuItem 
                    icon="solar:card-bold" 
                    label="Способы оплаты" 
                    subLabel={`Visa •••• ${userProfile.cards[0].last4}`} 
                    onClick={() => {}} 
                 />
                 <MenuItem 
                    icon="solar:bell-bold" 
                    label="Уведомления"
                    toggle={true}
                    toggleValue={userProfile.notifications.push}
                    onClick={() => setUserProfile({...userProfile, notifications: {...userProfile.notifications, push: !userProfile.notifications.push}})}
                 />
                  <MenuItem 
                    icon="solar:moon-bold" 
                    label="Темная тема"
                    toggle={true}
                    toggleValue={isDarkMode}
                    onClick={toggleDarkMode}
                 />
                 <MenuItem 
                    icon="solar:shield-keyhole-bold" 
                    label="Безопасность" 
                    subLabel="Сменить пароль"
                    onClick={() => {}} 
                 />
              </div>
           </div>

           {/* More Block */}
           <div>
              <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                 <MenuItem 
                    icon="solar:gift-bold" 
                    label="Пригласить друга" 
                    subLabel="Получите 50 бонусов"
                    onClick={() => {}} 
                 />
                 <MenuItem 
                    icon="solar:settings-bold" 
                    label="Админ панель" 
                    onClick={() => setView({ name: 'admin' })} 
                 />
                 <button className="w-full p-4 flex items-center justify-center text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <Icon icon="solar:logout-bold-duotone" className="size-5 mr-2" />
                    {t.logout}
                 </button>
              </div>
           </div>
           
           <div className="text-center pb-4">
              <p className="text-xs text-slate-300">Версия приложения 1.0.5</p>
           </div>
        </div>
      </div>
    );
  };

  // --- View Routing ---
  if (view.name === 'product' && view.data) {
    return (
    <>
      <ToastContainer messages={toasts} removeToast={removeToast} />
      <ProductDetails 
        product={view.data} 
        lang={lang} 
        onBack={() => setView({ name: 'home' })} 
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
        onProductClick={(p) => setView({ name: 'product', data: p })}
        isFavorite={favorites.includes(view.data.id)}
        onToggleFavorite={toggleFavorite}
      />
    </>
    );
  }

  if (view.name === 'admin') {
     return (
       <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
          <AdminDashboard 
            onBack={() => setView({name: 'profile'})} 
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            customers={customers}
            setCustomers={setCustomers}
            categories={categories}
            setCategories={setCategories}
          />
       </div>
     );
  }

  return (
    <div className="flex flex-col h-screen bg-background font-sans overflow-hidden">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      <ToastContainer messages={toasts} removeToast={removeToast} />
      
      {/* Checkout Modal - Moved to Root Level for High Z-Index */}
      <CheckoutModal 
         isOpen={isCheckoutOpen} 
         onClose={() => setIsCheckoutOpen(false)} 
         totalAmount={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
         itemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
         onSubmit={handlePlaceOrder}
      />

      {/* Filter Drawer Overlay */}
      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={setFilters}
        currentFilters={filters}
        lang={lang}
      />

      {/* Top Header is visible on Home and Listing */}
      {(view.name === 'home' || view.name === 'listing') && (
        <TopHeader 
          onSearch={(q) => { setFilters({...filters, search: q}); setView({ name: 'listing' }); }} 
          onFilterClick={() => setIsFilterOpen(true)}
          lang={lang} 
          setLang={setLang} 
        />
      )}

      {/* Main Content Area */}
      {view.name === 'home' && renderHome()}
      {view.name === 'listing' && renderListing()}
      {view.name === 'cart' && renderCart()}
      {view.name === 'profile' && renderProfile()}
      {view.name === 'favorites' && renderFavorites()}

      <BottomNav activeView={view.name} onNavigate={setView} cartCount={cart.length} />
    </div>
  );
};

export default App;
