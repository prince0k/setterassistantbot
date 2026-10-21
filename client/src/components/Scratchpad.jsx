import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Flame, 
  HeartHandshake, 
  MessageCircle, 
  Zap,
  BookmarkPlus
} from 'lucide-react';
import { generateSetterReply, saveGoldStandard } from '../api';

const SAMPLE_CHATS = [
  {
    label: "Menopause & Energy",
    snippet: "Alex: [FirstName], how much weight do you need to lose ideally?\nLead: Hey Alex, about 2 stone ideally. Honestly menopause has completely wrecked my sleep and energy levels lately, so I just keep falling off track."
  },
  {
    label: "High Stress & Lack of Time",
    snippet: "Alex: What would you say is making it difficult for you to lose 2 stone & keep it off sustainably?\nLead: I work 50 hours a week as a head teacher and have 2 kids. I just don't have the time to prep separate meals or spend hours at a gym."
  },
  {
    label: "Asking Price Objection",
    snippet: "Lead: Before we go any further Alex, how much is this program? I've spent thousands on weight watchers and personal trainers in the past and can't afford anything crazy right now."
  },
  {
    label: "Low Weight Goal (BMI Check)",
    snippet: "Alex: how much weight do you need to lose ideally?\nLead: Just looking to drop about 10-12 lbs before my sister's wedding in the summer."
  }
];

export default function Scratchpad({ currentModel, onSaveGoldSuccess }) {
  const [conversationText, setConversationText] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copiedOption, setCopiedOption] = useState(null);
  const [savedGoldOption, setSavedGoldOption] = useState(null);
  const [showRationale, setShowRationale] = useState(true);
  const [activeOptionTab, setActiveOptionTab] = useState('direct'); // direct | empathetic | short

  const handleGenerate = async () => {
    if (!conversationText.trim()) return;
    setIsLoading(true);
    setError(null);
    setCopiedOption(null);
    setSavedGoldOption(null);

    try {
      const data = await generateSetterReply({
        conversationText,
        customInstructions,
        modelName: currentModel
      });
      setResult(data);
      // Auto-select direct
      setActiveOptionTab('direct');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate response. Please check your connection or API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, optionName) => {
    navigator.clipboard.writeText(text);
    setCopiedOption(optionName);
    setTimeout(() => setCopiedOption(null), 2500);
  };

  const handleSaveToGold = async (optionName, replyText) => {
    if (!result) return;
    try {
      await saveGoldStandard({
        lead_name: result.lead_name || 'Prospect',
        lead_snippet: conversationText.slice(0, 300),
        stage: result.stage,
        reply_direct: optionName === 'direct' ? replyText : result.reply_direct,
        reply_empathetic: optionName === 'empathetic' ? replyText : result.reply_empathetic,
        reply_short: optionName === 'short' ? replyText : result.reply_short,
        rationale: result.why_this_message
      });
      setSavedGoldOption(optionName);
      if (onSaveGoldSuccess) onSaveGoldSuccess();
      setTimeout(() => setSavedGoldOption(null), 3000);
    } catch (err) {
      alert('Failed to save to Gold Bank: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Sample Quick Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Quick Test Prompts:</span>
        {SAMPLE_CHATS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setConversationText(sample.snippet);
              setResult(null);
            }}
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      {/* Input Scratchpad Box */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl shadow-xl overflow-hidden focus-within:border-emerald-500/50 transition-all">
        <div className="bg-[#0f141c] px-4 py-2.5 border-b border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            Paste DM Conversation (Instagram, Facebook Messenger, or WhatsApp)
          </span>
          {conversationText && (
            <button
              onClick={() => {
                setConversationText('');
                setResult(null);
              }}
              className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <textarea
          value={conversationText}
          onChange={(e) => setConversationText(e.target.value)}
          placeholder="Paste raw conversation here...&#10;e.g.&#10;Alex: How much weight do you need to lose ideally?&#10;Lead: About 2 stone, but I have terrible sciatica and struggle with snacking at night."
          rows={5}
          className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none resize-y"
        />

        {/* Action Bar */}
        <div className="bg-[#0f141c] px-4 py-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Optional setter note (e.g. 'Push for call booking today' or 'Lead was defensive earlier')"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !conversationText.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Diagnosing & Formulating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Setter Responses</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-rose-200">Generation Failed</p>
            <p className="mt-0.5 text-rose-300/80">{error}</p>
          </div>
        </div>
      )}

      {/* Output Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Lead Intelligence Card */}
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Lead: {result.lead_name || 'Prospect'}
              </span>

              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-lg font-medium">
                Stage: {result.stage}
              </span>

              {result.current_goal && result.current_goal !== 'unknown' && (
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                  Goal: {result.current_goal}
                </span>
              )}
            </div>

            {/* Identified Obstacles */}
            {result.detected_obstacles && result.detected_obstacles.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-400 font-medium">Obstacles:</span>
                {result.detected_obstacles.map((obs, idx) => (
                  <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                    {obs}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Qualification Warnings & Flags */}
          {result.qualification_flags && result.qualification_flags.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Setter Qualification Alerts:</span>
                <ul className="mt-1 list-disc list-inside space-y-0.5 text-amber-200/90">
                  {result.qualification_flags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 3 Variation Selector & Output */}
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="bg-[#0f141c] border-b border-slate-800/80 px-4 pt-3 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveOptionTab('direct')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
                  activeOptionTab === 'direct'
                    ? 'border-emerald-500 text-emerald-400 bg-[#161b22]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Option 1: Direct & Momentum</span>
              </button>

              <button
                onClick={() => setActiveOptionTab('empathetic')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
                  activeOptionTab === 'empathetic'
                    ? 'border-emerald-500 text-emerald-400 bg-[#161b22]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Option 2: Deeply Empathetic</span>
              </button>

              <button
                onClick={() => setActiveOptionTab('short')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
                  activeOptionTab === 'short'
                    ? 'border-emerald-500 text-emerald-400 bg-[#161b22]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Option 3: Short & Casual FUP</span>
              </button>
            </div>

            {/* Active Variation Content */}
            <div className="p-6">
              {activeOptionTab === 'direct' && (
                <div className="space-y-4">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-100 whitespace-pre-wrap selection:bg-emerald-500 selection:text-white">
                    {result.reply_direct}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 italic">
                      Direct, assertive progression through the spin.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToGold('direct', result.reply_direct)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                        title="Save to Gold Benchmark Bank so the AI learns this style"
                      >
                        {savedGoldOption === 'direct' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Saved to Bank!</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Save as Benchmark</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(result.reply_direct, 'direct')}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                      >
                        {copiedOption === 'direct' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeOptionTab === 'empathetic' && (
                <div className="space-y-4">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-100 whitespace-pre-wrap selection:bg-emerald-500 selection:text-white">
                    {result.reply_empathetic}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 italic">
                      Validates their frustration, body challenges, and emotional burden first.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToGold('empathetic', result.reply_empathetic)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        {savedGoldOption === 'empathetic' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Saved to Bank!</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Save as Benchmark</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(result.reply_empathetic, 'empathetic')}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                      >
                        {copiedOption === 'empathetic' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeOptionTab === 'short' && (
                <div className="space-y-4">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-100 whitespace-pre-wrap selection:bg-emerald-500 selection:text-white">
                    {result.reply_short}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400 italic">
                      Ultra-low friction one-liner; feels like a natural DM from phone.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToGold('short', result.reply_short)}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        {savedGoldOption === 'short' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Saved to Bank!</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Save as Benchmark</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(result.reply_short, 'short')}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-md transition-all cursor-pointer"
                      >
                        {copiedOption === 'short' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Strategic Rationale Accordion ("Why This Message") */}
          <div className="bg-[#161b22] border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setShowRationale(!showRationale)}
              className="w-full px-5 py-3 bg-[#0f141c] hover:bg-slate-800/40 flex items-center justify-between text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>Why This Message? (Sales Psychology & Funnel Strategy)</span>
              </div>
              {showRationale ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {showRationale && (
              <div className="p-5 space-y-3 text-xs leading-relaxed text-slate-300 border-t border-slate-800/60">
                <p>{result.why_this_message}</p>
                {result.next_objective && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 text-emerald-300">
                    <span className="font-semibold text-emerald-200">Immediate Next Setter Objective: </span>
                    {result.next_objective}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
