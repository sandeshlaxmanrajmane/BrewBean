import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, StoredUserAccount } from '../types';
import {
  getActiveSession,
  setActiveSession,
  getStoredAccounts,
  saveStoredAccounts,
  initializeStorage
} from '../services/storage';
import { generateSalt, hashPassword, verifyPassword } from '../services/crypto';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isOwner: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  loginCustomer: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (name: string, email: string, pass: string, confirmPass: string) => Promise<{ success: boolean; error?: string }>;
  loginOwner: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuth() {
      await initializeStorage();
      const current = getActiveSession();
      if (current) {
        setUser(current);
      }
      setIsLoading(false);
    }
    loadAuth();
  }, []);

  const loginCustomer = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const accounts = getStoredAccounts();
    const account = accounts.find(
      (a) => a.user.email.toLowerCase() === trimmedEmail && a.user.role === 'CUSTOMER'
    );

    if (!account) {
      return { success: false, error: 'No customer account found with this email. Please register.' };
    }

    const isValid = await verifyPassword(pass, account.passwordHash, account.salt);
    if (!isValid) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setUser(account.user);
    setActiveSession(account.user);
    return { success: true };
  };

  const registerCustomer = async (
    name: string,
    email: string,
    pass: string,
    confirmPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !pass || !confirmPass) {
      return { success: false, error: 'All fields are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email format (e.g., you@domain.com).' };
    }

    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (pass !== confirmPass) {
      return { success: false, error: 'Password confirmation does not match.' };
    }

    const accounts = getStoredAccounts();
    if (accounts.some((a) => a.user.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const salt = await generateSalt();
    const passwordHash = await hashPassword(pass, salt);

    const newUser: User = {
      id: `cust-${Date.now().toString(36)}`,
      email: trimmedEmail,
      name: trimmedName,
      role: 'CUSTOMER',
      customerType: 'REGULAR',
      createdAt: new Date().toISOString()
    };

    const newAccount: StoredUserAccount = {
      user: newUser,
      passwordHash,
      salt
    };

    saveStoredAccounts([...accounts, newAccount]);
    setUser(newUser);
    setActiveSession(newUser);
    return { success: true };
  };

  const loginOwner = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmed = identifier.trim().toLowerCase();
    if (!trimmed || !pass) {
      return { success: false, error: 'Owner credentials are required.' };
    }

    const accounts = getStoredAccounts();
    const account = accounts.find(
      (a) =>
        a.user.role === 'OWNER' &&
        (a.user.email.toLowerCase() === trimmed || trimmed === 'owner' || trimmed === 'admin')
    );

    if (!account) {
      return { success: false, error: 'Access denied: Owner account not recognized.' };
    }

    const isValid = await verifyPassword(pass, account.passwordHash, account.salt);
    if (!isValid) {
      return { success: false, error: 'Access denied: Invalid owner authentication credentials.' };
    }

    setUser(account.user);
    setActiveSession(account.user);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setActiveSession(null);
  };

  const updateProfile = async (updated: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const accounts = getStoredAccounts();
    const updatedUser = { ...user, ...updated };

    const newAccounts = accounts.map((a) => {
      if (a.user.id === user.id) {
        return { ...a, user: updatedUser };
      }
      return a;
    });

    saveStoredAccounts(newAccounts);
    setUser(updatedUser);
    setActiveSession(updatedUser);
    return true;
  };

  const changePassword = async (
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated.' };
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const accounts = getStoredAccounts();
    const target = accounts.find((a) => a.user.id === user.id);
    if (!target) return { success: false, error: 'User record not found.' };

    const isValid = await verifyPassword(oldPass, target.passwordHash, target.salt);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    const newSalt = await generateSalt();
    const newHash = await hashPassword(newPass, newSalt);

    const updatedAccounts = accounts.map((a) => {
      if (a.user.id === user.id) {
        return { ...a, passwordHash: newHash, salt: newSalt };
      }
      return a;
    });

    saveStoredAccounts(updatedAccounts);
    return { success: true };
  };

  const value: AuthContextType = {
    user,
    role: user ? user.role : null,
    isAuthenticated: !!user,
    isOwner: user?.role === 'OWNER',
    isCustomer: user?.role === 'CUSTOMER',
    isLoading,
    loginCustomer,
    registerCustomer,
    loginOwner,
    logout,
    updateProfile,
    changePassword,
    redirectAfterLogin,
    setRedirectAfterLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
