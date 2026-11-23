import React, { useState } from 'react';
import {
  Coffee,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCoffee } from '../context/CoffeeContext';
import { useToast } from '../components/Toast';

interface CustomerAuthPageProps {
  initialTab?: 'login' | 'register';
  onNavigate: (path: string) => void;
}

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({
  initialTab = 'login',
  onNavigate,
}) => {
  const { loginCustomer, registerCustomer, redirectAfterLogin, setRedirectAfterLogin } = useAuth();
  const { cartTotalCount } = useCoffee();
  const { success, error: toastError, info } = useToast();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const res = await loginCustomer(loginEmail, loginPass, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      success('Welcome back to BrewBean!', cartTotalCount > 0 ? `Your cart (${cartTotalCount} items) is preserved and ready.` : undefined);
      const destination = redirectAfterLogin || '/';
      setRedirectAfterLogin(null);
      onNavigate(destination);
    } else {
      setLoginError(res.error || 'Authentication failed');
      toastError('Login Error', res.error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setIsSubmitting(true);

    const res = await registerCustomer(regName, regEmail, regPass, regConfirmPass);
    setIsSubmitting(false);

    if (res.success) {
      success('Welcome to the BrewBean Family!', 'Your account has been created.');
      const destination = redirectAfterLogin || '/';
      setRedirectAfterLogin(null);
      onNavigate(destination);
    } else {
      setRegError(res.error || 'Registration failed');
      toastError('Registration Error', res.error);
    }
  };

  const handleQuickDemoFill = () => {
    setLoginEmail('alex.customer@brewbean.com');
    setLoginPass('CoffeeLover#2026');
    setLoginError('');
    info('Demo customer credentials filled!', 'Click "Sign In to BrewBean" to proceed.');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#fbf8f5] via-[#f5eee6] to-[#ebdccf] py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(67,40,28,0.15)] border border-coffee-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Side: Form Container (7 cols on lg) */}
        <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Top Bar with Brand and Switch */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-2 text-coffee-800 hover:text-amber-700 transition-colors text-sm font-semibold"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center text-amber-50">
                  <Coffee className="w-4 h-4" />
                </div>
                <span>BrewBean Artisanal Co.</span>
              </button>

              <button
                onClick={() => onNavigate('/owner/login')}
                className="text-xs text-coffee-600 hover:text-amber-800 underline transition-colors"
              >
                Store Owner Portal →
              </button>
            </div>

            {/* Cart preservation pill if items exist */}
            {cartTotalCount > 0 && (
              <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900 animate-fadeIn">
                <div className="w-7 h-7 rounded-lg bg-amber-200/80 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-amber-800" />
                </div>
                <div>
                  <span className="font-bold">Cart Preserved:</span> You have{' '}
                  <span className="font-semibold text-amber-800">{cartTotalCount} items</span> waiting. Login to complete your order seamlessly!
                </div>
              </div>
            )}

            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-coffee-100/70 p-1.5 mb-8 border border-coffee-200/70">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setLoginError('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-white text-coffee-950 shadow-sm'
                    : 'text-coffee-600 hover:text-coffee-900'
                }`}
              >
                Customer Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setRegError('');
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-white text-coffee-950 shadow-sm'
                    : 'text-coffee-600 hover:text-coffee-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ================= LOGIN FORM ================= */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-950">
                    Welcome Back, Coffee Lover
                  </h1>
                  <p className="text-coffee-600 text-sm mt-1">
                    Sign in to track orders, save favorites, and receive barista rewards.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <span className="font-medium">{loginError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-coffee-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-400 group-focus-within:text-amber-700 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="alex.customer@brewbean.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-coffee-200 rounded-xl text-coffee-900 text-sm placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-coffee-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-400 group-focus-within:text-amber-700 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-stone-50/70 border border-coffee-200 rounded-xl text-coffee-900 text-sm placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-400 hover:text-coffee-700 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-coffee-700 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-coffee-300 text-amber-700 focus:ring-amber-600 w-4 h-4 cursor-pointer"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 disabled:opacity-70 group cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to BrewBean</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Quick Demo Credentials button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Click to autofill Customer Demo (Alex Morgan)</span>
                  </button>
                </div>
              </form>
            )}

            {/* ================= REGISTRATION FORM ================= */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-coffee-950">
                    Join the BrewClub
                  </h1>
                  <p className="text-coffee-600 text-sm mt-1">
                    Create your free account for rapid ordering, perks, and token tracking.
                  </p>
                </div>

                {regError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <span className="font-medium">{regError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-coffee-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-400 group-focus-within:text-amber-700 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Hayes"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-coffee-200 rounded-xl text-coffee-900 text-sm placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-coffee-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-400 group-focus-within:text-amber-700 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="jordan@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-coffee-200 rounded-xl text-coffee-900 text-sm placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-coffee-700 mb-1.5">
                    Password (min. 6 characters)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-400 group-focus-within:text-amber-700 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-stone-50/70 border border-coffee-200 rounded-xl text-coffee-900 text-sm placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-400 hover:text-coffee-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-coffee-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-coffee-400 group-focus-within:text-amber-700 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={regConfirmPass}
                      onChange={(e) => setRegConfirmPass(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-stone-50/70 border border-coffee-200 rounded-xl text-coffee-900 text-sm placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-coffee-400 hover:text-coffee-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 disabled:opacity-70 group cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Toggle to login */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-coffee-600 hover:text-amber-800 font-medium transition-colors"
                  >
                    Already have an account? <span className="underline font-semibold">Sign in here</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-coffee-100 flex items-center justify-between text-xs text-coffee-400">
            <span>© BrewBean Specialty Roasters</span>
            <span>PBKDF2 SHA-256 Hashing Vault</span>
          </div>
        </div>

        {/* Right Side: Coffee Visual Storytelling (5 cols on lg) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#2c170d] to-[#170a04] p-10 flex-col justify-between text-white overflow-hidden">
          {/* Background image overlay */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140803] via-transparent to-[#1f0d06]/60" />

          {/* Top badge */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Roasted Selection
            </span>
          </div>

          {/* Center Quote / Art */}
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-1 bg-amber-500 rounded-full" />
            <h2 className="text-3xl font-serif font-bold text-amber-50 leading-tight">
              “Every roast tells the story of Ethiopian highlands and Colombian slopes.”
            </h2>
            <p className="text-coffee-300 text-sm leading-relaxed">
              Log in to track your personal orders, choose barista grind preferences, and collect campus perks.
            </p>

            {/* Perks list */}
            <div className="space-y-2.5 pt-2 text-xs text-coffee-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Real-time order token & counter tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>10% Student & Scholar Discount at checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Instant cart preservation across sessions</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 text-xs text-coffee-400 flex items-center justify-between">
            <span>Specialty Grade 1 Coffee</span>
            <span>Since 2018</span>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-coffee-200 animate-scale-up">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif font-bold text-lg text-coffee-950">Password Recovery</h3>
            </div>
            <p className="text-coffee-600 text-xs mb-4">
              Enter your registered customer email. We will send a secure password reset token to your inbox.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs mb-4">
                <div className="font-semibold">Reset instructions sent!</div>
                <div>Please check your inbox (or simulated email vault) for your recovery link.</div>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-coffee-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-coffee-700 hover:bg-coffee-100 rounded-xl transition-colors"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setForgotSent(true);
                      success('Recovery instructions sent to ' + forgotEmail);
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-colors"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
