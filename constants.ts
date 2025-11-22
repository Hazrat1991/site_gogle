
import { Product, Order, Customer, Category, UserProfile, Supplier, Employee, FinanceRecord, ActivityLog, PromoCode, SupportChat } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Куртка Зимняя Grand Parka",
    price: 1200,
    buyPrice: 800,
    oldPrice: 1500,
    category: "men",
    subCategory: "outerwear",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80"
    ],
    description: "Утепленная парка с водоотталкивающим покрытием. Идеально для суровой зимы.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Черный", "Хаки", "Синий"],
    rating: 4.8,
    reviews: [{id: '1', user: 'Алишер', rating: 5, comment: 'Очень теплая!', date: '2023-10-10'}],
    isNew: true,
    isTop: true,
    stock: 15,
    material: "Полиэстер, Пух"
  },
  {
    id: 2,
    name: "Платье Летнее Silk Dream",
    price: 450,
    buyPrice: 250,
    category: "women",
    subCategory: "dresses",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"
    ],
    description: "Легкое шелковое платье для вечерних прогулок.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Белый", "Красный"],
    rating: 4.9,
    reviews: [],
    isTop: true,
    stock: 4,
    material: "Шелк 100%"
  },
  {
    id: 3,
    name: "Кроссовки Urban Run",
    price: 680,
    buyPrice: 400,
    oldPrice: 800,
    category: "shoes",
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
    stock: 25,
    material: "Текстиль, Резина"
  },
  {
    id: 4,
    name: "Кепка New York",
    price: 120,
    buyPrice: 60,
    category: "hats",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89f?w=600&q=80"
    ],
    description: "Классическая бейсболка из хлопка.",
    sizes: ["One Size"],
    colors: ["Синий", "Черный"],
    rating: 4.5,
    reviews: [],
    stock: 50,
    material: "Хлопок"
  },
  {
    id: 5,
    name: "Носки Sport Elite (3 пары)",
    price: 45,
    buyPrice: 20,
    category: "socks",
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50f82?w=600&q=80"
    ],
    description: "Дышащие спортивные носки.",
    sizes: ["39-42", "43-46"],
    colors: ["Белый", "Черный"],
    rating: 4.6,
    reviews: [],
    stock: 100,
    material: "Хлопок, Эластан"
  },
  {
    id: 6,
    name: "Рюкзак Leather Travel",
    price: 550,
    buyPrice: 300,
    category: "accessories",
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
    material: "Эко-кожа"
  },
  {
    id: 7,
    name: "Джинсы Classic Fit",
    price: 320,
    buyPrice: 180,
    category: "men",
    images: [
      "https://images.unsplash.com/photo-1542272617-08f083758dc9?w=600&q=80"
    ],
    description: "Классические прямые джинсы.",
    sizes: ["30", "32", "34", "36"],
    colors: ["Синий"],
    rating: 4.4,
    reviews: [],
    stock: 12,
    material: "Деним"
  },
  {
    id: 8,
    name: "Ботинки Winter Steps",
    price: 890,
    buyPrice: 500,
    category: "shoes",
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
    material: "Кожа, Мех"
  },
  {
    id: 9,
    name: "Шарф Cashmere Soft",
    price: 180,
    buyPrice: 90,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80"
    ],
    description: "Мягкий кашемировый шарф.",
    sizes: ["One Size"],
    colors: ["Серый", "Бежевый"],
    rating: 4.7,
    reviews: [],
    stock: 20,
    material: "Кашемир"
  },
  {
    id: 10,
    name: "Худи Streetwear Oversize",
    price: 290,
    buyPrice: 150,
    category: "women",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80"
    ],
    description: "Уютное худи оверсайз.",
    sizes: ["S", "M", "L"],
    colors: ["Розовый", "Белый", "Мятный"],
    rating: 4.6,
    reviews: [],
    stock: 14,
    material: "Хлопок, Флис"
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
  }
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7782',
    customerName: 'Манижа Каримова',
    customerPhone: '+992 900 11 22 33',
    date: '2023-10-25',
    total: 1200,
    status: 'new',
    shippingMethod: 'delivery',
    paymentMethod: 'cash',
    address: 'ул. Рудаки 10, кв 5',
    items: [MOCK_PRODUCTS[0] as any]
  },
  {
    id: 'ORD-7781',
    customerName: 'Манижа Каримова',
    customerPhone: '+992 918 55 44 22',
    date: '2023-10-15',
    total: 450,
    status: 'delivered',
    shippingMethod: 'pickup',
    paymentMethod: 'card',
    address: '',
    items: [MOCK_PRODUCTS[1] as any]
  },
  {
    id: 'ORD-7780',
    customerName: 'Фарход Д.',
    customerPhone: '+992 93 444 55 66',
    date: '2023-10-24',
    total: 2890,
    status: 'delivered',
    shippingMethod: 'delivery',
    paymentMethod: 'card',
    address: 'пр. Сомони 55',
    items: [MOCK_PRODUCTS[2] as any, MOCK_PRODUCTS[7] as any]
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Алишер Н.', email: 'alisher@example.com', phone: '+992 900 11 22 33', ordersCount: 5, totalSpent: 3500, status: 'active', joinDate: '2023-01-10' },
  { id: '2', name: 'Зарина К.', email: 'zarina@example.com', phone: '+992 918 55 44 22', ordersCount: 12, totalSpent: 8900, status: 'active', joinDate: '2022-11-05' },
  { id: '3', name: 'Фарход Д.', email: 'farhod@example.com', phone: '+992 93 444 55 66', ordersCount: 2, totalSpent: 1200, status: 'blocked', joinDate: '2023-05-20' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'men', name: 'Мужчинам', subcategories: ['Верхняя одежда', 'Джинсы', 'Футболки', 'Костюмы'] },
  { id: 'women', name: 'Женщинам', subcategories: ['Платья', 'Блузки', 'Юбки', 'Сумки'] },
  { id: 'shoes', name: 'Обувь', subcategories: ['Кроссовки', 'Ботинки', 'Туфли'] },
  { id: 'hats', name: 'Головные уборы', subcategories: ['Кепки', 'Шапки'] },
  { id: 'socks', name: 'Носки', subcategories: ['Спортивные', 'Классические'] },
  { id: 'accessories', name: 'Аксессуары', subcategories: ['Сумки', 'Рюкзаки', 'Шарфы', 'Часы'] },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'ООО "Текстиль Групп"', contactName: 'Ахмад', phone: '+992 900 99 88 77', balance: 5000, lastDelivery: '2023-10-20' },
  { id: '2', name: 'Nike Official TJ', contactName: 'Сергей', phone: '+992 918 11 22 33', balance: 0, lastDelivery: '2023-10-15' },
  { id: '3', name: 'Обувной Мир', contactName: 'Дилшод', phone: '+992 93 555 44 33', balance: 12000, lastDelivery: '2023-10-22' }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Admin User', role: 'admin', phone: '+992 900 00 00 00', status: 'active', lastActive: 'Сейчас' },
  { id: '2', name: 'Самира (Продавец)', role: 'seller', phone: '+992 900 11 11 11', status: 'active', lastActive: '5 мин назад' },
  { id: '3', name: 'Рустам (Склад)', role: 'manager', phone: '+992 900 22 22 22', status: 'active', lastActive: '1 час назад' },
];

export const MOCK_FINANCE: FinanceRecord[] = [
  { id: '1', type: 'income', category: 'sales', amount: 1200, date: '2023-10-25', description: 'Продажа №7782' },
  { id: '2', type: 'expense', category: 'procurement', amount: 5000, date: '2023-10-24', description: 'Закупка товара у Nike TJ' },
  { id: '3', type: 'expense', category: 'salary', amount: 2000, date: '2023-10-20', description: 'Аванс Самире' },
  { id: '4', type: 'income', category: 'sales', amount: 2890, date: '2023-10-24', description: 'Продажа №7780' },
  { id: '5', type: 'expense', category: 'rent', amount: 1000, date: '2023-10-01', description: 'Аренда склада' },
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: '1', user: 'Admin User', action: 'Изменил цену товара "Куртка Зимняя" (1200 -> 1300)', date: '2023-10-25 14:30', type: 'warning' },
  { id: '2', user: 'Рустам (Склад)', action: 'Принял поставку (50 шт)', date: '2023-10-25 10:00', type: 'info' },
  { id: '3', user: 'Admin User', action: 'Удалил товар ID: 15', date: '2023-10-24 18:15', type: 'danger' },
];

export const MOCK_PROMOS: PromoCode[] = [
  { id: '1', code: 'WELCOME', discount: 10, active: true, usageCount: 45 },
  { id: '2', code: 'SUMMER23', discount: 20, active: false, usageCount: 120 },
  { id: '3', code: 'VIPCLIENT', discount: 15, active: true, usageCount: 12 },
];

export const MOCK_SUPPORT_CHATS: SupportChat[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Алишер Н. (Клиент)',
    userRole: 'customer',
    lastMessage: 'Где мой заказ?',
    timestamp: '10:30',
    unread: 2,
    messages: [
      { id: '1', text: 'Здравствуйте', sender: 'them', time: '10:20' },
      { id: '2', text: 'Где мой заказ?', sender: 'them', time: '10:30' }
    ]
  },
  {
    id: '2',
    userId: 'e2',
    userName: 'Самира (Продавец)',
    userRole: 'seller',
    lastMessage: 'Нужно оформить возврат',
    timestamp: '09:15',
    unread: 1,
    messages: [
        { id: '1', text: 'Тут клиент хочет вернуть куртку', sender: 'them', time: '09:15' }
    ]
  },
   {
    id: '3',
    userId: 'e3',
    userName: 'Рустам (Склад)',
    userRole: 'manager',
    lastMessage: 'Принял товар',
    timestamp: 'Вчера',
    unread: 0,
    messages: [
        { id: '1', text: 'Приехала машина с товаром', sender: 'them', time: '14:00' },
        { id: '2', text: 'Хорошо, принимай', sender: 'me', time: '14:05' },
        { id: '3', text: 'Принял товар', sender: 'them', time: '15:00' }
    ]
  }
];

export const DICTIONARY = {
  ru: {
    search: "Поиск товаров...",
    cart: "Корзина",
    menu: "Меню",
    heroTitle: "Grand Market Fashion",
    heroSubtitle: "Стиль для всех. Качество для каждого.",
    newArrivals: "Новинки недели",
    topSellers: "Хиты продаж",
    addToCart: "В корзину",
    buyNow: "Купить сейчас",
    categories: "Категории",
    men: "Мужчинам",
    women: "Женщинам",
    shoes: "Обувь",
    hats: "Головные уборы",
    socks: "Носки",
    accessories: "Аксессуары",
    checkout: "Оформление",
    profile: "Кабинет",
    admin: "Админ",
    price: "Цена",
    size: "Размер",
    color: "Цвет",
    description: "Описание",
    reviews: "Отзывы",
    similar: "Похожие товары",
    total: "Итого",
    delivery: "Доставка",
    pickup: "Самовывоз",
    payment: "Оплата",
    card: "Картой",
    cash: "Наличными",
    submitOrder: "Подтвердить заказ",
    buy1click: "Купить в 1 клик",
    bonuses: "Бонусы",
    myOrders: "Мои заказы",
    favorites: "Избранное",
    support: "Поддержка",
    addresses: "Адреса доставки",
    settings: "Настройки",
    logout: "Выйти"
  },
  tj: {
    search: "Ҷустуҷӯи мол...",
    cart: "Сабад",
    menu: "Меню",
    heroTitle: "Grand Market Fashion",
    heroSubtitle: "Услуби шумо. Сифати олӣ.",
    newArrivals: "Навиҳои ҳафта",
    topSellers: "Фурӯши беҳтарин",
    addToCart: "Ба сабад",
    buyNow: "Ҳозир харед",
    categories: "Категорияҳо",
    men: "Мардона",
    women: "Занона",
    shoes: "Пойафзол",
    hats: "Кулоҳҳо",
    socks: "Ҷӯробҳо",
    accessories: "Аксессуарҳо",
    checkout: "Барасмиятдарорӣ",
    profile: "Кабинет",
    admin: "Админ",
    price: "Нарх",
    size: "Андоза",
    color: "Ранг",
    description: "Тавсиф",
    reviews: "Шарҳҳо",
    similar: "Молҳои монанд",
    total: "Ҷамъ",
    delivery: "Дастраскунӣ",
    pickup: "Худбурӣ",
    payment: "Пардохт",
    card: "Бо корт",
    cash: "Нақд",
    submitOrder: "Тасдиқи фармоиш",
    buy1click: "Харид бо 1 клик",
    bonuses: "Бонусҳо",
    myOrders: "Фармоишҳои ман",
    favorites: "Баргузида",
    support: "Дастгирӣ",
    addresses: "Нишониҳо",
    settings: "Танзимот",
    logout: "Баромадан"
  }
};
