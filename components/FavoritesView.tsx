
import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FavoritesViewProps {
  favorites: number[];
  products: Product[];
  toggleFavorite: (p: Product) => void;
  onAddToCart: (p: Product, size?: string, color?: string) => void;
  onNavigate: (view: any) => void;
  lang: 'ru' | 'tj';
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites, products, toggleFavorite, onAddToCart, onNavigate, lang
}) => {
  const favProducts = products.filter(p => favorites.includes(p.id));
  const recommended = products.filter(p => p.isTop && !favorites.includes(p.id)).slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Мой вишлист Grand Market',
        text: 'Посмотри, что я хочу купить!',
        url: window.location.href
      });
    } else {
      alert('Ссылка скопирована!');
    }
  };

  const handleAddAllToCart = () => {
    favProducts.forEach(p => {
       if (p.stock && p.stock > 0) {
          onAddToCart(p, p.sizes[0], p.colors[0]);
       }
    });
    alert(lang === 'ru' ? 'Все доступные товары добавлены!' : 'Ҳамаи молҳо илова шуданд!');
  };

  if (favProducts.length === 0) {
    return (
       <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 animate-fade-in">
          <div className="flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
             <div className="size-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 relative">
                <Icon icon="solar:heart-broken-bold" className="size-10 text-slate-300" />
                <div className="absolute -top-1 -right-1 size-8 bg-pink-100 rounded-full flex items-center justify-center animate-pulse">
                   <Icon icon="solar:heart-bold" className="size-5 text-pink-500" />
                </div>
             </div>
             <h2 className="text-xl font-bold text-slate-900 mb-2">
               {lang === 'ru' ? 'В избранном пока пусто' : 'Дар дӯстдошта ҳоло холӣ аст'}
             </h2>
             <p className="text-slate-500 mb-8 max-w-xs">
               {lang === 'ru' ? 'Добавляйте товары сердечком, чтобы не потерять их.' : 'Молҳоро бо дил илова кунед, то онҳоро гум накунед.'}
             </p>
             <button 
               onClick={() => onNavigate({ name: 'listing' })}
               className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
             >
               {lang === 'ru' ? 'Перейти к покупкам' : 'Ба харид гузаштан'}
             </button>
          </div>

          <div className="px-4 pb-8">
             <h3 className="font-bold text-lg text-slate-900 mb-4">
               {lang === 'ru' ? 'Вам может понравиться' : 'Ба шумо маъқул мешавад'}
             </h3>
             <div className="grid grid-cols-2 gap-4">
                {recommended.map(p => (
                   <ProductCard 
                     key={p.id} 
                     product={p} 
                     onClick={() => onNavigate({ name: 'product', data: p })} 
                     onAddToCart={onAddToCart} 
                     isFavorite={favorites.includes(p.id)} 
                     onToggleFavorite={toggleFavorite} 
                   />
                ))}
             </div>
          </div>
       </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-slate-50 px-4 py-4 animate-fade-in">
       {/* Header Actions */}
       <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
             {lang === 'ru' ? 'Избранное' : 'Дӯстдошта'} 
             <span className="text-slate-400 ml-2 text-lg">({favProducts.length})</span>
          </h1>
          <div className="flex gap-2">
             <button onClick={handleShare} className="size-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm active:scale-95 transition-transform">
                <Icon icon="solar:share-bold" className="size-5" />
             </button>
             <button onClick={handleAddAllToCart} className="size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform" title="Добавить все">
                <Icon icon="solar:bag-plus-bold" className="size-5" />
             </button>
          </div>
       </div>

       {/* List of Favorites */}
       <div className="space-y-4">
          {favProducts.map(p => (
             <FavoriteCard 
               key={p.id} 
               product={p} 
               onRemove={() => toggleFavorite(p)} 
               onAddToCart={onAddToCart}
               onClick={() => onNavigate({ name: 'product', data: p })}
             />
          ))}
       </div>
    </div>
  );
};

const FavoriteCard: React.FC<{ 
  product: Product; 
  onRemove: () => void; 
  onAddToCart: (p: Product, size: string) => void;
  onClick: () => void;
}> = ({ product, onRemove, onAddToCart, onClick }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const isLowStock = product.stock && product.stock < 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 relative group ${isOutOfStock ? 'opacity-70 grayscale' : ''}`}
    >
       {/* Image */}
       <div className="w-24 h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
          <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
          {isLowStock && !isOutOfStock && (
             <div className="absolute bottom-0 inset-x-0 bg-red-500/90 text-white text-[9px] font-bold text-center py-0.5">
                Осталось {product.stock} шт
             </div>
          )}
          {discount > 0 && (
             <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{discount}%
             </div>
          )}
       </div>

       {/* Content */}
       <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-tight mb-1">{product.name}</h3>
                <div className="text-xs text-slate-500">{product.subCategory}</div>
             </div>
             <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-slate-300 hover:text-red-500">
                <Icon icon="solar:heart-bold" className="size-5 text-red-500" />
             </button>
          </div>

          <div>
             <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg text-slate-900">{product.price} с.</span>
                {product.oldPrice && <span className="text-xs text-slate-400 line-through">{product.oldPrice} с.</span>}
                {product.oldPrice && (product.oldPrice > product.price) && (
                   <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      Цена упала!
                   </span>
                )}
             </div>

             {/* Quick Actions */}
             <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                {isOutOfStock ? (
                   <button className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">
                      Нет в наличии
                   </button>
                ) : (
                   <>
                      <select 
                         value={selectedSize}
                         onChange={(e) => setSelectedSize(e.target.value)}
                         className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-2 py-2 outline-none"
                      >
                         {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button 
                         onClick={() => onAddToCart(product, selectedSize)}
                         className="flex-1 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-md active:scale-95 transition-transform"
                      >
                         <Icon icon="solar:bag-plus-bold" />
                         В корзину
                      </button>
                   </>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};
