import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { X, Send, Sparkles, PlusCircle, Check } from 'lucide-react';

interface ChatCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeHobbyName: string;
  activeHobbyLevel: string;
  currentStreak: number;
  onApplyDrillAsDailyStep?: (drillText: string) => void;
}

export const ChatCoachDrawer: React.FC<ChatCoachDrawerProps> = ({
  isOpen,
  onClose,
  activeHobbyName,
  activeHobbyLevel,
  currentStreak,
  onApplyDrillAsDailyStep,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'mentor',
      text: `Hey there! I'm your Tribely coach for ${activeHobbyName}. You're on a ${currentStreak}-day streak at the ${activeHobbyLevel} level. 

What can I help you unlock today? We can break down a tricky movement, troubleshoot physical tension, or design a quick 10-minute micro-drill.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [addedDrillId, setAddedDrillId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  if (!isOpen) return null;

  const quickPrompts = [
    `I only have 10 mins today—give me 1 high-impact drill`,
    `What is the cheapest beginner setup under $25?`,
    `How do I stop feeling awkward practicing in public?`,
    `Explain the biggest beginner mistake to avoid`,
  ];

  const handleSend = async (userPrompt?: string) => {
    const promptToSend = userPrompt || inputVal.trim();
    if (!promptToSend || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsSending(true);

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          hobby: activeHobbyName,
          level: activeHobbyLevel,
          streakDays: currentStreak,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Let's take it one small step at a time today!";

      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionDrill: promptToSend.toLowerCase().includes('drill') || promptToSend.toLowerCase().includes('10 min')
          ? '10-Minute Focused Micro-Drill'
          : undefined,
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      console.error('Mentor chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        sender: 'mentor',
        text: `Remember: 15 minutes of slow, intentional practice creates stronger neural pathways than 2 hours of distracted repetition. Focus on one small nuance today and let the habit carry you!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddDrill = (msgId: string, drillText: string) => {
    if (onApplyDrillAsDailyStep) {
      onApplyDrillAsDailyStep(drillText);
      setAddedDrillId(msgId);
      setTimeout(() => setAddedDrillId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-display">
              Tribely Hobby Coach
            </h2>
            <div className="text-[11px] text-slate-500">
              {activeHobbyName} · {activeHobbyLevel}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.actionDrill && onApplyDrillAsDailyStep && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-emerald-700">
                    Actionable Drill Suggested
                  </span>
                  <button
                    onClick={() => handleAddDrill(msg.id, msg.text)}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-900 hover:text-emerald-800 cursor-pointer"
                  >
                    {addedDrillId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Added to Today!</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3 h-3" />
                        <span>Use for Today</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Organic Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about a technique, gear, or mindset..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isSending}
            className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors text-slate-800 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !inputVal.trim()}
            className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="text-[10px] text-slate-400 text-center mt-2">
          Keep it small · 15 minutes a day builds lasting skills
        </div>
      </div>
    </div>
  );
};
