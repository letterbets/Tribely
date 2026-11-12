import React, { useState } from 'react';
import { SocialBookmark } from '../types';
import { X, Sparkles, Link as LinkIcon, Instagram, Youtube, BookmarkCheck, ArrowRight, Check } from 'lucide-react';

interface SocialBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeHobbyName: string;
  onApplyChapterAsDailyStep: (chapter: {
    title: string;
    objective: string;
    breakdown: string[];
    proTip: string;
    equipmentNeeded: string;
  }) => void;
  existingBookmarks: SocialBookmark[];
}

export const SocialBookmarkModal: React.FC<SocialBookmarkModalProps> = ({
  isOpen,
  onClose,
  activeHobbyName,
  onApplyChapterAsDailyStep,
  existingBookmarks,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [digestedChapter, setDigestedChapter] = useState<{
    title: string;
    objective: string;
    actionableSteps: string[];
    takeaway: string;
    budgetTip: string;
  } | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDigest = async (urlToDigest?: string, notesToDigest?: string) => {
    const finalUrl = urlToDigest ?? urlInput;
    const finalNotes = notesToDigest ?? notesInput;

    if (!finalUrl && !finalNotes) return;

    setIsLoading(true);
    setDigestedChapter(null);
    setAppliedSuccess(false);

    try {
      const response = await fetch('/api/digest-bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: finalUrl,
          notes: finalNotes,
          hobby: activeHobbyName,
        }),
      });

      const data = await response.json();
      if (data.chapter) {
        setDigestedChapter(data.chapter);
      }
    } catch (err) {
      console.error('Digest failed, using local extraction fallback', err);
      setDigestedChapter({
        title: `15-Min Drill: ${finalNotes ? finalNotes.slice(0, 30) : 'Technique Focus'}`,
        objective: `Turn passive ${activeHobbyName} social watching into active physical muscle memory.`,
        actionableSteps: [
          'Spend 2 mins arranging minimal gear on your table.',
          'Execute the exact hand/body movement shown in the video 12 times slowly.',
          'Review balance and jot down one sentence on what felt most natural.',
        ],
        takeaway: 'Smooth repetition builds confidence 10x faster than passive consumption.',
        budgetTip: 'Start with household tools or borrow basic items from your local tribe.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToToday = () => {
    if (!digestedChapter) return;
    onApplyChapterAsDailyStep({
      title: digestedChapter.title,
      objective: digestedChapter.objective,
      breakdown: digestedChapter.actionableSteps,
      proTip: digestedChapter.takeaway,
      equipmentNeeded: digestedChapter.budgetTip,
    });
    setAppliedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Social Bookmark to 15-Min Action
              </h2>
              <p className="text-xs text-slate-500">
                Stop just scrolling. Convert saved TikToks & Reels into today’s physical practice.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Input field */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paste Instagram Reel, TikTok, YouTube or Pinterest Link
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="https://www.instagram.com/reel/... or https://tiktok.com/@..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-colors text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What caught your eye? (Optional notes / creator name)
              </label>
              <input
                type="text"
                placeholder="e.g. 'How she holds the brush for feather strokes' or 'Foot placement trick on overhangs'"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-colors text-slate-800"
              />
            </div>

            <button
              onClick={() => handleDigest()}
              disabled={isLoading || (!urlInput && !notesInput)}
              className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Extracting 15-Min Action Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Digest with AI Coach</span>
                </>
              )}
            </button>
          </div>

          {/* Preset quick bookmarks from user saves */}
          {existingBookmarks.length > 0 && !digestedChapter && (
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-500 mb-2">
                Or pick from your recently saved bookmarks:
              </div>
              <div className="space-y-2">
                {existingBookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    onClick={() => {
                      setUrlInput(bm.url);
                      setNotesInput(bm.title);
                      handleDigest(bm.url, bm.title);
                    }}
                    className="p-3 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-xs flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        {bm.platform === 'Instagram' ? (
                          <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        ) : bm.platform === 'YouTube' ? (
                          <Youtube className="w-3.5 h-3.5 text-red-600" />
                        ) : (
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-slate-900 line-clamp-1">
                          {bm.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {bm.creator} · {bm.platform}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digested Output Result */}
          {digestedChapter && (
            <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
                  Customized 15-Minute Chapter
                </span>
                <span className="text-[11px] text-emerald-700">Ready to practice</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{digestedChapter.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{digestedChapter.objective}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-semibold text-slate-800">15-Min Breakdown:</div>
                {digestedChapter.actionableSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-emerald-200/80 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-emerald-200/60 text-xs space-y-1">
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-900">Key Insight: </span>
                  {digestedChapter.takeaway}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">Frugal / Budget Tip: </span>
                  {digestedChapter.budgetTip}
                </div>
              </div>

              <button
                onClick={handleApplyToToday}
                disabled={appliedSuccess}
                className="w-full mt-2 py-2 px-3 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {appliedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Today's Practice!</span>
                  </>
                ) : (
                  <>
                    <span>Set as Today's 15-Min Goal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
