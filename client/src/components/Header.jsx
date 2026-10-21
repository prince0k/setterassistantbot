import React from 'react';
import { Sparkles, Settings, BookOpen, MessageSquare, Award, ChevronRight, Zap, LogOut, User, ShieldCheck } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenSettings,
  currentModel,
  backendConnected,
  user,
  isAdmin,
  onLogout
}) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Breadcrumb Banner (like screenshot: Continue: Weight Loss and Mobility) */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2 hover:text-slate-900 transition-colors cursor-pointer bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-normal text-slate-500">Continue:</span>
          <span className="text-slate-800 font-semibold">Weight Loss and Mobility</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {backendConnected ? 'Live & Connected' : 'Connecting...'}
          </span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium">
            {currentModel}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Profile / Bot Identity Matching Reference Screenshot */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-base shadow-sm">
              <span className="tracking-tighter">AN</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">DMSetterAssistantnew</h1>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                @alexneilan
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Uses Gemini Flash, a model powered by Google AI.</span>
            </p>
          </div>
        </div>

        {/* Right side controls matching screenshot: Rates pill, bookmark, settings */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setActiveTab('scratchpad')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'scratchpad'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>DM Scratchpad</span>
            </button>

            <button
              onClick={() => setActiveTab('spin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'spin'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Spin Knowledge</span>
            </button>

            <button
              onClick={() => setActiveTab('gold')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'gold'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Gold Bank</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('approvals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'approvals'
                    ? 'bg-purple-600 text-white shadow-xs font-semibold'
                    : 'text-purple-700 bg-purple-50/80 hover:bg-purple-100 font-medium'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Team Approvals</span>
              </button>
            )}
          </nav>

          {/* Quick Action Pill from Screenshot: Rates */}
          <button
            onClick={() => setActiveTab('spin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition-colors cursor-pointer"
            title="View qualification rules & rates"
          >
            <Zap className="w-3.5 h-3.5 text-slate-500" />
            <span>Rates</span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors cursor-pointer"
            title="Configure Gemini & Supabase"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
              <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl max-w-[160px] truncate font-medium flex items-center gap-1" title={user.email}>
                <User className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{user.email?.split('@')[0]}</span>
                {isAdmin && (
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 bg-white transition-colors cursor-pointer"
                title="Log Out of Setter Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
