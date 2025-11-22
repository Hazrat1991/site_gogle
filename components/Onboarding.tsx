
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Добро пожаловать в Grand Market",
      desc: "Лучший магазин модной одежды с доставкой по всему Душанбе.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      icon: "solar:shop-bold-duotone"
    },
    {
      id: 2,
      title: "Примерка перед покупкой",
      desc: "Заказывайте несколько размеров. Платите только за то, что подошло.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      icon: "solar:t-shirt-bold-duotone"
    },
    {
      id: 3,
      title: "Бонусы и Кэшбек",
      desc: "Получайте баллы за каждую покупку и оплачивайте ими до 30% заказа.",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      icon: "solar:gift-bold-duotone"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in">
      {/* Image Section */}
      <div className="h-[60%] relative bg-slate-100 overflow-hidden rounded-b-[40px] shadow-xl">
        <img 
          src={slides[step].image} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          alt="Onboarding"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 pb-12">
           <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
              <Icon icon={slides[step].icon} className="size-8 text-white" />
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center justify-between p-8 pt-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-heading text-slate-900 leading-tight">
            {slides[step].title}
          </h2>
          <p className="text-slate-500 leading-relaxed">
            {slides[step].desc}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>

        {/* Button */}
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          {step === slides.length - 1 ? 'Начать покупки' : 'Далее'}
          <Icon icon="solar:arrow-right-bold" />
        </button>
      </div>
    </div>
  );
};
