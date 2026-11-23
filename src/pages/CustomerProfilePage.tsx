import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Save,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCoffee } from '../context/CoffeeContext';
import { useToast } from '../components/Toast';
import { CustomerType } from '../types';

interface CustomerProfilePageProps {
  onNavigate: (path: string) => void;
}

export const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const { getCustomerOrders } = useCoffee();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [defaultAddress, setDefaultAddress] = useState(user?.defaultAddress || '');
  const [customerType, setCustomerType] = useState<CustomerType>(
    user?.customerType || 'REGULAR'
  );
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [isSaving, setIsSaving] = useState(false);

  const customerOrders = user ? getCustomerOrders(user.id) : [];
  const totalSpent = customerOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toastError('Name Required', 'Please enter your name.');
      return;
    }

    setIsSaving(true);
    await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      defaultAddress: defaultAddress.trim(),
      customerType,
      studentId: customerType === 'STUDENT' ? studentId.trim() : undefined
    });
    setIsSaving(false);
    success('Profile Updated', 'Your customer preferences and address have been saved.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-8 text-coffee-950">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-coffee-900 via-coffee-950 to-espresso-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-coffee-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-2xl font-serif font-bold text-amber-100 shadow-md">
            {user?.name.charAt(0) || 'C'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              BrewBean Member
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-50">
              {user?.name}
            </h1>
            <p className="text-xs text-coffee-300 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/customer/orders')}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({customerOrders.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-coffee-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-coffee-500">Orders Completed</span>
          <p className="text-2xl font-serif font-bold text-coffee-950 mt-2">
            {customerOrders.filter((o) => o.status === 'Completed').length}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-coffee-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-coffee-500">Lifetime Coffee Spend</span>
          <p className="text-2xl font-serif font-bold text-amber-800 mt-2">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-coffee-200/80 shadow-sm">
          <span className="text-xs font-semibold uppercase text-coffee-500">Patron Tier</span>
          <p className="text-base font-semibold text-coffee-900 mt-2 flex items-center gap-1.5">
            {customerType === 'STUDENT' ? (
              <>
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Student Scholar (10% Off)</span>
              </>
            ) : (
              <span>Artisanal Regular</span>
            )}
          </p>
        </div>
      </div>

      {/* Profile Edit Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-coffee-200/80 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-coffee-950 mb-1">Personal Profile Settings</h2>
        <p className="text-xs text-coffee-500 mb-6">
          Update your contact information, student status, and default delivery address.
        </p>

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-coffee-200 rounded-xl text-xs text-coffee-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-coffee-200 rounded-xl text-xs text-coffee-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-coffee-200 rounded-xl text-xs text-coffee-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
              Default Delivery Address / Building & Room
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-coffee-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. University Hall, Room 402, North Campus"
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-coffee-200 rounded-xl text-xs text-coffee-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
            </div>
            <p className="text-[10px] text-coffee-500 mt-1">Pre-fills during bag checkout for rapid ordering.</p>
          </div>

          {/* Customer Category */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
              Patron Classification
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCustomerType('REGULAR')}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                  customerType === 'REGULAR'
                    ? 'bg-amber-700 text-white border-amber-800'
                    : 'bg-stone-50 text-coffee-700 border-coffee-200'
                }`}
              >
                Regular Patron
              </button>

              <button
                type="button"
                onClick={() => setCustomerType('STUDENT')}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                  customerType === 'STUDENT'
                    ? 'bg-amber-700 text-white border-amber-800'
                    : 'bg-stone-50 text-coffee-700 border-coffee-200'
                }`}
              >
                Student / Scholar (10% Off)
              </button>
            </div>
          </div>

          {customerType === 'STUDENT' && (
            <div className="pt-1">
              <label className="block text-xs font-semibold uppercase text-coffee-700 mb-1.5">
                Student ID / College Name
              </label>
              <input
                type="text"
                placeholder="e.g. STU-8829 or UC Berkeley"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50/70 border border-coffee-200 rounded-xl text-xs text-coffee-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
