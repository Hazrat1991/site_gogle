import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

interface DailySpinProps {
  onWin: (prize: string) => void;
}

export const DailySpin: React.FC<DailySpinProps> = ({ onWin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    const lastSpin = localStorage.getItem('grand_last_spin');
    const today = new Date().toDateString();
    
    // Show if not spun today (Simulated: show every refresh for demo if needed, but logic below is correct)
    if (lastSpin !== today) {
       // Delay showing to not block initial load
       setTimeout(() => setIsOpen(true), 2000);
    }
  }, []);

  const prizes = [
    { label: '50 Б', color: '#F59E0B', value: '50 баллов' },
    { label: '5%', color: '#EC4899', value: 'Скидка 5%' },
    { label: 'FREE', color: '#3B82F6', value: 'Бесплатная доставка' },
    { label: '10 Б', color: '#10B981', value: '10 баллов' },
    { label: '20 Б', color: '#8B5CF6', value: '20 баллов' },
    { label: '😞', color: '#64748B', value: 'Попробуйте завтра' },
  ];

  const spin = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
    
    const randomSegment = Math.floor(Math.random() * prizes.length);
    const spins = 5; // Number of full rotations
    const segmentAngle = 360 / prizes.length;
    const stopAngle = spins * 360 + (randomSegment * segmentAngle) + (segmentAngle / 2); // Center of segment

    setRotation(stopAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      const prize = prizes[prizes.length - 1 - randomSegment]; // Calculate winner based on rotation
      localStorage.setItem('grand_last_spin', new Date().toDateString());
      
      // Wait a bit then close and award
      setTimeout(() => {
         setIsOpen(false);
         if (prize.label !== '😞') {
            onWin(prize.value);
         }
      }, 1500);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl flex flex-col items-center">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <Icon icon="solar:close-circle-bold" className="size-8" />
        </button>

        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2 text-center">
           КОЛЕСО УДАЧИ
        </h2>
        <p className="text-sm text-slate-500 mb-6 text-center">Испытай удачу и получи подарок!</p>

        {/* Wheel Container */}
        <div className="relative size-64 mb-8">
           {/* Pointer */}
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-slate-800 filter drop-shadow-lg">
              <Icon icon="solar:map-arrow-down-bold" className="size-10" />
           </div>

           {/* Wheel */}
           <div 
              className="size-full rounded-full border-4 border-white shadow-xl overflow-hidden relative transition-transform cubic-bezier(0.25, 0.1, 0.25, 1)"
              style={{ 
                 transform: `rotate(${rotation}deg)`,
                 transitionDuration: '4s'
              }}
           >
              {prizes.map((prize, i) => (
                 <div 
                    key={i}
                    className="absolute top-0 left-0 w-full h-full flex justify-center pt-4"
                    style={{ 
                       transform: `rotate(${i * (360 / prizes.length)}deg)`,
                       background: `conic-gradient(from -30deg at 50% 50%, ${prize.color} 0deg, ${prize.color} 60deg, transparent 60deg)`
                    }}
                 >
                    {/* This is a hacky CSS way to make segments. In real production, SVG is better. 
                        For this specific UI without SVG paths, we'll use a simplified visual or just colored blocks.
                        Let's use a simpler CSS Conic Gradient for the background and absolute text.
                    */}
                 </div>
              ))}
              
              {/* Better Wheel Implementation with Conic Gradient */}
              <div 
                 className="absolute inset-0 rounded-full"
                 style={{
                    background: `conic-gradient(
                       ${prizes[0].color} 0deg 60deg,
                       ${prizes[1].color} 60deg 120deg,
                       ${prizes[2].color} 120deg 180deg,
                       ${prizes[3].color} 180deg 240deg,
                       ${prizes[4].color} 240deg 300deg,
                       ${prizes[5].color} 300deg 360deg
                    )`
                 }}
              ></div>

              {/* Labels */}
              {prizes.map((prize, i) => (
                 <div 
                    key={i}
                    className="absolute top-0 left-1/2 h-1/2 -ml-[1px] w-[2px] flex flex-col items-center pt-2 origin-bottom"
                    style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                 >
                    <span className="text-white font-bold text-sm drop-shadow-md -rotate-90 mt-4 whitespace-nowrap">
                       {prize.label}
                    </span>
                 </div>
              ))}
           </div>
           
           {/* Center Cap */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-white rounded-full shadow-md flex items-center justify-center font-bold text-slate-300 border-4 border-slate-100">
              GM
           </div>
        </div>

        <button 
           onClick={spin}
           disabled={isSpinning || hasSpun}
           className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-orange-500/30 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
        >
           {isSpinning ? 'Удачи!...' : hasSpun ? 'Готово!' : 'КРУТИТЬ!'}
        </button>
      </div>
    </div>
  );
};