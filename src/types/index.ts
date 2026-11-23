export type UserRole = 'OWNER' | 'CUSTOMER';

export type CustomerType = 'REGULAR' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  customerType?: CustomerType;
  studentId?: string;
  avatar?: string;
  phone?: string;
  defaultAddress?: string;
  createdAt: string;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export type CoffeeCategory = 'Hot Coffee' | 'Cold Brew' | 'Espresso Specialties' | 'Artisanal Teas' | 'Pastries & Bakery' | 'Signature Blends';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CoffeeCategory;
  image: string;
  stock: number;
  isAvailable: boolean;
  roastLevel?: 'Light' | 'Medium' | 'Dark' | 'Single Origin';
  rating: number;
  calories?: number;
  tags?: string[];
}

export interface CartItem {
  product: MenuItem;
  quantity: number;
  size?: 'Regular' | 'Large';
  milkChoice?: 'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Skim Milk';
  sweetness?: '0%' | '25%' | '50%' | '100%';
  customNotes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  customization?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BB-8042
  token: string;       // e.g. T-42
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerType: CustomerType;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  pickupCounter: string; // e.g. Counter A (Espresso Bar)
  deliveryType: 'Pickup' | 'Delivery';
  deliveryAddress: string; // Customer street address / building & room
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedMinutes?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  pickupCounters: string[];
  studentDiscountPercent: number;
  taxRatePercent: number;
  autoAcceptOrders: boolean;
  storeOpen: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface StoredUserAccount {
  user: User;
  passwordHash: string;
  salt: string;
}
