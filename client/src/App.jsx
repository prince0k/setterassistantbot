import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Scratchpad from './components/Scratchpad';
import SpinManager from './components/SpinManager';
import GoldStandards from './components/GoldStandards';
import SettingsModal from './components/SettingsModal';
import LoginPage from './components/LoginPage';
import { fetchHealth, fetchSpin, fetchGoldStandards } from './api';
import { supabase } from './supabaseClient';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('scratchpad');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [spin, setSpin] = useState(null);
  const [goldStandards, setGoldStandards] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);

  // Monitor Supabase Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      await fetchHealth();
      setBackendConnected(true);

      const [spinData, goldData] = await Promise.all([
        fetchSpin(),
        fetchGoldStandards()
      ]);
      setSpin(spinData);
      setGoldStandards(goldData);
    } catch (err) {
      console.warn('Initial data load error:', err);
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
      const interval = setInterval(async () => {
        try {
          await fetchHealth();
          setBackendConnected(true);
        } catch {
          setBackendConnected(false);
        }
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium text-slate-500">Checking setter session...</span>
      </div>
    );
  }

  // If not logged in, show Login Screen
  if (!session) {
    return <LoginPage onLoginSuccess={(sess) => setSession(sess)} />;
  }

  // Authenticated Setter Dashboard
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header matching reference image */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentModel={currentModel}
        backendConnected={backendConnected}
        user={session.user}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'scratchpad' && (
          <Scratchpad
            currentModel={currentModel}
            apiKey={apiKey}
            onSaveGoldSuccess={loadData}
          />
        )}

        {activeTab === 'spin' && (
          <SpinManager
            spin={spin}
            onSpinUpdated={(updated) => setSpin(updated)}
          />
        )}

        {activeTab === 'gold' && (
          <GoldStandards
            goldStandards={goldStandards}
            onRefresh={loadData}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentModel={currentModel}
        onSelectModel={(m) => setCurrentModel(m)}
        apiKey={apiKey}
        onSaveApiKey={(k) => setApiKey(k)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium text-slate-600">DMSetterAssistantnew &middot; Alex Neilan Sustainable Change Spin</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-slate-600">{backendConnected ? 'API Connected' : 'Connecting to API'}</span>
            </span>
            <span className="text-slate-300">&middot;</span>
            <span className="text-slate-500">Vercel + Render + Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
