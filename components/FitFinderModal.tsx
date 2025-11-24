
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

interface FitFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCategory: string;
}

export const FitFinderModal: React.FC<FitFinderModalProps> = ({ isOpen, onClose, productCategory }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ height: '', weight: '', fit: 'regular' });
  const [result, setResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculateSize = () => {
    // Mock logic for demo
    const h = Number(data.height);
    const w = Number(data.weight);
    
    let size = 'M';
    if (w < 60) size = 'S';
    if (w > 80) size = 'L';
    if (w > 95) size = 'XL';
    if (h > 185) size = 'XL';

    setResult(size);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <Icon icon="solar:close-circle-bold" className="size-6" />
        </button>

        <div className="text-center mb-6">
           <div className="size-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon icon="solar:ruler-pen-bold" className="size-6" />
           </div>
           <h3 className="text-xl font-bold">Fit Finder</h3>
           <p className="text-sm text-slate-500">Узнайте свой идеальный размер</p>
        </div>

        {step === 1 && (
           <div className="space-y-4">
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Ваш рост (см)</label>
                 <input type="number" value={data.height} onChange={e => setData({...data, height: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="175" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1">Ваш вес (кг)</label>
                 <input type="number" value={data.weight} onChange={e => setData({...data, weight: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="70" />
              </div>
              <button onClick={() => setStep(2)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold mt-2">Далее</button>
           </div>
        )}

        {step === 2 && (
           <div className="space-y-4">
              <div className="text-sm font-bold text-slate-700 mb-2">Как вы любите носить?</div>
              <div className="grid grid-cols-3 gap-2">
                 {['tight', 'regular', 'loose'].map(fit => (
                    <button 
                       key={fit}
                       onClick={() => setData({...data, fit})}
                       className={`p-3 border rounded-xl text-xs font-bold capitalize ${data.fit === fit ? 'border-primary bg-orange-50 text-primary' : 'border-slate-200'}`}
                    >
                       {fit}
                    </button>
                 ))}
              </div>
              <button onClick={calculateSize} className="w-full py-3 bg-primary text-white rounded-xl font-bold mt-4">Рассчитать</button>
           </div>
        )}

        {step === 3 && (
           <div className="text-center py-4">
              <div className="text-lg font-medium text-slate-600 mb-2">Ваш рекомендованный размер:</div>
              <div className="text-5xl font-black text-slate-800 mb-4">{result}</div>
              <div className="text-xs text-slate-400 mb-4">На основе данных похожих покупателей</div>
              <button onClick={onClose} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">Отлично, спасибо</button>
           </div>
        )}
      </div>
    </div>
  );
};
