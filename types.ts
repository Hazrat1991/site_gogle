
export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  buyPrice?: number; // Added for profit calculation
  oldPrice?: number;
  category: string; // 'men', 'women', 'shoes', 'hats', 'socks', 'accessories'
  subCategory?: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: Review[];
  isNew?: boolean;
  isTop?: boolean;
  stock?: number;
  material?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface SavedAddress {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard';
  expiry: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bonusPoints: number;
  cashbackLevel: number; // percentage
  addresses: SavedAddress[];
  cards: PaymentCard[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  joinDate: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface Campaign {
  id: string;
  name: string;
  discountPercent: number;
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName?: string; // For guest/admin view
  customerPhone?: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingMethod: 'delivery' | 'pickup';
  paymentMethod: 'card' | 'cash';
  address?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface AIRecommendation {
  message: string;
  productIds: number[];
}

// New Types for Admin Dashboard Enhancements
export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  balance: number; // Debt to supplier
  lastDelivery: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'seller';
  phone: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: 'sales' | 'salary' | 'procurement' | 'rent' | 'marketing' | 'other';
  amount: number;
  date: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string; // e.g., "Changed price of product X"
  date: string;
  type: 'info' | 'warning' | 'danger';
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number; // Percent
  active: boolean;
  usageCount: number;
}

export interface SupportChat {
  id: string;
  userId: string;
  userName: string;
  userRole: 'customer' | 'seller' | 'manager' | 'admin';
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: {
    id: string;
    text: string;
    sender: 'me' | 'them';
    time: string;
  }[];
}

export type Language = 'ru' | 'tj';