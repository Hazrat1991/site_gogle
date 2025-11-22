
import React, { useEffect } from 'react';
import { Icon } from "@iconify/react";

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  messages: ToastMessage[];
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ messages, removeToast }) => {
  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onClose={() => removeToast(msg.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ message: ToastMessage; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = message.type === 'success' ? 'bg-green-500' : message.type === 'error' ? 'bg-red-500' : 'bg-slate-800';
  const icon = message.type === 'success' ? 'solar:check-circle-bold' : message.type === 'error' ? 'solar:danger-circle-bold' : 'solar:info-circle-bold';

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white min-w-[280px] animate-fade-in ${bg}`}>
      <Icon icon={icon} className="size-5 shrink-0" />
      <span className="text-sm font-bold">{message.text}</span>
    </div>
  );
};
