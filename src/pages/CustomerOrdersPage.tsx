import React from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Truck,
  ChevronRight,
  Coffee,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCoffee } from '../context/CoffeeContext';
import { Order, OrderStatus } from '../types';

interface CustomerOrdersPageProps {
  onSelectOrder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
  onNavigateMenu: () => void;
}

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({
  onSelectOrder,
  onTrackOrder,
  onNavigateMenu,
}) => {
  const { user } = useAuth();
  const { getCustomerOrders } = useCoffee();

  const customerOrders = user ? getCustomerOrders(user.id) : [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Ready':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse';
      case 'Completed':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-950">
            My Coffee Orders & Tokens
          </h1>
          <p className="text-xs text-coffee-500 mt-1">
            Track current cups brewing at the roastery and view your verified item receipts.
          </p>
        </div>

        <button
          onClick={onNavigateMenu}
          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Coffee className="w-4 h-4" />
          <span>Order More Coffee</span>
        </button>
      </div>

      {/* Orders List */}
      {customerOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-coffee-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-xl text-coffee-950">No orders placed yet</h2>
          <p className="text-xs text-coffee-500 max-w-sm mx-auto">
            You haven't ordered any artisanal roasts yet. Browse our menu to try our famous Caramel Macchiato or Kyoto Cold Brew!
          </p>
          <button
            onClick={onNavigateMenu}
            className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Explore the Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {customerOrders.map((order) => {
            const isLive = order.status === 'Placed' || order.status === 'Preparing' || order.status === 'Ready';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-sm hover:shadow-md ${
                  isLive ? 'border-amber-300 ring-2 ring-amber-100' : 'border-coffee-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-coffee-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-lg text-coffee-950">
                      {order.orderNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 font-mono font-bold text-xs">
                      Token {order.token}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-coffee-400">
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Details Row with Product Pictures */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Items summary with pictures */}
                  <div className="md:col-span-2 space-y-2">
                    <p className="font-semibold text-coffee-900 text-xs mb-1">Items in this order:</p>
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        {it.productImage && (
                          <img
                            src={it.productImage}
                            alt={it.productName}
                            className="w-8 h-8 rounded-lg object-cover border border-coffee-200 shrink-0"
                          />
                        )}
                        <div className="text-coffee-700">
                          <span className="font-bold text-amber-800">{it.quantity}x</span>{' '}
                          <span className="font-semibold">{it.productName}</span>
                          {it.customization && <span className="text-coffee-400 text-[10px]"> ({it.customization})</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination & Price */}
                  <div className="space-y-1.5 md:text-right">
                    <p className="text-coffee-500 text-[11px]">
                      {order.deliveryType === 'Delivery' ? 'Delivered To:' : 'Pickup Station:'}
                    </p>
                    <p className="font-semibold text-amber-900 flex items-center md:justify-end gap-1 text-xs">
                      {order.deliveryType === 'Delivery' ? (
                        <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      )}
                      <span>{order.deliveryAddress || order.pickupCounter}</span>
                    </p>
                    <div className="pt-1">
                      <span className="text-sm font-serif font-bold text-coffee-950">
                        Total: ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom action buttons */}
                <div className="pt-3 border-t border-coffee-100 flex items-center justify-between">
                  <span className="text-[11px] text-coffee-400">
                    {order.customerType === 'STUDENT' ? 'Applied 10% Student Scholar Perk' : 'Standard checkout'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onTrackOrder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Track Order</span>
                    </button>

                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-coffee-100 hover:bg-coffee-200 text-coffee-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>View Receipt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
