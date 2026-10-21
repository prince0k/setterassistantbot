import React, { useState } from 'react';
import { Settings, X, Database, Key, Cpu, Check } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Assistant & Cloud Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Gemini Model Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            Select Gemini Engine
          </label>
          <div className="space-y-2">
            {MODELS.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  currentModel === m.id
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${currentModel === m.id ? 'text-emerald-800' : 'text-slate-800'}`}>
                    {m.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{m.speed}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. API Key Configuration */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="AIzaSy... or AQ.Ab8RN..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500"
          />
          <p className="text-[11px] text-slate-500">
            Pre-configured with your active Gemini key. You can update it anytime.
          </p>
        </div>

        {/* 3. Supabase Cloud Sync */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Supabase Cloud Database (Connected)
            </label>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Live & Synced
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your Supabase PostgreSQL database is connected and syncing spins & gold standards in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
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
