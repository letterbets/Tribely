import React from 'react';
import { Hobby } from '../types';
import { Palette, Mountain, Music, Sprout, Plus, Flame, Sparkles } from 'lucide-react';

interface HobbyHeaderProps {
  hobbies: Hobby[];
  activeHobbyId: string;
  onSelectHobby: (id: string) => void;
  onAddNewHobby: () => void;
}

export const HobbyHeader: React.FC<HobbyHeaderProps> = ({
  hobbies,
  activeHobbyId,
  onSelectHobby,
  onAddNewHobby,
}) => {
  const activeHobby = hobbies.find((h) => h.id === activeHobbyId) || hobbies[0];

  const getHobbyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mountain':
        return <Mountain className="w-4 h-4 text-amber-700" />;
      case 'Music':
        return <Music className="w-4 h-4 text-indigo-700" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-emerald-700" />;
      case 'Palette':
      default:
        return <Palette className="w-4 h-4 text-sky-700" />;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top line: Hobby Tabs & Add */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {hobbies.map((hobby) => {
              const isActive = hobby.id === activeHobbyId;
              return (
                <button
                  key={hobby.id}
                  onClick={() => onSelectHobby(hobby.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <span className={isActive ? 'opacity-90 brightness-200' : ''}>
                    {getHobbyIcon(hobby.iconName)}
                  </span>
                  <span>{hobby.name}</span>
                  {hobby.todayCompleted && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              );
            })}

            <button
              onClick={onAddNewHobby}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Explore New Hobby</span>
            </button>
          </div>

          {/* Quick stats unboxed metadata */}
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1 text-slate-800 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{activeHobby.currentStreak} day streak</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div>
              <span className="font-semibold text-slate-900 tabular-nums">{activeHobby.totalHours}h</span> logged
            </div>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <div>
              Level: <span className="font-semibold text-slate-900">{activeHobby.level}</span>
            </div>
          </div>
        </div>

        {/* Current Focus Highlight */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-slate-900">Current 15-Min Focus:</span>
            <span className="text-slate-600">{activeHobby.currentFocus}</span>
          </div>

          <div className="text-slate-500">
            Target: <span className="font-semibold text-slate-700">{activeHobby.dailyGoalMins} mins/day</span>
            <span className="mx-2 text-slate-300">|</span>
            Relative Standing: <span className="text-emerald-700 font-semibold">Top {100 - activeHobby.cohortPercentile}%</span> among beginners
          </div>
        </div>
      </div>
    </div>
  );
};
