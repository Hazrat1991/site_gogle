

import { Product, Order, Customer, Category, UserProfile, Supplier, Employee, FinanceRecord, ActivityLog, PromoCode, SupportChat, Department, MediaFolder, MediaItem, StoreSettings, EmployeeExtended, Shift, StaffFinancialRecord, Language, Promotion, CourierLocation, Lookbook, ReturnRequest, PackingTable, WarehouseDocument, PayoutRequest, StaticPage, DeliveryZone, NotificationCampaign, Attribute, AdminUser, Review, Brand, Occasion, Question } from './types';

export const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', user: 'Фариза', question: 'На рост 165 размер S подойдет?', answer: 'Да, модель идет размер в размер. На 165 см S сядет отлично.', date: '10.10.2023' },
  { id: 'q2', user: 'Рустам', question: 'Материал сильно мнется?', answer: 'Нет, ткань с добавлением синтетики, почти не мнется.', date: '12.10.2023' }
];

// Products with explicit Department IDs for picker logic
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Куртка Зимняя Grand Parka",
    price: 1200,
    buyPrice: 800,
    oldPrice: 1500,
    category: "men",
    subCategory: "Верхняя одежда",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-walking-in-winter-clothes-in-snow-32739-large.mp4",
    description: "Утепленная парка с водоотталкивающим покрытием. Идеально для суровой зимы.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Черный", "Хаки", "Синий"],
    rating: 4.8,
    reviews: [{id: '1', user: 'Алишер', rating: 5, comment: 'Очень теплая!', date: '2023-10-10', photos: ["https://images.unsplash.com/photo-1515434126000-961d90c2351a?w=100&q=80"], status: 'approved'}],
    questions: MOCK_QUESTIONS,
    isNew: true,
    isTop: true,
    stock: 15,
    material: "Полиэстер, Пух",
    crossSellIds: [9, 5, 8],
    supplierId: '1',
    approvalStatus: 'approved',
    departmentId: 'dep-1' // Clothing
  },
  {
    id: 2,
    name: "Платье Летнее Silk Dream",
    price: 450,
    buyPrice: 250,
    category: "women",
    subCategory: "Платья",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-in-a-pink-dress-41712-large.mp4",
    description: "Легкое шелковое платье для вечерних прогулок.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Белый", "Красный"],
    rating: 4.9,
    reviews: [],
    isTop: true,
    stock: 4,
    material: "Шелк 100%",
    crossSellIds: [6, 4],
    supplierId: '2',
    approvalStatus: 'approved',
    departmentId: 'dep-1'
  },
  {
    id: 3,
    name: "Кроссовки Urban Run",
    price: 680,
    buyPrice: 400,
    oldPrice: 800,
    category: "shoes",
    subCategory: "Кроссовки",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80"
    ],
    description: "Спортивные кроссовки с амортизирующей подошвой.",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["Красный", "Белый", "Черный"],
    rating: 4.7,
    reviews: [],
    isNew: true,
    stock: 3, // Low stock for forecast demo
    material: "Текстиль, Резина",
    crossSellIds: [5, 4],
    supplierId: '3',
    approvalStatus: 'approved',
    departmentId: 'dep-3' // Shoes (assuming new dep)
  },
  {
    id: 4,
    name: "Кепка New York",
    price: 120,
    buyPrice: 60,
    category: "hats",
    subCategory: "Кепки",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89f?w=600&q=80"
    ],
    description: "Классическая бейсболка из хлопка.",
    sizes: ["One Size"],
    colors: ["Синий", "Черный"],
    rating: 4.5,
    reviews: [],
    stock: 50,
    material: "Хлопок",
    supplierId: '2',
    approvalStatus: 'approved',
    departmentId: 'dep-2' // Accessories
  },
  {
    id: 5,
    name: "Носки Sport Elite (3 пары)",
    price: 45,
    buyPrice: 20,
    category: "socks",
    subCategory: "Спорт",
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50f82?w=600&q=80"
    ],
    description: "Дышащие спортивные носки.",
    sizes: ["39-42", "43-46"],
    colors: ["Белый", "Черный"],
    rating: 4.6,
    reviews: [],
    stock: 100,
    material: "Хлопок, Эластан",
    supplierId: '2',
    approvalStatus: 'approved',
    departmentId: 'dep-2'
  },
  {
    id: 6,
    name: "Рюкзак Leather Travel",
    price: 550,
    buyPrice: 300,
    category: "accessories",
    subCategory: "Сумки",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
    ],
    description: "Стильный кожаный рюкзак для города и путешествий.",
    sizes: ["20L"],
    colors: ["Коричневый", "Черный"],
    rating: 4.9,
    reviews: [],
    isTop: true,
    stock: 8,
    material: "Эко-кожа",
    supplierId: '1',
    approvalStatus: 'approved',
    departmentId: 'dep-2'
  },
  {
    id: 7,
    name: "Джинсы Classic Fit",
    price: 320,
    buyPrice: 180,
    category: "men",
    subCategory: "Джинсы",
    images: [
      "https://images.unsplash.com/photo-1542272617-08f083758dc9?w=600&q=80"
    ],
    description: "Классические прямые джинсы.",
    sizes: ["30", "32", "34", "36"],
    colors: ["Синий"],
    rating: 4.4,
    reviews: [],
    stock: 0, // Out of stock for "Notify Me" demo
    material: "Деним",
    crossSellIds: [1, 5],
    supplierId: '1',
    approvalStatus: 'approved',
    departmentId: 'dep-1'
  },
  {
    id: 8,
    name: "Ботинки Winter Steps",
    price: 890,
    buyPrice: 500,
    category: "shoes",
    subCategory: "Ботинки",
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80"
    ],
    description: "Теплые зимние ботинки из натуральной кожи.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Коричневый"],
    rating: 4.8,
    reviews: [],
    isNew: true,
    stock: 6,
    material: "Кожа, Мех",
    crossSellIds: [5, 9],
    supplierId: '3',
    approvalStatus: 'approved',
    departmentId: 'dep-3'
  },
  {
    id: 9,
    name: "Шарф Cashmere Soft",
    price: 180,
    buyPrice: 90,
    category: "accessories",
    subCategory: "Шарфы",
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80"
    ],
    description: "Мягкий кашемировый шарф.",
    sizes: ["One Size"],
    colors: ["Серый", "Бежевый"],
    rating: 4.7,
    reviews: [],
    stock: 20,
    material: "Кашемир",
    supplierId: '2',
    approvalStatus: 'approved',
    departmentId: 'dep-2'
  },
  {
    id: 10,
    name: "Худи Streetwear Oversize",
    price: 290,
    buyPrice: 150,
    category: "women",
    subCategory: "Худи",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80"
    ],
    description: "Уютное худи оверсайз.",
    sizes: ["S", "M", "L"],
    colors: ["Розовый", "Белый", "Мятный"],
    rating: 4.6,
    reviews: [],
    stock: 14,
    material: "Хлопок, Флис",
    supplierId: '1',
    approvalStatus: 'approved',
    departmentId: 'dep-1'
  },
  // Pending product for moderation
  {
    id: 99,
    name: "Спортивный Костюм (Ожидает)",
    price: 350,
    buyPrice: 200,
    category: "men",
    subCategory: "Костюмы",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
    ],
    description: "Новая модель от партнера.",
    sizes: ["M", "L"],
    colors: ["Серый"],
    rating: 0,
    reviews: [],
    stock: 10,
    material: "Трикотаж",
    supplierId: '2',
    approvalStatus: 'pending',
    departmentId: 'dep-1'
  }
];

export const MOCK_USER_PROFILE: UserProfile = {
  name: "Манижа Каримова",
  email: "manizha@example.com",
  phone: "+992 900 12 34 56",
  bonusPoints: 1250,
  cashbackLevel: 5,
  addresses: [
    { id: '1', title: 'Дом', address: 'ул. Рудаки 12, кв 45', isDefault: true },
    { id: '2', title: 'Работа', address: 'пр. Сомони 5, офис 201', isDefault: false }
  ],
  cards: [
    { id: '1', last4: '4242', brand: 'visa', expiry: '12/25' }
  ],
  notifications: {
    email: true,
    sms: true,
    push: true
  },
  referralCode: 'MANIZHA24',
  referralEarnings: 45,
  referralsCount: 3
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7782',
    customerName: 'Манижа Каримова',
    customerPhone: '900112233', // Numeric for WhatsApp
    date: '2023-10-25',
    total: 1200,
    status: 'new',
    shippingMethod: 'delivery',
    paymentMethod: 'cash',
    address: 'ул. Рудаки 10, кв 5',
    items: [
       { ...MOCK_PRODUCTS[0], quantity: 1, selectedSize: 'M', selectedColor: 'Черный', pickedStatus: 'pending' } as any
    ],
    tableId: 'tbl-1',
    verificationCode: '4590'
  },
  {
    id: 'ORD-7781',
    customerName: 'Манижа Каримова',
    customerPhone: '918554422',
    date: '2023-10-15',
    total: 450,
    status: 'delivered',
    shippingMethod: 'pickup',
    paymentMethod: 'card',
    address: '',
    items: [
       { ...MOCK_PRODUCTS[1], quantity: 1, selectedSize: 'S', selectedColor: 'Белый', pickedStatus: 'picked' } as any
    ],
    verificationCode: '1122'
  },
  {
    id: 'ORD-7780',
    customerName: 'Фарход Д.',
    customerPhone: '934445566',
    date: '2023-10-24',
    total: 2890,
    status: 'shipped',
    shippingMethod: 'delivery',
    paymentMethod: 'card',
    address: 'пр. Сомони 55',
    items: [
       { ...MOCK_PRODUCTS[2], quantity: 1, selectedSize: '42', selectedColor: 'Красный', pickedStatus: 'picked' } as any, 
       { ...MOCK_PRODUCTS[7], quantity: 1, selectedSize: '42', selectedColor: 'Коричневый', pickedStatus: 'picked' } as any
    ],
    courierId: 'emp-3',
    verificationCode: '3388'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Алишер Н.', email: 'alisher@example.com', phone: '+992 900 11 22 33', ordersCount: 5, totalSpent: 3500, status: 'active', joinDate: '2023-01-10' },
  { id: '2', name: 'Зарина К.', email: 'zarina@example.com', phone: '+992 918 55 44 22', ordersCount: 12, totalSpent: 8900, status: 'active', joinDate: '2022-11-05' },
  { id: '3', name: 'Фарход Д.', email: 'farhod@example.com', phone: '+992 93 444 55 66', ordersCount: 2, totalSpent: 1200, status: 'blocked', joinDate: '2023-05-20' },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dep-1', name: 'Одежда', description: 'Основной склад одежды', status: 'active', productCount: 80, createdAt: '2023-01-15', color: '#F97316', sortOrder: 1 },
  { id: 'dep-2', name: 'Аксессуары', description: 'Сумки, часы, украшения, шапки', status: 'active', productCount: 45, createdAt: '2023-02-10', color: '#1E3A8A', sortOrder: 2 },
  { id: 'dep-3', name: 'Обувь', description: 'Склад обуви', status: 'active', productCount: 30, createdAt: '2023-05-20', color: '#10B981', sortOrder: 3 },
];

export const MOCK_CATEGORIES: Category[] = [
  { 
    id: 'men', 
    name: 'Мужчинам', 
    subcategories: ['Верхняя одежда', 'Джинсы', 'Футболки', 'Костюмы'],
    departmentId: 'dep-1',
    description: 'Одежда для мужчин',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c809a10?w=600&q=80',
    parentId: undefined,
    sortOrder: 1,
    isActive: true,
    showOnHome: true,
    showInMenu: true,
    slug: 'men'
  },
  { 
    id: 'women', 
    name: 'Женщинам', 
    subcategories: ['Платья', 'Юбки', 'Блузки', 'Обувь', 'Худи'],
    departmentId: 'dep-1',
    description: 'Одежда для женщин',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    parentId: undefined,
    sortOrder: 2,
    isActive: true,
    showOnHome: true,
    showInMenu: true,
    slug: 'women'
  },
  { 
    id: 'shoes', 
    name: 'Обувь', 
    subcategories: ['Кроссовки', 'Ботинки', 'Туфли'],
    departmentId: 'dep-3',
    description: 'Обувь для всех',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    parentId: undefined,
    sortOrder: 3,
    isActive: true,
    showOnHome: true,
    showInMenu: true,
    slug: 'shoes'
  },
  { 
    id: 'accessories', 
    name: 'Аксессуары', 
    subcategories: ['Часы', 'Сумки', 'Очки', 'Шарфы'],
    departmentId: 'dep-2',
    description: 'Стильные детали',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
    parentId: undefined,
    sortOrder: 4,
    isActive: true,
    showOnHome: true,
    showInMenu: true,
    slug: 'accessories'
  },
];

// --- CATEGORY CONFIG FOR HERO BANNER ---
export const CATEGORY_CONFIG: Record<string, { image: string, title: string, subtitle: string }> = {
   men: { image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=80', title: 'Мужская Коллекция', subtitle: 'Стиль и комфорт для него' },
   women: { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80', title: 'Женская Коллекция', subtitle: 'Элегантность в каждой детали' },
   shoes: { image: 'https://images.unsplash.com/photo-1556048219-bb6978360b8c?w=1200&q=80', title: 'Обувь', subtitle: 'Шагай уверенно' },
   accessories: { image: 'https://images.unsplash.com/photo-1472851294608-41531b6574d4?w=1200&q=80', title: 'Аксессуары', subtitle: 'Завершите свой образ' },
   hats: { image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=1200&q=80', title: 'Головные уборы', subtitle: 'Стильная защита' },
   socks: { image: 'https://images.unsplash.com/photo-1517042530182-14de6b3a3250?w=1200&q=80', title: 'Носки', subtitle: 'Комфорт начинается с малого' },
};

// --- IN-FEED BANNERS DATA ---
export const IN_FEED_BANNERS = [
   { id: 'b1', type: 'promo', title: 'Скидка -10% на первый заказ', subtitle: 'Используйте код: FIRST10', image: '', color: 'bg-purple-600' },
   { id: 'b2', type: 'collection', title: 'Зимний Lookbook', subtitle: 'Смотреть образы', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', color: '' },
   { id: 'b3', type: 'video', title: 'Тренды 2024', subtitle: 'Смотреть видео', image: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-in-a-pink-dress-41712-large.mp4', color: '' }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Asia Textile', contactName: 'Джамшед', phone: '+992 900 55 55 55', balance: 5000, lastDelivery: '2023-10-20', rating: 4.8, status: 'active' },
  { id: '2', name: 'China Direct', contactName: 'Ван Ли', phone: '+86 138 0000 0000', balance: 12000, lastDelivery: '2023-10-15', rating: 4.5, status: 'active' },
  { id: '3', name: 'Local Shoes', contactName: 'Собир', phone: '+992 918 11 11 11', balance: -200, lastDelivery: '2023-10-22', rating: 3.9, status: 'active' }
];

// Old simplified employee list (kept for legacy support if needed, but we use Extended now)
export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Рустам А.', role: 'manager', phone: '+992 900 88 77 66', status: 'active', lastActive: '5 мин назад' },
  { id: '2', name: 'Сарвиноз Б.', role: 'seller', phone: '+992 918 33 22 11', status: 'active', lastActive: '12 мин назад' },
  { id: '3', name: 'Далер В.', role: 'admin', phone: '+992 93 555 66 77', status: 'active', lastActive: '1 час назад' },
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: '1', type: 'income', category: 'sales', amount: 15400, date: '2023-10-25', description: 'Выручка за день' },
  { id: '2', type: 'expense', category: 'procurement', amount: 8000, date: '2023-10-24', description: 'Закупка зимней коллекции' },
  { id: '3', type: 'expense', category: 'salary', amount: 12000, date: '2023-10-01', description: 'Зарплата за сентябрь' },
  { id: '4', type: 'income', category: 'other', amount: 500, date: '2023-10-23', description: 'Продажа оборудования' },
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: '1', timestamp: '10:45', userName: 'Admin', userRole: 'admin', actionType: 'update', actionTitle: 'Изменение цены', details: 'Куртка Зимняя: 1200 -> 1150', module: 'Products', ip: '192.168.1.1', device: 'Desktop' },
  { id: '2', timestamp: '11:20', userName: 'Рустам А.', userRole: 'manager', actionType: 'create', actionTitle: 'Новый заказ', details: 'Заказ #ORD-7783 создан', module: 'Orders', ip: '192.168.1.5', device: 'Tablet' },
  { id: '3', timestamp: '12:05', userName: 'System', userRole: 'system', actionType: 'warning', actionTitle: 'Низкий остаток', details: 'Товар ID: 5 осталось 2 шт', module: 'Inventory', ip: 'localhost', device: 'Server' },
];

export const MOCK_MEDIA_FILES: MediaItem[] = [
  { id: '1', name: 'banner_main.jpg', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', type: 'image', size: '2.4 MB', createdAt: '2023-10-01' },
  { id: '2', name: 'winter_collection.mp4', url: '#', type: 'video', size: '15.8 MB', createdAt: '2023-10-05' },
  { id: '3', name: 'price_list.pdf', url: '#', type: 'document', size: '0.5 MB', createdAt: '2023-10-10' },
  { id: '4', name: 'shoe_promo.jpg', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', type: 'image', size: '1.8 MB', createdAt: '2023-10-12' },
  { id: '5', name: 'logo_v2.png', url: '#', type: 'image', size: '0.2 MB', createdAt: '2023-09-01' },
  { id: '6', name: 'contract_template.docx', url: '#', type: 'document', size: '1.2 MB', createdAt: '2023-01-15' },
];

export const MOCK_SETTINGS: StoreSettings = {
  general: { storeName: 'Grand Market', slogan: 'Мода для всех', phone: '+992 900 00 00 00', email: 'info@grandmarket.tj', address: 'Душанбе, Рудаки 100', currency: 'TJS', language: 'ru' },
  design: { themeColor: '#F97316', darkMode: false, fontFamily: 'Manrope', logoUrl: '' },
  products: { unit: 'шт', minOrderAmount: 0, showOutOfStock: true, enableReviews: true, taxRate: 0 },
  users: { registrationRequired: false, loyaltyProgram: true, cashbackPercent: 5 },
  payment: { acceptCash: true, acceptCards: true, acceptCardsOnline: false, currencyRate: 1 },
  shipping: { freeShippingThreshold: 500, standardShippingCost: 20, expressShippingCost: 50 },
  notifications: { emailOrderConfirmation: true, smsOrderStatus: true, pushPromos: true },
  security: { twoFactorAuth: false, passwordExpirationDays: 90 }
};

export const DICTIONARY: Record<Language, any> = {
  ru: {
    search: "Поиск...",
    men: "Мужчинам",
    women: "Женщинам",
    shoes: "Обувь",
    hats: "Головные уборы",
    socks: "Носки",
    accessories: "Аксессуары",
    newArrivals: "Новинки",
    topSellers: "Хиты продаж",
    categories: "Категории",
    cart: "Корзина",
    total: "Итого",
    checkout: "Оформить заказ",
    favorites: "Избранное",
    profile: "Профиль",
    admin: "Админ-панель",
    description: "Описание",
    reviews: "Отзывы",
    similar: "Похожие товары",
    addToCart: "В корзину",
    buy1click: "Купить сейчас",
    color: "Цвет",
    size: "Размер",
    price: "Цена",
    bonuses: "Ваши бонусы",
    myOrders: "Мои заказы",
    settings: "Настройки",
    support: "Поддержка",
    addresses: "Мои адреса",
    logout: "Выйти"
  },
  tj: {
    search: "Ҷустуҷӯ...",
    men: "Мардона",
    women: "Занона",
    shoes: "Пойафзол",
    hats: "Кӯлоҳҳо",
    socks: "Ҷӯробҳо",
    accessories: "Аксессуарҳо",
    newArrivals: "Навиҳо",
    topSellers: "Беҳтаринҳо",
    categories: "Категорияҳо",
    cart: "Сабад",
    total: "Ҷамъ",
    checkout: "Ба расмият даровардан",
    favorites: "Дӯстдошта",
    profile: "Профил",
    admin: "Панели админ",
    description: "Тавсиф",
    reviews: "Тафсирҳо",
    similar: "Молҳои монанд",
    addToCart: "Ба сабад",
    buy1click: "Хариди ҳозира",
    color: "Ранг",
    size: "Андоза",
    price: "Нарх",
    bonuses: "Бонусҳои шумо",
    myOrders: "Фармоишҳои ман",
    settings: "Танзимот",
    support: "Дастгирӣ",
    addresses: "Суроғаҳо",
    logout: "Баромадан"
  }
};

// --- NEW MOCK DATA FOR EMPLOYEE MODULE ---

export const MOCK_EMPLOYEES_EXTENDED: EmployeeExtended[] = [
  {
    id: 'emp-1',
    fullName: 'Рустам Ахмедов',
    phone: '+992 900 88 77 66',
    role: 'supervisor', // Changed from manager for demo of senior shift
    status: 'working',
    hireDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    hourlyRate: 25,
    loginCode: '1111',
    totalDebt: 0,
    totalAdvances: 500,
    hoursWorkedMonth: 120,
    shiftsCountMonth: 15,
    earnedMonth: 3000,
    history: ['2023-10-25: Пришел вовремя', '2023-10-24: Взял аванс 200с']
  },
  {
    id: 'emp-2',
    fullName: 'Сарвиноз Бобоева',
    phone: '+992 918 33 22 11',
    role: 'seller',
    departmentId: 'dep-1', // Clothing Dept
    status: 'working',
    hireDate: '2023-03-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    hourlyRate: 15,
    loginCode: '2222',
    totalDebt: 150,
    totalAdvances: 0,
    hoursWorkedMonth: 140,
    shiftsCountMonth: 18,
    earnedMonth: 2100,
    history: ['2023-10-25: Опоздание 10 мин']
  },
  {
    id: 'emp-3',
    fullName: 'Далер Валиев',
    phone: '+992 93 555 66 77',
    role: 'courier',
    status: 'off',
    hireDate: '2023-06-01',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
    hourlyRate: 10,
    shiftRate: 50,
    commissionPercent: 5,
    loginCode: '3333',
    totalDebt: 0,
    totalAdvances: 100,
    hoursWorkedMonth: 80,
    shiftsCountMonth: 10,
    earnedMonth: 1500,
    history: []
  },
  {
    id: 'emp-4',
    fullName: 'Амир Т.',
    phone: '+992 90 123 45 67',
    role: 'seller',
    departmentId: 'dep-3', // Shoe Dept
    status: 'working',
    hireDate: '2023-07-15',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80',
    hourlyRate: 15,
    loginCode: '4444',
    totalDebt: 0,
    totalAdvances: 0,
    hoursWorkedMonth: 100,
    shiftsCountMonth: 14,
    earnedMonth: 1500,
    history: []
  }
];

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 'shift-1',
    employeeId: 'emp-1',
    employeeName: 'Рустам Ахмедов',
    date: '2023-10-25',
    startTime: '08:00',
    endTime: '17:00',
    durationHours: 9,
    earned: 225,
    status: 'completed',
    locationStart: 'Main Store',
    locationEnd: 'Main Store',
    device: 'Admin Tablet'
  },
  {
    id: 'shift-2',
    employeeId: 'emp-2',
    employeeName: 'Сарвиноз Бобоева',
    date: '2023-10-25',
    startTime: '09:00',
    status: 'active',
    durationHours: 0,
    earned: 0,
    locationStart: 'Main Store',
    device: 'Mobile'
  }
];

export const MOCK_STAFF_FINANCE: StaffFinancialRecord[] = [
  { id: 'fin-1', employeeId: 'emp-1', employeeName: 'Рустам Ахмедов', type: 'advance', amount: 200, date: '2023-10-24', comment: 'На обед', issuer: 'Admin' },
  { id: 'fin-2', employeeId: 'emp-1', employeeName: 'Рустам Ахмедов', type: 'advance', amount: 300, date: '2023-10-10', comment: 'Аванс', issuer: 'Admin' },
  { id: 'fin-3', employeeId: 'emp-2', employeeName: 'Сарвиноз Бобоева', type: 'debt', amount: 150, date: '2023-10-15', comment: 'Взяла платье из магазина', issuer: 'Admin', isPaid: false }
];

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: 'promo-1', title: '1+1=3 на Футболки', type: 'bogo', value: 0, startDate: '2023-10-01', endDate: '2023-10-30', isActive: true, color: 'bg-blue-100 text-blue-700' },
  { id: 'promo-2', title: 'Счастливые часы (-20%)', type: 'discount', value: 20, condition: '18:00 - 21:00', startDate: '2023-10-01', endDate: '2023-12-31', isActive: true, color: 'bg-green-100 text-green-700' },
  { id: 'promo-3', title: 'Бесплатная доставка обуви', type: 'shipping', value: 0, startDate: '2023-10-20', endDate: '2023-11-01', isActive: false, color: 'bg-purple-100 text-purple-700' }
];

export const MOCK_COURIER_LOCATIONS: CourierLocation[] = [
  { id: 'loc-1', courierId: 'emp-3', courierName: 'Далер Валиев', lat: 38.5598, lng: 68.7870, status: 'delivering', currentOrderId: 'ORD-7780' },
  { id: 'loc-2', courierId: 'emp-4', courierName: 'Амир Т.', lat: 38.5650, lng: 68.7900, status: 'idle' }
];

// --- NEW DATA FOR LOOKBOOK & RETURNS ---

export const MOCK_LOOKBOOKS: Lookbook[] = [
  {
    id: 'look-1',
    title: 'Зимний Городской',
    description: 'Идеальный комплект для прогулок по Душанбе зимой.',
    mainImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    productIds: [1, 5, 8],
    discount: 10
  },
  {
    id: 'look-2',
    title: 'Летняя Вечеринка',
    description: 'Легкий и элегантный образ.',
    mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    productIds: [2, 9],
    discount: 5
  }
];

export const MOCK_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'ret-1',
    orderId: 'ORD-7781',
    customerName: 'Манижа Каримова',
    date: '2023-10-26',
    items: [{ productId: 2, productName: 'Платье Летнее', reason: 'Не подошел размер' }],
    status: 'pending'
  }
];

export const MOCK_PACKING_TABLES: PackingTable[] = [
  { id: 'tbl-1', name: 'Стол №1', supervisorId: 'emp-1', supervisorName: 'Рустам Ахмедов', status: 'active', currentOrderIds: ['ORD-7782'], totalOrdersProcessed: 145 },
  { id: 'tbl-2', name: 'Стол №2', supervisorId: 'emp-2', supervisorName: 'Сарвиноз Бобоева', status: 'busy', currentOrderIds: ['ORD-7780'], totalOrdersProcessed: 89 },
];

export const MOCK_WAREHOUSE_DOCUMENTS: WarehouseDocument[] = [
  { id: 'doc-1', type: 'income', date: '2023-10-25', supplierName: 'Asia Textile', totalAmount: 5400, itemCount: 120, status: 'completed', comment: 'Зимняя коллекция' },
  { id: 'doc-2', type: 'writeoff', date: '2023-10-24', totalAmount: 320, itemCount: 2, status: 'completed', comment: 'Брак (пятна)' },
  { id: 'doc-3', type: 'transfer', date: '2023-10-26', totalAmount: 0, itemCount: 15, status: 'draft', comment: 'Перемещение в магазин №2' },
];

// --- MOCK DATA FOR NEW ADMIN SECTIONS ---

export const MOCK_PAYOUTS: PayoutRequest[] = [
  { id: 'pay-1', supplierId: '2', supplierName: 'China Direct', amount: 5000, date: '2023-10-25', status: 'pending', method: 'Bank Transfer' },
  { id: 'pay-2', supplierId: '3', supplierName: 'Local Shoes', amount: 200, date: '2023-10-20', status: 'paid', method: 'Cash' },
];

export const MOCK_PAGES: StaticPage[] = [
  { id: 'pg-1', title: 'О нас', slug: 'about', content: 'Мы - Grand Market...', lastUpdated: '2023-09-01', isActive: true },
  { id: 'pg-2', title: 'Политика конфиденциальности', slug: 'privacy', content: 'Ваши данные защищены...', lastUpdated: '2023-01-15', isActive: true },
  { id: 'pg-3', title: 'Контакты', slug: 'contact', content: 'Наш адрес: ...', lastUpdated: '2023-10-05', isActive: true },
];

export const MOCK_ZONES: DeliveryZone[] = [
  { id: 'zn-1', name: 'Центр', cost: 10, color: '#10B981', description: 'В пределах кольцевой' },
  { id: 'zn-2', name: 'Окраина', cost: 25, color: '#F59E0B', description: 'Спальные районы' },
  { id: 'zn-3', name: 'Область', cost: 50, color: '#EF4444', description: 'До 20км от города' },
];

export const MOCK_NOTIFICATIONS: NotificationCampaign[] = [
  { id: 'nt-1', title: 'Зимняя Распродажа', message: 'Скидки до 50% на всё!', type: 'push', sentDate: '2023-10-25', recipientsCount: 1250, status: 'sent' },
  { id: 'nt-2', title: 'Черная Пятница', message: 'Готовьтесь к скидкам', type: 'sms', sentDate: '2023-11-20', recipientsCount: 0, status: 'scheduled' },
];

export const MOCK_ATTRIBUTES: Attribute[] = [
  { id: 'at-1', type: 'size', name: 'XL', value: 'XL' },
  { id: 'at-2', type: 'color', name: 'Красный', value: '#EF4444' },
  { id: 'at-3', type: 'brand', name: 'Nike', value: 'Nike' },
  { id: 'at-4', type: 'material', name: 'Хлопок', value: 'Хлопок' },
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'adm-1', name: 'Admin Main', email: 'admin@grandmarket.tj', role: 'superadmin', status: 'active', lastLogin: 'Сейчас' },
  { id: 'adm-2', name: 'Manager Bob', email: 'bob@grandmarket.tj', role: 'manager', status: 'active', lastLogin: 'Вчера' },
];

export const MOCK_SUPPORT_CHATS: SupportChat[] = [
   {
      id: 'chat-1', userId: 'usr-1', userName: 'Алишер Н.', userRole: 'customer', 
      lastMessage: 'Где мой заказ?', timestamp: '10:30', unread: 1, status: 'open',
      messages: [{id: 'm1', text: 'Где мой заказ?', sender: 'them', time: '10:30'}]
   },
   {
      id: 'chat-2', userId: 'sup-1', userName: 'Asia Textile', userRole: 'seller', 
      lastMessage: 'Когда отгрузка?', timestamp: 'Вчера', unread: 0, status: 'open',
      messages: [{id: 'm1', text: 'Когда отгрузка?', sender: 'them', time: '14:00'}]
   }
];

// Helper to extract pending reviews for admin
export const MOCK_PENDING_REVIEWS: Review[] = [
   { id: 'rv-1', user: 'Фаридун', rating: 3, comment: 'Нормально, но доставка долгая', date: 'Сегодня', status: 'pending', productName: 'Кроссовки Urban', productId: 3 },
   { id: 'rv-2', user: 'Азиз', rating: 1, comment: 'Ужасное качество!', date: 'Вчера', status: 'pending', productName: 'Кепка NY', productId: 4 }
];

// --- NEW DATA FOR HOME PAGE ENHANCEMENTS ---

export const MOCK_BRANDS: Brand[] = [
  { id: '1', name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png' },
  { id: '2', name: 'Zara', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1280px-Zara_Logo.svg.png' },
  { id: '3', name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { id: '4', name: 'H&M', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png' },
  { id: '5', name: 'Gucci', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Gucci_Logo.svg/2560px-Gucci_Logo.svg.png' },
];

export const MOCK_OCCASIONS: Occasion[] = [
  { id: 'occ-1', name: 'Свадьба', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80', slug: 'wedding' },
  { id: 'occ-2', name: 'Офис', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80', slug: 'office' },
  { id: 'occ-3', name: 'Спорт', image: 'https://images.unsplash.com/photo-1517466131098-6f9dc972856f?w=400&q=80', slug: 'gym' },
  { id: 'occ-4', name: 'Намаз', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=400&q=80', slug: 'namaz' },
];
