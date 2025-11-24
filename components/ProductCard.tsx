
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isFullWidth?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
  onCompare?: (product: Product) => void;
  isCompare?: boolean;
  viewMode?: 'grid' | 'list'; // Added support for List view if needed later
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onAddToCart, 
  isFullWidth = false,
  isFavorite = false,
  onToggleFavorite,
  onCompare,
  isCompare
}) => {
  const [imgIndex, setImgIndex] = useState(0);

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  // Added h-full to ensure cards stretch to equal height in flex/grid containers
  const widthClass = isFullWidth ? "min-w-[160px] w-[160px] snap-start" : "w-full";
  const reviewCount = product.reviews.length > 0 ? product.reviews.length : 0;

  const handleImageNav = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation();
    if (direction === 'prev') {
       setImgIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1);
    } else {
       setImgIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0);
    }
  };

  return (
    <div 
      className={`${widthClass} h-full bg-card rounded-xl overflow-hidden shadow-sm border border-border cursor-pointer group flex flex-col relative`}
      onClick={() => onClick(product)}
    >
      {/* Aspect Ratio Container */}
      <div className="relative bg-muted shrink-0 group/image w-full" style={{ aspectRatio: '3/4' }}>
        <img
          alt={product.name}
          src={product.images[imgIndex]}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
        
        {/* Gallery Navigation Taps (Invisible but clickable) */}
        {product.images.length > 1 && (
           <>
              <div 
                 className="absolute inset-y-0 left-0 w-1/3 z-10" 
                 onClick={(e) => handleImageNav(e, 'prev')} 
              />
              <div 
                 className="absolute inset-y-0 right-0 w-1/3 z-10" 
                 onClick={(e) => handleImageNav(e, 'next')} 
              />
              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                 {product.images.map((_, i) => (
                    <div 
                       key={i} 
                       className={`size-1.5 rounded-full shadow-sm transition-all ${i === imgIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
                    />
                 ))}
              </div>
           </>
        )}

        {/* Favorite Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (onToggleFavorite) onToggleFavorite(product); 
          }}
          className="absolute top-2 right-2 size-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-90 shadow-sm"
        >
          <Icon 
            icon={isFavorite ? "solar:heart-bold" : "solar:heart-linear"} 
            className={`size-5 ${isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`} 
          />
        </button>
        
        {/* Compare Button */}
        {!isFullWidth && onCompare && (
           <button 
             onClick={(e) => { e.stopPropagation(); onCompare(product); }}
             className={`absolute top-12 right-2 size-8 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-all z-20 shadow-sm ${isCompare ? 'bg-primary text-white' : 'bg-white/80 text-secondary'}`}
           >
             <Icon icon="solar:scale-bold" className="size-5" />
           </button>
        )}

        {/* Smart Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
           {product.isNew && !discount && (
             <div className="bg-secondary/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
               NEW
             </div>
           )}
           {discount > 0 && (
             <div className="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
               -{discount}%
             </div>
           )}
           {product.stock && product.stock < 5 && product.stock > 0 && (
              <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                 <Icon icon="solar:fire-bold" className="size-3" />
                 Мало
              </div>
           )}
           {product.rating >= 4.8 && (
              <div className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                 <Icon icon="solar:star-bold" className="size-3" />
                 Хит
              </div>
           )}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        {/* Category & Shop Name */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded capitalize truncate max-w-[50%]">
              {product.subCategory || product.category}
            </span>
            <span className="truncate text-slate-400">• {product.supplierId ? 'Partner' : 'Grand Market'}</span>
        </div>

        <h3 className="text-sm font-bold text-foreground truncate mb-1">{product.name}</h3>
        
        {/* Rating Row */}
        <div className="flex items-center gap-1 mb-2">
           <Icon icon="solar:star-bold" className="text-orange-400 size-3" />
           <span className="text-xs font-bold text-slate-700">{product.rating}</span>
           <span className="text-[10px] text-slate-400">({reviewCount} отз.)</span>
        </div>

        <div className="mt-auto">
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                   <span className="font-bold text-primary text-base">{product.price} с.</span>
                   {product.oldPrice && (
                     <span className="text-[10px] text-muted-foreground line-through">{product.oldPrice} с.</span>
                   )}
                 </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="size-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shadow-sm active:bg-slate-700 transition-colors z-20"
              >
                <Icon icon="solar:bag-3-bold" className="size-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
