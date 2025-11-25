import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  products: Product[];
  onAddToCart: (p: Product) => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ 
  isOpen, 
  onClose, 
  imageFile, 
  products, 
  onAddToCart 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      setIsLoading(true);

      // Simulate AI Analysis
      setTimeout(() => {
        // Pick random "similar" products
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setResults(shuffled.slice(0, 4));
        setIsLoading(false);
      }, 2500);

      return () => URL.revokeObjectURL(url);
    }
  }, [isOpen, imageFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/20 p-2 rounded-full hover:bg-black/30 text-white">
           <Icon icon="solar:close-circle-bold" className="size-6" />
        </button>

        <div className="p-6 pb-0">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon icon="solar:camera-minimalistic-bold" className="text-primary" />
              Поиск по фото
           </h2>
           
           {/* Image Preview */}
           <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 relative mb-6 border border-slate-200">
              {previewUrl && <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />}
              {isLoading && (
                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                    <Icon icon="svg-spinners:ring-resize" className="size-10 mb-2" />
                    <span className="font-bold text-sm">Анализ изображения...</span>
                 </div>
              )}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0 bg-slate-50 rounded-t-3xl border-t border-slate-100">
           <h3 className="font-bold text-slate-900 my-4 flex items-center justify-between">
              Похожие товары
              <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">AI Match</span>
           </h3>
           
           {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded-xl h-48 animate-pulse"></div>
                 ))}
              </div>
           ) : (
              <div className="grid grid-cols-2 gap-4">
                 {results.map(p => (
                    <ProductCard 
                       key={p.id} 
                       product={p} 
                       onClick={() => {}} 
                       onAddToCart={onAddToCart} 
                       isFullWidth 
                    />
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};