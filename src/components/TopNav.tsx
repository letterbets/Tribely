import React from 'react';
import { Compass, CheckCircle2, MessageSquareText, Award } from 'lucide-react';

interface TopNavProps {
  currentView: 'daily' | 'map' | 'progress' | 'exchange' | 'badges';
  onSelectView: (view: 'daily' | 'map' | 'progress' | 'exchange' | 'badges') => void;
  onOpenCoach: () => void;
  onQuickLog: () => void;
  todayCompleted: boolean;
  activeHobbyName: string;
  unlockedBadgesCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onSelectView,
  onOpenCoach,
  onQuickLog,
  todayCompleted,
  unlockedBadgesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectView('daily')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap font-display">
              Tribely
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectView('daily')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentView === 'daily'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My 15-Min Path
          </button>

          <button
            onClick={() => onSelectView('map')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'map'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            HobbyMate Map
            <span className="inline-flex items-center justify-center text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
              Live
            </span>
          </button>

          <button
            onClick={() => onSelectView('progress')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentView === 'progress'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Relative Progress
          </button>

          <button
            onClick={() => onSelectView('badges')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'badges'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Badges</span>
            {unlockedBadgesCount !== undefined && (
              <span className="inline-flex items-center justify-center text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                {unlockedBadgesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('exchange')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentView === 'exchange'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tribe Exchange
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action with Coach shortcut */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCoach}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            title="Chat with AI Hobby Coach"
          >
            <MessageSquareText className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Ask Coach</span>
          </button>

          <button
            onClick={onQuickLog}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs ${
              todayCompleted
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{todayCompleted ? 'Done Today (15m)' : 'Log 15 Mins'}</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => onSelectView('daily')}
          className={`py-1 px-2 rounded-md shrink-0 ${
            currentView === 'daily' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Daily Path
        </button>
        <button
          onClick={() => onSelectView('map')}
          className={`py-1 px-2 rounded-md shrink-0 flex items-center gap-1 ${
            currentView === 'map' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Tribe Map
          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
        </button>
        <button
          onClick={() => onSelectView('progress')}
          className={`py-1 px-2 rounded-md shrink-0 ${
            currentView === 'progress' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => onSelectView('badges')}
          className={`py-1 px-2 rounded-md shrink-0 flex items-center gap-1 ${
            currentView === 'badges' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          <Award className="w-3 h-3 text-amber-500" />
          Badges
        </button>
        <button
          onClick={() => onSelectView('exchange')}
          className={`py-1 px-2 rounded-md shrink-0 ${
            currentView === 'exchange' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
          }`}
        >
          Exchange
        </button>
      </div>
    </header>
  );
};

