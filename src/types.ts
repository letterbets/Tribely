export type SkillLevel = 'Novice' | 'Apprentice' | 'Practitioner' | 'Artisan';

export interface Hobby {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  currentStreak: number;
  totalHours: number;
  dailyGoalMins: number;
  todayCompleted: boolean;
  cohortPercentile: number;
  flowMinutes: number;
  currentFocus: string;
  iconName: string;
}

export interface DailyStep {
  id: string;
  hobbyId: string;
  title: string;
  estimatedMins: number;
  objective: string;
  breakdown: string[];
  equipmentNeeded: string;
  proTip: string;
  completed: boolean;
}

export interface HobbyMate {
  id: string;
  name: string;
  avatar: string;
  hobby: string;
  level: SkillLevel;
  status: string;
  locationName: string;
  distanceKm: number;
  coords: { x: number; y: number }; // Relative map coordinates (0-100%)
  lastActive: string;
  isAvailableToMeet: boolean;
  gearToLend?: string;
  lookingFor?: string;
}

export interface SharedSpace {
  id: string;
  name: string;
  category: 'Studio' | 'Park' | 'Workshop' | 'Cafe' | 'Gym' | 'Community Club';
  address: string;
  distanceKm: number;
  coords: { x: number; y: number };
  popularHobby: string;
  amenities: string[];
  isOpen: boolean;
  cost: 'Free' | 'Low Cost ($)' | 'Paid ($$)';
  activeCount: number;
}

export interface SocialBookmark {
  id: string;
  hobbyId: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Pinterest';
  title: string;
  url: string;
  creator: string;
  thumbnail?: string;
  chapterSummary?: {
    objective: string;
    actionableSteps: string[];
    takeaway: string;
    budgetTip: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  actionDrill?: string;
}

export interface GearListing {
  id: string;
  title: string;
  hobby: string;
  type: 'Free Loan' | 'Swap' | 'Budget Buy';
  price: string;
  ownerName: string;
  distanceKm: number;
  description: string;
}

export interface CommunityThread {
  id: string;
  authorName: string;
  authorLevel: SkillLevel;
  hobby: string;
  title: string;
  content: string;
  upvotes: number;
  repliesCount: number;
  timestamp: string;
  tags: string[];
}
