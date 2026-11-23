import { MenuItem, Order, StoreSettings, StoredUserAccount, User } from '../types';
import { generateSalt, hashPassword } from './crypto';

const VAULT_USERS_KEY = 'brewbean_vault_users_v3';
const SESSION_KEY = 'brewbean_session_user';
const MENU_KEY = 'brewbean_menu_items_v3';
const ORDERS_KEY = 'brewbean_orders_v3';
const CART_KEY = 'brewbean_cart';
const SETTINGS_KEY = 'brewbean_settings';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'prod-1',
    name: 'Caramel Macchiato Reserve',
    description: 'Freshly steamed whole milk with vanilla-flavored syrup, marked with espresso and topped with artisan caramel drizzle.',
    price: 5.75,
    category: 'Espresso Specialties',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=80',
    stock: 24,
    isAvailable: true,
    roastLevel: 'Medium',
    rating: 4.9,
    calories: 250,
    tags: ['Bestseller', 'Sweet']
  },
  {
    id: 'prod-2',
    name: 'Artisan Espresso Double Shot',
    description: 'Rich, full-bodied espresso with velvety golden crema, pulled from single-origin Ethiopian Yirgacheffe beans.',
    price: 3.85,
    category: 'Hot Coffee',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=700&q=80',
    stock: 45,
    isAvailable: true,
    roastLevel: 'Dark',
    rating: 4.8,
    calories: 10,
    tags: ['Classic', 'Bold']
  },
  {
    id: 'prod-3',
    name: 'Kyoto-Style Cold Brew',
    description: 'Slow-dripped for 16 hours through custom glass towers, delivering ultra-smooth dark chocolate and berry undertones.',
    price: 5.25,
    category: 'Cold Brew',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80',
    stock: 8, // LOW stock (< 10)
    isAvailable: true,
    roastLevel: 'Single Origin',
    rating: 4.9,
    calories: 15,
    tags: ['Low Stock', 'Signature']
  },
  {
    id: 'prod-4',
    name: 'Vanilla Bean Oat Latte',
    description: 'Creamy barista oat milk blended with pure Madagascar bourbon vanilla and double shot espresso.',
    price: 6.20,
    category: 'Espresso Specialties',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80',
    stock: 18,
    isAvailable: true,
    roastLevel: 'Medium',
    rating: 4.7,
    calories: 180,
    tags: ['Plant-Based', 'Popular']
  },
  {
    id: 'prod-5',
    name: 'Ceremonial Uji Matcha Latte',
    description: 'First-harvest Japanese stone-ground matcha whisked with lightly sweetened silky steamed milk.',
    price: 5.95,
    category: 'Artisanal Teas',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=700&q=80',
    stock: 15,
    isAvailable: true,
    roastLevel: 'Light',
    rating: 4.8,
    calories: 190,
    tags: ['Antioxidant', 'Zen']
  },
  {
    id: 'prod-6',
    name: 'Butter Flaky Almond Croissant',
    description: 'Authentic French laminated pastry filled with rich almond frangipane cream and toasted sliced almonds.',
    price: 4.50,
    category: 'Pastries & Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80',
    stock: 5, // LOW stock (< 10)
    isAvailable: true,
    rating: 4.9,
    calories: 340,
    tags: ['Fresh Daily', 'Low Stock']
  },
  {
    id: 'prod-7',
    name: 'Nitro Cascara Cold Foam',
    description: 'Infused with nitrogen for a velvety stout-like texture, crowned with coffee cherry cascara foam.',
    price: 6.45,
    category: 'Cold Brew',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80',
    stock: 0, // OUT OF STOCK
    isAvailable: false,
    roastLevel: 'Medium',
    rating: 4.6,
    calories: 110,
    tags: ['Out of Stock']
  },
  {
    id: 'prod-8',
    name: 'BrewBean Reserve Blend Whole Beans',
    description: 'Our award-winning 250g bag of whole bean coffee with tasting notes of milk chocolate, praline, and candied orange.',
    price: 18.00,
    category: 'Signature Blends',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=700&q=80',
    stock: 30,
    isAvailable: true,
    roastLevel: 'Medium',
    rating: 5.0,
    calories: 0,
    tags: ['Retail', 'Award Winner']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'BB-7102',
    token: 'T-14',
    customerId: 'cust-alex',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.customer@brewbean.com',
    customerType: 'STUDENT',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Caramel Macchiato Reserve',
        productImage: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=80',
        price: 5.75,
        quantity: 1,
        size: 'Large',
        customization: 'Oat Milk, 50% Sweetness'
      },
      {
        id: 'item-2',
        productId: 'prod-6',
        productName: 'Butter Flaky Almond Croissant',
        productImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80',
        price: 4.50,
        quantity: 1
      }
    ],
    subtotal: 10.25,
    discount: 1.03, // 10% student discount
    tax: 0.74,
    total: 9.96,
    pickupCounter: 'Counter A (Espresso Bar)',
    deliveryType: 'Delivery',
    deliveryAddress: 'University Hall, Room 402, North Campus',
    status: 'Ready',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    estimatedMinutes: 3
  },
  {
    id: 'ord-102',
    orderNumber: 'BB-7103',
    token: 'T-22',
    customerId: 'cust-sarah',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerType: 'REGULAR',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Kyoto-Style Cold Brew',
        productImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80',
        price: 5.25,
        quantity: 2,
        size: 'Regular'
      }
    ],
    subtotal: 10.50,
    discount: 0,
    tax: 0.84,
    total: 11.34,
    pickupCounter: 'Counter B (Cold Draft Station)',
    deliveryType: 'Pickup',
    deliveryAddress: 'BrewBean In-Store Counter Express',
    status: 'Preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    estimatedMinutes: 6
  },
  {
    id: 'ord-103',
    orderNumber: 'BB-7104',
    token: 'T-37',
    customerId: 'cust-marcus',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@example.com',
    customerType: 'STUDENT',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Vanilla Bean Oat Latte',
        productImage: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80',
        price: 6.20,
        quantity: 1,
        size: 'Regular'
      }
    ],
    subtotal: 6.20,
    discount: 0.62,
    tax: 0.45,
    total: 6.03,
    pickupCounter: 'Counter A (Espresso Bar)',
    deliveryType: 'Delivery',
    deliveryAddress: 'Engineering Complex, Lab 108B',
    status: 'Placed',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    estimatedMinutes: 10
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'BrewBean Artisanal Coffee Co.',
  tagline: 'Crafting exceptional coffee moments, bean by roasted bean.',
  pickupCounters: [
    'Counter A (Espresso Bar)',
    'Counter B (Cold Draft Station)',
    'Counter C (Pastries & Rapid Pickup)'
  ],
  studentDiscountPercent: 10,
  taxRatePercent: 8,
  autoAcceptOrders: true,
  storeOpen: true,
  contactEmail: 'owner@brewbean.com',
  contactPhone: '+1 (555) 273-9232',
  address: '452 Roaster Avenue, Coffee District, CA 94107'
};

export async function initializeStorage(): Promise<void> {
  const existingUsers = localStorage.getItem(VAULT_USERS_KEY);
  if (!existingUsers) {
    const ownerSalt = await generateSalt();
    const ownerHash = await hashPassword('OwnerBean#2026', ownerSalt);
    const ownerUser: User = {
      id: 'owner-admin-1',
      email: 'owner@brewbean.com',
      name: 'Elena Rostova (Store Owner)',
      role: 'OWNER',
      phone: '+1 (555) 273-9232',
      defaultAddress: '452 Roaster Ave, Suite 100, Roaster District',
      createdAt: new Date().toISOString()
    };

    const customerSalt = await generateSalt();
    const customerHash = await hashPassword('CoffeeLover#2026', customerSalt);
    const customerUser: User = {
      id: 'cust-alex',
      email: 'alex.customer@brewbean.com',
      name: 'Alex Morgan',
      role: 'CUSTOMER',
      customerType: 'STUDENT',
      studentId: 'STU-8829',
      phone: '+1 (555) 948-2819',
      defaultAddress: 'University Hall, Room 402, North Campus',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
    };

    const initialAccounts: StoredUserAccount[] = [
      { user: ownerUser, passwordHash: ownerHash, salt: ownerSalt },
      { user: customerUser, passwordHash: customerHash, salt: customerSalt }
    ];

    localStorage.setItem(VAULT_USERS_KEY, JSON.stringify(initialAccounts));
  }

  if (!localStorage.getItem(MENU_KEY)) {
    localStorage.setItem(MENU_KEY, JSON.stringify(INITIAL_MENU));
  }

  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
  }

  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
  }
}

export function getStoredAccounts(): StoredUserAccount[] {
  try {
    const data = localStorage.getItem(VAULT_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredAccounts(accounts: StoredUserAccount[]): void {
  localStorage.setItem(VAULT_USERS_KEY, JSON.stringify(accounts));
}

export function getActiveSession(): User | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setActiveSession(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getStoredMenu(): MenuItem[] {
  try {
    const data = localStorage.getItem(MENU_KEY);
    return data ? JSON.parse(data) : INITIAL_MENU;
  } catch {
    return INITIAL_MENU;
  }
}

export function saveStoredMenu(items: MenuItem[]): void {
  localStorage.setItem(MENU_KEY, JSON.stringify(items));
}

export function getStoredOrders(): Order[] {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getStoredCart(): any[] {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: any[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getStoredSettings(): StoreSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: StoreSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
