
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product, CartItem, Language, Order, Customer, Category, UserProfile, EmployeeExtended, Shift, StaffFinancialRecord, FittingBooking, Supplier } from './types';
import { MOCK_PRODUCTS, DICTIONARY, MOCK_ORDERS, MOCK_CUSTOMERS, MOCK_CATEGORIES, MOCK_USER_PROFILE, MOCK_EMPLOYEES_EXTENDED, MOCK_SHIFTS, MOCK_STAFF_FINANCE, MOCK_LOOKBOOKS, MOCK_SUPPLIERS, MOCK_BRANDS, MOCK_OCCASIONS, CATEGORY_CONFIG, IN_FEED_BANNERS } from './constants';
import { BottomNav } from './components/BottomNav';
import { TopHeader } from './components/TopHeader';
import { Hero } from './components/Hero';
import { CategoryBlock } from './components/CategoryBlock';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeePortal } from './components/EmployeePortal';
import { FilterDrawer } from './components/FilterDrawer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { CheckoutModal } from './components/CheckoutModal';
import { Onboarding } from './components/Onboarding';
import { CompareDrawer } from './components/CompareDrawer';
import { LookbookView } from './components/LookbookView';
import { FittingRoomModal } from './components/FittingRoomModal';
import { VendorRegistrationModal } from './components/VendorRegistrationModal';
import { FitFinderModal } from './components/FitFinderModal';
import { GreetingHeader, FlashSale, DailyBonus, BrandWall, MasonryGrid, OccasionList, LiveTicker } from './components/HomeWidgets';
import { CategoryHero, SkeletonGrid, InFeedBanner } from './components/ListingWidgets';
import { CartView } from './components/CartView';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ru');
  const [view, setView] = useState<{ name: string, data?: any }>({ name: 'home' });
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Features State
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // New Features State
  const [isFittingModalOpen, setIsFittingModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [bookings, setBookings] = useState<FittingBooking[]>([]);
  const [waitlist, setWaitlist] = useState<number[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  
  // Logic for Recently Viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  // Listing Specific State
  const [isGridSingle, setIsGridSingle] = useState(false);
  const [isListingLoading, setIsListingLoading] = useState(false);

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

  // Abandoned Cart Recovery (Simulated)
  useEffect(() => {
    if (cart.length > 0) {
      const timer = setTimeout(() => {
        // Only trigger if still in cart logic (simplified)
        addToast('💬 WhatsApp: "Вы забыли товары! Скидка 5% по коду COMEBACK5"', 'info');
      }, 60000); // 1 minute simulation for demo (instead of 1 hour)
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

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
  const [userProfile, setUserProfile] = useState<UserProfile>({...MOCK_USER_PROFILE, referralCode: 'MANIZHA24', referralEarnings: 45, referralsCount: 3});

  // --- NEW: Employee Module State ---
  const [employees, setEmployees] = useState<EmployeeExtended[]>(MOCK_EMPLOYEES_EXTENDED);
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [financialRecords, setFinancialRecords] = useState<StaffFinancialRecord[]>(MOCK_STAFF_FINANCE);

  // Handlers for Employee Actions
  const handleClockIn = (employeeId: string, location: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      employeeId,
      employeeName: emp.fullName,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active',
      durationHours: 0,
      earned: 0,
      locationStart: location
    };

    setShifts([newShift, ...shifts]);
    setEmployees(employees.map(e => e.id === employeeId ? { ...e, status: 'working' } : e));
    addToast(`${emp.fullName} начал смену`, 'success');
  };

  const handleClockOut = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const currentShift = shifts.find(s => s.employeeId === employeeId && s.status === 'active');
    if (!currentShift) return;

    const endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hours = 8; 
    const earned = hours * emp.hourlyRate + (emp.shiftRate || 0);

    const updatedShift: Shift = {
      ...currentShift,
      endTime,
      durationHours: hours,
      earned: earned,
      status: 'completed'
    };

    setShifts(shifts.map(s => s.id === currentShift.id ? updatedShift : s));
    setEmployees(employees.map(e => e.id === employeeId ? {
      ...e, 
      status: 'off',
      hoursWorkedMonth: e.hoursWorkedMonth + hours,
      shiftsCountMonth: e.shiftsCountMonth + 1,
      earnedMonth: e.earnedMonth + earned
    } : e));
    
    addToast(`${emp.fullName} завершил смену`, 'success');
  };

  const [filters, setFilters] = useState({ 
    category: 'all', 
    subCategory: null as string | null,
    search: '',
    sort: 'popular',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    color: null as string | null,
    size: null as string | null,
    onlyNew: false,
    onlySale: false,
    onlyTop: false,
    onlyStock: false,
    maxPriceLimit: undefined as number | undefined
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const t = DICTIONARY[lang];

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

  const toggleCompare = (product: Product) => {
     if (compareList.find(p => p.id === product.id)) {
        setCompareList(prev => prev.filter(p => p.id !== product.id));
     } else {
        if (compareList.length >= 4) {
           addToast('Максимум 4 товара для сравнения', 'error');
           return;
        }
        setCompareList(prev => [...prev, product]);
        addToast('Добавлено к сравнению');
     }
  };

  // Bundle Logic: If cart has item from Category A and Category B, apply discount
  const bundleSavings = useMemo(() => {
    const hasJeans = cart.some(i => i.name.toLowerCase().includes('джинсы') || i.subCategory === 'Jeans');
    const hasTshirt = cart.some(i => i.name.toLowerCase().includes('футболка') || i.subCategory === 'T-Shirts');
    
    if (hasJeans && hasTshirt) {
        // Apply 15% discount to the bundle items (simplified: 15% of total of these items)
        const bundleItems = cart.filter(i => i.name.toLowerCase().includes('джинсы') || i.name.toLowerCase().includes('футболка'));
        const totalBundlePrice = bundleItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
        return Math.round(totalBundlePrice * 0.15);
    }
    return 0;
  }, [cart]);

  const handlePlaceOrder = (data: any) => {
    // If referral code used
    if (data.referralCode && data.referralCode.length > 3) {
        addToast(`Скидка 5% по коду ${data.referralCode} применена!`, 'success');
        // Logic to reward referrer would go here in backend
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) - bundleSavings;
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
       items: [...cart],
       referralCodeUsed: data.referralCode
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCheckoutOpen(false);
    addToast('Заказ успешно оформлен!', 'success');
    setTimeout(() => setView({ name: 'home' }), 1500);
  };

  const handleFittingBooking = (date: string, time: string) => {
    const newBooking: FittingBooking = {
       id: `BK-${Date.now()}`,
       date,
       timeSlot: time,
       items: cart.map(i => i.id),
       status: 'confirmed',
       customerName: userProfile.name,
       customerPhone: userProfile.phone
    };
    setBookings([newBooking, ...bookings]);
    setIsFittingModalOpen(false);
    addToast('Примерочная забронирована! Ждем вас.', 'success');
  };

  const handleVendorRegister = (data: any) => {
     // Create pending supplier
     const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        name: data.shopName,
        contactName: data.ownerName,
        phone: data.phone,
        balance: 0,
        lastDelivery: '-',
        rating: 0,
        status: 'pending'
     };
     setSuppliers([...suppliers, newSupplier]);
     setIsVendorModalOpen(false);
     addToast('Заявка отправлена! Мы свяжемся с вами.', 'success');
  };

  const handleAddToWaitlist = (product: Product) => {
     if (!waitlist.includes(product.id)) {
        setWaitlist([...waitlist, product.id]);
        addToast('Вы добавлены в лист ожидания', 'info');
     }
  };
  
  const handleProductClick = (product: Product) => {
     // Add to recently viewed logic
     if (!recentlyViewedIds.includes(product.id)) {
        setRecentlyViewedIds(prev => [product.id, ...prev].slice(0, 5));
     }
     setView({ name: 'product', data: product });
  };

  const handleSelectCategory = (catId: string) => {
    setFilters({ ...filters, category: catId, subCategory: null });
    // Simulate Loading
    setIsListingLoading(true);
    setTimeout(() => setIsListingLoading(false), 800);
  };

  // Complex Filtering Logic
  const filteredProducts = useMemo(() => {
    let res = products;
    if (filters.category !== 'all') {
      res = res.filter(p => p.category === filters.category);
    }
    if (filters.subCategory) {
      res = res.filter(p => 
        (p.subCategory && p.subCategory.toLowerCase().includes(filters.subCategory!.toLowerCase())) ||
        p.description.toLowerCase().includes(filters.subCategory!.toLowerCase())
      );
    }
    if (filters.search) {
      res = res.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.minPrice) res = res.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice) res = res.filter(p => p.price <= filters.maxPrice!);
    if (filters.maxPriceLimit) res = res.filter(p => p.price <= filters.maxPriceLimit!);
    if (filters.color) res = res.filter(p => p.colors.includes(filters.color!));
    if (filters.size) res = res.filter(p => p.sizes.includes(filters.size!));
    if (filters.onlyNew) res = res.filter(p => p.isNew);
    if (filters.onlySale) res = res.filter(p => (p.oldPrice || 0) > p.price);
    if (filters.onlyTop) res = res.filter(p => p.isTop);
    if (filters.onlyStock) res = res.filter(p => (p.stock || 0) > 0);

    switch (filters.sort) {
      case 'price_asc': res = [...res].sort((a, b) => a.price - b.price); break;
      case 'price_desc': res = [...res].sort((a, b) => b.price - a.price); break;
      case 'newest': res = [...res].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'rating': res = [...res].sort((a, b) => b.rating - a.rating); break;
       case 'discount':
        res = [...res].sort((a, b) => {
           const discA = a.oldPrice ? (a.oldPrice - a.price) : 0;
           const discB = b.oldPrice ? (b.oldPrice - b.price) : 0;
           return discB - discA;
        });
        break;
      default: res = [...res].sort((a, b) => b.rating - a.rating);
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
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty, selectedSize: s, selectedColor: c }];
    });
    addToast('Товар добавлен в корзину');
  };

  const handleBuyNow = (product: Product, size?: string, color?: string, quantity?: number) => {
    addToCart(product, size, color, quantity);
    setIsCheckoutOpen(true);
  };

  // --- RENDER FUNCTIONS ---

  const renderHome = () => {
     // Prepare data for widgets
     // 1. Promotions / Discounts (Sale)
     const saleProducts = products.filter(p => p.oldPrice && p.oldPrice > p.price);
     const flashSaleProduct = saleProducts.length > 0 ? saleProducts[0] : null;

     // 2. New Arrivals
     const newArrivals = products.filter(p => p.isNew);

     // 3. Recently Viewed
     const recentlyViewed = products.filter(p => recentlyViewedIds.includes(p.id));

     // 4. Recommended (Mock logic: just take some items that are top rated)
     const recommended = products.filter(p => p.rating >= 4.8).slice(0, 5);
     
     // 5. Top Sellers
     const topSellers = products.filter(p => p.isTop);

     // Trending (Masonry) - separate from main lists
     const trendingProducts = products.filter(p => p.isTop).slice(0, 3);

     return (
       <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background">
         {/* Widgets / Shell */}
         <LiveTicker />
         <GreetingHeader name={userProfile.name.split(' ')[0]} />
         <CategoryBlock lang={lang} onSelectCategory={(id) => { handleSelectCategory(id); setView({ name: 'listing' }); }} />
         <div className="mt-4"></div>
         <DailyBonus />
         <Hero lang={lang} onShopNow={() => setView({ name: 'listing' })} />
         <div className="mt-6">
            <BrandWall brands={MOCK_BRANDS} />
         </div>

         {/* SECTION 1: PROMOTIONS & DISCOUNTS */}
         <div className="mt-6 mb-2">
            <div className="flex justify-between items-center px-4 mb-3">
               <h2 className="font-heading font-bold text-lg text-red-600 flex items-center gap-2">
                 <Icon icon="solar:sale-bold" />
                 {lang === 'ru' ? 'Акции и скидки' : 'Аксияҳо ва тахфифҳо'}
               </h2>
               <button onClick={() => { setFilters({...filters, onlySale: true}); setView({ name: 'listing' }); }} className="text-primary text-sm font-medium">См. все</button>
            </div>
            
            {/* Flash Sale Widget integrated here */}
            {flashSaleProduct && (
                <FlashSale product={flashSaleProduct} onClick={() => handleProductClick(flashSaleProduct)} />
            )}

            <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
               {saleProducts.map(p => (
                  <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} onAddToCart={addToCart} isFullWidth isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} />
               ))}
            </div>
         </div>

         <div className="mt-2">
            <MasonryGrid products={trendingProducts} onProductClick={handleProductClick} />
         </div>

         {/* SECTION 2: NEW ARRIVALS */}
         <div className="mt-6 mb-2">
            <div className="flex justify-between items-center px-4 mb-3">
               <h2 className="font-heading font-bold text-lg text-foreground">
                 {lang === 'ru' ? 'Новые товары недели' : 'Молҳои нави ҳафта'}
               </h2>
               <button onClick={() => { setFilters({...filters, onlyNew: true}); setView({ name: 'listing' }); }} className="text-primary text-sm font-medium">См. все</button>
            </div>
            <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
               {newArrivals.map(p => (
                  <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} onAddToCart={addToCart} isFullWidth isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} />
               ))}
            </div>
         </div>

         {/* SECTION 3: RECENTLY VIEWED */}
         {recentlyViewed.length > 0 && (
            <div className="mb-6">
               <h2 className="px-4 font-heading font-bold text-lg text-foreground mb-3">
                  {lang === 'ru' ? 'Недавно вы посмотрели' : 'Ба наздикӣ дидашуда'}
               </h2>
               <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
                  {recentlyViewed.map(p => (
                     <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} onAddToCart={addToCart} isFullWidth isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} />
                  ))}
               </div>
            </div>
         )}

         {/* Lookbook Teaser (placed here to break up the lists) */}
         <div className="mt-2 px-4 mb-6">
            <div onClick={() => setView({ name: 'lookbook' })} className="w-full bg-slate-900 rounded-2xl p-6 text-white text-center cursor-pointer shadow-xl relative overflow-hidden group">
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <h2 className="text-2xl font-bold font-heading mb-2">Shop The Look</h2>
                  <p className="text-sm text-slate-300 mb-4">Готовые образы от стилистов</p>
                  <button className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm">Смотреть</button>
               </div>
            </div>
         </div>

         {/* SECTION 4: RECOMMENDED */}
         <div className="mb-6">
            <h2 className="px-4 font-heading font-bold text-lg text-foreground mb-3">
               {lang === 'ru' ? 'Рекомендовано вам' : 'Ба шумо тавсия дода мешавад'}
            </h2>
            <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
               {recommended.map(p => (
                  <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} onAddToCart={addToCart} isFullWidth isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} />
               ))}
            </div>
         </div>

         {/* SECTION 5: TOP SELLERS */}
         <div className="mb-6">
            <div className="flex justify-between items-center px-4 mb-3">
               <h2 className="font-heading font-bold text-lg text-foreground">
                  {lang === 'ru' ? 'Хиты продаж' : 'Хитҳои фурӯш'}
               </h2>
               <button onClick={() => { setFilters({...filters, onlyTop: true}); setView({ name: 'listing' }); }} className="text-primary text-sm font-medium">См. все</button>
            </div>
            <div className="flex overflow-x-auto px-4 gap-4 pb-4 scrollbar-hide snap-x">
               {topSellers.map(p => (
                  <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} onAddToCart={addToCart} isFullWidth isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} />
               ))}
            </div>
         </div>

         <OccasionList occasions={MOCK_OCCASIONS} />
       </div>
     );
  };

  const renderListing = () => {
    const currentCategory = categories.find(c => c.id === filters.category);
    const subcategories = currentCategory ? currentCategory.subcategories : [];
    const heroConfig = CATEGORY_CONFIG[filters.category];

    // Banner injection logic
    const productsWithBanners: (Product | any)[] = [...filteredProducts];
    if (filteredProducts.length > 4) {
       productsWithBanners.splice(4, 0, { isBanner: true, data: IN_FEED_BANNERS[0] });
    }
    if (filteredProducts.length > 8) {
       productsWithBanners.splice(9, 0, { isBanner: true, data: IN_FEED_BANNERS[1] }); // Lookbook
    }
    
    return (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background">
         {/* Category Hero Banner */}
         {heroConfig && filters.category !== 'all' && (
            <CategoryHero image={heroConfig.image} title={heroConfig.title} subtitle={heroConfig.subtitle} />
         )}

         {/* Sticky Controls */}
         <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100">
            
            {/* Horizontal Subcategories (Pills) */}
            {subcategories.length > 0 && (
               <div className="py-3 px-4 flex overflow-x-auto gap-2 scrollbar-hide border-b border-slate-50">
                  {subcategories.map(sub => (
                     <button 
                        key={sub}
                        onClick={() => setFilters({...filters, subCategory: filters.subCategory === sub ? null : sub})}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${filters.subCategory === sub ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
                     >
                        {sub}
                     </button>
                  ))}
               </div>
            )}

            {/* Quick Filters Row */}
            <div className="px-4 py-2 flex items-center justify-between">
               <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {/* Size Quick Filter */}
                  <div className="relative group">
                     <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${filters.size ? 'bg-primary/10 text-primary border-primary' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {filters.size || 'Размер'} <Icon icon="solar:alt-arrow-down-bold" className="size-3" />
                     </button>
                     <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block min-w-[150px] z-20">
                        <div className="grid grid-cols-3 gap-1">
                           {['S','M','L','XL','39','40','41'].map(s => (
                              <button key={s} onClick={() => setFilters({...filters, size: s})} className="p-2 hover:bg-slate-50 rounded text-xs font-bold">{s}</button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Color Quick Filter */}
                  <div className="relative group">
                     <button className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${filters.color ? 'bg-primary/10 text-primary border-primary' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {filters.color || 'Цвет'} <Icon icon="solar:alt-arrow-down-bold" className="size-3" />
                     </button>
                     <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block min-w-[120px] z-20">
                         {['Черный','Белый','Синий','Красный'].map(c => (
                            <button key={c} onClick={() => setFilters({...filters, color: c})} className="w-full text-left p-2 hover:bg-slate-50 rounded text-xs font-bold flex items-center gap-2">
                               <div className="size-2 rounded-full border border-slate-300" style={{background: c === 'Черный' ? '#000' : c === 'Белый' ? '#fff' : c === 'Синий' ? 'blue' : 'red'}}></div>
                               {c}
                            </button>
                         ))}
                     </div>
                  </div>
                  
                  {/* Toggle Sale */}
                  <button onClick={() => setFilters({...filters, onlySale: !filters.onlySale})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${filters.onlySale ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                     % Sale
                  </button>
               </div>

               {/* Grid Toggle */}
               <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 shrink-0">
                  <button onClick={() => setIsGridSingle(false)} className={`p-1.5 rounded-md transition-colors ${!isGridSingle ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>
                     <Icon icon="solar:gallery-wide-bold" className="size-4" />
                  </button>
                  <button onClick={() => setIsGridSingle(true)} className={`p-1.5 rounded-md transition-colors ${isGridSingle ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>
                     <Icon icon="solar:gallery-bold" className="size-4" />
                  </button>
               </div>
            </div>

            <div className="px-4 pb-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
               <span>Найдено: {filteredProducts.length} товаров</span>
               <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-1 text-primary">
                  <Icon icon="solar:sort-from-top-to-bottom-bold" className="size-3" />
                  Фильтры и Сортировка
               </button>
            </div>
         </div>

         {/* Product Grid / Skeleton */}
         {isListingLoading ? (
            <SkeletonGrid />
         ) : (
            <div className={`p-4 pt-2 grid gap-4 ${isGridSingle ? 'grid-cols-1' : 'grid-cols-2'}`}>
               {productsWithBanners.map((item, i) => {
                  if (item.isBanner) {
                     return (
                        <div key={`banner-${i}`} className={isGridSingle ? 'col-span-1' : 'col-span-2'}>
                           <InFeedBanner 
                              type={item.data.type} 
                              title={item.data.title} 
                              subtitle={item.data.subtitle} 
                              image={item.data.image} 
                              color={item.data.color}
                              onClick={item.data.type === 'collection' ? () => setView({ name: 'lookbook' }) : undefined}
                           />
                        </div>
                     );
                  }
                  const p = item as Product;
                  return (
                     <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={() => handleProductClick(p)} 
                        onAddToCart={addToCart} 
                        isFavorite={favorites.includes(p.id)} 
                        onToggleFavorite={toggleFavorite} 
                        onCompare={toggleCompare} 
                        isCompare={!!compareList.find(c => c.id === p.id)} 
                        isFullWidth={isGridSingle}
                     />
                  );
               })}
            </div>
         )}
      </div>
    );
  };

  const renderFavorites = () => (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-background px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">{t.favorites}</h1>
      <div className="grid grid-cols-2 gap-4">{products.filter(p => favorites.includes(p.id)).map(p => <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} onAddToCart={addToCart} isFavorite={true} onToggleFavorite={toggleFavorite} onCompare={toggleCompare} isCompare={!!compareList.find(c => c.id === p.id)} />)}</div>
    </div>
  );

  const renderProfile = () => (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 dark:bg-slate-950">
         <div className="bg-white dark:bg-card p-6 pb-8 rounded-b-3xl shadow-sm relative">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md flex items-center justify-center">
                   {userProfile.avatar ? <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" /> : <Icon icon="solar:user-bold" className="size-10 text-slate-300" />}
                 </div>
              </div>
              <div><h1 className="text-xl font-bold text-slate-800 dark:text-white">{userProfile.name}</h1><p className="text-sm text-slate-400 font-medium mb-1">{userProfile.email}</p></div>
           </div>
        </div>

        {/* Referral Program Section */}
        <div className="px-4 mt-6">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                 <Icon icon="solar:users-group-rounded-bold" className="text-primary" />
                 Приведи друга
              </h3>
              <p className="text-xs text-slate-500 mb-4">Делись кодом, получай 2% от покупок друзей!</p>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 border-dashed">
                 <span className="font-mono text-lg font-bold text-slate-800 tracking-wider flex-1 text-center">{userProfile.referralCode}</span>
                 <button className="text-primary font-bold text-xs bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100" onClick={() => { navigator.clipboard.writeText(userProfile.referralCode); addToast('Код скопирован!'); }}>
                    КОПИРОВАТЬ
                 </button>
              </div>
              <div className="mt-4 flex gap-4">
                 <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Заработано</div>
                    <div className="font-bold text-green-600 text-lg">{userProfile.referralEarnings} с.</div>
                 </div>
                 <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Приглашено</div>
                    <div className="font-bold text-slate-800 text-lg">{userProfile.referralsCount} чел.</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Gift Card Promo */}
        <div className="px-4 mt-6">
           <div onClick={() => addToCart({ id: 999, name: "Подарочный сертификат 500с", price: 500, images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48'], category: 'gift', sizes: ['500'], colors: ['Gold'], rating: 5, reviews: [], description: 'Подарок' } as any)} className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer">
              <div>
                 <div className="font-bold text-lg">Подарить сертификат</div>
                 <div className="text-xs opacity-80">Лучший подарок близким</div>
              </div>
              <Icon icon="solar:gift-bold" className="size-8" />
           </div>
        </div>

        {/* Vendor Registration */}
        <div className="px-4 mt-6">
           <div onClick={() => setIsVendorModalOpen(true)} className="bg-slate-800 rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer shadow-lg shadow-slate-800/30">
              <div className="flex items-center gap-3">
                 <Icon icon="solar:shop-bold-duotone" className="size-8 text-yellow-400" />
                 <div>
                    <div className="font-bold text-lg">Стать продавцом</div>
                    <div className="text-xs opacity-70">Продавайте на Grand Market</div>
                 </div>
              </div>
              <Icon icon="solar:arrow-right-bold" className="size-5 opacity-50" />
           </div>
        </div>

        <div className="px-4 space-y-4 mt-6">
            <div className="bg-white p-4 rounded-xl flex justify-between items-center cursor-pointer shadow-sm" onClick={() => setView({ name: 'admin' })}>
               <span className="font-bold">Админ панель</span>
               <Icon icon="solar:settings-bold" className="text-slate-400" />
            </div>
            <div className="bg-white p-4 rounded-xl flex justify-between items-center cursor-pointer shadow-sm" onClick={() => setView({ name: 'employee_portal' })}>
               <span className="font-bold">Вход для сотрудников</span>
               <Icon icon="solar:user-id-bold" className="text-slate-400" />
            </div>
        </div>
      </div>
  );

  // --- View Routing ---
  if (view.name === 'product' && view.data) {
    return (
    <>
      <ToastContainer messages={toasts} removeToast={removeToast} />
      <ProductDetails 
        product={view.data} 
        lang={lang} 
        onBack={() => setView({ name: 'listing' })} 
        onAddToCart={addToCart}
        onBuyNow={handleBuyNow}
        onProductClick={handleProductClick}
        isFavorite={favorites.includes(view.data.id)}
        onToggleFavorite={toggleFavorite}
        onAddToWaitlist={handleAddToWaitlist}
      />
      <FitFinderModal isOpen={false} onClose={() => {}} productCategory="" /> 
    </>
    );
  }

  if (view.name === 'lookbook') {
     return <LookbookView lookbooks={MOCK_LOOKBOOKS} onBack={() => setView({ name: 'listing' })} onAddToCart={addToCart} />;
  }

  if (view.name === 'employee_portal') {
    return <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col"><EmployeePortal onBack={() => setView({ name: 'profile' })} employees={employees} shifts={shifts} onClockIn={handleClockIn} onClockOut={handleClockOut} financialRecords={financialRecords} /></div>;
  }

  if (view.name === 'admin') {
     return (
       <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
          <AdminDashboard 
            onBack={() => setView({name: 'profile'})} 
            products={products} setProducts={setProducts}
            orders={orders} setOrders={setOrders}
            customers={customers} setCustomers={setCustomers}
            categories={categories} setCategories={setCategories}
            employees={employees} setEmployees={setEmployees}
            shifts={shifts} setShifts={setShifts}
            financialRecords={financialRecords} setFinancialRecords={setFinancialRecords}
            bookings={bookings} // NEW
            suppliers={suppliers} setSuppliers={setSuppliers} // NEW
          />
       </div>
     );
  }

  return (
    <div className="flex flex-col h-screen bg-background font-sans overflow-hidden">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      <ToastContainer messages={toasts} removeToast={removeToast} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} totalAmount={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) - bundleSavings} itemCount={cart.reduce((acc, item) => acc + item.quantity, 0)} onSubmit={handlePlaceOrder} savedViaBundles={bundleSavings} />
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={setFilters} currentFilters={filters} lang={lang} />
      <CompareDrawer isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} products={compareList} onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))} onAddToCart={addToCart} />
      <FittingRoomModal isOpen={isFittingModalOpen} onClose={() => setIsFittingModalOpen(false)} onSubmit={handleFittingBooking} itemCount={cart.length} />
      <VendorRegistrationModal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} onSubmit={handleVendorRegister} />

      {compareList.length > 0 && !isCompareOpen && view.name !== 'admin' && view.name !== 'employee_portal' && (
         <button onClick={() => setIsCompareOpen(true)} className="fixed bottom-24 right-4 z-40 bg-primary text-white p-4 rounded-full shadow-xl flex items-center justify-center gap-2 animate-bounce"><Icon icon="solar:scale-bold" className="size-6" /><span className="font-bold text-xs">{compareList.length}</span></button>
      )}

      {(view.name === 'home' || view.name === 'listing') && <TopHeader onSearch={(q) => { setFilters({...filters, search: q}); setView({ name: 'listing' }); }} onFilterClick={() => setIsFilterOpen(true)} lang={lang} setLang={setLang} />}

      {view.name === 'home' && renderHome()}
      {view.name === 'listing' && renderListing()}
      
      {view.name === 'cart' && (
        <CartView 
          cart={cart} 
          setCart={setCart} 
          favorites={favorites} 
          toggleFavorite={toggleFavorite} 
          onCheckout={() => setIsCheckoutOpen(true)} 
          onNavigate={setView}
          bundleSavings={bundleSavings}
          onBookingFitting={() => setIsFittingModalOpen(true)}
          lang={lang}
        />
      )}
      
      {view.name === 'profile' && renderProfile()}
      {view.name === 'favorites' && renderFavorites()}

      <BottomNav activeView={view.name} onNavigate={setView} cartCount={cart.length} />
    </div>
  );
};

export default App;
