import React from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Coffee,
  AlertCircle,
  MapPin,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
  onViewAllOrders?: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onViewAllOrders,
}) => {
  if (!order) return null;

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Placed', label: 'Order Placed', desc: 'Ticket sent to barista workstation' },
    { status: 'Preparing', label: 'Roasting & Pulling', desc: 'Barista is crafting your beverage' },
    {
      status: 'Ready',
      label: order.deliveryType === 'Delivery' ? 'Out for Delivery' : 'Ready at Counter',
      desc: order.deliveryType === 'Delivery' ? `Runner en route to ${order.deliveryAddress}` : `Head to ${order.pickupCounter}`
    },
    { status: 'Completed', label: 'Delivered & Enjoyed', desc: 'Order completed' },
  ];

  const getStepIndex = (st: OrderStatus): number => {
    switch (st) {
      case 'Placed': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Completed': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-coffee-200 animate-scale-up text-coffee-950 relative overflow-hidden">
        
        {/* Glow accent bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-600" />

        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-coffee-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
              Live Order Tracker
            </div>
            <h3 className="font-serif font-bold text-2xl text-coffee-950">
              {order.orderNumber}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-coffee-100 text-coffee-400 hover:text-coffee-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token and Destination Banner */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-br from-[#2c170d] to-[#1a0c06] text-amber-50 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-amber-300 uppercase tracking-widest font-semibold">
              Pickup Token Number
            </p>
            <div className="text-3xl font-mono font-black text-amber-300 mt-0.5">
              {order.token}
            </div>
          </div>

          <div className="text-right max-w-[210px]">
            <span className="text-[10px] text-coffee-300 block uppercase tracking-wider font-medium">
              {order.deliveryType === 'Delivery' ? 'Delivery Destination:' : 'Pickup Station:'}
            </span>
            <span className="text-xs font-semibold text-amber-100 flex items-center gap-1 justify-end mt-0.5 truncate">
              {order.deliveryType === 'Delivery' ? (
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate">{order.deliveryAddress || order.pickupCounter}</span>
            </span>
          </div>
        </div>

        {/* Stepper Status Progression */}
        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold">This order has been cancelled.</p>
              <p className="text-[11px] text-red-600">Please speak with our head barista for assistance.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {steps.map((s, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={s.status} className="flex items-start gap-4 relative">
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-0.5 h-8 -ml-[1px] ${
                        idx < currentIdx ? 'bg-amber-600' : 'bg-coffee-200'
                      }`}
                    />
                  )}

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isPast
                        ? 'bg-amber-700 text-white'
                        : isCurrent
                        ? 'bg-amber-600 text-white ring-4 ring-amber-200 animate-pulse'
                        : 'bg-coffee-100 text-coffee-400'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Coffee className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-amber-900' : isPast ? 'text-coffee-900' : 'text-coffee-400'
                        }`}
                      >
                        {s.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Active State
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-coffee-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Items with Product Pictures */}
        <div className="mt-6 pt-4 border-t border-coffee-100 space-y-2 text-xs text-coffee-700 max-h-40 overflow-y-auto">
          <p className="font-semibold text-coffee-950 text-xs mb-1">Your Order Items:</p>
          {order.items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-stone-50">
              <div className="flex items-center gap-2.5">
                {it.productImage && (
                  <img
                    src={it.productImage}
                    alt={it.productName}
                    className="w-8 h-8 rounded-lg object-cover border border-coffee-200 shrink-0"
                  />
                )}
                <div>
                  <p className="font-bold text-coffee-950">
                    {it.quantity}x {it.productName}
                  </p>
                  {it.customization && <p className="text-[10px] text-coffee-500">{it.customization}</p>}
                </div>
              </div>
              <span className="font-mono font-semibold">${(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-coffee-950 pt-2 border-t border-coffee-100 text-sm">
            <span>Total Paid:</span>
            <span className="font-mono text-amber-900">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end gap-2">
          {onViewAllOrders && (
            <button
              onClick={() => {
                onClose();
                onViewAllOrders();
              }}
              className="px-4 py-2.5 rounded-xl bg-coffee-100 hover:bg-coffee-200 text-coffee-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              View Order History
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Keep Cup Ready
          </button>
        </div>
      </div>
    </div>
  );
};
