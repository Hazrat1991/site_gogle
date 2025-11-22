import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, Heart } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../constants';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  onSearch: (query: string) => void;
  onNavigate: (view: any) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  onLogoClick, 
  onSearch, 
  onNavigate,
  lang,
  setLang 
}) => {
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = DICTIONARY[lang];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const NavLink = ({ view, label, category }: { view: string, label: string, category?: string }) => (
    <button 
      onClick={() => {
        onNavigate({ name: view, category });
        setMobileMenuOpen(false);
      }}
      className="text-slate-600 hover:text-primary font-medium transition-colors"
    >
      {label}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-1 text-center">
        Grand Market Fashion — {lang === 'ru' ? 'Бесплатная доставка от 500 с.' : 'Дастраскунии ройгон аз 500 с.'}
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          className="flex flex-col cursor-pointer" 
          onClick={onLogoClick}
        >
          <span className="text-2xl font-extrabold text-primary tracking-tighter">
            GRAND<span className="text-secondary">MARKET</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400">Fashion Store</span>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative w-full group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="flex text-sm font-bold border border-slate-200 rounded-md overflow-hidden">
            <button onClick={() => setLang('ru')} className={`px-2 py-1 ${lang === 'ru' ? 'bg-slate-100 text-primary' : 'text-slate-400'}`}>RU</button>
            <button onClick={() => setLang('tj')} className={`px-2 py-1 ${lang === 'tj' ? 'bg-slate-100 text-primary' : 'text-slate-400'}`}>TJ</button>
          </div>

          <button onClick={() => onNavigate({ name: 'profile' })} className="hidden md:block p-2 hover:bg-slate-50 rounded-full text-slate-600">
            <User className="w-6 h-6" />
          </button>

          <button onClick={() => onNavigate({ name: 'profile' })} className="hidden md:block p-2 hover:bg-slate-50 rounded-full text-slate-600">
            <Heart className="w-6 h-6" />
          </button>

          <button 
            onClick={onCartClick}
            className="relative p-2 hover:bg-slate-50 rounded-full text-slate-800"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-secondary text-white text-xs font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            className="md:hidden p-2 text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Categories */}
      <div className="hidden md:block border-t border-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3 text-sm">
            <NavLink view="listing" category="men" label={t.men} />
            <NavLink view="listing" category="women" label={t.women} />
            <NavLink view="listing" category="shoes" label={t.shoes} />
            <NavLink view="listing" category="hats" label={t.hats} />
            <NavLink view="listing" category="socks" label={t.socks} />
            <NavLink view="listing" category="accessories" label={t.accessories} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 z-50">
           <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          </form>
          <NavLink view="listing" category="men" label={t.men} />
          <NavLink view="listing" category="women" label={t.women} />
          <NavLink view="listing" category="shoes" label={t.shoes} />
          <NavLink view="listing" category="hats" label={t.hats} />
          <NavLink view="listing" category="socks" label={t.socks} />
          <NavLink view="listing" category="accessories" label={t.accessories} />
          <div className="h-px bg-slate-100 my-2"></div>
          <button onClick={() => { onNavigate({ name: 'profile' }); setMobileMenuOpen(false); }} className="text-left font-medium text-slate-600">{t.profile}</button>
          <button onClick={() => { onNavigate({ name: 'admin' }); setMobileMenuOpen(false); }} className="text-left font-medium text-slate-600">{t.admin}</button>
        </div>
      )}
    </nav>
  );
};