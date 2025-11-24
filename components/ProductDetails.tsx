
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product, Language } from '../types';
import { DICTIONARY, MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { FitFinderModal } from './FitFinderModal';

interface ProductDetailsProps {
  product: Product;
  lang: Language;
  onBack: () => void;
  onAddToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  onBuyNow: (product: Product, size?: string, color?: string, quantity?: number) => void;
  onProductClick: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
  onAddToWaitlist?: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  lang, 
  onBack, 
  onAddToCart, 
  onBuyNow,
  onProductClick,
  isFavorite,
  onToggleFavorite,
  onAddToWaitlist
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);
  const [isNotifySet, setIsNotifySet] = useState(false);
  const [areReviewsExpanded, setAreReviewsExpanded] = useState(false);
  
  // New States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [viewersCount, setViewersCount] = useState(12);

  const t = DICTIONARY[lang];
  
  useEffect(() => {
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQty(1);
    setIsDescOpen(true);
    setIsReviewsOpen(true);
    setShowVideo(false);
    setIsNotifySet(false);
    setAreReviewsExpanded(false);
    setCurrentImageIndex(0);
    setViewersCount(Math.floor(Math.random() * 15) + 5);
    const container = document.getElementById('product-details-container');
    if (container) container.scrollTop = 0;
  }, [product]);

  const similarProducts = MOCK_PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 5);
  
  const displayReviews = product.reviews.length > 0 ? product.reviews : [
     {id: 'd1', user: 'Анна К.', rating: 5, comment: 'Отличное платье! Ткань легкая и приятная к телу.', date: '2 дня назад', photos: ["https://images.unsplash.com/photo-1515434126000-961d90c2351a?w=100&q=80"]},
     {id: 'd2', user: 'Мария С.', rating: 4, comment: 'Красивое, но цвет немного отличается от фото.', date: '5 дней назад'},
     {id: 'd3', user: 'Елена В.', rating: 5, comment: 'Размер подошел идеально, спасибо за быструю доставку!', date: 'Неделю назад'},
     {id: 'd4', user: 'Зарина', rating: 3, comment: 'Доставка задержалась на день.', date: '2 недели назад'}
  ];

  const visibleReviews = areReviewsExpanded ? displayReviews : displayReviews.slice(0, 2);
  const allReviewPhotos = displayReviews.flatMap(r => r.photos || []);

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

  const handleNotify = () => {
    if (onAddToWaitlist) onAddToWaitlist(product);
    setIsNotifySet(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
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
      <FitFinderModal isOpen={isFitFinderOpen} onClose={() => setIsFitFinderOpen(false)} productCategory={product.category} />

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

      <div id="product-details-container" className="flex-1 overflow-y-auto scrollbar-hide pb-32 bg-white">
        {/* Gallery Slider */}
        <div className="relative w-full aspect-[3/4] bg-slate-100 group">
          {showVideo && product.videoUrl ? (
             <video 
               src={product.videoUrl} 
               className="w-full h-full object-cover" 
               controls 
               autoPlay 
               loop 
             />
          ) : (
             <img
               alt={product.name}
               src={product.images[currentImageIndex]}
               className="w-full h-full object-cover cursor-pointer"
               onClick={() => setIsLightboxOpen(true)}
             />
          )}
          
          {/* Gallery Navigation */}
          {!showVideo && product.images.length > 1 && (
            <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 size-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"><Icon icon="solar:alt-arrow-left-bold" className="size-5" /></button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 size-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"><Icon icon="solar:alt-arrow-right-bold" className="size-5" /></button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                    {product.images.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`} />
                    ))}
                </div>
            </>
          )}
          
          {product.videoUrl && (
             <button 
               onClick={() => setShowVideo(!showVideo)}
               className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 z-10"
             >
                <Icon icon={showVideo ? "solar:gallery-bold" : "solar:play-circle-bold"} />
                {showVideo ? "Фото" : "Видео"}
             </button>
          )}

          {product.isNew && !showVideo && (
             <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
               NEW
             </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
            <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fade-in touch-none" onClick={() => setIsLightboxOpen(false)}>
                <img src={product.images[currentImageIndex]} className="max-w-full max-h-full object-contain" />
                <button className="absolute top-6 right-6 text-white p-2"><Icon icon="solar:close-circle-bold" className="size-10" /></button>
                <div className="absolute bottom-10 text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">
                    {currentImageIndex + 1} / {product.images.length}
                </div>
            </div>
        )}

        {/* Product Info */}
        <div className="px-5 py-6">
          <div className="flex items-start justify-between mb-2">
             <div className="flex-1 pr-4">
                <h1 className="text-2xl font-bold font-heading text-slate-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                   <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase tracking-wide">{product.subCategory || product.category}</span>
                   <span>•</span>
                   <span>{product.supplierId ? 'Partner Store' : 'Grand Market'}</span>
                </div>
             </div>
          </div>
          
          {/* Price & Urgency */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-primary">{product.price} с.</span>
                {product.oldPrice && (
                    <span className="text-lg text-slate-400 line-through decoration-red-400 decoration-2">{product.oldPrice} с.</span>
                )}
            </div>
            {/* Live Stats */}
            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold animate-pulse">
                <Icon icon="solar:eye-bold" className="size-4" />
                <span>Сейчас смотрят: {viewersCount} чел.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-orange-400">
               {[...Array(5)].map((_, i) => (
                  <Icon key={i} icon={i < Math.floor(product.rating) ? "solar:star-bold" : "solar:star-linear"} className="size-5" />
               ))}
            </div>
            <span className="text-base font-bold text-slate-900">{product.rating}</span>
            <span className="text-sm text-slate-400 underline decoration-dotted underline-offset-4">
               {displayReviews.length} {t.reviews}
            </span>
          </div>

          {/* Bundle Offer */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
             <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Выгодный комплект</div>
                <div className="text-sm font-bold text-slate-800 leading-tight">Купите с джинсами и получите скидку <span className="text-red-500">15%</span></div>
             </div>
             <Icon icon="solar:gift-bold-duotone" className="size-8 text-blue-500" />
          </div>

          <div className="mb-8">
             {/* Colors */}
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

             {/* Size */}
             <div className="mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                   <h3 className="text-sm font-bold text-slate-900">{t.size}</h3>
                   <button 
                     onClick={() => setIsFitFinderOpen(true)}
                     className="text-xs font-bold text-primary flex items-center gap-1"
                   >
                      <Icon icon="solar:ruler-pen-bold" />
                      Fit Finder
                   </button>
                </div>
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

             {/* Quantity */}
             <div className="mb-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
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
          </div>
          
          {/* Description */}
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
          
          {/* Info Accordions (Delivery & Returns) */}
          <div className="space-y-3 mb-8">
              {/* Delivery */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button onClick={() => toggleAccordion('delivery')} className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3 font-bold text-sm text-slate-800">
                           <Icon icon="solar:delivery-bold" className="text-blue-600 size-5" />
                           Доставка
                      </div>
                      <Icon icon="solar:alt-arrow-down-linear" className={`text-slate-400 transition-transform ${activeAccordion === 'delivery' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'delivery' && (
                      <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                          <p>🚚 <strong>Бесплатно</strong> завтра в центр города.</p>
                          <p className="mt-1">⚡️ Экспресс-доставка за 2 часа: 20 с.</p>
                      </div>
                  )}
              </div>
              {/* Returns */}
               <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button onClick={() => toggleAccordion('returns')} className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3 font-bold text-sm text-slate-800">
                           <Icon icon="solar:restart-bold" className="text-green-600 size-5" />
                           Возврат
                      </div>
                      <Icon icon="solar:alt-arrow-down-linear" className={`text-slate-400 transition-transform ${activeAccordion === 'returns' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'returns' && (
                      <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                          <p>↩️ 30 дней на примерку и возврат.</p>
                          <p className="mt-1">Деньги вернутся на карту мгновенно после проверки товара.</p>
                      </div>
                  )}
              </div>
          </div>

          {/* Reviews Section */}
          <div className="mb-8 border-t border-slate-100 pt-6">
             <button 
               onClick={() => setIsReviewsOpen(!isReviewsOpen)}
               className="flex items-center justify-between w-full mb-4"
             >
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                    <Icon icon="solar:star-bold" className="size-5" />
                  </div>
                  {t.reviews} <span className="text-slate-400 text-sm font-normal">({displayReviews.length})</span>
               </h3>
               <Icon 
                 icon="solar:alt-arrow-down-linear" 
                 className={`text-slate-400 transition-transform ${isReviewsOpen ? 'rotate-180' : ''}`} 
               />
             </button>
             
             {isReviewsOpen && (
                 <div className="space-y-4 animate-fade-in">
                   {/* Review Photos Strip */}
                   {allReviewPhotos.length > 0 && (
                      <div className="mb-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 px-1">Фото покупателей</h4>
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                              {allReviewPhotos.map((photo, i) => (
                                  <div key={i} className="size-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                     <img src={photo} className="w-full h-full object-cover" alt="review" />
                                  </div>
                              ))}
                          </div>
                      </div>
                   )}

                   {visibleReviews.map((review) => (
                      <div key={review.id} className="bg-slate-50 p-4 rounded-2xl animate-fade-in">
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
                         <p className="text-sm text-slate-600 leading-snug pl-[44px] mb-2">{review.comment}</p>
                      </div>
                   ))}
                   
                   {displayReviews.length > 2 && (
                      <button 
                         onClick={() => setAreReviewsExpanded(!areReviewsExpanded)}
                         className="w-full py-3 text-primary text-sm font-bold hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                         <span>{areReviewsExpanded ? 'Свернуть отзывы' : `Показать все отзывы (${displayReviews.length})`}</span>
                         <Icon icon="solar:alt-arrow-down-linear" className={`transition-transform ${areReviewsExpanded ? 'rotate-180' : ''}`} />
                      </button>
                   )}
                 </div>
             )}
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
             <div className="mb-6 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <Icon icon="solar:layers-bold" className="size-5" />
                      </div>
                      {t.similar}
                   </h3>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-1">
                   {similarProducts.map(p => (
                      <div key={p.id} className="min-w-[160px] w-[160px]">
                         <ProductCard 
                            product={p} 
                            onClick={onProductClick} 
                            onAddToCart={onAddToCart}
                            isFullWidth
                            isFavorite={false} 
                         />
                      </div>
                   ))}
                </div>
             </div>
          )}

        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] flex items-center gap-4">
         <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Итого</span>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{product.price * qty} с.</span>
                {product.oldPrice && <span className="text-xs line-through text-slate-400">{product.oldPrice * qty} с.</span>}
            </div>
         </div>
         
         {(product.stock === 0) ? (
            <button 
               onClick={handleNotify}
               disabled={isNotifySet}
               className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${isNotifySet ? 'bg-green-600 text-white' : 'bg-slate-800 text-white'}`}
            >
               <Icon icon={isNotifySet ? "solar:check-circle-bold" : "solar:bell-bold"} />
               {isNotifySet ? "Вы в очереди" : "Уведомить"}
            </button>
         ) : (
            <button 
              onClick={() => onAddToCart(product, selectedSize, selectedColor, qty)}
              className="flex-1 bg-slate-900 text-white h-12 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Icon icon="solar:bag-plus-bold" className="size-5" />
              {t.addToCart}
            </button>
         )}
      </div>
    </div>
  );
};
