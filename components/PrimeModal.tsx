import React from 'react';
import { Icon } from "@iconify/react";

interface PrimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const PrimeModal: React.FC<PrimeModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  if (!isOpen) return null;

  const benefits = [
    { icon: 'solar:box-bold', title: 'Бесплатная доставка', desc: 'На все заказы, без минимальной суммы.' },
    { icon: 'solar:sale-bold', title: 'Закрытые распродажи', desc: 'Доступ к скидкам на 24 часа раньше.' },
    { icon: 'solar:wallet-money-bold', title: 'Повышенный кэшбек', desc: '10% баллами за каждую покупку.' },
    { icon: 'solar:chat-round-line-bold', title: 'Приоритетная поддержка', desc: 'Ответ оператора за 1 минуту.' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/10 p-2 rounded-full hover:bg-black/20 text-slate-800">
           <Icon icon="solar:close-circle-bold" className="size-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-black text-white p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest mb-4">
                 <Icon icon="solar:crown-bold" className="text-yellow-400" />
                 Premium
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Grand Prime</h2>
              <p className="text-slate-300 text-sm">Клуб привилегий для избранных</p>
           </div>
        </div>

        <div className="p-6">
           <div className="space-y-4 mb-8">
              {benefits.map((b, i) => (
                 <div key={i} className="flex items-start gap-4">
                    <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 text-primary">
                       <Icon icon={b.icon} className="size-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                    </div>
                 </div>
              ))}
           </div>

           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center mb-4">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Стоимость подписки</div>
              <div className="text-3xl font-black text-slate-900">19 с. <span className="text-sm text-slate-400 font-medium">/ месяц</span></div>
           </div>

           <button 
              onClick={() => { onSubscribe(); onClose(); }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
           >
              Попробовать бесплатно
              <Icon icon="solar:arrow-right-bold" />
           </button>
           <p className="text-center text-[10px] text-slate-400 mt-3">30 дней бесплатно, затем 19 с/мес. Отмена в любой момент.</p>
        </div>
      </div>
    </div>
  );
};