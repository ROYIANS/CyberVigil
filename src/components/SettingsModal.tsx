import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';
import { AIConfig } from '../utils/aiService';

interface SettingsModalProps {
  onClose: () => void;
  onSave: (config: AIConfig) => void;
  initialConfig: AIConfig;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave, initialConfig }) => {
  const [config, setConfig] = useState<AIConfig>(initialConfig);

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-6">
      <div className="w-full max-w-md bg-stone-900 border border-stone-700 rounded-lg shadow-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-stone-300">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
            <Settings className="text-stone-400" size={20} />
          </div>
          <h3 className="text-xl text-stone-200 font-serif-sc tracking-widest">连接齐默默</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-stone-500 tracking-widest">API Base URL</label>
            <input 
              type="text" 
              value={config.baseUrl}
              onChange={e => setConfig({...config, baseUrl: e.target.value})}
              placeholder="https://api.openai.com/v1"
              className="w-full bg-stone-800/50 border border-stone-700 rounded p-3 text-stone-300 text-sm focus:border-stone-500 outline-none font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-stone-500 tracking-widest">API Key</label>
            <input 
              type="password" 
              value={config.apiKey}
              onChange={e => setConfig({...config, apiKey: e.target.value})}
              placeholder="sk-..."
              className="w-full bg-stone-800/50 border border-stone-700 rounded p-3 text-stone-300 text-sm focus:border-stone-500 outline-none font-mono"
            />
            <p className="text-[10px] text-stone-600">* 您的 Key 仅保存在本地浏览器中，不会上传到任何服务器。</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-stone-500 tracking-widest">Model Name</label>
            <input 
              type="text" 
              value={config.model}
              onChange={e => setConfig({...config, model: e.target.value})}
              placeholder="gpt-3.5-turbo"
              className="w-full bg-stone-800/50 border border-stone-700 rounded p-3 text-stone-300 text-sm focus:border-stone-500 outline-none font-mono"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-3 bg-stone-200 text-stone-900 hover:bg-white transition-all flex items-center justify-center gap-2 text-xs tracking-widest font-bold rounded mt-4"
          >
            <Save size={14}/> 保存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;