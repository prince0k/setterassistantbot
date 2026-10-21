import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Save, 
  Upload, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  AlertCircle,
  ExternalLink,
  ShieldAlert
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation for Knowledge Base */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Master Sales Spin & Knowledge Base</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The rules, stage scripts, and objection frameworks that guide the AI setter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('stages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSection === 'stages'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Spin Stages
          </button>

          <button
            onClick={() => setActiveSection('objections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSection === 'objections'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Objections
          </button>

          <button
            onClick={() => setActiveSection('resources')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSection === 'resources'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Links & Assets
          </button>

          <button
            onClick={() => setActiveSection('importer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'importer'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Paste Full Spin</span>
          </button>
        </div>
      </div>

      {/* Global Rules Banner */}
      {spin?.rules && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 grid sm:grid-cols-2 gap-3 text-xs shadow-xs">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">BMI & Qualification Rule:</span>
              <p className="text-slate-600 mt-0.5">{spin.rules.qualification_bmi}</p>
              <p className="text-amber-800 font-medium mt-0.5">{spin.rules.low_bmi_note}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Disqualification Thresholds:</span>
              <p className="text-slate-600 mt-0.5">{spin.rules.disqualification_criteria}</p>
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
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setExpandedStage(expandedStage === idx ? null : idx)}
                className="w-full px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/60 flex items-center justify-between text-left text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-[11px]">
                    {idx}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-slate-900">{stage.name}</span>
                    <p className="text-slate-500 font-normal text-xs mt-0.5">{stage.description}</p>
                  </div>
                </div>
                {expandedStage === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedStage === idx && (
                <div className="p-5 space-y-4 border-t border-slate-200 text-xs">
                  {/* Scripts List */}
                  {Array.isArray(stage.scripts) && (
                    <div>
                      <span className="font-semibold text-slate-700 block mb-2">Core Question Variations:</span>
                      <div className="space-y-2">
                        {stage.scripts.map((sc, sIdx) => (
                          <div key={sIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed">
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
                          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed">
                            {typeof val === 'string' ? val : JSON.stringify(val, null, 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Categories if present (e.g. Stage 2 deep-dives) */}
                  {stage.categories && (
                    <div>
                      <span className="font-semibold text-slate-700 block mb-2">Obstacle Deep Dives:</span>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {Object.entries(stage.categories).map(([catName, catData]) => (
                          <div key={catName} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                            <span className="font-bold text-emerald-800 block mb-1">{catName}</span>
                            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
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
                      <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Follow-ups:</span>
                      <div className="space-y-1.5">
                        {stage.followups.map((fup, fIdx) => (
                          <div key={fIdx} className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-slate-700">
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
            <div key={objKey} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block mb-2">
                {objKey.replace(/_/g, ' ')}
              </span>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
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
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-xs">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{res.name}</span>
                <span className="text-xs text-slate-500 font-mono mt-1 block truncate max-w-xs">{res.url}</span>
              </div>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg text-emerald-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 4: IMPORTER (PASTE NEW FULL SPIN) */}
      {activeSection === 'importer' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Import / Paste New Full Spin</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Have a revised Google Doc or new spin flow? Paste the raw text below. The AI setter will incorporate this text directly into its knowledge base.
            </p>
          </div>

          <textarea
            value={rawImportText}
            onChange={(e) => setRawImportText(e.target.value)}
            rows={10}
            placeholder="Paste your full spin script here...&#10;&#10;Question 1...&#10;Question 2 deep dives...&#10;Call pitches...&#10;Objections..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
          />

          {error && (
            <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg">
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
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
