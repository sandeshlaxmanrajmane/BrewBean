import React from 'react';
import { Coffee, Store, ShieldCheck, ArrowRight, X, Sparkles, User } from 'lucide-react';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'CUSTOMER' | 'OWNER') => void;
}

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#25150f] to-[#160b06] border border-coffee-800/80 rounded-3xl p-6 sm:p-9 shadow-2xl text-coffee-100 z-10 overflow-hidden animate-scale-up">
        {/* Glow ambient decorations */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-700/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-coffee-300 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            BrewBean Portal Entry
          </div>
          <h2 className="text-3xl font-serif font-bold text-amber-100 tracking-tight">
            Welcome to BrewBean
          </h2>
          <p className="text-coffee-300 text-sm mt-2 max-w-md mx-auto">
            Select your account type to access personalized coffee ordering or coffeehouse management tools.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Customer Card */}
          <div
            onClick={() => onSelectRole('CUSTOMER')}
            className="group relative cursor-pointer flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-coffee-900/60 to-coffee-950/80 border border-amber-900/40 hover:border-amber-500/60 hover:shadow-[0_10px_30px_rgba(217,119,6,0.15)] transition-all duration-300 hover:-translate-y-1.5"
          >
            <div className="relative">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/30 to-amber-800/20 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Coffee className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Guest & Member
                </span>
              </div>

              <h3 className="text-xl font-serif font-semibold text-amber-50 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400 inline" /> Customer Login
              </h3>
              <p className="text-coffee-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Order your favorite coffee, manage your orders, and enjoy your BrewBean experience.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-coffee-800/40">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-semibold text-sm transition-all duration-200 shadow-md group-hover:shadow-amber-500/25"
              >
                <span>Continue as Customer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Owner Card */}
          <div
            onClick={() => onSelectRole('OWNER')}
            className="group relative cursor-pointer flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-[#1c120c]/90 to-[#0e0704]/90 border border-amber-700/30 hover:border-amber-400/60 hover:shadow-[0_10px_30px_rgba(251,191,36,0.12)] transition-all duration-300 hover:-translate-y-1.5"
          >
            <div className="relative">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Store className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Authorized Admin
                </span>
              </div>

              <h3 className="text-xl font-serif font-semibold text-amber-100 group-hover:text-amber-300 transition-colors">
                Owner Login
              </h3>
              <p className="text-coffee-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Manage your coffee shop, inventory, orders, and sales.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-coffee-800/40">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-semibold text-sm transition-all duration-200 shadow-md group-hover:shadow-amber-600/30 border border-amber-500/30"
              >
                <span>Owner Login</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo hints footer */}
        <div className="mt-7 text-center pt-4 border-t border-coffee-800/50 flex flex-wrap items-center justify-center gap-2 text-xs text-coffee-400">
          <span>Prototype Security: Salted PBKDF2 Web Crypto Vault Active</span>
          <span>•</span>
          <span className="text-amber-400 font-medium">Zero Plaintext Storage</span>
        </div>
      </div>
    </div>
  );
};
