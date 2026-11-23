import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Lock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCoffee } from '../context/CoffeeContext';
import { useAuth } from '../context/AuthContext';
import { CustomerType, Order } from '../types';
import { useToast } from './Toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onNavigateLogin: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onNavigateLogin,
}) => {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, placeOrder, settings } = useCoffee();
  const { user, isCustomer, isOwner, isAuthenticated, setRedirectAfterLogin, updateProfile } = useAuth();
  const { success, error: toastError, warning } = useToast();

  const [customerType, setCustomerType] = useState<CustomerType>(
    user?.customerType || 'REGULAR'
  );
  const [deliveryType, setDeliveryType] = useState<'Pickup' | 'Delivery'>('Delivery');
  const [address, setAddress] = useState<string>(user?.defaultAddress || '');
  const [addressError, setAddressError] = useState<string>('');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    if (user?.defaultAddress && !address) {
      setAddress(user.defaultAddress);
    }
  }, [user]);

  if (!isOpen) return null;

  // Pricing calculations
  const discountRate = customerType === 'STUDENT' ? settings.studentDiscountPercent / 100 : 0;
  const discountAmount = Number((cartSubtotal * discountRate).toFixed(2));
  const taxableSubtotal = cartSubtotal - discountAmount;
  const taxAmount = Number((taxableSubtotal * (settings.taxRatePercent / 100)).toFixed(2));
  const finalTotal = Number((taxableSubtotal + taxAmount).toFixed(2));

  const handleCheckoutClick = async () => {
    // Check Rule E.2: Owners cannot accidentally enter customer checkout as owner
    if (isOwner) {
      warning(
        'Owner Mode Detected',
        'Store proprietors cannot place customer orders under an owner account. Please sign in as a customer.'
      );
      return;
    }

    // Customer must be authenticated
    if (!isAuthenticated || !user) {
      setRedirectAfterLogin('checkout');
      onNavigateLogin();
      onClose();
      return;
    }

    // Require Customer Address before placing order
    if (!address.trim()) {
      setAddressError('Please enter your delivery or pickup address to continue.');
      toastError('Address Required', 'Please enter your delivery address or building location.');
      return;
    }

    setAddressError('');
    setIsPlacing(true);

    // Save default address to profile if changed
    if (address.trim() !== user.defaultAddress) {
      updateProfile({ defaultAddress: address.trim() });
    }

    const res = await placeOrder(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        customerType,
        deliveryType,
        deliveryAddress: address.trim()
      },
      orderNotes
    );
    setIsPlacing(false);

    if (res.success && res.order) {
      success('Order Placed!', `Your token is ${res.order.token}. Delivered to ${res.order.deliveryAddress}`);
      onClose();
      onOrderSuccess(res.order);
    } else {
      toastError('Order Failed', res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#faf7f2] shadow-2xl flex flex-col justify-between border-l border-amber-900/30 animate-fade-in text-coffee-950">
          
          {/* Header */}
          <div className="p-6 border-b border-coffee-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-50 shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-black text-xl text-coffee-950">Your Coffee Bag</h2>
                <p className="text-xs text-coffee-500">
                  {cart.length === 0 ? 'Empty bag' : `${cart.length} handcrafted selection(s)`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-coffee-100 text-coffee-500 hover:text-coffee-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 rounded-3xl bg-amber-100/60 border border-amber-200 flex items-center justify-center text-amber-700 mb-4 animate-bounce">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif font-bold text-lg text-coffee-900">Your bag is empty</h3>
                <p className="text-xs text-coffee-500 mt-1 max-w-xs leading-relaxed">
                  Explore our handcrafted coffees, rich nitro cold brews, and fresh French pastries to begin your order.
                </p>
              </div>
            ) : (
              <>
                {/* Cart preservation banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                  <span>Your selections and bag items are preserved automatically across page navigations and sign-ins!</span>
                </div>

                {/* Items List with High-Res Product Pictures */}
                <div className="space-y-3.5">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-2xl bg-white border border-coffee-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-3.5 group"
                    >
                      {/* Product Pic Thumbnail */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-coffee-100 border border-coffee-200 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-amber-200 text-[9px] font-mono font-bold px-1 rounded">
                          {item.product.category.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif font-bold text-sm text-coffee-950 truncate">
                            {item.product.name}
                          </h4>
                          <span className="font-mono font-bold text-xs text-amber-800 shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="text-[11px] text-coffee-500 mt-1">
                          <span className="font-medium text-amber-900">{item.size || 'Regular'}</span>
                          {item.milkChoice && <span> • {item.milkChoice}</span>}
                          {item.sweetness && <span> • {item.sweetness}</span>}
                        </div>

                        {item.customNotes && (
                          <p className="text-[10px] text-coffee-400 mt-0.5 truncate">
                            Note: {item.customNotes}
                          </p>
                        )}

                        {/* Quantity and Delete controls */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-coffee-100">
                          <div className="flex items-center gap-2 bg-coffee-50 rounded-xl p-0.5 border border-coffee-200">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white text-coffee-700 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-xs px-1 text-coffee-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white text-coffee-700 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-coffee-400 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ================= MANDATORY ADDRESS SECTION ================= */}
                <div className="p-5 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <span>Delivery & Pickup Destination *</span>
                    </label>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  </div>

                  {/* Delivery vs Pickup Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('Delivery')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        deliveryType === 'Delivery'
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-stone-50 text-coffee-700 border-coffee-200 hover:bg-coffee-100'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Campus / Table Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('Pickup')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        deliveryType === 'Pickup'
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-stone-50 text-coffee-700 border-coffee-200 hover:bg-coffee-100'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Express Counter Pickup</span>
                    </button>
                  </div>

                  {/* Address Input Field */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={
                        deliveryType === 'Delivery'
                          ? 'e.g. University Hall, Room 402, North Campus or Table #7'
                          : 'e.g. In-Store Counter Express Pickup'
                      }
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (addressError) setAddressError('');
                      }}
                      className={`w-full px-3.5 py-2.5 bg-stone-50/80 border rounded-xl text-xs text-coffee-900 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all ${
                        addressError ? 'border-red-500 bg-red-50/50' : 'border-coffee-200'
                      }`}
                    />
                    {addressError && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{addressError}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-coffee-500 mt-1">
                      Our runners deliver hot beverages directly to your campus desk, library table, or express pickup counter.
                    </p>
                  </div>
                </div>

                {/* Customer Category & Perks */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase text-coffee-700">
                    Select Customer Category:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerType('REGULAR')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        customerType === 'REGULAR'
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-white text-coffee-700 border-coffee-200 hover:bg-coffee-50'
                      }`}
                    >
                      <div className="font-bold">Regular Patron</div>
                      <div className="text-[10px] opacity-80">Standard pricing</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomerType('STUDENT')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        customerType === 'STUDENT'
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-white text-coffee-700 border-coffee-200 hover:bg-coffee-50'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Student ({settings.studentDiscountPercent}% OFF)</span>
                      </div>
                      <div className="text-[10px] opacity-80">Campus scholar discount</div>
                    </button>
                  </div>

                  {customerType === 'STUDENT' && (
                    <input
                      type="text"
                      placeholder="Student ID / College Name (e.g. STU-8829)"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  )}

                  {/* Special barista notes */}
                  <div>
                    <label className="block text-xs font-semibold text-coffee-700 mb-1">
                      Barista Notes (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Extra hot, double cup, leave sleeve on..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-coffee-200/80 space-y-4 shadow-lg sticky bottom-0 z-10">
              <div className="space-y-1.5 text-xs text-coffee-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Student Discount ({settings.studentDiscountPercent}%)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-coffee-500">
                  <span>Tax ({settings.taxRatePercent}%)</span>
                  <span className="font-mono">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-coffee-950 pt-2 border-t border-coffee-100">
                  <span>Estimated Total</span>
                  <span className="font-mono text-amber-800">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Customer login required before placing order. Your cart and address will be preserved!</span>
                  </div>
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
                  >
                    <span>Sign In to Complete Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : isOwner ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Logged in as Owner. Proprietors cannot checkout as customer.</span>
                  </div>
                  <button
                    disabled
                    className="w-full py-3.5 px-6 rounded-2xl bg-stone-300 text-stone-600 font-bold text-xs cursor-not-allowed"
                  >
                    Checkout Disabled for Owner Role
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCheckoutClick}
                  disabled={isPlacing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPlacing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm & Place Order (${finalTotal.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
