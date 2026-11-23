import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  Store,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

interface OwnerLoginPageProps {
  onNavigate: (path: string) => void;
}

export const OwnerLoginPage: React.FC<OwnerLoginPageProps> = ({ onNavigate }) => {
  const { loginOwner } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await loginOwner(identifier, password);
    setIsSubmitting(false);

    if (res.success) {
      success('Owner Authenticated', 'Access granted to BrewBean Management Console.');
      onNavigate('/owner/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication rejected.');
      toastError('Access Denied', res.error);
    }
  };

  const handleQuickDemoFill = () => {
    setIdentifier('owner@brewbean.com');
    setPassword('OwnerBean#2026');
    setErrorMessage('');
    info('Owner demo credentials populated!', 'Click "Access Dashboard" to authenticate.');
  };

  return (
    <div className="min-h-screen bg-[#0c0603] text-coffee-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background ambience & dark espresso glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a1d11] via-[#150a05] to-[#0c0603] opacity-80" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-coffee-300 hover:text-amber-400 transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to BrewBean Main Store</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/30 text-amber-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Restricted Management Node</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-gradient-to-b from-[#21120b] to-[#120804] border border-amber-600/30 rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-xl animate-scale-up">
            
            {/* Top gold accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-600" />

            {/* Icon & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/40 items-center justify-center text-amber-400 shadow-inner mb-4">
                <Store className="w-8 h-8" />
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 tracking-tight">
                  Owner Dashboard
                </h1>
              </div>

              <p className="text-xs text-coffee-400 mt-1 max-w-xs mx-auto">
                Authorized access only. Enter proprietor credentials to manage shop inventory, live orders, and revenue analytics.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier (Email / Username) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-2">
                  Owner Email or Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-500 group-focus-within:text-amber-400 transition-colors">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="owner@brewbean.com or admin"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#150a05]/90 border border-coffee-800 rounded-xl text-amber-100 text-sm placeholder:text-coffee-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-2">
                  Security Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-500 group-focus-within:text-amber-400 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 bg-[#150a05]/90 border border-coffee-800 rounded-xl text-amber-100 text-sm placeholder:text-coffee-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-500 hover:text-amber-400 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-espresso-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-espresso-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Access Dashboard</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Credentials Quick-Fill Pill */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-2 transition-all hover:border-amber-500/50"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Click to autofill Owner Demo (owner@brewbean.com)</span>
                </button>
              </div>

              {/* Registration notice */}
              <div className="pt-4 text-center">
                <p className="text-[11px] text-coffee-500">
                  Notice: Proprietor accounts cannot be created publicly. New staff credentials are issued exclusively by the General Manager.
                </p>
              </div>
            </form>
          </div>

          {/* Under-card security reassurance */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-coffee-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>End-to-End Role Separation • PBKDF2 Web Crypto Vault</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-coffee-600 border-t border-coffee-900/60">
        BrewBean Store Management System v2.6 • Private Admin Console
      </footer>
    </div>
  );
};
