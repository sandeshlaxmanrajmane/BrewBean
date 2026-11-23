import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCoffee } from './context/CoffeeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RoleSelectModal } from './components/RoleSelectModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { useToast } from './components/Toast';
import { Order } from './types';

// Pages
import { HomePage } from './pages/HomePage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { CustomerOrderDetailPage } from './pages/CustomerOrderDetailPage';
import { OwnerLoginPage } from './pages/OwnerLoginPage';

// Owner Dashboard views
import { OwnerDashboardLayout, OwnerTab } from './pages/owner/OwnerDashboardLayout';
import { OwnerOverview } from './pages/owner/OwnerOverview';
import { OwnerOrders } from './pages/owner/OwnerOrders';
import { OwnerMenu } from './pages/owner/OwnerMenu';
import { OwnerInventory } from './pages/owner/OwnerInventory';
import { OwnerAnalytics } from './pages/owner/OwnerAnalytics';
import { OwnerCustomers } from './pages/owner/OwnerCustomers';
import { OwnerSettings } from './pages/owner/OwnerSettings';

export const App: React.FC = () => {
  const { user, isOwner, isCustomer, isAuthenticated, isLoading, logout } = useAuth();
  const { orders } = useCoffee();
  const { warning } = useToast();

  // Navigation path state synchronized with window.location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Modals state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Sync state on popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Keep trackedOrder in sync with live order state from CoffeeContext
  useEffect(() => {
    if (trackedOrder) {
      const updated = orders.find((o) => o.id === trackedOrder.id);
      if (updated && updated.status !== trackedOrder.status) {
        setTrackedOrder(updated);
      }
    }
  }, [orders, trackedOrder]);

  // Handle `/login` route: open role selection modal
  useEffect(() => {
    if (currentPath === '/login') {
      setRoleModalOpen(true);
    }
  }, [currentPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#110905] flex items-center justify-center text-amber-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-sm tracking-wide">Brewing BrewBean Portal...</p>
        </div>
      </div>
    );
  }

  // ================= ROLE-BASED ACCESS CONTROL GUARDS =================
  // Rule 3, 5, 8: Owner routes protection
  const isOwnerRoute = currentPath.startsWith('/owner/') && currentPath !== '/owner/login';
  if (isOwnerRoute) {
    if (!isAuthenticated) {
      // Unauthenticated user trying to access owner route
      warning('Authentication Required', 'Please log in with owner credentials to access the administrative dashboard.');
      return <OwnerLoginPage onNavigate={navigate} />;
    }
    if (!isOwner) {
      // Customer trying to access owner route (Rule 1)
      warning('Access Restricted', 'Proprietor console is restricted to store owners. You are logged in as a customer.');
      return (
        <div className="min-h-screen bg-[#110905] text-amber-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#1d0e07] border border-amber-800/60 p-8 rounded-3xl shadow-2xl space-y-4">
            <h2 className="text-xl font-serif font-bold text-amber-200">Owner Authorization Required</h2>
            <p className="text-xs text-coffee-300">
              Your active session is a Customer Member account. You cannot access administrative shop settings without owner credentials.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs"
              >
                Return to Storefront
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/owner/login');
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-700/40 text-xs"
              >
                Log Out & Sign In as Owner
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Rule 4, 5: Customer account routes protection
  const isCustomerAccountRoute =
    currentPath.startsWith('/customer/profile') ||
    currentPath.startsWith('/customer/orders');

  if (isCustomerAccountRoute && (!isAuthenticated || !isCustomer)) {
    warning('Customer Sign In Required', 'Please sign in to view your orders and member profile.');
    return <CustomerAuthPage initialTab="login" onNavigate={navigate} />;
  }

  // ================= ROUTE RENDERING =================

  // 1. Owner Dashboard Routes
  if (isOwnerRoute && isOwner) {
    let ownerTab: OwnerTab = 'overview';
    if (currentPath === '/owner/orders') ownerTab = 'orders';
    else if (currentPath === '/owner/menu') ownerTab = 'menu';
    else if (currentPath === '/owner/inventory') ownerTab = 'inventory';
    else if (currentPath === '/owner/analytics') ownerTab = 'analytics';
    else if (currentPath === '/owner/customers') ownerTab = 'customers';
    else if (currentPath === '/owner/settings') ownerTab = 'settings';

    return (
      <OwnerDashboardLayout
        currentTab={ownerTab}
        onSelectTab={(tab) => navigate(`/owner/${tab}`)}
        onNavigateHome={() => navigate('/')}
      >
        {ownerTab === 'overview' && <OwnerOverview onNavigateTab={(tab) => navigate(`/owner/${tab}`)} />}
        {ownerTab === 'orders' && <OwnerOrders />}
        {ownerTab === 'menu' && <OwnerMenu />}
        {ownerTab === 'inventory' && <OwnerInventory />}
        {ownerTab === 'analytics' && <OwnerAnalytics />}
        {ownerTab === 'customers' && <OwnerCustomers />}
        {ownerTab === 'settings' && <OwnerSettings onLogout={() => { logout(); navigate('/'); }} />}
      </OwnerDashboardLayout>
    );
  }

  // 2. Owner Login Route
  if (currentPath === '/owner/login') {
    return <OwnerLoginPage onNavigate={navigate} />;
  }

  // 3. Customer Auth Routes
  if (currentPath === '/customer/login') {
    return <CustomerAuthPage initialTab="login" onNavigate={navigate} />;
  }

  if (currentPath === '/customer/register') {
    return <CustomerAuthPage initialTab="register" onNavigate={navigate} />;
  }

  // 4. Main Customer Website Layout (Home, Profile, Orders, Order Details)
  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col justify-between selection:bg-amber-700/20 selection:text-amber-950">
      {/* Main Navbar */}
      <Navbar
        onOpenLoginModal={() => setRoleModalOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onNavigate={navigate}
        currentPath={currentPath}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPath === '/customer/profile' ? (
          <CustomerProfilePage onNavigate={navigate} />
        ) : currentPath.startsWith('/customer/orders/') && selectedReceiptOrder ? (
          <CustomerOrderDetailPage
            order={selectedReceiptOrder}
            onBack={() => navigate('/customer/orders')}
            onTrackOrder={(o) => setTrackedOrder(o)}
          />
        ) : currentPath === '/customer/orders' ? (
          <CustomerOrdersPage
            onSelectOrder={(ord) => {
              setSelectedReceiptOrder(ord);
              navigate(`/customer/orders/${ord.orderNumber}`);
            }}
            onTrackOrder={(ord) => setTrackedOrder(ord)}
            onNavigateMenu={() => navigate('/')}
          />
        ) : (
          <HomePage
            onOpenCart={() => setCartOpen(true)}
            onOpenLoginModal={() => setRoleModalOpen(true)}
          />
        )}
      </main>

      {/* Main Footer */}
      <Footer
        onNavigate={navigate}
        onOpenLoginModal={() => setRoleModalOpen(true)}
      />

      {/* Role Selection Entry Point Modal (Requirement A) */}
      <RoleSelectModal
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          if (currentPath === '/login') navigate('/');
        }}
        onSelectRole={(role) => {
          setRoleModalOpen(false);
          if (role === 'CUSTOMER') {
            navigate('/customer/login');
          } else {
            navigate('/owner/login');
          }
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onNavigateLogin={() => {
          setCartOpen(false);
          navigate('/customer/login');
        }}
        onOrderSuccess={(order) => {
          setTrackedOrder(order);
        }}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
        onViewAllOrders={() => navigate('/customer/orders')}
      />
    </div>
  );
};
