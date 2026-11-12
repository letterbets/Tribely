import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Hobby, DailyStep, Badge, BadgeCategory, BadgeTier } from '../types';
import {
  Award,
  Flame,
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Share2,
  ChevronRight,
  TrendingUp,
  Zap,
  Target,
  Compass,
  Layers,
  X,
  Copy,
  Check,
} from 'lucide-react';

interface BadgesViewProps {
  hobbies: Hobby[];
  activeHobby: Hobby;
  dailyStep?: DailyStep;
  onOpenCoach: () => void;
  onQuickLog: () => void;
  onUpdateHobbyHours?: (hobbyId: string, additionalHours: number) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  hobbies,
  activeHobby,
  onOpenCoach,
  onQuickLog,
  onUpdateHobbyHours,
}) => {
  // Scope: 'all' (combined profile stats) or specific hobby id
  const [selectedScope, setSelectedScope] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeModalBadge, setActiveModalBadge] = useState<Badge | null>(null);
  const [copiedBadgeId, setCopiedBadgeId] = useState<string | null>(null);
  const [justCelebratedId, setJustCelebratedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute stats according to selected scope
  const stats = useMemo(() => {
    if (selectedScope === 'all') {
      const totalHours = Number(
        hobbies.reduce((sum, h) => sum + (h.totalHours || 0), 0).toFixed(1)
      );
      const maxStreak = hobbies.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0);
      const totalFlowMinutes = hobbies.reduce((sum, h) => sum + (h.flowMinutes || 0), 0);
      const hobbiesCount = hobbies.length;
      const bestPercentile = hobbies.reduce((max, h) => Math.max(max, h.cohortPercentile || 0), 0);
      const hasCompletedToday = hobbies.some((h) => h.todayCompleted);

      return {
        scopeName: 'All Hobbies (Combined)',
        totalHours,
        currentStreak: maxStreak,
        flowMinutes: totalFlowMinutes,
        hobbiesCount,
        cohortPercentile: bestPercentile,
        hasCompletedToday,
      };
    } else {
      const hobby = hobbies.find((h) => h.id === selectedScope) || activeHobby;
      return {
        scopeName: hobby.name,
        totalHours: hobby.totalHours,
        currentStreak: hobby.currentStreak,
        flowMinutes: hobby.flowMinutes,
        hobbiesCount: 1,
        cohortPercentile: hobby.cohortPercentile,
        hasCompletedToday: hobby.todayCompleted,
      };
    }
  }, [hobbies, activeHobby, selectedScope]);

  // Master badge definitions dynamically evaluated against current stats
  const allBadges: Badge[] = useMemo(() => {
    const list: Array<Omit<Badge, 'currentValue' | 'unlocked' | 'unlockedAt'> & {
      calculateCurrent: (s: typeof stats) => number;
    }> = [
      // 1. Streak Milestones
      {
        id: 'streak-1',
        title: 'First Spark',
        tagline: 'Day 1 Commitment',
        description: 'Complete your initial 15-minute practice session and light the habit flame.',
        category: 'streak',
        tier: 'Bronze',
        iconName: 'Zap',
        targetValue: 1,
        unit: 'days',
        xpReward: 50,
        perkText: 'Overcame the hardest inertia: starting.',
        calculateCurrent: (s) => (s.currentStreak >= 1 || s.hasCompletedToday ? 1 : 0),
      },
      {
        id: 'streak-3',
        title: '3-Day Ignition',
        tagline: 'Tri-Day Discipline',
        description: 'Log 3 consecutive days of 15-minute micro-sessions.',
        category: 'streak',
        tier: 'Bronze',
        iconName: 'Flame',
        targetValue: 3,
        unit: 'days',
        xpReward: 100,
        perkText: 'Brain begins wiring routine into basal ganglia.',
        calculateCurrent: (s) => s.currentStreak,
      },
      {
        id: 'streak-7',
        title: '7-Day Streak',
        tagline: 'Week Warrior',
        description: 'Complete a full 7 consecutive days of 15-minute practice without missing a beat.',
        category: 'streak',
        tier: 'Silver',
        iconName: 'Award',
        targetValue: 7,
        unit: 'days',
        xpReward: 250,
        perkText: 'Habit stability increases by 80% once the 7-day barrier is cleared.',
        calculateCurrent: (s) => s.currentStreak,
      },
      {
        id: 'streak-14',
        title: '14-Day Momentum',
        tagline: 'Two-Week Lock',
        description: 'Forge a 14-day continuous daily streak across your micro-practice.',
        category: 'streak',
        tier: 'Gold',
        iconName: 'Trophy',
        targetValue: 14,
        unit: 'days',
        xpReward: 500,
        perkText: 'Practice switches from conscious effort to automatic daily ritual.',
        calculateCurrent: (s) => s.currentStreak,
      },
      {
        id: 'streak-30',
        title: '30-Day Legend',
        tagline: 'Monthly Mastery',
        description: 'Sustain 30 continuous days of deliberate practice. You are unstoppable.',
        category: 'streak',
        tier: 'Diamond',
        iconName: 'Sparkles',
        targetValue: 30,
        unit: 'days',
        xpReward: 1000,
        perkText: 'Top 3% of all hobbyists sustain a 30-day streak.',
        calculateCurrent: (s) => s.currentStreak,
      },

      // 2. Hours Milestones
      {
        id: 'hours-1',
        title: 'Hour of Power',
        tagline: 'The First 60 Minutes',
        description: 'Accumulate your first full hour (4 x 15 min sessions) of intentional practice.',
        category: 'hours',
        tier: 'Bronze',
        iconName: 'Clock',
        targetValue: 1,
        unit: 'hours',
        xpReward: 50,
        perkText: 'Starter hesitation officially defeated.',
        calculateCurrent: (s) => s.totalHours,
      },
      {
        id: 'hours-10',
        title: '10 Hours Groundwork',
        tagline: 'Apprentice Foundation',
        description: 'Reach 10 cumulative hours of practice, crossing into the Apprentice tier.',
        category: 'hours',
        tier: 'Bronze',
        iconName: 'Clock',
        targetValue: 10,
        unit: 'hours',
        xpReward: 150,
        perkText: 'Foundational muscle memory is permanent.',
        calculateCurrent: (s) => s.totalHours,
      },
      {
        id: 'hours-25',
        title: '25 Hours Explorer',
        tagline: 'Technique Fluency',
        description: 'Complete 25 deliberate practice hours. Core fundamentals feel natural.',
        category: 'hours',
        tier: 'Silver',
        iconName: 'Target',
        targetValue: 25,
        unit: 'hours',
        xpReward: 300,
        perkText: 'You can improvise without constantly checking instructions.',
        calculateCurrent: (s) => s.totalHours,
      },
      {
        id: 'hours-50',
        title: '50 Hours Practitioner',
        tagline: 'Halfway to Century',
        description: 'Log 50 hours of practice. Transition into self-sufficient craft execution.',
        category: 'hours',
        tier: 'Silver',
        iconName: 'TrendingUp',
        targetValue: 50,
        unit: 'hours',
        xpReward: 600,
        perkText: 'You can now assist beginners in local tribe meetups.',
        calculateCurrent: (s) => s.totalHours,
      },
      {
        id: 'hours-100',
        title: '100 Hours Logged',
        tagline: 'Centurion of Craft',
        description: 'Achieve 100 cumulative hours of deliberate practice. A milestone of true dedication.',
        category: 'hours',
        tier: 'Gold',
        iconName: 'Trophy',
        targetValue: 100,
        unit: 'hours',
        xpReward: 1200,
        perkText: 'According to learning psychology, 100 hours puts you ahead of 95% of casual learners.',
        calculateCurrent: (s) => s.totalHours,
      },
      {
        id: 'hours-250',
        title: '250 Hours Artisan',
        tagline: 'Deep Craft Immersion',
        description: 'Cross 250 hours. Signature style and effortless execution emerge.',
        category: 'hours',
        tier: 'Platinum',
        iconName: 'Sparkles',
        targetValue: 250,
        unit: 'hours',
        xpReward: 2500,
        perkText: 'Artisan level achieved. Ready to host workshops.',
        calculateCurrent: (s) => s.totalHours,
      },

      // 3. Flow & Focus Milestones
      {
        id: 'flow-300',
        title: 'Flow State Seeker',
        tagline: 'Deep Immersion',
        description: 'Log over 300 minutes of pure flow state without digital distractions.',
        category: 'flow',
        tier: 'Silver',
        iconName: 'Zap',
        targetValue: 300,
        unit: 'mins',
        xpReward: 250,
        perkText: 'Reaching flow reduces cortisol and doubles skill retention.',
        calculateCurrent: (s) => s.flowMinutes,
      },
      {
        id: 'flow-1000',
        title: 'Deep Flow Sage',
        tagline: 'Zen Focus',
        description: 'Surpass 1,000 minutes of uninterrupted craft immersion.',
        category: 'flow',
        tier: 'Gold',
        iconName: 'Sparkles',
        targetValue: 1000,
        unit: 'mins',
        xpReward: 800,
        perkText: 'Time dilation experienced regularly during practice.',
        calculateCurrent: (s) => s.flowMinutes,
      },

      // 4. Mastery & Tribe Milestones
      {
        id: 'polymath-3',
        title: 'Polymath Pioneer',
        tagline: 'Renaissance Spirit',
        description: 'Active learner in 3 or more distinct craft hobbies simultaneously.',
        category: 'mastery',
        tier: 'Silver',
        iconName: 'Layers',
        targetValue: 3,
        unit: 'hobbies',
        xpReward: 350,
        perkText: 'Cross-pollinating skills accelerates creative problem solving.',
        calculateCurrent: (s) => s.hobbiesCount,
      },
      {
        id: 'cohort-80',
        title: 'Cohort Pacesetter',
        tagline: 'Top 20% Learner',
        description: 'Rank in the top 20% (80th+ percentile) among your peer beginner cohort.',
        category: 'mastery',
        tier: 'Gold',
        iconName: 'Award',
        targetValue: 80,
        unit: '%',
        xpReward: 500,
        perkText: 'Proof that 15 minutes a day outperforms sporadic marathon practice.',
        calculateCurrent: (s) => s.cohortPercentile,
      },
      {
        id: 'tribe-scout',
        title: 'Tribe Connector',
        tagline: 'Local Tribe Pioneer',
        description: 'Explore community spaces and connect with local HobbyMates on the map.',
        category: 'community',
        tier: 'Bronze',
        iconName: 'Compass',
        targetValue: 1,
        unit: 'connect',
        xpReward: 150,
        perkText: 'Learning in community improves practice consistency by 65%.',
        calculateCurrent: () => 1, // Granted to all Tribely explorers
      },
    ];

    return list.map((item) => {
      const currentVal = item.calculateCurrent(stats);
      const unlocked = currentVal >= item.targetValue;
      return {
        id: item.id,
        title: item.title,
        tagline: item.tagline,
        description: item.description,
        category: item.category,
        tier: item.tier,
        iconName: item.iconName,
        targetValue: item.targetValue,
        currentValue: currentVal,
        unit: item.unit,
        unlocked,
        unlockedAt: unlocked ? 'Awarded in Tribely' : undefined,
        xpReward: item.xpReward,
        perkText: item.perkText,
      };
    });
  }, [stats]);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return allBadges.filter((b) => {
      if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
      if (statusFilter === 'unlocked' && !b.unlocked) return false;
      if (statusFilter === 'locked' && b.unlocked) return false;
      return true;
    });
  }, [allBadges, selectedCategory, statusFilter]);

  // Summary counts
  const unlockedCount = useMemo(() => allBadges.filter((b) => b.unlocked).length, [allBadges]);
  const totalBadgesCount = allBadges.length;
  const totalEarnedXP = useMemo(
    () => allBadges.filter((b) => b.unlocked).reduce((sum, b) => sum + b.xpReward, 0),
    [allBadges]
  );
  const totalPossibleXP = useMemo(() => allBadges.reduce((sum, b) => sum + b.xpReward, 0), [allBadges]);
  const progressRatio = Math.round((unlockedCount / totalBadgesCount) * 100);

  // Next closest milestone to unlock
  const nextMilestone = useMemo(() => {
    const locked = allBadges.filter((b) => !b.unlocked);
    if (locked.length === 0) return null;
    return locked.reduce((closest, curr) => {
      const currPct = curr.currentValue / curr.targetValue;
      const closestPct = closest.currentValue / closest.targetValue;
      return currPct > closestPct ? curr : closest;
    }, locked[0]);
  }, [allBadges]);

  // Subtle confetti effect when inspecting an unlocked badge
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
    const particles = Array.from({ length: 65 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 - 50,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.alpha -= 0.016;
        p.rotation += p.vRot;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  };

  const handleOpenBadgeModal = (badge: Badge) => {
    setActiveModalBadge(badge);
    if (badge.unlocked) {
      setTimeout(triggerConfetti, 50);
    }
  };

  const handleCopyBrag = (badge: Badge) => {
    const text = `🏆 I earned the "${badge.title}" badge on Tribely!\n${badge.description}\n🎯 Milestone: ${badge.targetValue} ${badge.unit} | +${badge.xpReward} XP.\n15 minutes of daily practice really compounds! #TribelyHobby`;
    navigator.clipboard.writeText(text);
    setCopiedBadgeId(badge.id);
    setTimeout(() => setCopiedBadgeId(null), 2500);
  };

  // Helper for rendering icons
  const renderIcon = (name: string, className: string = 'w-6 h-6') => {
    switch (name) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Award':
      default:
        return <Award className={className} />;
    }
  };

  // Tier styling helpers
  const getTierStyles = (tier: BadgeTier, unlocked: boolean) => {
    if (!unlocked) {
      return {
        badgeBg: 'bg-slate-100 border-slate-200 text-slate-400',
        badgeIconBg: 'bg-slate-200 text-slate-400',
        pill: 'bg-slate-100 text-slate-500 border-slate-200',
        accentBorder: 'border-slate-200',
        glow: 'border-slate-200',
      };
    }

    switch (tier) {
      case 'Bronze':
        return {
          badgeBg: 'bg-gradient-to-br from-amber-50 to-orange-50/60 border-amber-200/90 text-amber-900',
          badgeIconBg: 'bg-gradient-to-tr from-amber-600 to-amber-700 text-white shadow-xs',
          pill: 'bg-amber-100/80 text-amber-900 border-amber-200',
          accentBorder: 'border-amber-300',
          glow: 'hover:shadow-md hover:border-amber-400',
        };
      case 'Silver':
        return {
          badgeBg: 'bg-gradient-to-br from-slate-50 to-zinc-100/80 border-slate-300 text-slate-900',
          badgeIconBg: 'bg-gradient-to-tr from-slate-500 to-slate-700 text-white shadow-xs',
          pill: 'bg-slate-200/80 text-slate-800 border-slate-300',
          accentBorder: 'border-slate-400',
          glow: 'hover:shadow-md hover:border-slate-400',
        };
      case 'Gold':
        return {
          badgeBg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100/40 border-amber-300 text-amber-950',
          badgeIconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-white shadow-xs',
          pill: 'bg-amber-200/90 text-amber-950 font-semibold border-amber-300',
          accentBorder: 'border-amber-400',
          glow: 'hover:shadow-lg hover:shadow-amber-100/60 hover:border-amber-400',
        };
      case 'Platinum':
        return {
          badgeBg: 'bg-gradient-to-br from-cyan-50/70 via-indigo-50/50 to-slate-50 border-cyan-300 text-slate-900',
          badgeIconBg: 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-xs',
          pill: 'bg-cyan-100 text-cyan-900 border-cyan-200',
          accentBorder: 'border-cyan-300',
          glow: 'hover:shadow-lg hover:border-cyan-400',
        };
      case 'Diamond':
        return {
          badgeBg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-300 text-emerald-950',
          badgeIconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-xs',
          pill: 'bg-emerald-100 text-emerald-900 font-bold border-emerald-200',
          accentBorder: 'border-emerald-400',
          glow: 'hover:shadow-lg hover:shadow-emerald-100/70 hover:border-emerald-400',
        };
      default:
        return {
          badgeBg: 'bg-white border-slate-200 text-slate-800',
          badgeIconBg: 'bg-slate-900 text-white',
          pill: 'bg-slate-100 text-slate-700 border-slate-200',
          accentBorder: 'border-slate-200',
          glow: 'hover:shadow-md',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Confetti Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Header & Milestone Showcase */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Virtual Milestone Vault
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              {stats.scopeName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-2">
            Milestones & Virtual Badges
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Honoring your consistency and practice time. Every 15-minute daily micro-step compounds into
            measurable mastery.
          </p>
        </div>

        {/* Scope Selector: Combined vs Specific Hobby */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-xs self-start lg:self-auto text-xs">
          <span className="text-slate-400 px-2 font-medium">Scope:</span>
          <button
            onClick={() => setSelectedScope('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedScope === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            All Hobbies
          </button>
          {hobbies.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedScope(h.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedScope === h.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Badges Progress Gauge */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-slate-700">
                Milestone Completion
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {unlockedCount} / {totalBadgesCount}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-display">
                {progressRatio}%
              </span>
              <span className="text-xs text-slate-500">of badges unlocked</span>
            </div>

            {/* Custom progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tribe XP: <strong>{totalEarnedXP}</strong> / {totalPossibleXP} pts</span>
            </span>
            <span className="text-emerald-700 font-semibold">
              +{allBadges.filter((b) => b.unlocked && b.tier === 'Gold').length} Gold
            </span>
          </div>
        </div>

        {/* Card 2: Live Core Stats (Streak & Hours) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Active Milestone Metrics
            </span>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Current Streak</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-950 font-display mt-1">
                  {stats.currentStreak} <span className="text-xs font-normal text-amber-800">Days</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {stats.currentStreak >= 7 ? '✓ 7-Day Streak Badge Unlocked!' : `${7 - stats.currentStreak} days to 7-Day Badge`}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Logged Hours</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-display mt-1">
                  {stats.totalHours} <span className="text-xs font-normal text-slate-500">hrs</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {stats.totalHours >= 100
                    ? '✓ 100 Hours Logged Unlocked!'
                    : `${(100 - stats.totalHours).toFixed(1)}h to Centurion (100h)`}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Flow Time: <strong>{stats.flowMinutes} mins</strong></span>
            <button
              onClick={onQuickLog}
              className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Log Today's 15m</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Next Closest Milestone Highlight */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="uppercase tracking-wider font-semibold text-amber-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Next Target Badge
              </span>
              {nextMilestone && (
                <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300">
                  {nextMilestone.tier}
                </span>
              )}
            </div>

            {nextMilestone ? (
              <div className="mt-3">
                <h3 className="text-lg font-bold font-display text-white">
                  {nextMilestone.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {nextMilestone.description}
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Progress</span>
                    <span className="font-semibold text-amber-300">
                      {nextMilestone.currentValue} / {nextMilestone.targetValue} {nextMilestone.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((nextMilestone.currentValue / nextMilestone.targetValue) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center py-2">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-semibold mt-2">All Milestones Unlocked!</p>
                <p className="text-xs text-slate-300 mt-0.5">You have mastered the entire vault.</p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
            {nextMilestone ? (
              <>
                <span className="text-slate-400">
                  Earns +{nextMilestone.xpReward} XP
                </span>
                <button
                  onClick={() => handleOpenBadgeModal(nextMilestone)}
                  className="text-amber-300 hover:text-amber-200 font-semibold cursor-pointer flex items-center gap-1"
                >
                  Inspect Milestone
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <span className="text-amber-300 font-semibold">Master Polymath Status</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-200 pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'streak', label: 'Streaks & Habits' },
            { id: 'hours', label: 'Practice Hours' },
            { id: 'flow', label: 'Flow & Focus' },
            { id: 'mastery', label: 'Mastery' },
            { id: 'community', label: 'Community' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filters & Coach Prompt */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex items-center">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              All ({allBadges.length})
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === 'unlocked' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-500'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'locked' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500'
              }`}
            >
              Locked ({totalBadgesCount - unlockedCount})
            </button>
          </div>

          <button
            onClick={onOpenCoach}
            className="hidden md:flex items-center gap-1.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <span>Ask Coach for Drill</span>
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBadges.map((badge) => {
          const styles = getTierStyles(badge.tier, badge.unlocked);
          const percent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => handleOpenBadgeModal(badge)}
              className={`relative group bg-white border rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                badge.unlocked
                  ? `${styles.badgeBg} ${styles.accentBorder} ${styles.glow}`
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Unlocked status badge pill top right */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.pill}`}
                >
                  {badge.tier}
                </span>

                {badge.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                    <Lock className="w-2.5 h-2.5" />
                    Locked
                  </span>
                )}
              </div>

              {/* Insignia & Titles */}
              <div className="my-4 text-center flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${styles.badgeIconBg}`}
                >
                  {renderIcon(badge.iconName, 'w-7 h-7')}
                </div>

                <h3 className="font-bold text-slate-900 font-display text-base mt-3 leading-snug">
                  {badge.title}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {badge.tagline}
                </span>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 px-1">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Reward Footer */}
              <div className="pt-3 border-t border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {badge.unlocked ? 'Milestone achieved' : 'Progress'}
                  </span>
                  <span
                    className={`font-semibold ${
                      badge.unlocked ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {badge.currentValue} / {badge.targetValue} {badge.unit} ({percent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      badge.unlocked
                        ? 'bg-emerald-600'
                        : percent > 50
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="font-semibold text-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    +{badge.xpReward} XP
                  </span>
                  <span className="text-slate-400 group-hover:text-slate-700 group-hover:underline flex items-center gap-0.5">
                    View
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Share Modal */}
      {activeModalBadge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative p-6 sm:p-7 pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                    getTierStyles(activeModalBadge.tier, activeModalBadge.unlocked).badgeIconBg
                  }`}
                >
                  {renderIcon(activeModalBadge.iconName, 'w-8 h-8')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                        getTierStyles(activeModalBadge.tier, activeModalBadge.unlocked).pill
                      }`}
                    >
                      {activeModalBadge.tier} Tier
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      +{activeModalBadge.xpReward} XP
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-display mt-1">
                    {activeModalBadge.title}
                  </h2>
                  <p className="text-xs text-slate-500">{activeModalBadge.tagline}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalBadge(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5 text-sm">
              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  activeModalBadge.unlocked
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                {activeModalBadge.unlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div className="text-xs">
                  <div className="font-semibold">
                    {activeModalBadge.unlocked
                      ? 'Milestone Unlocked & Verified'
                      : 'Milestone Currently In Progress'}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    {activeModalBadge.unlocked
                      ? `Requirement met: ${activeModalBadge.currentValue} / ${activeModalBadge.targetValue} ${activeModalBadge.unit}`
                      : `Needs ${(
                          activeModalBadge.targetValue - activeModalBadge.currentValue
                        ).toFixed(1)} more ${activeModalBadge.unit} to unlock.`}
                  </div>
                </div>
              </div>

              {/* Requirement Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Requirement
                </h4>
                <p className="text-slate-800 text-sm mt-1 leading-relaxed">
                  {activeModalBadge.description}
                </p>
              </div>

              {/* Craft Psychology Insight */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Why This Milestone Matters
                </span>
                <p className="text-slate-600 leading-relaxed">{activeModalBadge.perkText}</p>
              </div>

              {/* Progress gauge inside modal */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Current Metric</span>
                  <span className="font-semibold text-slate-900">
                    {activeModalBadge.currentValue} / {activeModalBadge.targetValue}{' '}
                    {activeModalBadge.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      activeModalBadge.unlocked ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (activeModalBadge.currentValue / activeModalBadge.targetValue) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopyBrag(activeModalBadge)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                {copiedBadgeId === activeModalBadge.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Brag Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-600" />
                    <span>Share Badge</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {!activeModalBadge.unlocked && (
                  <button
                    onClick={() => {
                      onQuickLog();
                      setActiveModalBadge(null);
                    }}
                    className="text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Log 15m Practice</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveModalBadge(null)}
                  className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
