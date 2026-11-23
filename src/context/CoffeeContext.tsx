import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, StoreSettings, CustomerType } from '../types';
import {
  getStoredMenu,
  saveStoredMenu,
  getStoredOrders,
  saveStoredOrders,
  getStoredCart,
  saveStoredCart,
  getStoredSettings,
  saveStoredSettings
} from '../services/storage';
import { generateOrderNumber, generateToken } from '../services/crypto';

interface CoffeeContextType {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  // Cart Actions
  addToCart: (product: MenuItem, quantity?: number, options?: Partial<CartItem>) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  // Order Actions
  placeOrder: (customer: {
    id: string;
    name: string;
    email: string;
    customerType: CustomerType;
    deliveryAddress: string;
    deliveryType: 'Pickup' | 'Delivery';
  }, notes?: string) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getCustomerOrders: (customerId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  // Menu Management
  addMenuItem: (item: Omit<MenuItem, 'id'>) => { success: boolean; error?: string };
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => { success: boolean; error?: string };
  deleteMenuItem: (id: string) => { success: boolean; error?: string };
  toggleItemAvailability: (id: string) => void;
  // Inventory Management
  updateItemStock: (id: string, newStock: number) => { success: boolean; error?: string };
  adjustItemStock: (id: string, delta: number) => { success: boolean; error?: string };
  // Settings Management
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  // Computed Statistics
  stats: {
    totalOrders: number;
    todayRevenue: number;
    totalRevenue: number;
    pendingOrdersCount: number;
    totalMenuItems: number;
    lowStockCount: number;
    outOfStockCount: number;
    mostPopularProduct: string;
    studentOrderCount: number;
    regularOrderCount: number;
  };
}

const CoffeeContext = createContext<CoffeeContextType | undefined>(undefined);

export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings());

  useEffect(() => {
    setMenu(getStoredMenu());
    setCart(getStoredCart());
    setOrders(getStoredOrders());
    setSettings(getStoredSettings());
  }, []);

  const updateMenuState = (newMenu: MenuItem[]) => {
    setMenu(newMenu);
    saveStoredMenu(newMenu);
  };

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    saveStoredCart(newCart);
  };

  const updateOrdersState = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveStoredOrders(newOrders);
  };

  const addToCart = (product: MenuItem, quantity = 1, options?: Partial<CartItem>) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let newCart: CartItem[];

    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity, ...options }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          product,
          quantity,
          size: options?.size || 'Regular',
          milkChoice: options?.milkChoice || 'Whole Milk',
          sweetness: options?.sweetness || '100%',
          customNotes: options?.customNotes || ''
        }
      ];
    }
    updateCartState(newCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    updateCartState(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    updateCartState(newCart);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Place Order with Mandatory Customer Address check
  const placeOrder = async (
    customer: {
      id: string;
      name: string;
      email: string;
      customerType: CustomerType;
      deliveryAddress: string;
      deliveryType: 'Pickup' | 'Delivery';
    },
    notes?: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    // Require Customer Address
    if (!customer.deliveryAddress || !customer.deliveryAddress.trim()) {
      return {
        success: false,
        error: 'Please enter your delivery/pickup address before placing your order.'
      };
    }

    // Check stock availability
    for (const item of cart) {
      const productInMenu = menu.find((p) => p.id === item.product.id);
      if (!productInMenu || !productInMenu.isAvailable || productInMenu.stock < item.quantity) {
        return {
          success: false,
          error: `Sorry, "${item.product.name}" is out of stock or does not have sufficient quantity.`
        };
      }
    }

    const counters = settings.pickupCounters.length > 0
      ? settings.pickupCounters
      : ['Counter A (Espresso Bar)', 'Counter B (Rapid Pickup)'];
    const randomCounter = counters[Math.floor(Math.random() * counters.length)];

    const subtotal = cartSubtotal;
    const discountRate = customer.customerType === 'STUDENT' ? settings.studentDiscountPercent / 100 : 0;
    const discount = Number((subtotal * discountRate).toFixed(2));
    const taxableAmount = subtotal - discount;
    const tax = Number((taxableAmount * (settings.taxRatePercent / 100)).toFixed(2));
    const total = Number((taxableAmount + tax).toFixed(2));

    const orderItems = cart.map((ci) => ({
      id: `orditem-${Math.random().toString(36).substring(2, 9)}`,
      productId: ci.product.id,
      productName: ci.product.name,
      productImage: ci.product.image,
      price: ci.product.price,
      quantity: ci.quantity,
      size: ci.size,
      customization: `${ci.milkChoice || ''} ${ci.sweetness ? `| ${ci.sweetness}` : ''}`.trim()
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      token: generateToken('T'),
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerType: customer.customerType,
      items: orderItems,
      subtotal,
      discount,
      tax,
      total,
      pickupCounter: randomCounter,
      deliveryType: customer.deliveryType,
      deliveryAddress: customer.deliveryAddress.trim(),
      status: 'Placed',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedMinutes: 8 + cart.length * 2
    };

    // Deduct stock
    const updatedMenu = menu.map((p) => {
      const inCart = cart.find((ci) => ci.product.id === p.id);
      if (inCart) {
        const remaining = Math.max(0, p.stock - inCart.quantity);
        return {
          ...p,
          stock: remaining,
          isAvailable: remaining > 0 ? p.isAvailable : false
        };
      }
      return p;
    });

    updateMenuState(updatedMenu);
    updateOrdersState([newOrder, ...orders]);
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? { ...o, status, updatedAt: new Date().toISOString() }
        : o
    );
    updateOrdersState(updated);
  };

  const getCustomerOrders = (customerId: string): Order[] => {
    return orders.filter((o) => o.customerId === customerId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>): { success: boolean; error?: string } => {
    if (!item.name || !item.name.trim()) {
      return { success: false, error: 'Product name cannot be empty.' };
    }
    if (isNaN(item.price) || item.price <= 0) {
      return { success: false, error: 'Price must be greater than $0.00.' };
    }
    if (isNaN(item.stock) || item.stock < 0) {
      return { success: false, error: 'Stock cannot be negative.' };
    }

    const newItem: MenuItem = {
      ...item,
      id: `prod-${Date.now()}`,
      name: item.name.trim(),
      stock: Math.floor(item.stock),
      price: Number(Number(item.price).toFixed(2))
    };

    updateMenuState([...menu, newItem]);
    return { success: true };
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>): { success: boolean; error?: string } => {
    if (updates.name !== undefined && !updates.name.trim()) {
      return { success: false, error: 'Product name cannot be empty.' };
    }
    if (updates.price !== undefined && (isNaN(updates.price) || updates.price <= 0)) {
      return { success: false, error: 'Price must be greater than $0.00.' };
    }
    if (updates.stock !== undefined && (isNaN(updates.stock) || updates.stock < 0)) {
      return { success: false, error: 'Stock cannot be negative.' };
    }

    const updated = menu.map((m) => {
      if (m.id === id) {
        const newStock = updates.stock !== undefined ? Math.floor(updates.stock) : m.stock;
        return {
          ...m,
          ...updates,
          stock: newStock,
          isAvailable: updates.isAvailable !== undefined ? updates.isAvailable : (newStock > 0 ? m.isAvailable : false)
        };
      }
      return m;
    });

    updateMenuState(updated);
    return { success: true };
  };

  const deleteMenuItem = (id: string): { success: boolean; error?: string } => {
    const updated = menu.filter((m) => m.id !== id);
    updateMenuState(updated);
    return { success: true };
  };

  const toggleItemAvailability = (id: string) => {
    const updated = menu.map((m) =>
      m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
    );
    updateMenuState(updated);
  };

  const updateItemStock = (id: string, newStock: number): { success: boolean; error?: string } => {
    if (isNaN(newStock) || newStock < 0) {
      return { success: false, error: 'Stock cannot be negative.' };
    }
    const cleanStock = Math.floor(newStock);
    const updated = menu.map((m) =>
      m.id === id
        ? {
            ...m,
            stock: cleanStock,
            isAvailable: cleanStock > 0 ? m.isAvailable : false
          }
        : m
    );
    updateMenuState(updated);
    return { success: true };
  };

  const adjustItemStock = (id: string, delta: number): { success: boolean; error?: string } => {
    const item = menu.find((m) => m.id === id);
    if (!item) return { success: false, error: 'Item not found.' };

    const newStock = Math.max(0, item.stock + delta);
    return updateItemStock(id, newStock);
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    saveStoredSettings(merged);
  };

  const totalOrders = orders.length;
  const todayDateStr = new Date().toDateString();
  const todayRevenue = orders
    .filter((o) => new Date(o.createdAt).toDateString() === todayDateStr && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready'
  ).length;

  const totalMenuItems = menu.length;
  const lowStockCount = menu.filter((m) => m.stock > 0 && m.stock < 10).length;
  const outOfStockCount = menu.filter((m) => m.stock === 0).length;

  const productCountMap: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      productCountMap[item.productName] = (productCountMap[item.productName] || 0) + item.quantity;
    });
  });
  let topCount = 0;
  let mostPopularProduct = 'Caramel Macchiato Reserve';
  Object.entries(productCountMap).forEach(([pName, count]) => {
    if (count > topCount) {
      topCount = count;
      mostPopularProduct = pName;
    }
  });

  const studentOrderCount = orders.filter((o) => o.customerType === 'STUDENT').length;
  const regularOrderCount = orders.filter((o) => o.customerType === 'REGULAR').length;

  const stats = {
    totalOrders,
    todayRevenue: Number(todayRevenue.toFixed(2)),
    totalRevenue: Number(totalRevenue.toFixed(2)),
    pendingOrdersCount,
    totalMenuItems,
    lowStockCount,
    outOfStockCount,
    mostPopularProduct,
    studentOrderCount,
    regularOrderCount
  };

  const value: CoffeeContextType = {
    menu,
    cart,
    orders,
    settings,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    placeOrder,
    updateOrderStatus,
    getCustomerOrders,
    getOrderById,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    updateItemStock,
    adjustItemStock,
    updateSettings,
    stats
  };

  return <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>;
};

export const useCoffee = (): CoffeeContextType => {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error('useCoffee must be used within a CoffeeProvider');
  }
  return context;
};
