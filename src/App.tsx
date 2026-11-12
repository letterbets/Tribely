import { useState, useEffect } from 'react';
import { Hobby, DailyStep, SocialBookmark } from './types';
import {
  INITIAL_HOBBIES,
  INITIAL_DAILY_STEPS,
  INITIAL_HOBBY_MATES,
  INITIAL_SPACES,
  INITIAL_BOOKMARKS,
  INITIAL_GEAR_LISTINGS,
  INITIAL_COMMUNITY_THREADS,
} from './data/mockData';
import { TopNav } from './components/TopNav';
import { HobbyHeader } from './components/HobbyHeader';
import { DailyPlanView } from './components/DailyPlanView';
import { MapView } from './components/MapView';
import { ProgressView } from './components/ProgressView';
import { TribeExchangeView } from './components/TribeExchangeView';
import { ChatCoachDrawer } from './components/ChatCoachDrawer';
import { SocialBookmarkModal } from './components/SocialBookmarkModal';
import { NewHobbyModal } from './components/NewHobbyModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation view state
  const [currentView, setCurrentView] = useState<'daily' | 'map' | 'progress' | 'exchange'>('daily');

  // Hobbies state with local storage hydration
  const [hobbies, setHobbies] = useState<Hobby[]>(() => {
    const saved = localStorage.getItem('tribely_hobbies');
    return saved ? JSON.parse(saved) : INITIAL_HOBBIES;
  });

  const [activeHobbyId, setActiveHobbyId] = useState<string>(() => {
    return hobbies[0]?.id || 'watercolor';
  });

  // Daily steps per hobby
  const [dailySteps, setDailySteps] = useState<Record<string, DailyStep>>(() => {
    const saved = localStorage.getItem('tribely_steps');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_STEPS;
  });

  // Social bookmarks
  const [bookmarks, setBookmarks] = useState<SocialBookmark[]>(() => {
    const saved = localStorage.getItem('tribely_bookmarks');
    return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tribely_hobbies', JSON.stringify(hobbies));
  }, [hobbies]);

  useEffect(() => {
    localStorage.setItem('tribely_steps', JSON.stringify(dailySteps));
  }, [dailySteps]);

  useEffect(() => {
    localStorage.setItem('tribely_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Modals & Drawers
  const [coachOpen, setCoachOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [newHobbyModalOpen, setNewHobbyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeHobby = hobbies.find((h) => h.id === activeHobbyId) || hobbies[0];
  const activeStep = dailySteps[activeHobbyId] || {
    id: `step-${activeHobbyId}`,
    hobbyId: activeHobbyId,
    title: `15-Min Focused Fundamentals in ${activeHobby.name}`,
    estimatedMins: 15,
    objective: `Complete 15 deliberate minutes of practice.`,
    breakdown: [
      '2 min: Minimal gear setup.',
      '10 min: Focus on core technique repetition.',
      '3 min: Clean and pack tools.',
    ],
    equipmentNeeded: 'Basic starter kit',
    proTip: 'Show up for 15 minutes today; let compounding do the rest.',
    completed: false,
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Toggle step completion & streak
  const handleToggleCompleteStep = () => {
    const isNowCompleted = !activeStep.completed;

    setDailySteps((prev) => ({
      ...prev,
      [activeHobbyId]: {
        ...activeStep,
        completed: isNowCompleted,
      },
    }));

    setHobbies((prev) =>
      prev.map((h) => {
        if (h.id === activeHobbyId) {
          const newStreak = isNowCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          const newHours = isNowCompleted
            ? Number((h.totalHours + h.dailyGoalMins / 60).toFixed(2))
            : Math.max(0, Number((h.totalHours - h.dailyGoalMins / 60).toFixed(2)));
          const newFlow = isNowCompleted ? h.flowMinutes + h.dailyGoalMins : h.flowMinutes;

          return {
            ...h,
            todayCompleted: isNowCompleted,
            currentStreak: newStreak,
            totalHours: newHours,
            flowMinutes: newFlow,
          };
        }
        return h;
      })
    );

    if (isNowCompleted) {
      showToast(`🎉 15 Minutes Logged! Day ${activeHobby.currentStreak + 1} streak unlocked.`);
    }
  };

  // Quick log from top bar
  const handleQuickLog = () => {
    handleToggleCompleteStep();
  };

  // When bookmark is digested into a new daily step
  const handleApplyChapterAsDailyStep = (chapter: {
    title: string;
    objective: string;
    breakdown: string[];
    proTip: string;
    equipmentNeeded: string;
  }) => {
    setDailySteps((prev) => ({
      ...prev,
      [activeHobbyId]: {
        id: `step-digested-${Date.now()}`,
        hobbyId: activeHobbyId,
        title: chapter.title,
        estimatedMins: 15,
        objective: chapter.objective,
        breakdown: chapter.breakdown,
        proTip: chapter.proTip,
        equipmentNeeded: chapter.equipmentNeeded,
        completed: false,
      },
    }));

    // Add to bookmarks list
    const newBookmark: SocialBookmark = {
      id: `bm-${Date.now()}`,
      hobbyId: activeHobbyId,
      platform: 'Instagram',
      title: chapter.title,
      url: 'Social Bookmark Digest',
      creator: 'Creator Video',
      chapterSummary: {
        objective: chapter.objective,
        actionableSteps: chapter.breakdown,
        takeaway: chapter.proTip,
        budgetTip: chapter.equipmentNeeded,
      },
    };
    setBookmarks((prev) => [newBookmark, ...prev]);

    showToast(`✨ Chapter applied to today's 15-minute path!`);
  };

  // Add new hobby from modal
  const handleAddNewHobby = (newHobby: Hobby, newStep: DailyStep) => {
    setHobbies((prev) => [...prev, newHobby]);
    setDailySteps((prev) => ({
      ...prev,
      [newHobby.id]: newStep,
    }));
    setActiveHobbyId(newHobby.id);
    showToast(`🚀 ${newHobby.name} added! Day 1 plan ready.`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Contract (Zone 1: Brand, Zone 2: Links, Zone 3: 1 Primary CTA) */}
      <TopNav
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenCoach={() => setCoachOpen(true)}
        onQuickLog={handleQuickLog}
        todayCompleted={activeStep.completed}
        activeHobbyName={activeHobby.name}
      />

      {/* Sub-Header: Active Hobby Switcher & Unboxed Stats */}
      <HobbyHeader
        hobbies={hobbies}
        activeHobbyId={activeHobbyId}
        onSelectHobby={setActiveHobbyId}
        onAddNewHobby={() => setNewHobbyModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        {currentView === 'daily' && (
          <DailyPlanView
            activeHobby={activeHobby}
            dailyStep={activeStep}
            bookmarks={bookmarks.filter((b) => b.hobbyId === activeHobbyId)}
            onToggleCompleteStep={handleToggleCompleteStep}
            onOpenSocialModal={() => setSocialModalOpen(true)}
            onOpenCoach={() => setCoachOpen(true)}
            onAskCoachPrompt={(_prompt) => setCoachOpen(true)}
          />
        )}

        {currentView === 'map' && (
          <MapView
            hobbyMates={INITIAL_HOBBY_MATES}
            spaces={INITIAL_SPACES}
            activeHobbyName={activeHobby.name}
            onOpenCoach={() => setCoachOpen(true)}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            activeHobby={activeHobby}
            onOpenCoach={() => setCoachOpen(true)}
          />
        )}

        {currentView === 'exchange' && (
          <TribeExchangeView
            activeHobbyName={activeHobby.name}
            gearListings={INITIAL_GEAR_LISTINGS}
            threads={INITIAL_COMMUNITY_THREADS}
            onOpenCoach={() => setCoachOpen(true)}
          />
        )}
      </main>

      {/* Slide-in Chat Coach Drawer */}
      <ChatCoachDrawer
        isOpen={coachOpen}
        onClose={() => setCoachOpen(false)}
        activeHobbyName={activeHobby.name}
        activeHobbyLevel={activeHobby.level}
        currentStreak={activeHobby.currentStreak}
        onApplyDrillAsDailyStep={(drillText) => {
          setDailySteps((prev) => ({
            ...prev,
            [activeHobbyId]: {
              id: `step-coach-${Date.now()}`,
              hobbyId: activeHobbyId,
              title: `Coach Suggested Micro-Drill`,
              estimatedMins: 10,
              objective: drillText.slice(0, 100),
              breakdown: [
                '2 min: Posture and breath reset.',
                '6 min: High-focus deliberate practice.',
                '2 min: Cool down and record progression.',
              ],
              equipmentNeeded: 'Minimal starter tools',
              proTip: 'Smooth is fast. Focus on quality over rushed repetitions.',
              completed: false,
            },
          }));
          showToast(`Coach drill set as today's practice!`);
        }}
      />

      {/* Social Media Bookmark to Action Digester Modal */}
      <SocialBookmarkModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        activeHobbyName={activeHobby.name}
        existingBookmarks={bookmarks.filter((b) => b.hobbyId === activeHobbyId)}
        onApplyChapterAsDailyStep={handleApplyChapterAsDailyStep}
      />

      {/* New Hobby Creator Modal */}
      <NewHobbyModal
        isOpen={newHobbyModalOpen}
        onClose={() => setNewHobbyModalOpen(false)}
        onAddHobby={handleAddNewHobby}
      />

      {/* Quiet, anti-slop footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Tribely</span>
            <span>—</span>
            <span>15 minutes a day · Real-time local tribes · Zero barrier to entry</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Community Spaces</span>
            <span>·</span>
            <span>Gear Swaps</span>
            <span>·</span>
            <span>Frugal Starter Guides</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
