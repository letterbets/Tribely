import React, { useState } from 'react';
import { GearListing, CommunityThread } from '../types';
import {
  Package,
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Sparkles,
  Search,
  Check,
  Building,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TribeExchangeViewProps {
  activeHobbyName: string;
  gearListings: GearListing[];
  threads: CommunityThread[];
  onOpenCoach: () => void;
}

export const TribeExchangeView: React.FC<TribeExchangeViewProps> = ({
  activeHobbyName,
  gearListings: initialGear,
  threads: initialThreads,
  onOpenCoach,
}) => {
  const [activeTab, setActiveTab] = useState<'gear' | 'threads' | 'partners'>('gear');
  const [gearListings, setGearListings] = useState<GearListing[]>(initialGear);
  const [threads, setThreads] = useState<CommunityThread[]>(initialThreads);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddGearModal, setShowAddGearModal] = useState(false);
  const [newGearTitle, setNewGearTitle] = useState('');
  const [newGearType, setNewGearType] = useState<'Free Loan' | 'Swap' | 'Budget Buy'>('Free Loan');
  const [newGearPrice, setNewGearPrice] = useState('Free 2-week loan');
  const [newGearDesc, setNewGearDesc] = useState('');

  // New thread modal
  const [showAddThreadModal, setShowAddThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTag, setNewThreadTag] = useState('Beginner Guide');

  // Contact / Borrow modal
  const [borrowModalItem, setBorrowModalItem] = useState<GearListing | null>(null);
  const [borrowSent, setBorrowSent] = useState(false);

  const handleUpvote = (id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  const handleAddGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGearTitle.trim()) return;

    const newListing: GearListing = {
      id: `gear-${Date.now()}`,
      title: newGearTitle,
      hobby: activeHobbyName,
      type: newGearType,
      price: newGearPrice,
      ownerName: 'You',
      distanceKm: 0.2,
      description: newGearDesc || 'Available for friendly community borrowing!',
    };

    setGearListings((prev) => [newListing, ...prev]);
    setShowAddGearModal(false);
    setNewGearTitle('');
    setNewGearDesc('');
  };

  const handleAddThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    const newThread: CommunityThread = {
      id: `thread-${Date.now()}`,
      authorName: 'You',
      authorLevel: 'Novice',
      hobby: activeHobbyName,
      title: newThreadTitle,
      content: newThreadContent,
      upvotes: 1,
      repliesCount: 0,
      timestamp: 'Just now',
      tags: [newThreadTag],
    };

    setThreads((prev) => [newThread, ...prev]);
    setShowAddThreadModal(false);
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Tribe Exchange & Resources
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Don't let gear costs or unanswered beginner questions hold you back. Borrow equipment, share frugal tips, and connect.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('gear')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'gear'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gear Loan & Swap ({gearListings.length})
          </button>
          <button
            onClick={() => setActiveTab('threads')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'threads'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tribe Guides ({threads.length})
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'partners'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Community Studios
          </button>
        </div>
      </div>

      {/* Tab 1: Gear Loan & Swap */}
      {activeTab === 'gear' && (
        <div className="space-y-6">
          {/* Frugal Promise Callout */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  The Zero-Barrier Gear Promise
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Never spend $150 on equipment before knowing if you genuinely enjoy a hobby. Borrow beginner gear from trusted neighbors for your first 3 weeks.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddGearModal(true)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Offer Gear to Lend</span>
            </button>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gearListings.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.distanceKm} km away · Owner: {item.ownerName}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400">Terms: </span>
                    <span className="text-xs font-semibold text-slate-800">{item.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      setBorrowModalItem(item);
                      setBorrowSent(false);
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Request to Borrow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tribe Guides & Discussions */}
      {activeTab === 'threads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Honest, beginner-to-beginner advice without corporate sponsorship.
            </div>

            <button
              onClick={() => setShowAddThreadModal(true)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Tip or Ask Tribe</span>
            </button>
          </div>

          <div className="space-y-4">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{thread.authorName}</span>
                    <span>·</span>
                    <span>{thread.authorLevel}</span>
                    <span>·</span>
                    <span className="text-slate-400">{thread.hobby}</span>
                  </div>
                  <span>{thread.timestamp}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-display">
                  {thread.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {thread.content}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {thread.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpvote(thread.id)}
                      className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-semibold tabular-nums">{thread.upvotes}</span>
                    </button>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{thread.repliesCount} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Partner Studios & Community Spaces */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Community Partner Network
              </div>
              <h3 className="text-base font-bold text-white font-display">
                Public Studios, Community Clubs & Subsidized Workshops
              </h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Partnered with local organizations (Health Promotion Board, Community Clubs, and independent maker collectives) offering accessible open studio hours.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Open Community Space
                </span>
                <span className="text-xs text-slate-500 font-medium">Free Access</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Botanical Gardens Conservatory Shade Pavilions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated outdoor covered sketching and watercolor benches with clean running water basins and natural daylight.
              </p>
              <div className="text-[11px] text-slate-500">
                Amenities: Fresh water taps, shaded wooden tables, public restrooms.
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  Maker Studio
                </span>
                <span className="text-xs text-slate-700 font-medium">$5 Day Pass</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Civic Community Makers & Clay Loft
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Shared pottery wheels, hand carpentry benches, and communal cleanup sinks for messy crafts you can't easily do in an apartment.
              </p>
              <div className="text-[11px] text-slate-500">
                Amenities: Pottery wheels, aprons, carving tools, kiln firing service.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Borrow Modal */}
      {borrowModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Request Community Gear Borrow
            </h3>
            <p className="text-xs text-slate-600">
              You are requesting to borrow: <span className="font-semibold">{borrowModalItem.title}</span> from {borrowModalItem.ownerName} ({borrowModalItem.distanceKm} km away).
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="font-semibold text-slate-800">Tribe Lending Code:</div>
              <p className="text-slate-600">Treat borrowed tools with care. Return them clean and ready for the next beginner!</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBorrowModalItem(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setBorrowSent(true);
                  setTimeout(() => {
                    setBorrowSent(false);
                    setBorrowModalItem(null);
                  }, 1500);
                }}
                disabled={borrowSent}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {borrowSent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Request Sent to {borrowModalItem.ownerName}!</span>
                  </>
                ) : (
                  <span>Send Borrow Request</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Gear Modal */}
      {showAddGearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Offer Gear to Your Tribe
            </h3>
            <p className="text-xs text-slate-500">
              Have spare starter tools or an extra instrument sitting in a closet? Lend it to a beginner nearby to help them take their first step.
            </p>

            <form onSubmit={handleAddGear} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gear Title</label>
                <input
                  type="text"
                  placeholder="e.g. Spare Ukulele, Starter Watercolor Pan Set, or Climbing Shoes EU 42"
                  value={newGearTitle}
                  onChange={(e) => setNewGearTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Offer Type</label>
                <select
                  value={newGearType}
                  onChange={(e) => setNewGearType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Free Loan">Free Community Loan</option>
                  <option value="Swap">Item Swap</option>
                  <option value="Budget Buy">Low-Cost / Frugal Starter Sale</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terms or Duration</label>
                <input
                  type="text"
                  value={newGearPrice}
                  onChange={(e) => setNewGearPrice(e.target.value)}
                  placeholder="e.g. Free 2-week loan, or Swap for bass picks"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Condition & Pickup Notes</label>
                <textarea
                  rows={2}
                  value={newGearDesc}
                  onChange={(e) => setNewGearDesc(e.target.value)}
                  placeholder="Clean and sanitized. Can meet at Central Park or Atelier Cafe."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGearModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  List Gear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Thread Modal */}
      {showAddThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Post to the Tribe Board
            </h3>
            <p className="text-xs text-slate-500">
              Ask a question, share a lesson you learned the hard way, or celebrate a tiny 15-minute milestone.
            </p>

            <form onSubmit={handleAddThread} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. What nobody tells you about acoustic guitar calluses..."
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tag</label>
                <select
                  value={newThreadTag}
                  onChange={(e) => setNewThreadTag(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Beginner Guide">Beginner Guide</option>
                  <option value="Budget Gear">Budget Gear</option>
                  <option value="15-Min System">15-Min System</option>
                  <option value="Mindset">Mindset</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  placeholder="Write your tip or question clearly..."
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddThreadModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                >
                  Publish to Tribe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
