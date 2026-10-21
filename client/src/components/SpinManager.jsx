import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Save, 
  Upload, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { updateSpin } from '../api';

export default function SpinManager({ spin, onSpinUpdated }) {
  const [activeSection, setActiveSection] = useState('stages'); // stages | objections | resources | importer
  const [expandedStage, setExpandedStage] = useState(0);
  const [rawImportText, setRawImportText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSaveRawSpin = async () => {
    if (!rawImportText.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      // Create an updated spin object integrating the user's raw text
      const updated = {
        ...spin,
        raw_custom_spin: rawImportText,
        updated_at: new Date().toISOString()
      };
      await updateSpin(updated);
      setSaveSuccess(true);
      if (onSpinUpdated) onSpinUpdated(updated);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update spin.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Navigation for Knowledge Base */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Master Sales Spin & Knowledge Base</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            The underlying rules, stage scripts, and objection frameworks that guide the AI setter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('stages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSection === 'stages'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Spin Stages
          </button>

          <button
            onClick={() => setActiveSection('objections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSection === 'objections'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Objections
          </button>

          <button
            onClick={() => setActiveSection('resources')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSection === 'resources'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Links & Assets
          </button>

          <button
            onClick={() => setActiveSection('importer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSection === 'importer'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-emerald-500/30'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Paste Full Spin</span>
          </button>
        </div>
      </div>

      {/* Global Rules Banner */}
      {spin?.rules && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">BMI & Qualification Rule:</span>
              <p className="text-slate-400 mt-0.5">{spin.rules.qualification_bmi}</p>
              <p className="text-amber-300/80 mt-0.5">{spin.rules.low_bmi_note}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">Disqualification Thresholds:</span>
              <p className="text-slate-400 mt-0.5">{spin.rules.disqualification_criteria}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: STAGES */}
      {activeSection === 'stages' && (
        <div className="space-y-3">
          {spin?.stages?.map((stage, idx) => (
            <div
              key={stage.id || idx}
              className="bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
                className="w-full px-5 py-3.5 bg-[#0f141c] hover:bg-slate-800/40 flex items-center justify-between text-left text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-[11px]">
                    {idx}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-white">{stage.name}</span>
                    <p className="text-slate-400 font-normal text-xs mt-0.5">{stage.description}</p>
                  </div>
                </div>
                {expandedStage === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedStage === idx && (
                <div className="p-5 space-y-4 border-t border-slate-800/60 text-xs">
                  {/* Scripts List */}
                  {Array.isArray(stage.scripts) && (
                    <div>
                      <span className="font-semibold text-slate-300 block mb-2">Core Question Variations:</span>
                      <div className="space-y-2">
                        {stage.scripts.map((sc, sIdx) => (
                          <div key={sIdx} className="bg-[#0d1117] p-3 rounded-lg border border-slate-800/80 text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {sc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scripts Object */}
                  {stage.scripts && !Array.isArray(stage.scripts) && (
                    <div className="space-y-2.5">
                      {Object.entries(stage.scripts).map(([key, val]) => (
                        <div key={key}>
                          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800/80 text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {typeof val === 'string' ? val : JSON.stringify(val, null, 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Categories if present (e.g. Stage 2 deep-dives) */}
                  {stage.categories && (
                    <div>
                      <span className="font-semibold text-slate-300 block mb-2">Obstacle Deep Dives:</span>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {Object.entries(stage.categories).map(([catName, catData]) => (
                          <div key={catName} className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
                            <span className="font-bold text-emerald-400 block mb-1">{catName}</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                              {catData.script}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Followups */}
                  {stage.followups && stage.followups.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Follow-ups:</span>
                      <div className="space-y-1.5">
                        {stage.followups.map((fup, fIdx) => (
                          <div key={fIdx} className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-slate-300">
                            {fup}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: OBJECTIONS */}
      {activeSection === 'objections' && (
        <div className="space-y-3">
          {spin?.objections && Object.entries(spin.objections).map(([objKey, script]) => (
            <div key={objKey} className="bg-[#161b22] border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block mb-2">
                {objKey.replace(/_/g, ' ')}
              </span>
              <div className="bg-[#0d1117] p-3.5 rounded-lg border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {script}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: RESOURCES */}
      {activeSection === 'resources' && (
        <div className="grid sm:grid-cols-2 gap-3">
          {spin?.resources?.map((res, idx) => (
            <div key={idx} className="bg-[#161b22] border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-white block">{res.name}</span>
                <span className="text-xs text-slate-400 font-mono mt-1 block truncate max-w-xs">{res.url}</span>
              </div>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-emerald-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 4: IMPORTER (PASTE NEW FULL SPIN) */}
      {activeSection === 'importer' && (
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Import / Paste New Full Spin</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Have a revised Google Doc or new spin flow? Paste the raw text below. The AI setter will incorporate this text directly into its knowledge base.
            </p>
          </div>

          <textarea
            value={rawImportText}
            onChange={(e) => setRawImportText(e.target.value)}
            rows={10}
            placeholder="Paste your full spin script here...&#10;&#10;Question 1...&#10;Question 2 deep dives...&#10;Call pitches...&#10;Objections..."
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
          />

          {error && (
            <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-800/40 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Changes will update both local and Supabase cloud storage instantly.
            </span>

            <button
              onClick={handleSaveRawSpin}
              disabled={isSaving || !rawImportText.trim()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Updating Spin...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Spin Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save to Knowledge Base</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
