import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { CoffeeProvider } from './context/CoffeeContext';
import { ToastProvider } from './components/Toast';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CoffeeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CoffeeProvider>
    </AuthProvider>
  </React.StrictMode>
);
