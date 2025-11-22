import React from 'react';
import { Icon } from "@iconify/react";

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: any) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, cartCount }) => {
  const navItems = [
    { id: 'home', label: 'Главная', icon: 'solar:home-2-bold' },
    { id: 'listing', label: 'Каталог', icon: 'solar:widget-bold' },
    { id: 'cart', label: 'Корзина', icon: 'solar:cart-large-2-bold', isMain: true },
    { id: 'favorites', label: 'Избранное', icon: 'solar:heart-bold' },
    { id: 'profile', label: 'Профиль', icon: 'solar:user-bold' },
  ];

  return (
    <div className="border-t border-border bg-background pb-safe fixed bottom-0 left-0 right-0 z-30">
      <div className="flex items-center justify-around px-2 py-2 h-16">
        {navItems.map((item) => {
          if (item.isMain) {
            return (
              <div key={item.id} className="relative">
                <button 
                  onClick={() => onNavigate({ name: item.id })}
                  className="flex items-center justify-center size-12 bg-secondary text-white rounded-full shadow-lg -mt-6 border-4 border-background hover:scale-105 transition-transform"
                >
                  <Icon icon={item.icon} className="size-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            );
          }

          const isActive = activeView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate({ name: item.id })}
              className={`flex flex-col items-center justify-center gap-1 w-14 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-secondary'}`}
            >
              <Icon icon={item.icon} className="size-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};