import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  User, 
  Stethoscope, 
  Calendar, 
  FileText, 
  RefreshCw, 
  KeyRound, 
  CheckCircle2, 
  HeartPulse 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { queryAuraAi } from '../../config/gemini';
import { isGeminiConfigured } from '../../config/apiConfig';

export const AuraAiHelperModal = ({ isOpen, onClose, onBookDoctor }) => {
  const { setApiKeyModalOpen } = useAuth();
  const { doctors, appointments } = useData();

  const [messages, setMessages] = useState([
    {
      id: "msg_welcome",
      sender: "ai",
      text: `Namaste! Main **Aura AI**, aapka personalized 24/7 Healthcare Assistant hoon. 🩺\n\nAap mujhse **Hindi**, **Hinglish** ya **English** me kuch bhi puch sakte hain:\n\n1. **Apni Bimari / Symptoms:** Apna problem batayein, main sahi specialist doctor suggest karunga.\n2. **Doctor Timing & Slots:** Kisi bhi doctor ki availability ya OPD timings puchhein.\n3. **Medical Reports:** Apne lab test values (BP, Sugar, CBC, ECG) samjhein.\n\n*Aap aaj kaisa feel kar rahe hain?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: "system"
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const aiResponse = await queryAuraAi(query, doctors, appointments);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: aiResponse.source
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "ai",
          text: "Maaf kijiye, temporary issue ke kaaran response generate nahi ho paya. Kripya punah prayas karein ya emergency hotline 1800-AURA-911 par sampark karein.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { text: "Mujhe 2 din se tez bukhar aur body pain hai, kisse consult karu?", icon: HeartPulse },
    { text: "Dr. Ananya Sen kab khali hain OPD ke liye?", icon: Calendar },
    { text: "Mera Fasting Blood Sugar 160 mg/dL aaya hai, iska kya matlab hai?", icon: FileText },
    { text: "Chest me heavy feel ho rha hai, kaunse Cardiologist available hain?", icon: Stethoscope }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[640px] max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Aura AI Clinical Assistant</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {isGeminiConfigured() ? "Gemini Live ⚡" : "Smart Clinical Engine"}
                </span>
              </div>
              <p className="text-xs text-slate-400">Symptom Checker • Doctor Recommender • Report Explainer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); setApiKeyModalOpen(true); }}
              className="p-1.5 rounded-xl text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition flex items-center gap-1"
              title="Configure Gemini API Key"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API Config</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-950/40 to-slate-900/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none'
                  : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-line prose-invert">
                  {msg.text}
                </div>
                
                <div className={`text-[10px] mt-2 flex items-center justify-between opacity-60 ${
                  msg.sender === 'user' ? 'text-cyan-100' : 'text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <span className="font-mono text-[9px] uppercase tracking-wider">
                      {msg.source === 'gemini-live' ? '⚡ Gemini 1.5' : '🧠 Aura Medical Engine'}
                    </span>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 p-3 rounded-2xl w-fit">
              <Bot className="w-4 h-4 animate-spin" />
              <span>Aura AI is analyzing clinical context & matching doctors...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sample Prompt Chips */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Try:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.text)}
              className="text-[11px] text-slate-300 hover:text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition flex items-center gap-1.5 shrink-0"
            >
              <p.icon className="w-3 h-3 text-cyan-400" />
              <span>{p.text}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your symptoms, doctor query or report details in Hindi / English..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 font-bold text-xs hover:opacity-95 disabled:opacity-40 shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
