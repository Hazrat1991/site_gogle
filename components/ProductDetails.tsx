
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product, Language } from '../types';
import { DICTIONARY, MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  lang: Language;
  onBack: () => void;
  onAddToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  onBuyNow: (product: Product, size?: string, color?: string, quantity?: number) => void;
  onProductClick: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  lang, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onProductClick,
  isFavorite,
  onToggleFavorite
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const t = DICTIONARY[lang];
  
  // Reset state when product changes
  useEffect(() => {
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQty(1);
    setIsDescOpen(true);
    const container = document.getElementById('product-details-container');
    if (container) container.scrollTop = 0;
  }, [product]);

  const similarProducts = MOCK_PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 5);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Посмотри этот товар в Grand Market: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  const getColorClass = (color: string) => {
      switch(color.toLowerCase()) {
          case 'белый': return 'bg-white border border-slate-200';
          case 'черный': return 'bg-slate-900';
          case 'синий': return 'bg-blue-600';
          case 'красный': return 'bg-red-500';
          case 'хаки': return 'bg-[#5D6C1C]';
          case 'желтый': return 'bg-yellow-400';
          case 'розовый': return 'bg-pink-400';
          case 'бежевый': return 'bg-[#F5F5DC] border border-slate-200';
          case 'серый': return 'bg-gray-500';
          case 'коричневый': return 'bg-[#8B4513]';
          default: return 'bg-slate-400';
      }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white font-sans animate-fade-in absolute inset-0 z-40 pb-safe">
      {/* Top Sticky Header */}
      <div className="px-4 py-3 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 flex items-center justify-between">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all">
          <Icon icon="solar:arrow-left-linear" className="size-6 text-slate-800" />
        </button>
        <span className="font-bold text-sm text-slate-800 line-clamp-1 max-w-[60%]">
          {product.name}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="size-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Icon icon="solar:share-bold" className="size-5 text-slate-800" />
          </button>
          <button 
            onClick={() => onToggleFavorite(product)}
            className="size-10 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Icon 
              icon={isFavorite ? "solar:heart-bold" : "solar:heart-linear"} 
              className={`size-5 ${isFavorite ? "text-red-500" : "text-slate-800"}`} 
            />
          </button>
        </div>
      </div>

      <div id="product-details-container" className="flex-1 overflow-y-auto scrollbar-hide pb-24 bg-white">
        {/* Image Gallery */}
        <div className="relative w-full aspect-[4/5] bg-slate-100">
          <img
            alt={product.name}
            src={product.images[0]}
            className="w-full h-full object-cover"
          />
          {product.isNew && (
             <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
               NEW
             </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-5 py-6">
          <div className="flex items-start justify-between mb-4">
             <div className="flex-1 pr-4">
                <h1 className="text-2xl font-bold font-heading text-slate-900 leading-tight mb-2">
                  {product.name}
                </h1>
                {/* Category and Brand below Title */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                   <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase tracking-wide">{product.subCategory || product.category}</span>
                   <span>•</span>
                   <span>Grand Market</span>
                </div>
             </div>
             <div className="flex flex-col items-end shrink-0">
                <span className="text-2xl font-extrabold text-primary">{product.price} с.</span>
                {product.oldPrice && (
                   <span className="text-sm text-slate-400 line-through decoration-red-400 decoration-2">{product.oldPrice} с.</span>
                )}
             </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-orange-400">
               {[...Array(5)].map((_, i) => (
                  <Icon key={i} icon={i < Math.floor(product.rating) ? "solar:star-bold" : "solar:star-linear"} className="size-5" />
               ))}
            </div>
            <span className="text-base font-bold text-slate-900">{product.rating}</span>
            <span className="text-sm text-slate-400 underline decoration-dotted underline-offset-4">
               {product.reviews.length > 0 ? product.reviews.length : 12} {t.reviews}
            </span>
          </div>

          {/* --- Controls Section (UPDATED) --- */}
          <div className="mb-8">
             
             {/* Block 1: Sizes */}
             <div className="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">{t.size}</h3>
                <div className="flex flex-wrap gap-2">
                   {product.sizes.map(size => (
                      <button
                         key={size}
                         onClick={() => setSelectedSize(size)}
                         className={`min-w-[48px] h-10 px-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all border ${
                            selectedSize === size 
                            ? 'border-primary bg-primary text-white shadow-md shadow-primary/30' 
                            : 'border-slate-200 text-slate-600 bg-white hover:border-primary/50'
                         }`}
                      >
                         {size}
                      </button>
                   ))}
                </div>
             </div>

             {/* Block 2: Colors */}
             <div className="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">{t.color}</h3>
                <div className="flex gap-3 flex-wrap">
                   {product.colors.map(color => (
                      <button
                         key={color}
                         onClick={() => setSelectedColor(color)}
                         className={`size-10 rounded-full flex items-center justify-center transition-all relative ${
                            selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                         }`}
                      >
                         <div className={`size-full rounded-full shadow-sm border border-black/5 ${getColorClass(color)}`} />
                      </button>
                   ))}
                </div>
             </div>

             {/* Block 3: Quantity (Updated: Horizontal Arrows) */}
             <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Количество</h3>
                
                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                   <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="size-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 active:scale-90 transition-all"
                   >
                      <Icon icon="solar:alt-arrow-down-bold" className="size-5" />
                   </button>
                   
                   <div className="w-8 text-center font-bold text-slate-900 text-lg">{qty}</div>
                   
                   <button 
                      onClick={() => setQty(qty + 1)}
                      className="size-8 flex items-center justify-center bg-green-50 text-green-500 rounded-lg hover:bg-green-100 active:scale-90 transition-all"
                   >
                      <Icon icon="solar:alt-arrow-up-bold" className="size-5" />
                   </button>
                </div>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3">
                <button 
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, qty)}
                  className="flex-1 bg-slate-900 text-white h-14 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:bag-plus-bold" className="size-5" />
                  {t.addToCart}
                </button>
                <button 
                   onClick={() => onBuyNow(product, selectedSize, selectedColor, qty)}
                   className="flex-1 bg-primary text-white h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center"
                >
                   {t.buy1click}
                </button>
             </div>
          </div>

          {/* Description Accordion */}
          <div className="mb-6 border-t border-slate-100 pt-6">
             <button 
               onClick={() => setIsDescOpen(!isDescOpen)}
               className="flex items-center justify-between w-full mb-2"
             >
               <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <Icon icon="solar:document-text-bold" className="size-5" />
                  </div>
                  {t.description}
               </h3>
               <Icon 
                 icon="solar:alt-arrow-down-linear" 
                 className={`text-slate-400 transition-transform ${isDescOpen ? 'rotate-180' : ''}`} 
               />
             </button>
             
             {isDescOpen && (
               <div className="animate-fade-in">
                 <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {product.description}
                 </p>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                       <span className="text-xs text-slate-400 block mb-1">Материал</span>
                       <span className="text-sm font-medium text-slate-800">{product.material || 'Хлопок 100%'}</span>
                    </div>
                    <div>
                       <span className="text-xs text-slate-400 block mb-1">Артикул</span>
                       <span className="text-sm font-medium text-slate-800">GM-{product.id}24</span>
                    </div>
                 </div>
               </div>
             )}
          </div>

          {/* Reviews Section */}
          <div className="mb-8 border-t border-slate-100 pt-6">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                    <Icon icon="solar:star-bold" className="size-5" />
                  </div>
                  {t.reviews} <span className="text-slate-400 text-sm font-normal">({product.reviews.length > 0 ? product.reviews.length : 127})</span>
               </h3>
             </div>
             
             <div className="space-y-4">
               {(product.reviews.length > 0 ? product.reviews : [
                 {id: 'd1', user: 'Анна К.', rating: 5, comment: 'Отличное платье! Ткань легкая и приятная к телу. Размер соответствует. Очень довольна покупкой!', date: '2 дня назад'},
                 {id: 'd2', user: 'Мария С.', rating: 4, comment: 'Красивое, но цвет немного отличается от фото. В целом качество хорошее.', date: '5 дней назад'}
               ]).map((review) => (
                  <div key={review.id} className="bg-slate-50 p-4 rounded-2xl">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                           <div className="size-8 rounded-full bg-white flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm">
                              {review.user[0]}
                           </div>
                           <div>
                              <div className="text-sm font-bold text-slate-900">{review.user}</div>
                              <div className="flex text-orange-400 text-[10px]">
                                 {[...Array(5)].map((_, i) => (
                                    <Icon key={i} icon={i < review.rating ? "solar:star-bold" : "solar:star-linear"} />
                                 ))}
                              </div>
                           </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                     </div>
                     <p className="text-sm text-slate-600 leading-snug pl-[44px]">{review.comment}</p>
                  </div>
               ))}
               <button className="w-full py-3 text-primary text-sm font-bold hover:bg-primary/5 rounded-xl transition-colors">
                 Показать все отзывы
               </button>
             </div>
          </div>

          {/* Similar Products */}
          <div className="pt-2 border-t border-slate-100 pt-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
               <div className="w-1 h-5 bg-secondary rounded-full"></div>
               {t.similar}
             </h3>
             <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide snap-x -mx-5 px-5">
                {similarProducts.map(p => (
                   <ProductCard 
                     key={p.id} 
                     product={p} 
                     onClick={onProductClick}
                     onAddToCart={onAddToCart}
                     isFullWidth={true}
                     isFavorite={false}
                   />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
