import React from 'react';
import {
  ChevronLeft,
  MapPin,
  Truck,
  Clock,
  Printer,
  Sparkles,
  Coffee,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';

interface CustomerOrderDetailPageProps {
  order: Order;
  onBack: () => void;
  onTrackOrder: (order: Order) => void;
}

export const CustomerOrderDetailPage: React.FC<CustomerOrderDetailPageProps> = ({
  order,
  onBack,
  onTrackOrder,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-coffee-600 hover:text-amber-800 transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to My Orders</span>
      </button>

      {/* Receipt Card */}
      <div className="bg-white rounded-3xl p-8 border border-coffee-200/80 shadow-lg relative overflow-hidden">
        {/* Top gold bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-600" />

        {/* Brand & Order Header */}
        <div className="flex items-start justify-between pb-6 border-b border-coffee-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-700 flex items-center justify-center text-amber-50">
                <Coffee className="w-4 h-4" />
              </div>
              <h2 className="font-serif font-black text-xl text-coffee-950">BrewBean.</h2>
            </div>
            <p className="text-[11px] text-coffee-500">Official Artisanal Coffee Receipt</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-coffee-400 block uppercase tracking-wider font-semibold">
              Pickup Token
            </span>
            <span className="text-2xl font-mono font-black text-amber-800">
              {order.token}
            </span>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-coffee-100">
          <div>
            <span className="text-coffee-400 block text-[10px] uppercase font-semibold">Order ID</span>
            <span className="font-mono font-bold text-coffee-900 mt-0.5 block">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-coffee-400 block text-[10px] uppercase font-semibold">Date & Time</span>
            <span className="text-coffee-800 mt-0.5 block">
              {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div>
            <span className="text-coffee-400 block text-[10px] uppercase font-semibold">
              {order.deliveryType === 'Delivery' ? 'Delivery Address' : 'Pickup Station'}
            </span>
            <span className="font-semibold text-amber-900 mt-0.5 block truncate">
              {order.deliveryAddress || order.pickupCounter}
            </span>
          </div>
          <div>
            <span className="text-coffee-400 block text-[10px] uppercase font-semibold">Order Status</span>
            <span className="font-bold text-amber-800 mt-0.5 block">{order.status}</span>
          </div>
        </div>

        {/* Items Table with Product Pictures */}
        <div className="py-6 border-b border-coffee-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-coffee-700 mb-3">
            Handcrafted Items
          </h3>
          <div className="space-y-3">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  {it.productImage && (
                    <img
                      src={it.productImage}
                      alt={it.productName}
                      className="w-10 h-10 rounded-xl object-cover border border-coffee-200 shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-bold text-coffee-950">
                      {it.quantity}x {it.productName}
                    </p>
                    {it.size && <p className="text-[11px] text-coffee-500">Size: {it.size}</p>}
                    {it.customization && <p className="text-[11px] text-coffee-500">Specs: {it.customization}</p>}
                  </div>
                </div>
                <span className="font-mono font-bold text-coffee-900">
                  ${(it.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="py-6 border-b border-coffee-100 space-y-2 text-xs text-coffee-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-mono">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Student Perk Discount:</span>
              <span className="font-mono">-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-coffee-500">
            <span>Tax:</span>
            <span className="font-mono">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-coffee-950 pt-2 border-t border-coffee-100">
            <span>Amount Paid:</span>
            <span className="font-mono text-amber-900">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 flex items-center justify-between">
          <button
            onClick={() => onTrackOrder(order)}
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Open Live Tracker</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-coffee-100 hover:bg-coffee-200 text-coffee-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
