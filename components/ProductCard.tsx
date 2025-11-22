
import React from 'react';
import { Icon } from "@iconify/react";
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isFullWidth?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onAddToCart, 
  isFullWidth = false,
  isFavorite = false,
  onToggleFavorite
}) => {
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const widthClass = isFullWidth ? "min-w-[160px] w-[160px] snap-start" : "w-full";
  const reviewCount = product.reviews.length;

  return (
    <div 
      className={`${widthClass} bg-card rounded-xl overflow-hidden shadow-sm border border-border cursor-pointer group flex flex-col relative`}
      onClick={() => onClick(product)}
    >
      <div className="h-[160px] relative bg-muted shrink-0">
        <img
          alt={product.name}
          src={product.images[0]}
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (onToggleFavorite) onToggleFavorite(product); 
          }}
          className="absolute top-2 right-2 size-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all z-10 hover:scale-110 active:scale-90"
        >
          <Icon 
            icon={isFavorite ? "solar:heart-bold" : "solar:heart-linear"} 
            className={`size-5 ${isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`} 
          />
        </button>
        
        {!isFullWidth && (
           <button className="absolute top-2 left-2 size-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary active:scale-90 transition-all z-10">
             <Icon icon="solar:eye-bold" className="size-5" />
           </button>
        )}

        {product.isNew && !discount && (
          <div className="absolute bottom-2 left-2 bg-secondary/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
            NEW
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        
        {/* Title first */}
        <h3 className="text-sm font-bold text-foreground line-clamp-1 leading-tight mb-1">{product.name}</h3>

        {/* Category below title, no 'GRAND' */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
          <span className="px-1.5 py-0.5 bg-muted rounded text-foreground/70 capitalize">
            {product.subCategory || product.category}
          </span>
          {/* Optional Brand Tag */}
          <span className="text-slate-300">•</span>
          <span>Grand Market</span>
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
                 {/* Rating Row Requested */}
                 <div className="flex items-center gap-1 mt-1">
                    <Icon icon="solar:star-bold" className="size-3 text-orange-400" />
                    <span className="text-[10px] font-bold text-foreground">{product.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({reviewCount > 0 ? reviewCount : 12})</span>
                 </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="size-8 bg-secondary text-white rounded-lg flex items-center justify-center shadow-sm active:bg-secondary/90 transition-colors"
              >
                <Icon icon="solar:bag-3-bold" className="size-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
