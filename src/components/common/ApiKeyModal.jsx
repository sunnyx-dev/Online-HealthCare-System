import React, { useState, useEffect } from 'react';
import { 
  X, 
  KeyRound, 
  Flame, 
  Database, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock 
} from 'lucide-react';
import { getApiConfig, saveApiConfig, isFirebaseConfigured, isSupabaseConfigured, isGeminiConfigured } from '../../config/apiConfig';
import { initFirebase } from '../../config/firebase';
import { initSupabase } from '../../config/supabase';
import { useAuth } from '../../context/AuthContext';

export const ApiKeyModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [config, setConfig] = useState(getApiConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getApiConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Strict Security: Only Admin (Sunny) can access API configuration
  if (currentUser?.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
        <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Restricted Administrator Area</h3>
          <p className="text-xs text-slate-400">
            API credentials and infrastructure keys are protected and only accessible to the Chief Administrator (Sunny).
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    saveApiConfig(config);
    initFirebase();
    initSupabase();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const firebaseStatus = isFirebaseConfigured();
  const supabaseStatus = isSupabaseConfigured();
  const geminiStatus = isGeminiConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-900/40 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">System API Keys &amp; Infrastructure</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  CONFIDENTIAL
                </span>
              </div>
              <p className="text-xs text-slate-400">Encrypted in .env &amp; protected by system administrator credentials</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {showKeys ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{showKeys ? 'Hide Keys' : 'Masked (Protected)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Status Badges */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 grid grid-cols-3 gap-3">
          <div className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            firebaseStatus ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold truncate">Firebase Auth</div>
              <div className="text-[10px] opacity-80">{firebaseStatus ? '🟢 Connected' : '⚪ Smart Demo Mode'}</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            supabaseStatus ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold truncate">Supabase DB</div>
              <div className="text-[10px] opacity-80">{supabaseStatus ? '🟢 Connected' : '⚪ Local DB Active'}</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            geminiStatus ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold truncate">Gemini AI</div>
              <div className="text-[10px] opacity-80">{geminiStatus ? '🟢 Live API' : '⚡ Smart Engine'}</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Configurations updated securely!</span>
            </div>
          )}

          {/* 1. Google Gemini AI */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Google Gemini API Key</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">Protected</span>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">API Key</label>
              <input
                type={showKeys ? "text" : "password"}
                placeholder="Protected key loaded from .env"
                value={config.gemini?.apiKey || ''}
                onChange={(e) => setConfig({
                  ...config,
                  gemini: { ...config.gemini, apiKey: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition"
              />
            </div>
          </div>

          {/* 2. Firebase Authentication */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Firebase Authentication Credentials</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">Protected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Firebase Web API Key</label>
                <input
                  type={showKeys ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  value={config.firebase?.apiKey || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    firebase: { ...config.firebase, apiKey: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Project ID</label>
                <input
                  type="text"
                  value={config.firebase?.projectId || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    firebase: { ...config.firebase, projectId: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 3. Supabase PostgreSQL */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Supabase PostgreSQL Configuration</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">Protected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Supabase Project URL</label>
                <input
                  type="text"
                  value={config.supabase?.url || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    supabase: { ...config.supabase, url: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Supabase Anon Key</label>
                <input
                  type={showKeys ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  value={config.supabase?.anonKey || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    supabase: { ...config.supabase, anonKey: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
