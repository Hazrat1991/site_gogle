
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate focus on next input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-fade-in">
      {/* Decorative Header */}
      <div className="h-1/3 bg-slate-900 relative overflow-hidden rounded-b-[40px] shadow-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
           <span className="text-3xl font-extrabold text-white tracking-tighter">
             GRAND<span className="text-primary">MARKET</span>
           </span>
           <p className="text-slate-300 text-sm mt-2">Вход в аккаунт</p>
        </div>
      </div>

      <div className="flex-1 px-8 pt-12">
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Номер телефона</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus-within:border-primary transition-colors">
                <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/320px-Flag_of_Tajikistan.svg.png" className="w-6 h-auto rounded-sm shadow-sm" />
                   <span className="font-bold text-slate-700">+992</span>
                </div>
                <input 
                  type="tel" 
                  placeholder="900 00 00 00" 
                  className="bg-transparent outline-none font-bold text-lg text-slate-900 w-full"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={phone.length < 9 || isLoading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Отправка...' : 'Получить код'}
              {!isLoading && <Icon icon="solar:arrow-right-bold" />}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Нажимая кнопку, вы соглашаетесь с условиями использования сервиса.
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-8 animate-fade-in">
            <div className="text-center">
               <h3 className="font-bold text-xl text-slate-800">Введите код из SMS</h3>
               <p className="text-sm text-slate-500 mt-1">Мы отправили код на +992 {phone}</p>
            </div>

            <div className="flex justify-center gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="number"
                  maxLength={1}
                  className="w-14 h-16 rounded-2xl border-2 border-slate-200 text-center text-2xl font-bold outline-none focus:border-primary focus:bg-primary/5 transition-all"
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                />
              ))}
            </div>

            <button 
              type="submit" 
              disabled={otp.some(d => !d) || isLoading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>

            <div className="text-center">
               <button 
                 type="button"
                 onClick={() => setStep('phone')}
                 className="text-sm font-bold text-slate-400 hover:text-slate-600"
               >
                 Изменить номер
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
