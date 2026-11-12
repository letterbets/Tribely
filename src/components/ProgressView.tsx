import React from 'react';
import { Hobby } from '../types';
import {
  Trophy,
  Flame,
  Brain,
  Smartphone,
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProgressViewProps {
  activeHobby: Hobby;
  onOpenCoach: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  activeHobby,
  onOpenCoach,
}) => {
  // Level tiers definitions
  const tiers = [
    { name: 'Novice', minHours: 0, maxHours: 10, desc: 'Overcoming initial hesitation, getting comfortable with starter tools.' },
    { name: 'Apprentice', minHours: 10, maxHours: 30, desc: 'Building consistent 15-min daily rhythm, learning core mechanics.' },
    { name: 'Practitioner', minHours: 30, maxHours: 70, desc: 'Self-sufficient problem solving, fluid muscle memory, joining jams.' },
    { name: 'Artisan', minHours: 70, maxHours: 150, desc: 'Developing personal creative voice, guiding new tribe members.' },
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === activeHobby.level);
  const currentTier = tiers[currentTierIndex] || tiers[0];
  const nextTier = tiers[currentTierIndex + 1];

  const hoursInCurrentTier = Math.max(0, activeHobby.totalHours - currentTier.minHours);
  const tierHourSpan = currentTier.maxHours - currentTier.minHours;
  const progressPercent = Math.min(100, Math.round((hoursInCurrentTier / tierHourSpan) * 100));
  const hoursRemaining = Math.max(0, currentTier.maxHours - activeHobby.totalHours);

  // Cohort comparison stats
  const cohortPercentile = activeHobby.cohortPercentile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Skill Progression & Relative Benchmarks
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track how your 15-minute daily micro-habits compound into genuine craft and how you compare to fellow learners.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-slate-900">{activeHobby.currentStreak} Days</span>
            <span className="text-slate-500">Streak</span>
          </div>

          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-900 tabular-nums">{activeHobby.totalHours}h</span>
            <span className="text-slate-500">Total Practice</span>
          </div>
        </div>
      </div>

      {/* Level-Up Progression Roadmap */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              Current Skill Stage
            </div>
            <div className="text-xl font-bold text-slate-900 font-display mt-0.5 flex items-center gap-2">
              <span>Tier {currentTierIndex + 1}: {activeHobby.level}</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {activeHobby.name}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{currentTier.desc}</p>
          </div>

          {nextTier && (
            <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 text-xs">
              <div className="text-slate-400">Next Stage:</div>
              <div className="font-bold text-slate-800 text-sm">{nextTier.name}</div>
              <div className="text-emerald-700 font-semibold mt-0.5">
                {hoursRemaining.toFixed(1)}h remaining (~{Math.ceil((hoursRemaining * 60) / 15)} sessions)
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>{currentTier.name} ({currentTier.minHours}h)</span>
            <span className="text-emerald-800 font-bold">{progressPercent}% to {nextTier ? nextTier.name : 'Mastery'}</span>
            <span>{nextTier ? `${nextTier.name} (${currentTier.maxHours}h)` : 'Max'}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* 4-Tier Visual Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {tiers.map((t, idx) => {
            const isPassed = activeHobby.totalHours >= t.maxHours;
            const isCurrent = activeHobby.level === t.name;
            return (
              <div
                key={t.name}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  isCurrent
                    ? 'border-slate-900 bg-slate-50/80'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-600'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className={isCurrent ? 'text-slate-900' : isPassed ? 'text-emerald-800' : 'text-slate-400'}>
                    {idx + 1}. {t.name}
                  </span>
                  <span className="tabular-nums font-mono text-[11px]">{t.minHours}–{t.maxHours}h</span>
                </div>
                <div className="text-[11px] line-clamp-2 leading-relaxed">
                  {t.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relative Cohort Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cohort Benchmark Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Relative Beginner Cohort Standing
              </div>
              <h2 className="text-base font-bold text-slate-900 font-display mt-0.5">
                Top {100 - cohortPercentile}% in Consistency
              </h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Compared to 480 people who started {activeHobby.name} in the last 60 days, your daily 15-minute routine puts you in the upper tier for habit retention.
          </p>

          {/* Visual bell-curve / cohort distribution bar */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-800">
              Where You Stand Among This Month's Beginners:
            </div>
            
            <div className="relative pt-6 pb-2">
              {/* Pointer indicator */}
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${cohortPercentile}%` }}
              >
                <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
                  You ({cohortPercentile}th Percentile)
                </span>
                <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5"></div>
              </div>

              {/* Multi-shade bar */}
              <div className="h-4 rounded-full flex overflow-hidden border border-slate-200">
                <div className="w-1/3 bg-slate-200" title="Occasional (1-2 days/week)"></div>
                <div className="w-1/3 bg-slate-300" title="Regular (3-4 days/week)"></div>
                <div className="w-1/3 bg-emerald-600" title="Consistent Daily (5-7 days/week)"></div>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Casual (~15m/week)</span>
              <span>Average (~45m/week)</span>
              <span className="font-semibold text-emerald-700">Dedicated Tribe (~105m/week)</span>
            </div>
          </div>

          {/* Relative Milestones comparison */}
          <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
            <div className="font-bold text-slate-900">
              Key Cohort Landmarks:
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Day 7 "Drop-off Hurdle" Overcome</span>
                    <p className="text-[11px] text-slate-500">64% of people quit before Day 7. You’re already past it!</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-[11px]">Achieved</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">First Tribe Jam / Shared Space Visit</span>
                    <p className="text-[11px] text-slate-500">Connect with 1 person nearby to share tips in person.</p>
                  </div>
                </div>
                <span className="text-slate-500 font-medium text-[11px]">Next Milestone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health, Mind & Digital Detox ROI (from Business Model Canvas) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  Lifestyle & Wellness ROI
                </div>
                <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
                  Mindfulness Beyond Social Feeds
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Replacing passive phone scrolling with tactile, analog crafts yields measurable mental health and focus recovery.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Creative Flow Logged:</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-display mt-1">
                  {activeHobby.flowMinutes} mins
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Deep state of immersion without distractions.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital Screen Detox:</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-display mt-1 tabular-nums">
                  {activeHobby.totalHours} hours
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Time reclaimed from passive endless scrolling.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  <span>Calm Focus Recovery:</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-display mt-1">
                  +42%
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Self-reported stress reduction after 15m sessions.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCoach}
            className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Coach How to Level Up Faster</span>
          </button>
        </div>
      </div>
    </div>
  );
};
