import React, { useState } from 'react';
import { Clock, ShieldAlert, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';

export default function PendingApprovalScreen({ user, onCheckStatus, onLogout }) {
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleRefresh = async () => {
    setIsChecking(true);
    setStatusMessage(null);
    try {
      const isNowApproved = await onCheckStatus();
      if (!isNowApproved) {
        setStatusMessage('Status is still pending. Prince has not yet approved this account.');
      }
    } finally {
      setTimeout(() => setIsChecking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Branding */}
        <div className="space-y-3">
          <div className="inline-flex relative">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-md mx-auto">
              <span>AN</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full"></div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">DMSetterAssistantnew</h1>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                @alexneilan
              </span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5 text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-base font-bold text-slate-900">Account Pending Admin Approval</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Welcome <span className="font-semibold text-slate-900">{user?.email}</span>! Your account has been registered.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                To protect client conversation data and proprietary sales spins, new users must be approved by the admin:
              </span>
            </div>
            <p className="font-semibold text-slate-800 pl-6">
              prince4sharmaa123@gmail.com
            </p>
          </div>

          {statusMessage && (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
              {statusMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleRefresh}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow-xs transition-all text-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking Supabase...' : 'Check Approval Status'}</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-medium py-2 rounded-xl transition-all text-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Once Prince approves your account in the Admin Panel, refresh this page to begin.
        </p>
      </div>
    </div>
  );
}
