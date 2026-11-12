import React, { useState } from 'react';
import { HobbyMate, SharedSpace } from '../types';
import {
  Compass,
  MapPin,
  Users,
  Building2,
  Navigation,
  MessageCircle,
  Plus,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Send,
  X,
  Radio,
} from 'lucide-react';

interface MapViewProps {
  hobbyMates: HobbyMate[];
  spaces: SharedSpace[];
  activeHobbyName: string;
  onOpenCoach: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  hobbyMates,
  spaces,
  activeHobbyName,
}) => {
  const [filterRadiusKm, setFilterRadiusKm] = useState<number>(3.0);
  const [filterType, setFilterType] = useState<'all' | 'my-hobby' | 'spaces' | 'gear-loan'>('all');
  const [selectedMate, setSelectedMate] = useState<HobbyMate | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<SharedSpace | null>(null);
  const [pingModalOpen, setPingModalOpen] = useState(false);
  const [pingMessage, setPingMessage] = useState('');
  const [pingSentSuccess, setPingSentSuccess] = useState(false);
  
  // User broadcast status
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [userLocationName, setUserLocationName] = useState('Central Community Park');
  const [userStatusText, setUserStatusText] = useState(`Practicing 15-min ${activeHobbyName} drills`);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Zoom level state
  const [zoomScale, setZoomScale] = useState(1);

  // Filtered lists
  const filteredMates = hobbyMates.filter((mate) => {
    if (mate.distanceKm > filterRadiusKm) return false;
    if (filterType === 'my-hobby' && !mate.hobby.toLowerCase().includes(activeHobbyName.toLowerCase().slice(0, 5))) {
      return false;
    }
    if (filterType === 'spaces') return false;
    if (filterType === 'gear-loan' && !mate.gearToLend) return false;
    return true;
  });

  const filteredSpaces = spaces.filter((space) => {
    if (space.distanceKm > filterRadiusKm) return false;
    if (filterType === 'my-hobby' && !space.popularHobby.toLowerCase().includes(activeHobbyName.toLowerCase().slice(0, 5))) {
      return false;
    }
    if (filterType === 'gear-loan') return false;
    return true;
  });

  const handleSendPing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pingMessage.trim()) return;
    setPingSentSuccess(true);
    setTimeout(() => {
      setPingSentSuccess(false);
      setPingModalOpen(false);
      setPingMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-display">
              Real-Time HobbyMate & Spaces Map
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              {filteredMates.length} HobbyMates nearby
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover fellow hobbyists practicing right now in parks, studios, and quiet cafes. Connect with zero awkwardness.
          </p>
        </div>

        {/* Action button to broadcast own status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs ${
              isBroadcasting
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isBroadcasting ? 'You are Live on Map' : 'Broadcast My Session'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium mr-1">Show:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Everyone ({hobbyMates.length})
          </button>

          <button
            onClick={() => setFilterType('my-hobby')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'my-hobby'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {activeHobbyName} Only
          </button>

          <button
            onClick={() => setFilterType('spaces')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'spaces'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Shared Spaces ({spaces.length})
          </button>

          <button
            onClick={() => setFilterType('gear-loan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'gear-loan'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Has Gear to Lend
          </button>
        </div>

        {/* Distance Radius */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Radius:</span>
          {[1.0, 3.0, 5.0].map((radius) => (
            <button
              key={radius}
              onClick={() => setFilterRadiusKm(radius)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                filterRadiusKm === radius
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              &lt; {radius} km
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vector Interactive Map Area */}
        <div className="lg:col-span-2 bg-[#f4f6f8] border border-slate-200 rounded-2xl relative overflow-hidden h-[540px] select-none shadow-xs">
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setZoomScale((z) => Math.min(z + 0.2, 1.6))}
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale((z) => Math.max(z - 0.2, 0.8))}
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Compass / Location indicator badge */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-xs">
            <Compass className="w-4 h-4 text-emerald-700 animate-spin [animation-duration:12s]" />
            <span className="font-semibold text-slate-800">Central District & Parks</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">Live Radar</span>
          </div>

          {/* Interactive SVG Canvas */}
          <div
            className="w-full h-full transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Map Ground & District Shapes */}
              <rect width="1000" height="650" fill="#f8fafc" />

              {/* Park Zone 1 (Botanical Gardens) */}
              <path
                d="M 240 180 C 290 140, 440 160, 460 260 C 470 330, 390 380, 320 370 C 240 360, 210 260, 240 180 Z"
                fill="#dcfce7"
                stroke="#bbf7d0"
                strokeWidth="2"
                opacity="0.85"
              />
              <text x="310" y="270" fontSize="13" fontWeight="600" fill="#166534" opacity="0.6">
                City Botanical Gardens
              </text>

              {/* Park Zone 2 (Riverside Park & Steps) */}
              <path
                d="M 380 440 C 460 430, 580 470, 620 540 C 580 600, 440 600, 360 550 Z"
                fill="#ecfdf5"
                stroke="#a7f3d0"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <text x="430" y="520" fontSize="12" fontWeight="600" fill="#065f46" opacity="0.6">
                Riverside Park Amphitheater
              </text>

              {/* River / Water Channel */}
              <path
                d="M 0 490 C 200 480, 400 520, 550 490 C 700 460, 850 470, 1000 440 L 1000 500 C 850 530, 700 520, 550 550 C 400 580, 200 540, 0 550 Z"
                fill="#e0f2fe"
                stroke="#bae6fd"
                strokeWidth="2"
              />
              <text x="750" y="490" fontSize="11" fontWeight="500" fill="#0284c7" opacity="0.6">
                Civic Riverfront
              </text>

              {/* District Roads / Arterials */}
              <path
                d="M 120 0 L 180 650"
                stroke="#e2e8f0"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 0 320 Q 500 300 1000 340"
                stroke="#e2e8f0"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M 720 0 L 680 650"
                stroke="#e2e8f0"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 480 0 L 530 650"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeDasharray="8 6"
              />

              {/* Radius rings centered on user */}
              <circle
                cx="500"
                cy="325"
                r="140"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <circle
                cx="500"
                cy="325"
                r="280"
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="6 6"
                opacity="0.2"
              />

              {/* User Self Marker */}
              <g transform="translate(500, 325)">
                <circle r="22" fill="#047857" opacity="0.15">
                  <animate
                    attributeName="r"
                    values="14;28;14"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.25;0.05;0.25"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r="8" fill="#065f46" stroke="#ffffff" strokeWidth="2.5" />
              </g>
            </svg>

            {/* DOM Overlay Pins for HobbyMates */}
            {filteredMates.map((mate) => {
              const isSelected = selectedMate?.id === mate.id;
              return (
                <div
                  key={mate.id}
                  style={{
                    left: `${mate.coords.x}%`,
                    top: `${mate.coords.y}%`,
                  }}
                  onClick={() => {
                    setSelectedMate(mate);
                    setSelectedSpace(null);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  <div className="relative flex flex-col items-center">
                    {/* Floating mini status bubble */}
                    <div
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap mb-1 shadow-sm transition-all duration-200 pointer-events-none flex items-center gap-1 ${
                        isSelected
                          ? 'bg-slate-900 text-white scale-105'
                          : 'bg-white/95 text-slate-800 border border-slate-200 group-hover:scale-105'
                      }`}
                    >
                      <span>{mate.name}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-emerald-700 font-bold">{mate.distanceKm}km</span>
                    </div>

                    {/* Avatar Pin */}
                    <div
                      className={`w-9 h-9 rounded-full border-2 overflow-hidden shadow-md transition-transform duration-200 bg-white ${
                        isSelected
                          ? 'border-emerald-600 ring-4 ring-emerald-100 scale-110'
                          : 'border-white group-hover:scale-110 group-hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={mate.avatar}
                        alt={mate.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Live ping dot */}
                    {mate.isAvailableToMeet && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* DOM Overlay Pins for Shared Spaces */}
            {filteredSpaces.map((space) => {
              const isSelected = selectedSpace?.id === space.id;
              return (
                <div
                  key={space.id}
                  style={{
                    left: `${space.coords.x}%`,
                    top: `${space.coords.y}%`,
                  }}
                  onClick={() => {
                    setSelectedSpace(space);
                    setSelectedMate(null);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap mb-1 shadow-sm pointer-events-none flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white/90 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Building2 className="w-3 h-3 text-emerald-600" />
                      <span>{space.name.slice(0, 16)}...</span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 ${
                        isSelected
                          ? 'bg-emerald-800 text-white scale-110 ring-4 ring-emerald-100'
                          : 'bg-emerald-700 text-white group-hover:scale-110'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Broadcast Self Pin */}
            {isBroadcasting && (
              <div
                style={{ left: '50%', top: '50%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
              >
                <div className="bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1">
                  You (Live): {userLocationName}
                </div>
              </div>
            )}
          </div>

          {/* Map bottom legend */}
          <div className="absolute bottom-3 left-4 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Available to Jam / Meet</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Free / Low-Cost Spaces</span>
            </div>
          </div>
        </div>

        {/* Detail Panel / Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          {selectedMate ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src={selectedMate.avatar}
                      alt={selectedMate.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      {selectedMate.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {selectedMate.hobby} · {selectedMate.level}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMate(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Note */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Currently Practicing:</span>
                </div>
                <p className="text-slate-800 italic">"{selectedMate.status}"</p>
                <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedMate.locationName} ({selectedMate.distanceKm} km away)</span>
                </div>
              </div>

              {/* Gear loan offer */}
              {selectedMate.gearToLend && (
                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3 text-xs">
                  <div className="font-semibold text-amber-900">Community Gear Loan Offer:</div>
                  <div className="text-amber-800 mt-0.5">{selectedMate.gearToLend}</div>
                  <div className="text-[10px] text-amber-700/80 mt-1">
                    Free community borrow — no purchase required.
                  </div>
                </div>
              )}

              {/* Looking for */}
              {selectedMate.lookingFor && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Looking For: </span>
                  {selectedMate.lookingFor}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setPingMessage(`Hey ${selectedMate.name}! I'm practicing ${activeHobbyName} nearby at the moment. Would love to say hi or share a quick 15-min drill!`);
                    setPingModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Say Hi / Send Friendly Ping</span>
                </button>

                <div className="text-[10px] text-slate-400 text-center">
                  Active {selectedMate.lastActive} · Organic low-pressure meetup
                </div>
              </div>
            </div>
          ) : selectedSpace ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                    {selectedSpace.category} Space
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-display mt-0.5">
                    {selectedSpace.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedSpace.address} ({selectedSpace.distanceKm} km)</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSpace(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Access Cost:</span>
                  <span className="font-semibold text-slate-900">{selectedSpace.cost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Popular For:</span>
                  <span className="font-semibold text-slate-800">{selectedSpace.popularHobby}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">People Practicing Here:</span>
                  <span className="font-semibold text-emerald-700">{selectedSpace.activeCount} creators</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">Amenities Available:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSpace.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setUserLocationName(selectedSpace.name);
                    setIsBroadcasting(true);
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Set as My Practice Spot Today</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Select a Pin to View Tribe Details
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Click on any nearby HobbyMate or Community Space to see what they are practicing, gear you can borrow, or send an instant invite.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 text-left">
                <div className="text-xs font-semibold text-slate-700 mb-2">Nearby Highlights:</div>
                <div className="space-y-2">
                  {hobbyMates.slice(0, 3).map((mate) => (
                    <div
                      key={mate.id}
                      onClick={() => setSelectedMate(mate)}
                      className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={mate.avatar}
                          alt={mate.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <span className="font-semibold text-slate-800">{mate.name}</span>
                          <span className="text-slate-400"> · </span>
                          <span className="text-slate-500">{mate.hobby}</span>
                        </div>
                      </div>
                      <span className="text-emerald-700 font-medium tabular-nums">{mate.distanceKm} km</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ping Modal */}
      {pingModalOpen && selectedMate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Ping {selectedMate.name}
                </h3>
              </div>
              <button
                onClick={() => setPingModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Low-stress organic connection. Send a friendly message to see if they'd like to share tips or sketch/practice side by side.
            </p>

            <form onSubmit={handleSendPing} className="space-y-3">
              <textarea
                value={pingMessage}
                onChange={(e) => setPingMessage(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-800"
                placeholder="Write your note..."
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPingModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pingSentSuccess || !pingMessage.trim()}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {pingSentSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ping Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Ping</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Broadcast Your Session to Nearby Tribe
                </h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Let other beginners nearby know you're practicing today. Your exact home address is never shown—only your public spot or district.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Current Spot
                </label>
                <input
                  type="text"
                  value={userLocationName}
                  onChange={(e) => setUserLocationName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800"
                  placeholder="e.g. City Botanical Pavilion, Central Library, or Home Studio"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  What are you drilling today?
                </label>
                <input
                  type="text"
                  value={userStatusText}
                  onChange={(e) => setUserStatusText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800"
                  placeholder="e.g. Doing 15 mins of gradient blending"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {isBroadcasting && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsBroadcasting(false);
                      setShowBroadcastModal(false);
                    }}
                    className="text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Stop Broadcasting
                  </button>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBroadcasting(true);
                      setShowBroadcastModal(false);
                    }}
                    className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors cursor-pointer shadow-xs"
                  >
                    Set Live Pin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
