import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Coffee,
  XCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  MapPin,
  Truck
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { OrderStatus, Order } from '../../types';
import { useToast } from '../../components/Toast';

export const OwnerOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useCoffee();
  const { success } = useToast();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: OrderStatus[] = ['Placed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    success('Status Updated', `Order marked as "${newStatus}"`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.token.toLowerCase().includes(q) ||
      (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(q)) ||
      o.pickupCounter.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'Preparing':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'Ready':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700 animate-pulse';
      case 'Completed':
        return 'bg-stone-800/80 text-stone-300 border-stone-700';
      case 'Cancelled':
        return 'bg-red-950/80 text-red-300 border-red-800';
      default:
        return 'bg-stone-800 text-stone-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">Order Management Queue</h1>
          <p className="text-xs text-coffee-400">
            Control order workflow states from ticket receipt to table delivery & counter dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-coffee-300">Live Active Queue:</span>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
            {orders.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled').length} tickets
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#190d07] p-4 rounded-2xl border border-amber-900/30">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-amber-600 text-amber-950 shadow-sm font-bold'
                : 'bg-[#24130a] text-coffee-300 hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-amber-950 shadow-sm font-bold'
                    : 'bg-[#24130a] text-coffee-300 hover:text-white'
                }`}
              >
                {status} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-coffee-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, address, token, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 placeholder:text-coffee-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Orders Table with Product Pictures & Delivery Address */}
      <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-coffee-200">
            <thead className="bg-[#24130a] text-amber-300/80 uppercase font-semibold text-[11px] border-b border-amber-900/30">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Items (With Pics)</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Token</th>
                <th className="py-3.5 px-4">Customer Destination Address</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Quick Status Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-950/60 bg-[#150a05]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-coffee-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-950/20 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-amber-200">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="hover:underline flex items-center gap-1 text-left cursor-pointer"
                      >
                        {order.orderNumber}
                      </button>
                      <span className="block text-[10px] text-coffee-500 font-sans">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-amber-100">{order.customerName}</div>
                      <div className="text-[10px] text-coffee-400">
                        {order.customerEmail}
                        {order.customerType === 'STUDENT' && (
                          <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-900/60 text-amber-300 text-[9px] font-bold">
                            STUDENT
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Items with Product Pictures */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5 max-w-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] leading-tight">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-6 h-6 rounded-md object-cover border border-amber-900/30 shrink-0"
                              />
                            )}
                            <div>
                              <span className="font-semibold text-amber-300">{item.quantity}x</span>{' '}
                              <span>{item.productName}</span>
                              {item.size && <span className="text-coffee-400"> ({item.size})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-amber-200 text-sm">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-extrabold text-xs tracking-wider shadow-sm">
                        {order.token}
                      </span>
                    </td>

                    {/* Customer Destination Address */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 text-amber-100 font-medium">
                        {order.deliveryType === 'Delivery' ? (
                          <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className="truncate">{order.deliveryAddress || order.pickupCounter}</span>
                      </div>
                      <span className="text-[10px] text-coffee-400 block mt-0.5">
                        Method: {order.deliveryType || 'Pickup'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex rounded-xl bg-[#201008] border border-amber-900/50 p-1">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                          className="bg-transparent text-amber-200 text-xs font-medium focus:outline-none cursor-pointer pr-2"
                        >
                          <option value="Placed" className="bg-[#201008]">Placed</option>
                          <option value="Preparing" className="bg-[#201008]">Preparing</option>
                          <option value="Ready" className="bg-[#201008]">Ready</option>
                          <option value="Completed" className="bg-[#201008]">Completed</option>
                          <option value="Cancelled" className="bg-[#201008]">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md">
          <div className="bg-[#1a0e08] border border-amber-800/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-coffee-100 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-mono">Order Ticket</span>
                <h3 className="text-xl font-serif font-bold text-amber-100">{selectedOrder.orderNumber}</h3>
              </div>
              <span className="text-xl font-mono font-bold text-amber-300 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30">
                {selectedOrder.token}
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between text-coffee-300">
                <span>Customer:</span>
                <span className="font-semibold text-amber-100">{selectedOrder.customerName} ({selectedOrder.customerEmail})</span>
              </div>
              <div className="flex justify-between text-coffee-300">
                <span>Destination Address:</span>
                <span className="font-semibold text-amber-200">{selectedOrder.deliveryAddress || selectedOrder.pickupCounter}</span>
              </div>
              <div className="flex justify-between text-coffee-300">
                <span>Placed At:</span>
                <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>

              {/* Items List with Product Pictures */}
              <div className="pt-3 border-t border-amber-950/80">
                <p className="font-semibold text-amber-300 uppercase text-[10px] tracking-wider mb-2">Order Items (With Photos)</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center bg-[#120703] p-2.5 rounded-xl border border-amber-900/20">
                      <div className="flex items-center gap-2.5">
                        {it.productImage && (
                          <img
                            src={it.productImage}
                            alt={it.productName}
                            className="w-8 h-8 rounded-lg object-cover border border-amber-900/40 shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-bold text-amber-100">{it.quantity}x {it.productName}</span>
                          {it.customization && <p className="text-[10px] text-coffee-400">{it.customization}</p>}
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-amber-200">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial summary */}
              <div className="pt-3 border-t border-amber-950/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-coffee-400">Subtotal:</span>
                  <span className="font-mono">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (Student Perk):</span>
                    <span className="font-mono">-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-coffee-400">
                  <span>Tax:</span>
                  <span className="font-mono">${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-amber-200 pt-1 border-t border-amber-900/30">
                  <span>Total:</span>
                  <span className="font-mono">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div className="pt-4 border-t border-amber-950 flex flex-wrap gap-2 justify-end">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusUpdate(selectedOrder.id, st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedOrder.status === st
                      ? 'bg-amber-600 text-amber-950 font-bold'
                      : 'bg-[#24130a] text-coffee-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors ml-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
