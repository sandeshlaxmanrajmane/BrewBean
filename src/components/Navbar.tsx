import React, { useState } from 'react';
import {
  Coffee,
  ShoppingBag,
  User,
  Store,
  LogOut,
  ChevronDown,
  Clock,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCoffee } from '../context/CoffeeContext';

interface NavbarProps {
  onOpenLoginModal: () => void;
  onOpenCart: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLoginModal,
  onOpenCart,
  onNavigate,
  currentPath,
}) => {
  const { user, isOwner, isCustomer, isAuthenticated, logout } = useAuth();
  const { cartTotalCount, orders } = useCoffee();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Find if customer has any active order in progress
  const activeCustomerOrders = isAuthenticated && isCustomer && user
    ? orders.filter(
        (o) =>
          o.customerId === user.id &&
          (o.status === 'Placed' || o.status === 'Preparing' || o.status === 'Ready')
      )
    : [];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    onNavigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fbf8f5]/90 backdrop-blur-md border-b border-coffee-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-amber-50 shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform duration-300">
            <Coffee className="w-6 h-6 text-amber-200 animate-steam-slow" />
          </div>
          <div>
            <span className="font-serif font-black text-2xl tracking-tight text-coffee-950 group-hover:text-amber-800 transition-colors">
              BrewBean<span className="text-amber-600">.</span>
            </span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-coffee-500">
              Artisanal Specialty Roasters
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-coffee-800">
          <button
            onClick={() => onNavigate('/')}
            className={`transition-colors hover:text-amber-700 cursor-pointer ${
              currentPath === '/' ? 'text-amber-700 underline underline-offset-8 font-bold' : ''
            }`}
          >
            Roastery Menu
          </button>

          {isAuthenticated && isCustomer && (
            <>
              <button
                onClick={() => onNavigate('/customer/orders')}
                className={`transition-colors hover:text-amber-700 cursor-pointer flex items-center gap-1.5 ${
                  currentPath === '/customer/orders' ? 'text-amber-700 underline underline-offset-8 font-bold' : ''
                }`}
              >
                <span>My Orders</span>
                {activeCustomerOrders.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>
              <button
                onClick={() => onNavigate('/customer/profile')}
                className={`transition-colors hover:text-amber-700 cursor-pointer ${
                  currentPath === '/customer/profile' ? 'text-amber-700 underline underline-offset-8 font-bold' : ''
                }`}
              >
                Patron Profile
              </button>
            </>
          )}

          {isOwner && (
            <button
              onClick={() => onNavigate('/owner/dashboard')}
              className="text-amber-800 font-bold hover:text-amber-900 cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/70 border border-amber-300/60"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </button>
          )}
        </nav>

        {/* Right Action Icons: Cart & Auth Button */}
        <div className="flex items-center gap-3">
          {/* Active Order Pill if customer has a live cup brewing */}
          {activeCustomerOrders.length > 0 && (
            <button
              onClick={() => onNavigate('/customer/orders')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>Order {activeCustomerOrders[0].token} in Prep</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-2xl bg-white hover:bg-coffee-100 border border-coffee-200 text-coffee-800 transition-all duration-200 shadow-sm hover:shadow group cursor-pointer"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-5 h-5 text-coffee-800 group-hover:text-amber-700 transition-colors" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-700 text-amber-50 text-[11px] font-bold flex items-center justify-center shadow-md animate-scale-up">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Auth State Button */}
          {!isAuthenticated ? (
            /* Requirement A: "Add a 'Login' button to the main navbar. When clicked, open a beautifully designed login selection page/modal" */
            <button
              onClick={onOpenLoginModal}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-coffee-900 to-coffee-800 hover:from-coffee-800 hover:to-amber-900 text-coffee-50 text-xs font-bold tracking-wide uppercase shadow-md shadow-coffee-950/15 hover:shadow-lg transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <User className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Login</span>
            </button>
          ) : (
            /* Logged in User Menu */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-2xl bg-white hover:bg-coffee-50 border border-coffee-200 text-xs font-semibold text-coffee-900 shadow-sm transition-colors cursor-pointer"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isOwner
                      ? 'bg-amber-600 text-amber-950'
                      : 'bg-amber-800 text-amber-50'
                  }`}
                >
                  {user?.name.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden sm:block max-w-[120px] truncate">
                  <span className="block font-bold text-coffee-950 truncate leading-tight">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-coffee-500 font-normal">
                    {isOwner ? 'Proprietor' : user?.customerType === 'STUDENT' ? 'Student' : 'Customer'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-coffee-400" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-coffee-200 py-2 z-50 text-xs text-coffee-800 animate-scale-up">
                  <div className="px-4 py-2 border-b border-coffee-100">
                    <p className="font-bold text-coffee-950 truncate">{user?.name}</p>
                    <p className="text-[11px] text-coffee-500 truncate">{user?.email}</p>
                  </div>

                  {isCustomer && (
                    <>
                      <button
                        onClick={() => {
                          onNavigate('/customer/orders');
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-coffee-50 flex items-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4 text-amber-700" />
                        <span>Order History & Tokens</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/customer/profile');
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-coffee-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-amber-700" />
                        <span>My Account Profile</span>
                      </button>
                    </>
                  )}

                  {isOwner && (
                    <button
                      onClick={() => {
                        onNavigate('/owner/dashboard');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-amber-700" />
                      <span>Owner Dashboard</span>
                    </button>
                  )}

                  <div className="border-t border-coffee-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-700 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
