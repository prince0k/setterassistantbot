import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserX, Clock, UserPlus, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  getApprovalsRegistry, 
  approveUser, 
  revokeUser, 
  dismissPendingUser, 
  ADMIN_EMAIL 
} from '../authService';

export default function AdminApprovalsTab() {
  const [registry, setRegistry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [actionSuccess, setActionSuccess] = useState(null);
  const [error, setError] = useState(null);

  const loadRegistry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getApprovalsRegistry();
      setRegistry(data);
    } catch (err) {
      setError(err.message || 'Failed to load registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  const handleApprove = async (email) => {
    try {
      const updated = await approveUser(email);
      setRegistry(updated);
      setActionSuccess(`Approved access for ${email}!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleRevoke = async (email) => {
    if (!window.confirm(`Revoke bot access for ${email}?`)) return;
    try {
      const updated = await revokeUser(email);
      setRegistry(updated);
      setActionSuccess(`Revoked access for ${email}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDismiss = async (email) => {
    if (!window.confirm(`Dismiss pending request for ${email}?`)) return;
    try {
      const updated = await dismissPendingUser(email);
      setRegistry(updated);
      setActionSuccess(`Dismissed ${email}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handlePreApprove = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    try {
      const updated = await approveUser(newEmail.trim());
      setRegistry(updated);
      setNewEmail('');
      setActionSuccess(`Pre-approved ${newEmail.trim()}!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const pendingList = registry?.pending_users || [];
  const approvedList = registry?.approved_emails || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Setter Approvals & Team Access (Admin)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Logged in as Super Admin (<span className="font-semibold text-slate-800">{ADMIN_EMAIL}</span>). Only users approved by you can use the Setter Assistant Bot.
          </p>
        </div>

        <button
          onClick={loadRegistry}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Pre-Approve Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 text-emerald-600" />
          Pre-Approve a Team Member
        </span>
        <form onSubmit={handlePreApprove} className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="colleague@sustainablechange.com"
            required
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            Pre-Approve Access
          </button>
        </form>
      </div>

      {/* SECTION 1: PENDING REQUESTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Pending Approval Requests ({pendingList.length})
          </h3>
        </div>

        {pendingList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
            No pending approval requests. When new users register, they will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {pendingList.map((item, idx) => {
              const email = typeof item === 'string' ? item : item.email;
              const time = item.requested_at ? new Date(item.requested_at).toLocaleDateString() : '';

              return (
                <div
                  key={idx}
                  className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">{email}</span>
                    {time && <span className="text-[11px] text-slate-400">Requested: {time}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(email)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleApprove(email)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve Setter</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: APPROVED SETTERS */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          Approved Team Members ({approvedList.length})
        </h3>

        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
          {approvedList.map((email, idx) => {
            const isSuperAdmin = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

            return (
              <div
                key={idx}
                className="p-4 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{email}</span>
                  {isSuperAdmin && (
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Super Admin
                    </span>
                  )}
                </div>

                {!isSuperAdmin && (
                  <button
                    onClick={() => handleRevoke(email)}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Revoke access"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
