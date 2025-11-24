
import React, { useState, useMemo } from 'react';
import { Icon } from "@iconify/react";
import { EmployeeExtended, Shift, StaffFinancialRecord, SalaryReport } from '../../types';

interface EmployeeManagerProps {
  employees: EmployeeExtended[];
  setEmployees: (data: EmployeeExtended[]) => void;
  shifts: Shift[];
  setShifts: (data: Shift[]) => void;
  financialRecords: StaffFinancialRecord[];
  setFinancialRecords: (data: StaffFinancialRecord[]) => void;
}

export const EmployeeManager: React.FC<EmployeeManagerProps> = ({
  employees, setEmployees, shifts, setShifts, financialRecords, setFinancialRecords
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'add' | 'schedule' | 'finance' | 'payroll'>('all');
  
  // --- SUB COMPONENTS ---

  const AllEmployeesTab = () => (
    <div className="animate-fade-in space-y-4">
       <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Все сотрудники ({employees.length})</h3>
          <button 
            onClick={() => setActiveTab('add')}
            className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:bg-primary/90"
          >
            <Icon icon="solar:user-plus-bold" />
            Добавить
          </button>
       </div>
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Сотрудник</th>
                <th className="p-4">Должность</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Телефон</th>
                <th className="p-4">Баланс</th>
                <th className="p-4">ЗП (мес)</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50">
                   <td className="p-4 flex items-center gap-3">
                      <img src={emp.avatar || 'https://via.placeholder.com/40'} className="size-10 rounded-full object-cover bg-slate-200" alt={emp.fullName} />
                      <div>
                        <div className="font-bold text-slate-800">{emp.fullName}</div>
                        <div className="text-xs text-slate-400">ID: {emp.id}</div>
                      </div>
                   </td>
                   <td className="p-4 capitalize">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{emp.role}</span>
                   </td>
                   <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                        emp.status === 'working' ? 'bg-green-100 text-green-700' : 
                        emp.status === 'off' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'
                      }`}>
                        <div className={`size-1.5 rounded-full ${emp.status === 'working' ? 'bg-green-600' : 'bg-slate-500'}`} />
                        {emp.status === 'working' ? 'На смене' : emp.status === 'off' ? 'Выходной' : 'Уволен'}
                      </span>
                   </td>
                   <td className="p-4 text-slate-600">{emp.phone}</td>
                   <td className="p-4">
                      <div className="text-xs">
                        <span className="text-red-500 block">Долг: {emp.totalDebt} с.</span>
                        <span className="text-orange-500 block">Аванс: {emp.totalAdvances} с.</span>
                      </div>
                   </td>
                   <td className="p-4 font-bold text-green-600">
                      {emp.earnedMonth} с.
                      <div className="text-xs text-slate-400 font-normal">{emp.hoursWorkedMonth} ч.</div>
                   </td>
                   <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600">
                         <Icon icon="solar:pen-bold" className="size-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Удалить сотрудника?')) {
                             setEmployees(employees.filter(e => e.id !== emp.id));
                          }
                        }} 
                        className="p-2 bg-red-50 rounded-lg hover:bg-red-100 text-red-600"
                      >
                         <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                      </button>
                   </td>
                </tr>
              ))}
            </tbody>
         </table>
       </div>
    </div>
  );

  const AddEmployeeTab = () => {
     const [form, setForm] = useState({
        fullName: '',
        phone: '',
        role: 'seller',
        hourlyRate: '',
        loginCode: '',
        avatar: ''
     });

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEmp: EmployeeExtended = {
           id: `emp-${Date.now()}`,
           fullName: form.fullName,
           phone: form.phone,
           role: form.role,
           status: 'off',
           hireDate: new Date().toISOString().split('T')[0],
           avatar: form.avatar || 'https://via.placeholder.com/100',
           hourlyRate: Number(form.hourlyRate) || 0,
           loginCode: form.loginCode,
           totalDebt: 0,
           totalAdvances: 0,
           hoursWorkedMonth: 0,
           shiftsCountMonth: 0,
           earnedMonth: 0,
           history: []
        };
        setEmployees([...employees, newEmp]);
        alert('Сотрудник добавлен!');
        setActiveTab('all');
     };

     return (
       <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <h3 className="text-xl font-bold mb-6">Добавить сотрудника</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">ФИО</label>
                   <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Телефон</label>
                   <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Должность</label>
                   <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                      <option value="seller">Продавец</option>
                      <option value="manager">Менеджер</option>
                      <option value="courier">Курьер</option>
                      <option value="driver">Водитель</option>
                      <option value="loader">Грузчик</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Ставка (в час)</label>
                   <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})} />
                </div>
             </div>
             <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Код доступа (для входа)</label>
                 <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={form.loginCode} onChange={e => setForm({...form, loginCode: e.target.value})} placeholder="4 цифры" />
             </div>
             <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Ссылка на фото</label>
                 <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={form.avatar} onChange={e => setForm({...form, avatar: e.target.value})} />
             </div>
             <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg mt-4">Сохранить</button>
          </form>
       </div>
     );
  };

  const ScheduleTab = () => (
    <div className="animate-fade-in space-y-4">
       <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">График / Смены</h3>
          <div className="flex gap-2">
             <input type="date" className="p-2 border rounded-lg text-sm" />
             <button className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-bold">Экспорт</button>
          </div>
       </div>
       <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-slate-50 text-slate-500">
               <tr>
                 <th className="p-4">Сотрудник</th>
                 <th className="p-4">Дата</th>
                 <th className="p-4">Приход</th>
                 <th className="p-4">Уход</th>
                 <th className="p-4">Часы</th>
                 <th className="p-4">Заработок</th>
                 <th className="p-4">Статус</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {shifts.map(shift => (
                 <tr key={shift.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold">{shift.employeeName}</td>
                    <td className="p-4 text-slate-600">{shift.date}</td>
                    <td className="p-4 text-green-600 font-medium">{shift.startTime}</td>
                    <td className="p-4 text-red-600 font-medium">{shift.endTime || '-'}</td>
                    <td className="p-4">{shift.durationHours > 0 ? shift.durationHours + ' ч' : '-'}</td>
                    <td className="p-4 font-bold">{shift.earned > 0 ? shift.earned + ' с.' : '-'}</td>
                    <td className="p-4">
                       <span className={`px-2 py-1 rounded text-xs font-bold ${shift.status === 'active' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                          {shift.status === 'active' ? 'На смене' : 'Завершен'}
                       </span>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
       </div>
    </div>
  );

  const FinanceTab = () => {
     const [modalOpen, setModalOpen] = useState(false);
     const [newRecord, setNewRecord] = useState<Partial<StaffFinancialRecord>>({ type: 'advance' });

     const handleAddRecord = () => {
        if (!newRecord.employeeId || !newRecord.amount) return;
        const emp = employees.find(e => e.id === newRecord.employeeId);
        const record: StaffFinancialRecord = {
           id: `fin-${Date.now()}`,
           employeeId: newRecord.employeeId,
           employeeName: emp?.fullName || 'Unknown',
           type: newRecord.type as any,
           amount: Number(newRecord.amount),
           date: new Date().toISOString().split('T')[0],
           comment: newRecord.comment || '',
           issuer: 'Admin',
           isPaid: newRecord.type === 'debt' ? false : undefined
        };
        
        setFinancialRecords([record, ...financialRecords]);

        // Update employee stats
        const updatedEmployees = employees.map(e => {
           if (e.id === record.employeeId) {
              if (record.type === 'advance') return { ...e, totalAdvances: e.totalAdvances + record.amount };
              if (record.type === 'debt') return { ...e, totalDebt: e.totalDebt + record.amount };
           }
           return e;
        });
        setEmployees(updatedEmployees);
        setModalOpen(false);
     };

     return (
        <div className="animate-fade-in space-y-4">
           {modalOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
                    <h3 className="font-bold text-lg mb-4">Добавить запись</h3>
                    <div className="space-y-3">
                       <select className="w-full p-2 border rounded-lg" onChange={e => setNewRecord({...newRecord, employeeId: e.target.value})}>
                          <option value="">Выберите сотрудника</option>
                          {employees.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
                       </select>
                       <select className="w-full p-2 border rounded-lg" onChange={e => setNewRecord({...newRecord, type: e.target.value as any})}>
                          <option value="advance">Аванс (выдать деньги)</option>
                          <option value="debt">Долг (товар/штраф)</option>
                       </select>
                       <input type="number" placeholder="Сумма" className="w-full p-2 border rounded-lg" onChange={e => setNewRecord({...newRecord, amount: Number(e.target.value)})} />
                       <input type="text" placeholder="Комментарий" className="w-full p-2 border rounded-lg" onChange={e => setNewRecord({...newRecord, comment: e.target.value})} />
                       <div className="flex gap-2 pt-2">
                          <button onClick={() => setModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded-lg font-bold">Отмена</button>
                          <button onClick={handleAddRecord} className="flex-1 py-2 bg-primary text-white rounded-lg font-bold">Сохранить</button>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Авансы и Долги</h3>
              <button onClick={() => setModalOpen(true)} className="bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                 <Icon icon="solar:wallet-money-bold" />
                 Добавить запись
              </button>
           </div>
           
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
             <table className="w-full text-left text-sm min-w-[800px]">
                <thead className="bg-slate-50 text-slate-500">
                   <tr>
                     <th className="p-4">Дата</th>
                     <th className="p-4">Сотрудник</th>
                     <th className="p-4">Тип</th>
                     <th className="p-4">Сумма</th>
                     <th className="p-4">Комментарий</th>
                     <th className="p-4">Выдал</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {financialRecords.map(rec => (
                     <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-4 text-slate-500">{rec.date}</td>
                        <td className="p-4 font-bold">{rec.employeeName}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${rec.type === 'advance' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                              {rec.type === 'advance' ? 'Аванс' : rec.type === 'debt' ? 'Долг' : rec.type}
                           </span>
                        </td>
                        <td className="p-4 font-bold">{rec.amount} с.</td>
                        <td className="p-4 text-slate-600">{rec.comment}</td>
                        <td className="p-4 text-xs text-slate-400">{rec.issuer}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
     );
  };

  const PayrollTab = () => {
    // Basic calculation simulation
    const payrollData = useMemo(() => {
        return employees.map(emp => {
            const final = (emp.earnedMonth || 0) - (emp.totalAdvances || 0) - (emp.totalDebt || 0);
            return {
                ...emp,
                finalPayout: final > 0 ? final : 0
            };
        });
    }, [employees]);

    return (
        <div className="animate-fade-in space-y-4">
           <h3 className="text-xl font-bold mb-4">Зарплатная ведомость (Текущий месяц)</h3>
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
             <table className="w-full text-left text-sm min-w-[900px]">
                <thead className="bg-slate-50 text-slate-500">
                   <tr>
                     <th className="p-4">Сотрудник</th>
                     <th className="p-4">Ставка</th>
                     <th className="p-4">Отработано</th>
                     <th className="p-4">Начислено</th>
                     <th className="p-4 text-orange-600">Авансы</th>
                     <th className="p-4 text-red-600">Долги/Штрафы</th>
                     <th className="p-4 font-bold text-green-700">К ВЫПЛАТЕ</th>
                     <th className="p-4">Действия</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {payrollData.map(p => (
                     <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{p.fullName}</td>
                        <td className="p-4 text-slate-600">{p.hourlyRate} с/час</td>
                        <td className="p-4">
                            <div>{p.hoursWorkedMonth} ч.</div>
                            <div className="text-xs text-slate-400">{p.shiftsCountMonth} смен</div>
                        </td>
                        <td className="p-4 font-bold">{p.earnedMonth} с.</td>
                        <td className="p-4 text-orange-600">-{p.totalAdvances} с.</td>
                        <td className="p-4 text-red-600">-{p.totalDebt} с.</td>
                        <td className="p-4 font-extrabold text-green-700 text-lg">{p.finalPayout} с.</td>
                        <td className="p-4">
                           <button className="px-3 py-1 bg-green-600 text-white rounded-lg font-bold text-xs shadow-sm hover:bg-green-700">
                              Выплатить
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
       {/* Module Header Tabs */}
       <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
          {[
            { id: 'all', label: 'Все сотрудники' },
            { id: 'add', label: 'Добавить' },
            { id: 'schedule', label: 'График работы' },
            { id: 'finance', label: 'Авансы и Долги' },
            { id: 'payroll', label: 'Зарплаты' }
          ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-slate-800 text-white shadow-lg' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
               }`}
            >
               {tab.label}
            </button>
          ))}
       </div>

       {/* Content Area */}
       <div>
          {activeTab === 'all' && <AllEmployeesTab />}
          {activeTab === 'add' && <AddEmployeeTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'finance' && <FinanceTab />}
          {activeTab === 'payroll' && <PayrollTab />}
       </div>
    </div>
  );
};
