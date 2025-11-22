import React, { useState, useRef, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { ChatMessage, AIRecommendation, Product } from '../types';
import { getProductRecommendations } from '../services/geminiService';

interface AIChatProps {
  allProducts: Product[];
  onRecommendations: (ids: number[]) => void;
  onResetFilter: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({ allProducts, onRecommendations, onResetFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'intro', 
      role: 'model', 
      text: "Привет! Я твой стилист Grand Market. Что ищем сегодня?" 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setLoading(true);

    try {
      const result: AIRecommendation = await getProductRecommendations(userText, allProducts);
      setMessages(prev => [...prev, { id: Date.now().toString() + 'ai', role: 'model', text: result.message }]);
      if (result.productIds.length > 0) onRecommendations(result.productIds);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString() + 'err', role: 'model', text: "Ошибка соединения." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 z-40 size-14 rounded-full shadow-xl flex items-center justify-center transition-all ${
          isOpen ? 'bg-muted-foreground rotate-45' : 'bg-gradient-to-br from-primary to-orange-600 hover:scale-110'
        }`}
      >
        {isOpen ? <Icon icon="solar:add-circle-bold" className="text-white size-8" /> : <Icon icon="solar:magic-stick-3-bold-duotone" className="text-white size-8 animate-pulse" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-4 w-[90vw] max-w-sm bg-card border border-border rounded-2xl shadow-2xl z-40 flex flex-col h-[500px] animate-fade-in">
          <div className="p-4 border-b border-border bg-secondary text-white rounded-t-2xl flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-full">
              <Icon icon="solar:magic-stick-3-bold" className="size-5" />
            </div>
            <div>
              <h3 className="font-bold">AI Стилист</h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-foreground rounded-bl-none border border-border'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground ml-4">Печатает...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-border bg-card rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Найти красное платье..."
                className="flex-1 bg-muted rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button onClick={handleSend} className="size-10 bg-primary text-white rounded-xl flex items-center justify-center">
                <Icon icon="solar:plain-bold" className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};