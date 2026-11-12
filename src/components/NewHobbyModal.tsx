import React, { useState } from 'react';
import { Hobby, DailyStep } from '../types';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface NewHobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHobby: (hobby: Hobby, dailyStep: DailyStep) => void;
}

export const NewHobbyModal: React.FC<NewHobbyModalProps> = ({
  isOpen,
  onClose,
  onAddHobby,
}) => {
  const [hobbyName, setHobbyName] = useState('');
  const [category, setCategory] = useState('Visual Arts');
  const [dailyMins, setDailyMins] = useState(15);
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const popularSuggestions = [
    { name: 'Film Photography', category: 'Visual Arts' },
    { name: 'Sourdough Bread Baking', category: 'Culinary Craft' },
    { name: 'Ceramics & Wheel Throwing', category: 'Craft' },
    { name: 'Skateboarding & Balance', category: 'Physical & Movement' },
    { name: 'Creative Writing & Zines', category: 'Writing' },
    { name: 'Mechanical Keyboards & Soldering', category: 'Tech & Craft' },
  ];

  const handleCreateHobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hobbyName.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const newId = hobbyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newHobby: Hobby = {
        id: newId,
        name: hobbyName.trim(),
        category,
        level: 'Novice',
        currentStreak: 1,
        totalHours: 0.25,
        dailyGoalMins: dailyMins,
        todayCompleted: false,
        cohortPercentile: 50,
        flowMinutes: 15,
        currentFocus: goal || `Master fundamental 15-min basics in ${hobbyName}`,
        iconName: 'Sparkles',
      };

      const newDailyStep: DailyStep = {
        id: `step-${newId}-1`,
        hobbyId: newId,
        title: `Day 1: 15-Min Fundamentals in ${hobbyName}`,
        estimatedMins: dailyMins,
        objective: goal ? `Establish initial feel: ${goal}` : `Get comfortable with starter mechanics and clean workspace setup.`,
        breakdown: [
          '3 min: Gather your starter tools and clear a flat distraction-free area.',
          `8 min: Execute 10 slow, deliberate repetitions of the core ${hobbyName} motion.`,
          '4 min: Record 1 quick observation or take a photo to mark your Day 1 baseline.',
        ],
        equipmentNeeded: 'Basic starter kit or borrow from a tribe mate before buying',
        proTip: 'Consistency beats intensity. 15 minutes today already puts you ahead of 90% of people who only watch tutorials.',
        completed: false,
      };

      onAddHobby(newHobby, newDailyStep);
      setIsGenerating(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Start a New Hobby or Skill
              </h2>
              <p className="text-xs text-slate-500">
                Customized into approachable 15-minute daily habits.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateHobby} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              What hobby or craft do you want to explore?
            </label>
            <input
              type="text"
              placeholder="e.g. Film Photography, Sourdough Baking, Chess..."
              value={hobbyName}
              onChange={(e) => setHobbyName(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
              required
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Popular among learners:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularSuggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setHobbyName(s.name);
                    setCategory(s.category);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs"
              >
                <option value="Visual Arts">Visual Arts</option>
                <option value="Physical & Movement">Physical & Movement</option>
                <option value="Music">Music</option>
                <option value="Culinary Craft">Culinary Craft</option>
                <option value="Nature & Craft">Nature & Craft</option>
                <option value="Tech & Craft">Tech & Craft</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Daily Habit Commitment</label>
              <select
                value={dailyMins}
                onChange={(e) => setDailyMins(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs"
              >
                <option value={10}>10 minutes / day (Micro)</option>
                <option value={15}>15 minutes / day (Recommended)</option>
                <option value={20}>20 minutes / day (Focused)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              What excites you most or what is your first milestone?
            </label>
            <input
              type="text"
              placeholder="e.g. 'I want to bake my first loaf without throwing away sourdough starter'"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !hobbyName.trim()}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Designing 15-Min Plan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Hobby Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
