import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Coffee,
  Package,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Bell,
  Store,
  Menu as MenuIcon,
  X,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCoffee } from '../../context/CoffeeContext';

export type OwnerTab =
  | 'overview'
  | 'orders'
  | 'menu'
  | 'inventory'
  | 'analytics'
  | 'customers'
  | 'settings';

interface OwnerDashboardLayoutProps {
  currentTab: OwnerTab;
  onSelectTab: (tab: OwnerTab) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const OwnerDashboardLayout: React.FC<OwnerDashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  children,
}) => {
  const { user, logout } = useAuth();
  const { stats, settings, updateSettings } = useCoffee();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: OwnerTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ClipboardList className="w-5 h-5" />,
      badge: stats.pendingOrdersCount > 0 ? stats.pendingOrdersCount : undefined
    },
    { id: 'menu', label: 'Menu Management', icon: <Coffee className="w-5 h-5" /> },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      badge: stats.lowStockCount + stats.outOfStockCount > 0 ? stats.lowStockCount + stats.outOfStockCount : undefined
    },
    { id: 'analytics', label: 'Sales & Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    onNavigateHome();
  };

  return (
    <div className="min-h-screen bg-[#110905] text-[#f4ece4] flex flex-col md:flex-row font-sans selection:bg-amber-600/30 selection:text-amber-200">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1a0e08] border-b border-amber-950/80 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-amber-950 font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm text-amber-100">BrewBean</h1>
            <p className="text-[10px] text-amber-400 font-medium">Owner Console</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-amber-950 text-amber-200 border border-amber-800/40"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-[#170c07] border-r border-amber-900/30 flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-amber-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-amber-950 shadow-lg shadow-amber-900/40">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-amber-100 leading-tight">BrewBean</h1>
                <p className="text-xs text-amber-400/90 font-medium tracking-wide">Owner Dashboard</p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 text-coffee-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Store Quick Status Toggle */}
          <div className="mb-6 p-3 rounded-2xl bg-[#23120a] border border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  settings.storeOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="font-medium text-amber-200">
                {settings.storeOpen ? 'Accepting Orders' : 'Store Paused'}
              </span>
            </div>
            <button
              onClick={() => updateSettings({ storeOpen: !settings.storeOpen })}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                settings.storeOpen
                  ? 'bg-amber-900/60 text-amber-300 hover:bg-amber-900'
                  : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
              }`}
            >
              {settings.storeOpen ? 'Pause' : 'Open'}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-amber-500/70">
              Management Menu
            </div>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 shadow-md shadow-amber-950/40 font-semibold'
                      : 'text-coffee-300 hover:text-amber-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-amber-200' : 'text-coffee-400 group-hover:text-amber-300'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-amber-950 text-amber-200'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Owner Profile & Logout */}
          <div className="pt-4 mt-4 border-t border-amber-950/80 space-y-3">
            <button
              onClick={onNavigateHome}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-coffee-300 hover:text-amber-300 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-coffee-400" />
                <span>Visit Main Storefront</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-coffee-500" />
            </button>

            <div className="p-3 rounded-2xl bg-[#23120a] border border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-amber-700/60 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-200 shrink-0">
                  {user?.name.charAt(0) || 'O'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-amber-100 truncate">{user?.name || 'Owner'}</p>
                  <p className="text-[10px] text-amber-400/80">Proprietor</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Log out of Owner Console"
                className="p-1.5 rounded-lg text-coffee-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar for desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#170c07]/80 backdrop-blur-md border-b border-amber-950/80 sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-100 capitalize">
              {currentTab === 'overview' ? 'Shop Overview & Live Operations' : currentTab.replace('-', ' ')}
            </h2>
            <p className="text-xs text-coffee-400">
              Real-time synchronization with active customer orders & live bean inventory
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#23120a] border border-amber-900/30 text-xs text-amber-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live System: Active</span>
            </div>

            <div className="text-xs text-coffee-400 border-l border-amber-900/40 pl-4">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Sub-page Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
