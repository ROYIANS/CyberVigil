import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Ghost, Loader2 } from 'lucide-react';
import { AIConfig, chatWithQiMomo } from '../utils/aiService';

interface ChatModalProps {
  onClose: () => void;
  config: AIConfig;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, config }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '我是齐默默，这里的守墓人。如果你心里有些话没处说，可以告诉我。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await chatWithQiMomo(input, config, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `(齐默默似乎没听清: ${error instanceof Error ? error.message : '未知错误'})` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4 md:p-6">
      <div className="w-full max-w-2xl h-[80vh] bg-stone-900 border border-stone-700 rounded-lg shadow-2xl flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-stone-800 flex items-center justify-between px-6 bg-stone-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
              <Ghost className="text-stone-400" size={16} />
            </div>
            <div>
              <h3 className="text-stone-200 font-serif-sc tracking-widest text-sm">守墓人 · 齐默默</h3>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-stone-500">在线</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0c0a09]">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed font-serif-sc ${
                msg.role === 'user' 
                  ? 'bg-stone-800 text-stone-200 rounded-tr-none' 
                  : 'bg-stone-900 border border-stone-800 text-stone-400 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="animate-spin text-stone-600" size={14} />
                <span className="text-xs text-stone-600">齐默默正在思考...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-stone-900 border-t border-stone-800">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="想说点什么..."
              className="flex-1 bg-stone-800/50 border border-stone-700 rounded-full px-6 py-3 text-stone-300 text-sm focus:border-stone-500 outline-none font-serif-sc placeholder:text-stone-600"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full bg-stone-200 text-stone-900 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;