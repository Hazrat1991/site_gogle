
import React from 'react';
import { Icon } from "@iconify/react";

interface CategoryHeroProps {
  image: string;
  title: string;
  subtitle: string;
}

export const CategoryHero: React.FC<CategoryHeroProps> = ({ image, title, subtitle }) => (
  <div className="relative h-40 w-full overflow-hidden shrink-0">
    <img src={image} className="w-full h-full object-cover" alt={title} />
    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
      <h1 className="text-white font-heading font-bold text-2xl mb-1">{title}</h1>
      <p className="text-white/80 text-sm font-medium">{subtitle}</p>
    </div>
  </div>
);

export const SkeletonGrid: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 p-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="bg-slate-200 aspect-[3/4] rounded-xl animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
      </div>
    ))}
  </div>
);

interface InFeedBannerProps {
  type: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  onClick?: () => void;
}

export const InFeedBanner: React.FC<InFeedBannerProps> = ({ type, title, subtitle, image, color, onClick }) => {
  if (type === 'promo') {
    return (
      <div 
        onClick={onClick}
        className={`w-full p-4 rounded-xl ${color || 'bg-primary'} text-white flex items-center justify-between shadow-lg cursor-pointer my-2`}
      >
        <div>
           <div className="text-xs font-bold uppercase opacity-80 mb-1">Эксклюзив</div>
           <h3 className="font-bold text-lg leading-tight">{title}</h3>
           <p className="text-xs mt-1">{subtitle}</p>
        </div>
        <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
           <Icon icon="solar:ticket-sale-bold" className="size-6" />
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
       <div onClick={onClick} className="w-full h-64 rounded-xl overflow-hidden relative shadow-lg my-2 group cursor-pointer">
          <video src={image} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
             <div className="size-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-auto border border-white/30 self-center">
                <Icon icon="solar:play-bold" className="size-6 text-white" />
             </div>
             <h3 className="text-white font-bold text-lg">{title}</h3>
             <p className="text-white/80 text-xs">{subtitle}</p>
          </div>
       </div>
    );
  }

  // Collection / Lookbook
  return (
    <div onClick={onClick} className="w-full h-48 rounded-xl overflow-hidden relative shadow-lg my-2 cursor-pointer">
       <img src={image} className="w-full h-full object-cover" alt={title} />
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-xs flex items-center gap-1">
             {subtitle} <Icon icon="solar:arrow-right-linear" />
          </p>
       </div>
    </div>
  );
};
