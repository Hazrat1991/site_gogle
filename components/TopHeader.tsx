import React from 'react';
import { Icon } from "@iconify/react";
import { Language } from '../types';

interface TopHeaderProps {
  onSearch: (query: string) => void;
  onFilterClick?: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSearch, onFilterClick, lang, setLang }) => {
  return (
    <div className="px-4 py-3 bg-card sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5"
          />
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-20 bg-muted/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder={lang === 'ru' ? "Поиск товаров..." : "Ҷустуҷӯи мол..."}
          />
          {/* Smart Search Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <button className="text-slate-400 hover:text-primary active:scale-95 transition-colors">
                <Icon icon="solar:camera-minimalistic-bold" className="size-5" />
             </button>
             <button className="text-slate-400 hover:text-primary active:scale-95 transition-colors">
                <Icon icon="solar:microphone-3-bold" className="size-5" />
             </button>
          </div>
        </div>
        
        {/* Filter Button */}
        <button 
          onClick={onFilterClick}
          className="size-11 flex shrink-0 items-center justify-center bg-secondary text-white rounded-xl shadow-sm active:scale-95 transition-transform"
        >
          <Icon icon="solar:tuning-2-bold" className="size-5" />
        </button>

        <button 
          onClick={() => setLang(lang === 'ru' ? 'tj' : 'ru')}
          className="size-11 flex shrink-0 items-center justify-center bg-muted text-foreground border border-border rounded-xl shadow-sm active:scale-95 transition-transform relative font-bold text-xs"
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </div>
  );
};