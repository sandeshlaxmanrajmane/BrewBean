import React, { useState } from 'react';
import {
  User,
  Lock,
  Store,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  LogOut,
  Save,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCoffee } from '../../context/CoffeeContext';
import { useToast } from '../../components/Toast';
import { SUPABASE_SCHEMA_SQL } from '../../services/supabaseSql';

interface OwnerSettingsProps {
  onLogout: () => void;
}

export const OwnerSettings: React.FC<OwnerSettingsProps> = ({ onLogout }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const { settings, updateSettings } = useCoffee();
  const { success, error: toastError } = useToast();

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Elena Rostova (Store Owner)');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 273-9232');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password Change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  // Store Preferences state
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [studentDiscount, setStudentDiscount] = useState(settings.studentDiscountPercent.toString());
  const [taxRate, setTaxRate] = useState(settings.taxRatePercent.toString());
  const [autoAccept, setAutoAccept] = useState(settings.autoAcceptOrders);

  // Supabase SQL Viewer Modal
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, phone });
    setProfileSaved(true);
    success('Profile Updated', 'Proprietor profile details saved.');
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    setPassSubmitting(true);
    const res = await changePassword(oldPassword, newPassword);
    setPassSubmitting(false);

    if (res.success) {
      success('Password Updated', 'Your security password has been re-hashed with PBKDF2 SHA-256.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(res.error || 'Password update failed.');
      toastError('Password Error', res.error);
    }
  };

  const handleStorePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    const discountVal = parseFloat(studentDiscount);
    const taxVal = parseFloat(taxRate);

    if (isNaN(discountVal) || discountVal < 0 || discountVal > 50) {
      toastError('Invalid Discount', 'Discount must be between 0% and 50%.');
      return;
    }
    if (isNaN(taxVal) || taxVal < 0 || taxVal > 25) {
      toastError('Invalid Tax', 'Tax rate must be between 0% and 25%.');
      return;
    }

    updateSettings({
      storeName,
      tagline,
      studentDiscountPercent: discountVal,
      taxRatePercent: taxVal,
      autoAcceptOrders: autoAccept
    });
    success('Settings Saved', 'Coffeehouse operational rules updated.');
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    success('SQL Copied', 'Supabase schema and RLS policies copied to clipboard.');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-amber-100">Store Settings & Access Controls</h1>
        <p className="text-xs text-coffee-400">
          Manage proprietor identity, cryptographic authentication, store pricing rules, and database RLS.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Owner Profile */}
        <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-serif font-bold text-amber-100">Proprietor Profile</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'owner@brewbean.com'}
                className="w-full px-3.5 py-2.5 bg-[#120703]/80 border border-amber-950 rounded-xl text-xs text-coffee-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-coffee-500">Master account email cannot be changed via web portal.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Shop Telephone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Security & Password Change */}
        <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-serif font-bold text-amber-100">Update Security Password</h2>
          </div>

          {passError && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                New Security Password *
              </label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passSubmitting}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-100 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{passSubmitting ? 'Verifying & Hashing...' : 'Update Password Hash'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Store Preferences */}
      <div className="bg-[#190d07] border border-amber-900/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-serif font-bold text-amber-100">Coffeehouse Store Preferences</h2>
        </div>

        <form onSubmit={handleStorePreferencesSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Student Discount Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={studentDiscount}
                onChange={(e) => setStudentDiscount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-[10px] text-coffee-500">Applied automatically when customer selects Student</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
                Sales Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#120703] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Pickup Counters */}
          <div>
            <label className="block text-xs font-semibold uppercase text-amber-300/80 mb-1">
              Active Pickup Counters
            </label>
            <div className="flex flex-wrap gap-2">
              {settings.pickupCounters.map((counter, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#120703] border border-amber-900/40 text-amber-200 text-xs font-mono"
                >
                  {counter}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Production Database & Supabase Row Level Security (RLS) Hub */}
      <div className="bg-gradient-to-r from-[#1d1009] to-[#140a05] border border-amber-700/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/20 border border-amber-600/40 text-amber-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-100 text-base">
                  Database & Supabase RLS Policies
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  Prototype Vault Mode Active
                </span>
              </div>
              <p className="text-xs text-coffee-300 mt-0.5">
                Complies with Section F: PBKDF2 salted password encryption in-memory & complete Row Level Security (RLS) PostgreSQL schema.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#26150c] hover:bg-amber-900/60 border border-amber-700/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Supabase RLS SQL</span>
          </button>
        </div>
      </div>

      {/* 5. Logout Zone */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-900/30 flex items-center justify-between">
        <div>
          <h4 className="font-serif font-bold text-amber-100 text-sm">Terminate Administrative Session</h4>
          <p className="text-xs text-coffee-400">Clears authorization cookies and memory state securely.</p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-100 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit & Logout</span>
        </button>
      </div>

      {/* Supabase SQL Code Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/85 backdrop-blur-md">
          <div className="bg-[#190d07] border border-amber-700/60 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-coffee-100 shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-amber-950">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-serif font-bold text-amber-100">
                  Supabase PostgreSQL Schema & Row Level Security (RLS)
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-coffee-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-coffee-400 py-3">
              This SQL script defines the complete PostgreSQL schema with role enums, profiles, menu items, orders, and strict Row Level Security (RLS) policies preventing customers from modifying store menu items and preventing them from reading other patrons' orders.
            </p>

            <div className="flex-1 overflow-y-auto bg-[#0d0603] p-4 rounded-2xl border border-amber-950 font-mono text-[11px] text-amber-200/90 whitespace-pre leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </div>

            <div className="pt-4 border-t border-amber-950 flex justify-end gap-2">
              <button
                onClick={copySqlToClipboard}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
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
