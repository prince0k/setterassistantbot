import React, { useState } from 'react';
import { Settings, X, Database, Key, Cpu, Check, AlertCircle, CloudUpload, ShieldCheck } from 'lucide-react';

const MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Recommended)',
    speed: '⚡ 1-2s Latency',
    desc: 'Fastest turn-around for live DM setting. High quota and strict script adherence.'
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    speed: '⚡ 1-3s Latency',
    desc: 'Next-gen tone and empathy. Eliminates robotic AI cadence.'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    speed: '⏱️ 4-8s Latency',
    desc: 'Deep analytical power. Best for complex medical or high-friction objections.'
  }
];

export default function SettingsModal({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
  apiKey,
  onSaveApiKey
}) {
  if (!isOpen) return null;

  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (onSaveApiKey) onSaveApiKey(tempApiKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Assistant & Cloud Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Gemini Model Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Select Gemini Engine
          </label>
          <div className="space-y-2">
            {MODELS.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  currentModel === m.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-[#0d1117] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${currentModel === m.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {m.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{m.speed}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. API Key Configuration */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="AIzaSy... or AQ.Ab8RN..."
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
          />
          <p className="text-[11px] text-slate-500">
            Pre-configured with your active Gemini key. You can update it anytime.
          </p>
        </div>

        {/* 3. Supabase Cloud Sync (Optional Free Hosting) */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              Supabase Cloud Database (Free)
            </label>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
              Multi-Device Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect your free Supabase PostgreSQL project so multiple setters can share the same Gold Bank and Spin updates across devices. If left blank, the bot saves locally.
          </p>

          <div className="space-y-2">
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="Supabase Anon Public API Key"
              className="w-full bg-[#0d1117] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <span>Save & Apply</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
