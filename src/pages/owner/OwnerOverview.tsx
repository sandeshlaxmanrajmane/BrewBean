import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Coffee,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Package,
  MapPin,
  Truck
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { OrderStatus } from '../../types';
import { useToast } from '../../components/Toast';

interface OwnerOverviewProps {
  onNavigateTab: (tab: any) => void;
}

export const OwnerOverview: React.FC<OwnerOverviewProps> = ({ onNavigateTab }) => {
  const { stats, orders, updateOrderStatus } = useCoffee();
  const { success } = useToast();

  const recentOrders = orders.slice(0, 6);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    success('Order Updated', `Order status set to ${newStatus}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'Preparing':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60';
      case 'Ready':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 animate-pulse';
      case 'Completed':
        return 'bg-stone-800/80 text-stone-300 border-stone-700/60';
      case 'Cancelled':
        return 'bg-red-950/80 text-red-300 border-red-800/60';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2a160d] via-[#1e0e07] to-[#160a04] border border-amber-900/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Roastery Ops
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              Welcome back to your Coffeehouse Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-coffee-300 mt-1 max-w-xl">
              Monitor incoming espresso tickets, table deliveries, inventory stock, and customer address destinations.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Manage All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Orders */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md flex flex-col justify-between hover:border-amber-700/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-coffee-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/70 text-amber-400 flex items-center justify-center border border-amber-800/40">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-amber-100">{stats.totalOrders}</span>
            <span className="text-xs text-coffee-400 block mt-0.5">Lifetime orders processed</span>
          </div>
        </div>

        {/* 2. Today's Revenue */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md flex flex-col justify-between hover:border-amber-700/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-coffee-400 uppercase tracking-wider">Today's Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950/70 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-emerald-300">${stats.todayRevenue.toFixed(2)}</span>
            <span className="text-xs text-coffee-400 block mt-0.5">Total rev: ${stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* 3. Pending Orders */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md flex flex-col justify-between hover:border-amber-700/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-coffee-400 uppercase tracking-wider">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-950/70 text-blue-400 flex items-center justify-center border border-blue-800/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-blue-300">{stats.pendingOrdersCount}</span>
            <span className="text-xs text-coffee-400 block mt-0.5">Placed, preparing, or ready</span>
          </div>
        </div>

        {/* 4. Total Menu Items */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md flex flex-col justify-between hover:border-amber-700/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-coffee-400 uppercase tracking-wider">Total Menu Items</span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/70 text-amber-300 flex items-center justify-center border border-amber-800/40">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-amber-100">{stats.totalMenuItems}</span>
            <span className="text-xs text-coffee-400 block mt-0.5">Active catalogue offerings</span>
          </div>
        </div>

        {/* 5. Low Stock Items */}
        <div className="p-5 rounded-2xl bg-[#1c0f08] border border-amber-900/30 shadow-md flex flex-col justify-between hover:border-amber-700/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-coffee-400 uppercase tracking-wider">Low Stock Items</span>
            <div className="w-9 h-9 rounded-xl bg-orange-950/70 text-orange-400 flex items-center justify-center border border-orange-800/40">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-serif font-bold text-orange-300">{stats.lowStockCount}</span>
            <span className="text-xs text-coffee-400 block mt-0.5">{stats.outOfStockCount} out of stock</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section with Pictures and Addresses */}
      <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100">Recent Coffee Orders</h2>
            <p className="text-xs text-coffee-400">
              Live incoming tickets showing product pictures and delivery locations.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-amber-950">
          <table className="w-full text-left text-xs text-coffee-200">
            <thead className="bg-[#24130a] text-amber-300/80 uppercase font-semibold text-[11px] border-b border-amber-900/30">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Items (With Pics)</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Delivery Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/60 bg-[#150a05]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-coffee-500">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-100">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-amber-50">{order.customerName}</div>
                      <span className="text-[10px] text-coffee-400">{order.customerType}</span>
                    </td>

                    {/* Items with product pictures */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 truncate max-w-xs text-[11px]">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-5 h-5 rounded object-cover border border-amber-900/40 shrink-0"
                              />
                            )}
                            <span className="font-semibold text-amber-200">{item.quantity}x</span>{' '}
                            <span className="truncate">{item.productName}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-amber-200">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                        {order.token}
                      </span>
                    </td>

                    {/* Destination Address */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-coffee-300">
                      <div className="flex items-center gap-1 truncate text-amber-100">
                        {order.deliveryType === 'Delivery' ? (
                          <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{order.deliveryAddress || order.pickupCounter}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="bg-[#24130a] text-amber-200 border border-amber-800/50 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
