import React from 'react';
import { Coffee, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLoginModal }) => {
  return (
    <footer className="bg-[#1e1008] text-coffee-200 border-t border-amber-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-700 flex items-center justify-center text-amber-100 shadow-md">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif font-black text-2xl text-amber-100 tracking-tight">
                BrewBean<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-xs text-coffee-300 leading-relaxed">
              Purveyors of single-origin roast profiles and slow-steeped cold brews. Sourced ethically from cooperative farms worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Fair-Trade Verified</span>
            </div>
          </div>

          {/* Column 2: Hours & Pickup */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-amber-100 text-sm tracking-wide">
              Roastery Hours
            </h3>
            <ul className="space-y-2 text-xs text-coffee-300">
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Mon – Fri: 6:30 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Saturday: 7:00 AM – 9:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Sunday: 8:00 AM – 6:00 PM</span>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-amber-300/80">
              Rapid pickup counters: A (Espresso), B (Cold Draft), C (Bakery).
            </div>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-amber-100 text-sm tracking-wide">
              Flagship Roastery
            </h3>
            <ul className="space-y-2 text-xs text-coffee-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>452 Roaster Avenue, Coffee District, CA 94107</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+1 (555) 273-9232</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>hello@brewbean.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Portals */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-amber-100 text-sm tracking-wide">
              Portals & Roles
            </h3>
            <div className="flex flex-col gap-2 text-xs text-coffee-300">
              <button
                onClick={onOpenLoginModal}
                className="text-left hover:text-amber-300 transition-colors cursor-pointer"
              >
                • Customer & Member Sign In
              </button>
              <button
                onClick={() => onNavigate('/customer/register')}
                className="text-left hover:text-amber-300 transition-colors cursor-pointer"
              >
                • Register for BrewClub Perks
              </button>
              <button
                onClick={() => onNavigate('/owner/login')}
                className="text-left text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer"
              >
                • Store Owner Dashboard Login →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-amber-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-coffee-400 gap-4">
          <p>© {new Date().getFullYear()} BrewBean Artisanal Coffee Co. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Crafted with passion & espresso</span>
            <span>•</span>
            <span>PBKDF2 Cryptographic Vault</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
