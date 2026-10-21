import React, { useState } from 'react';
import { Award, Plus, Trash2, Search, Check, Sparkles, MessageSquare, Info } from 'lucide-react';
import { saveGoldStandard, deleteGoldStandard } from '../api';

export default function GoldStandards({ goldStandards, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New form fields
  const [leadName, setLeadName] = useState('');
  const [leadSnippet, setLeadSnippet] = useState('');
  const [stage, setStage] = useState('Stage 2: Obstacle Deep Dive');
  const [replyDirect, setReplyDirect] = useState('');
  const [replyEmpathetic, setReplyEmpathetic] = useState('');
  const [replyShort, setReplyShort] = useState('');
  const [rationale, setRationale] = useState('');

  const filtered = (goldStandards || []).filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.lead_name && item.lead_name.toLowerCase().includes(term)) ||
      (item.lead_snippet && item.lead_snippet.toLowerCase().includes(term)) ||
      (item.stage && item.stage.toLowerCase().includes(term)) ||
      (item.reply_direct && item.reply_direct.toLowerCase().includes(term))
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Gold Standard example?')) return;
    try {
      await deleteGoldStandard(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!leadSnippet.trim() || !replyDirect.trim()) {
      alert('Please fill in at least the lead context and direct reply.');
      return;
    }
    setIsSubmitting(true);
    try {
      await saveGoldStandard({
        lead_name: leadName || 'Prospect',
        lead_snippet: leadSnippet,
        stage,
        reply_direct: replyDirect,
        reply_empathetic: replyEmpathetic || replyDirect,
        reply_short: replyShort || '',
        rationale: rationale || 'High-converting setter benchmark'
      });
      setShowAddModal(false);
      // Reset form
      setLeadName('');
      setLeadSnippet('');
      setReplyDirect('');
      setReplyEmpathetic('');
      setReplyShort('');
      setRationale('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to add example: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Gold Benchmark Bank (Few-Shot Learning)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            These are your upvoted, high-converting setter replies. Whenever you generate suggestions in the Scratchpad, Gemini references these exact benchmarks to emulate Alex's tone, empathy, and phrasing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Example</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search benchmark examples by lead name, obstacle, stage, or keyword..."
          className="w-full bg-[#161b22] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* List of Examples */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-10 text-center text-xs text-slate-400">
            No gold standard examples found. You can add one manually or click "Save as Benchmark" on any reply in the Scratchpad.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold text-xs">
                    Lead: {item.lead_name || 'Prospect'}
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md text-xs">
                    {item.stage || 'General'}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                  title="Delete Example"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Lead Context */}
              <div className="text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                  Lead Message:
                </span>
                <p className="text-slate-300 italic bg-[#0d1117] p-2.5 rounded-lg border border-slate-800/80">
                  "{item.lead_snippet}"
                </p>
              </div>

              {/* Direct Reply */}
              <div className="text-xs">
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                  Trained Direct Reply:
                </span>
                <p className="text-slate-200 bg-[#0d1117] p-3 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-wrap">
                  {item.reply_direct}
                </p>
              </div>

              {/* Empathetic / Short Replies if available */}
              {(item.reply_empathetic || item.reply_short) && (
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  {item.reply_empathetic && item.reply_empathetic !== item.reply_direct && (
                    <div>
                      <span className="text-purple-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                        Empathetic Variation:
                      </span>
                      <p className="text-slate-300 bg-[#0d1117] p-2.5 rounded-lg border border-slate-800 leading-relaxed line-clamp-3">
                        {item.reply_empathetic}
                      </p>
                    </div>
                  )}

                  {item.reply_short && (
                    <div>
                      <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                        Short Follow-up:
                      </span>
                      <p className="text-slate-300 bg-[#0d1117] p-2.5 rounded-lg border border-slate-800 leading-relaxed line-clamp-3">
                        {item.reply_short}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Rationale */}
              {item.rationale && (
                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{item.rationale}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Example Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Add Benchmark Gold Standard Reply</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Lead First Name</label>
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stage in Spin</label>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    placeholder="e.g. Stage 2: Menopause"
                    className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Lead Message / Context *</label>
                <textarea
                  value={leadSnippet}
                  onChange={(e) => setLeadSnippet(e.target.value)}
                  placeholder="What the prospect said..."
                  rows={2}
                  required
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Direct Setter Reply *</label>
                <textarea
                  value={replyDirect}
                  onChange={(e) => setReplyDirect(e.target.value)}
                  placeholder="Your ideal high-converting direct reply..."
                  rows={3}
                  required
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Empathetic Reply Variation (Optional)</label>
                <textarea
                  value={replyEmpathetic}
                  onChange={(e) => setReplyEmpathetic(e.target.value)}
                  placeholder="Deeply validating variation..."
                  rows={2}
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Short One-Liner FUP (Optional)</label>
                <input
                  type="text"
                  value={replyShort}
                  onChange={(e) => setReplyShort(e.target.value)}
                  placeholder="Quick casual text..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Strategic Rationale</label>
                <input
                  type="text"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Why this reply works..."
                  className="w-full bg-[#0d1117] border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
