
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { EmployeeExtended, Shift, StaffFinancialRecord } from '../types';

interface EmployeePortalProps {
  onBack: () => void;
  employees: EmployeeExtended[];
  shifts: Shift[];
  onClockIn: (employeeId: string, location: string) => void;
  onClockOut: (employeeId: string) => void;
  financialRecords: StaffFinancialRecord[];
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  onBack, employees, shifts, onClockIn, onClockOut, financialRecords
}) => {
  const [currentUser, setCurrentUser] = useState<EmployeeExtended | null>(null);
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');

  // Find active shift for current user
  const activeShift = currentUser ? shifts.find(s => s.employeeId === currentUser.id && s.status === 'active') : null;
  const myShifts = currentUser ? shifts.filter(s => s.employeeId === currentUser.id) : [];
  const myFinances = currentUser ? financialRecords.filter(f => f.employeeId === currentUser.id) : [];

  const handleLogin = (e: React.FormEvent) => {
     e.preventDefault();
     const found = employees.find(emp => emp.loginCode === loginCode);
     if (found) {
        setCurrentUser(found);
        setError('');
        setLoginCode('');
     } else {
        setError('Неверный код доступа');
     }
  };

  if (!currentUser) {
     return (
        <div className="h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white animate-fade-in">
           <div className="w-full max-w-sm bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
              <div className="text-center mb-8">
                 <div className="size-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/40">
                    <Icon icon="solar:user-id-bold" className="size-10 text-white" />
                 </div>
                 <h1 className="text-2xl font-bold">Сотрудник</h1>
                 <p className="text-slate-400 text-sm">Вход в личный кабинет</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                 <input 
                    type="password" 
                    placeholder="Введите ваш код (4 цифры)" 
                    className="w-full text-center text-2xl tracking-[1em] font-mono p-4 bg-slate-900 border border-slate-600 rounded-xl focus:border-primary outline-none transition-colors"
                    maxLength={4}
                    value={loginCode}
                    onChange={e => setLoginCode(e.target.value)}
                 />
                 {error && <div className="text-red-500 text-center text-sm font-bold bg-red-900/20 p-2 rounded-lg">{error}</div>}
                 <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 active:scale-95 transition-all">
                    Войти
                 </button>
              </form>
              <button onClick={onBack} className="w-full mt-4 text-slate-500 text-sm hover:text-white transition-colors">
                 Вернуться в магазин
              </button>
           </div>
        </div>
     );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
       {/* Header */}
       <header className="bg-white p-4 shadow-sm z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={currentUser.avatar} alt="Avatar" className="size-12 rounded-full border-2 border-slate-100 object-cover" />
             <div>
                <h2 className="font-bold text-slate-800 leading-tight">{currentUser.fullName}</h2>
                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded w-fit capitalize">{currentUser.role}</div>
             </div>
          </div>
          <button onClick={() => setCurrentUser(null)} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100">
             <Icon icon="solar:logout-bold-duotone" className="size-6" />
          </button>
       </header>

       <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {/* Main Action Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-full h-1 ${activeShift ? 'bg-green-500' : 'bg-slate-200'}`} />
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Текущий статус</h3>
             
             {activeShift ? (
                <div className="animate-fade-in">
                   <div className="text-4xl font-black text-slate-800 mb-2">{activeShift.startTime}</div>
                   <div className="text-green-600 font-bold mb-6 flex items-center justify-center gap-2">
                      <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                      Вы на смене
                   </div>
                   <button 
                      onClick={() => onClockOut(currentUser.id)}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                   >
                      Я ушёл (Завершить)
                   </button>
                </div>
             ) : (
                <div className="animate-fade-in">
                   <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Icon icon="solar:sleeping-bold" className="size-10" />
                   </div>
                   <p className="text-slate-500 mb-6">Смена не начата</p>
                   <button 
                      onClick={() => onClockIn(currentUser.id, 'Main Store')}
                      className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-600/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                   >
                      <Icon icon="solar:play-circle-bold" className="size-6" />
                      Я пришёл (Начать)
                   </button>
                </div>
             )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Отработано</div>
                <div className="text-2xl font-bold text-slate-800">{currentUser.hoursWorkedMonth} <span className="text-sm text-slate-400">часов</span></div>
             </div>
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase mb-1">Смен</div>
                <div className="text-2xl font-bold text-slate-800">{currentUser.shiftsCountMonth}</div>
             </div>
          </div>

          {/* Finances Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <Icon icon="solar:wallet-money-bold" className="absolute -right-4 -bottom-4 size-32 text-white/5" />
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Финансы (Месяц)</h3>
             
             <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-sm text-slate-300">Начислено</span>
                   <span className="text-xl font-bold text-green-400">+{currentUser.earnedMonth} с.</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-sm text-slate-300">Авансы</span>
                   <span className="text-xl font-bold text-orange-400">-{currentUser.totalAdvances} с.</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-sm text-slate-300">Долг</span>
                   <span className="text-xl font-bold text-red-400">-{currentUser.totalDebt} с.</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                   <span className="font-bold">Итого к выплате:</span>
                   <span className="text-2xl font-extrabold bg-white/10 px-3 py-1 rounded-lg">
                      {Math.max(0, currentUser.earnedMonth - currentUser.totalAdvances - currentUser.totalDebt)} с.
                   </span>
                </div>
             </div>
          </div>

          {/* Recent History */}
          <div className="space-y-3">
             <h3 className="font-bold text-slate-800 px-2">История действий</h3>
             {myShifts.slice(0, 3).map(s => (
                <div key={s.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                   <div>
                      <div className="font-bold text-sm text-slate-800">{s.date}</div>
                      <div className="text-xs text-slate-500">
                         {s.startTime} - {s.endTime || '...'}
                      </div>
                   </div>
                   <div className="text-right">
                      {s.earned > 0 && <div className="font-bold text-green-600">+{s.earned} с.</div>}
                      <div className="text-xs text-slate-400">{s.durationHours} ч.</div>
                   </div>
                </div>
             ))}
             {myFinances.slice(0, 2).map(f => (
                <div key={f.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                   <div>
                      <div className="font-bold text-sm text-slate-800">{f.comment || 'Финансы'}</div>
                      <div className="text-xs text-slate-500">{f.date}</div>
                   </div>
                   <div className={`font-bold ${f.type === 'advance' ? 'text-orange-500' : 'text-red-500'}`}>
                      {f.amount} с.
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};
