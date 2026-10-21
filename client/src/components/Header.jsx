import React from 'react';
import { Sparkles, Settings, BookOpen, MessageSquare, Award, Cloud, ChevronRight, Activity } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenSettings,
  currentModel,
  backendConnected
}) {
  return (
    <header className="border-b border-slate-800 bg-[#161b22]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Breadcrumb Banner (like screenshot: Continue: Weight Loss and Mobility) */}
      <div className="bg-[#0f141c] border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-slate-300">Active Spin:</span>
          <span className="text-slate-200 font-semibold">Sustainable Weight Loss & Mobility (Alex Neilan)</span>
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {backendConnected ? 'Engine Ready' : 'Connecting...'}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[11px] font-mono">
            {currentModel}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Profile / Bot Identity Matching Reference Screenshot */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              AN
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#161b22] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">DMSetterAssistantnew</h1>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-700">
                @alexneilan
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Uses Google Gemini Flash &middot; Powered by Antigravity</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'scratchpad'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>DM Scratchpad</span>
          </button>

          <button
            onClick={() => setActiveTab('spin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'spin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Spin Knowledge</span>
          </button>

          <button
            onClick={() => setActiveTab('gold')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'gold'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Gold Examples</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all border-l border-slate-800 ml-1"
            title="Configure Gemini & Supabase"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
