

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[]; // Added for Photo Reviews
  status?: 'pending' | 'approved' | 'rejected'; // Added for Moderation
  productId?: number; // For admin context
  productName?: string; // For admin context
}

export interface Question {
  id: string;
  user: string;
  question: string;
  answer?: string;
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
  videoUrl?: string; // NEW: Video review/preview
  description: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: Review[];
  questions?: Question[]; // NEW: Q&A
  isNew?: boolean;
  isTop?: boolean;
  stock?: number;
  material?: string;
  crossSellIds?: number[]; // NEW: IDs of products to recommend
  supplierId?: string; // NEW: Link to supplier
  approvalStatus?: 'pending' | 'approved' | 'rejected'; // NEW: For Product Approval
  departmentId?: string; // NEW: For routing to specific warehouse section
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  bundleDiscountApplied?: number; // New: Amount saved via bundle
  // Fulfillment fields
  pickedStatus?: 'pending' | 'picked'; 
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
  // NEW: Referral System
  referralCode: string;
  referralEarnings: number;
  referralsCount: number;
  isVendor?: boolean;
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
  subcategories: string[]; // Kept for frontend compatibility
  
  // New Fields for Admin
  description?: string;
  image?: string;
  departmentId?: string; // Link to Department
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
  showInMenu: boolean;
  
  // SEO
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
  color: string;
  sortOrder: number;
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
  status: 'new' | 'processing' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled' | 'returned'; 
  shippingMethod: 'delivery' | 'pickup';
  paymentMethod: 'card' | 'cash';
  address?: string;
  referralCodeUsed?: string; // NEW
  
  // Fulfillment Fields
  tableId?: string; // Which table acts as assembly point
  verificationCode?: string; // 4-6 digit code for delivery
  courierId?: string;
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
  rating: number; // For admin to see supplier reliability
  status: 'active' | 'pending' | 'blocked'; // For Marketplace registration
  commissionRate?: number; // Marketplace fee
}

// Basic Employee type (kept for backward compatibility with old mocks if needed)
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
  timestamp: string;
  userName: string;
  userRole: 'admin' | 'manager' | 'seller' | 'system';
  actionType: 'create' | 'update' | 'delete' | 'auth' | 'error' | 'warning' | 'info';
  actionTitle: string;
  details: string; // Specifics (e.g. "Price changed 100 -> 200")
  module: string; // 'Products', 'Orders', 'Auth', 'Settings', etc.
  ip: string;
  device: string;
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
  status: 'open' | 'closed';
}

export interface MediaFolder {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string; // e.g. "1.2 MB"
  dimensions?: string; // e.g. "1920x1080"
  createdAt: string;
  folderId?: string;
  alt?: string;
}

export interface StoreSettings {
  general: {
    storeName: string;
    slogan: string;
    phone: string;
    email: string;
    address: string;
    currency: string;
    language: string;
  };
  design: {
    themeColor: string;
    darkMode: boolean;
    fontFamily: string;
    logoUrl: string;
  };
  products: {
    unit: string;
    minOrderAmount: number;
    showOutOfStock: boolean;
    enableReviews: boolean;
    taxRate: number;
  };
  users: {
    registrationRequired: boolean;
    loyaltyProgram: boolean;
    cashbackPercent: number;
  };
  payment: {
    acceptCash: boolean;
    acceptCards: boolean;
    acceptCardsOnline: boolean;
    currencyRate: number; // USD to TJS
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    expressShippingCost: number;
  };
  notifications: {
    emailOrderConfirmation: boolean;
    smsOrderStatus: boolean;
    pushPromos: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    passwordExpirationDays: number;
  };
}

export type Language = 'ru' | 'tj';

// --- NEW EMPLOYEE MODULE TYPES ---

export interface EmployeeExtended {
  id: string;
  fullName: string;
  phone: string;
  role: string; // 'courier', 'seller', 'driver', 'manager', 'loader', 'admin', 'supervisor'
  departmentId?: string; // Specific department they work in
  status: 'working' | 'off' | 'fired';
  hireDate: string;
  avatar: string;
  hourlyRate: number;
  shiftRate?: number; // Optional flat rate per shift
  commissionPercent?: number; // For couriers/sales
  
  // Financials
  totalDebt: number; // How much they owe the company
  totalAdvances: number; // Advances taken this month
  loginCode: string; // Simple login code
  
  // Stats (computed)
  hoursWorkedMonth: number;
  shiftsCountMonth: number;
  earnedMonth: number;
  
  // History logs (simplified as strings for now)
  history: string[];
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string; // ISO or HH:mm
  endTime?: string;
  durationHours: number;
  earned: number;
  status: 'active' | 'completed';
  locationStart?: string;
  locationEnd?: string;
  device?: string;
  photoUrl?: string; // Verification photo
}

export interface StaffFinancialRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'advance' | 'debt' | 'fine' | 'bonus';
  amount: number;
  date: string; // YYYY-MM-DD
  comment: string;
  isPaid?: boolean; // For debts
  issuer: string; // Who authorized it
}

export interface SalaryReport {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  month: string; // YYYY-MM
  totalHours: number;
  shifts: number;
  baseSalary: number; // from hours/shifts
  bonuses: number;
  fines: number;
  debts: number;
  advances: number;
  finalAmount: number;
  status: 'pending' | 'paid';
  generatedDate: string;
}

// --- NEW MARKETING & COURIER TYPES ---

export interface Promotion {
  id: string;
  title: string;
  type: 'discount' | 'bogo' | 'gift' | 'shipping'; // BOGO = Buy One Get One
  value: number; // e.g. 20% or 0 for BOGO
  condition?: string; // e.g. "Order > 500c"
  startDate: string;
  endDate: string;
  isActive: boolean;
  color: string;
}

export interface CourierLocation {
  id: string;
  courierId: string;
  courierName: string;
  lat: number;
  lng: number;
  status: 'delivering' | 'idle' | 'offline';
  currentOrderId?: string;
}

// --- NEW TYPES FOR FEATURES: Lookbook, RMA, GiftCards ---

export interface Lookbook {
  id: string;
  title: string;
  description: string;
  mainImage: string;
  productIds: number[];
  discount?: number; // Discount if bought together
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  date: string;
  items: { productId: number; productName: string; reason: string }[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminComment?: string;
}

export interface InventoryForecast {
  productId: number;
  productName: string;
  currentStock: number;
  dailyVelocity: number; // Sales per day
  daysLeft: number;
  recommendation: 'reorder_now' | 'reorder_soon' | 'ok';
}

// --- NEW TYPES FOR O2O & MARKETPLACE ---

export interface FittingBooking {
  id: string;
  date: string;
  timeSlot: string; // "14:00 - 15:00"
  items: number[]; // Product IDs
  status: 'pending' | 'confirmed' | 'completed';
  customerName: string;
  customerPhone: string;
}

export interface BundleOffer {
  name: string;
  description: string;
  requiredCategories: string[]; // e.g. ['men', 'shoes']
  discountPercent: number; // 15%
}

// --- NEW TYPES FOR TABLES & WAREHOUSE ---

export interface PackingTable {
  id: string;
  name: string;
  supervisorId: string;
  supervisorName: string;
  status: 'active' | 'busy' | 'closed';
  currentOrderIds: string[];
  totalOrdersProcessed: number;
}

export interface WarehouseDocument {
  id: string;
  type: 'income' | 'writeoff' | 'transfer' | 'return';
  date: string;
  supplierName?: string;
  totalAmount: number;
  itemCount: number;
  status: 'draft' | 'completed';
  comment?: string;
}

// --- NEW TYPES FOR MISSING ADMIN MODULES (Requested Update) ---

export interface PayoutRequest {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  method: string; // 'Card', 'Bank Transfer', 'Cash'
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string; // e.g. 'about-us'
  content: string;
  lastUpdated: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string; // e.g. "Center", "Suburbs"
  cost: number;
  color: string;
  description: string;
}

export interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  type: 'push' | 'sms' | 'email';
  sentDate: string;
  recipientsCount: number;
  status: 'sent' | 'draft' | 'scheduled';
}

export interface Attribute {
  id: string;
  type: 'size' | 'color' | 'brand' | 'material';
  name: string;
  value: string; // hex code for color, or text
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager' | 'editor' | 'support';
  status: 'active' | 'blocked';
  lastLogin: string;
}

// --- NEW TYPES FOR HOME PAGE ENHANCEMENTS ---

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Occasion {
  id: string;
  name: string;
  image: string;
  slug: string;
}
