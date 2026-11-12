import React, { useState } from 'react';
import { Hobby, DailyStep, SocialBookmark } from '../types';
import {
  Clock,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  ArrowRight,
  MessageSquare,
  Flame,
  HelpCircle,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

interface DailyPlanViewProps {
  activeHobby: Hobby;
  dailyStep: DailyStep;
  bookmarks: SocialBookmark[];
  onToggleCompleteStep: () => void;
  onOpenSocialModal: () => void;
  onOpenCoach: () => void;
  onAskCoachPrompt: (prompt: string) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  activeHobby,
  dailyStep,
  bookmarks,
  onToggleCompleteStep,
  onOpenSocialModal,
  onOpenCoach,
  onAskCoachPrompt,
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onAskCoachPrompt(quickQuestion);
    setQuickQuestion('');
    onOpenCoach();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero 15-Minute Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Drill Card (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
            {/* Top kicker */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-emerald-800 uppercase tracking-wide">
                  Daily 15-Min Habit
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeHobby.name}</span>
                <span aria-hidden="true">·</span>
                <span>Day {activeHobby.currentStreak + 1} of Consistency</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold tabular-nums">{dailyStep.estimatedMins} min</span>
              </div>
            </div>

            {/* Drill Title & Objective */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {dailyStep.title}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {dailyStep.objective}
            </p>

            {/* Breakdown Steps */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Bite-Sized Action Steps:
              </div>
              <div className="space-y-2.5">
                {dailyStep.breakdown.map((stepText, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{stepText}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment & Pro-tip info */}
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span>Required Starter Gear:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {dailyStep.equipmentNeeded}
                </p>
              </div>

              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70">
                <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Coach Micro-Tip:</span>
                </div>
                <p className="text-amber-900/90 leading-relaxed">
                  {dailyStep.proTip}
                </p>
              </div>
            </div>

            {/* Completion CTA */}
            <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>
                  {dailyStep.completed
                    ? 'Session logged for today! Awesome dedication.'
                    : '15 mins builds genuine skill without burning out.'}
                </span>
              </div>

              <button
                onClick={onToggleCompleteStep}
                className={`py-3 px-6 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 ${
                  dailyStep.completed
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{dailyStep.completed ? 'Practice Logged (Click to Undo)' : 'Complete Today’s 15 Mins'}</span>
              </button>
            </div>
          </div>

          {/* Social Media Digest Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Smart Bookmark Ingestion</span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  Turn Saved TikToks & Reels into Real Action
                </h3>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                  Have 20 saved tutorials you never got around to trying? Paste any video link and let your AI Coach distill it into a 15-minute hands-on practice session.
                </p>
              </div>

              <button
                onClick={onOpenSocialModal}
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Digest a Video</span>
              </button>
            </div>

            {/* List of active bookmarks */}
            {bookmarks.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {bookmarks.slice(0, 2).map((bm) => (
                  <div
                    key={bm.id}
                    onClick={onOpenSocialModal}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{bm.platform}</span>
                      <ExternalLink className="w-3 h-3 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="font-semibold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {bm.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {bm.chapterSummary?.objective.slice(0, 50)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Chat Coach Shortcut & Tribe Presence */}
        <div className="space-y-6">
          {/* Quick Chat Coach Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Ask Your Hobby Mentor
                </h3>
                <div className="text-[11px] text-slate-500">
                  Organic, bite-sized guidance
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Stuck on today's drill? Ask anything about finger positioning, cheap gear alternatives, or modifying this plan for 5 minutes.
            </p>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Common Quick Questions:
              </div>
              <button
                onClick={() => {
                  onAskCoachPrompt("I only have 7 minutes today. How should I compress this drill?");
                  onOpenCoach();
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs text-slate-700 transition-colors cursor-pointer"
              >
                "I only have 7 minutes today. How do I adapt?"
              </button>
              <button
                onClick={() => {
                  onAskCoachPrompt("What's the cheapest way to buy materials without buying full kits?");
                  onOpenCoach();
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs text-slate-700 transition-colors cursor-pointer"
              >
                "What's the cheapest way to start under $20?"
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleQuickSubmit} className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type a quick question..."
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-800"
                />
                <button
                  type="submit"
                  className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center absolute right-1.5 top-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Tribe Peers Active Today */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fellow Beginners Practicing
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold">14 today</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                    M
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Maya C.</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-500">Day 8 streak</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-medium text-[11px]">Logged 15m</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold flex items-center justify-center">
                    E
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Elena K.</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-500">Day 12 streak</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-medium text-[11px]">Logged 20m</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Arjun R.</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-500">Day 5 streak</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-medium text-[11px]">Logged 15m</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-1">
              Practicing together quietly across the city.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
