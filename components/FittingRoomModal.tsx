
import React, { useState } from 'react';
import { Icon } from "@iconify/react";

interface FittingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string, time: string) => void;
  itemCount: number;
}

export const FittingRoomModal: React.FC<FittingRoomModalProps> = ({ isOpen, onClose, onSubmit, itemCount }) => {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (!isOpen) return null;

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
  ];

  const handleSubmit = () => {
    if (!date || !selectedTime) {
      alert('Пожалуйста, выберите дату и время');
      return;
    }
    onSubmit(date, selectedTime);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative animate-fade-in shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <Icon icon="solar:close-circle-bold" className="size-6" />
        </button>

        <div className="text-center mb-6">
           <div className="size-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon icon="solar:hanger-2-bold" className="size-7" />
           </div>
           <h3 className="text-xl font-bold font-heading">VIP Примерочная</h3>
           <p className="text-sm text-slate-500 px-4">Мы подготовим и отпарим {itemCount} вещей к вашему приходу.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Выберите дату</label>
            <input 
              type="date" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Выберите время</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedTime === time 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-600/30 active:scale-95 transition-transform mt-4 flex items-center justify-center gap-2"
          >
            <Icon icon="solar:calendar-check-bold" className="size-5" />
            Забронировать
          </button>
        </div>
      </div>
    </div>
  );
};
