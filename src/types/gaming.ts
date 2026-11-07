/**
 * Gaming, Sessions, and Tournaments Models
 */

import { User } from './user';

export type GamingCategory = 
  | 'pc_esports' 
  | 'mobile_gaming' 
  | 'console' 
  | 'tabletop' 
  | 'turf_sports';

export type GamingPlatform = 
  | 'PC' 
  | 'Mobile' 
  | 'PlayStation 5' 
  | 'Xbox' 
  | 'Nintendo Switch' 
  | 'Physical / In-Person';

export type SkillLevel = 'casual' | 'intermediate' | 'competitive' | 'pro';

export type GamingFormat = 'online' | 'lan_cafe' | 'turf' | 'boardgame_cafe';

export interface GamingPlayerSlot {
  slotIndex: number;
  role?: string;
  isHost?: boolean;
  user?: User;
}

export interface GamingSession {
  id: string;
  title: string;
  gameTitle: string; // e.g. "Valorant", "BGMI", "Turf Cricket", "EA FC 25"
  category: GamingCategory;
  categoryLabel: string;
  coverImage: string;
  gameLogo?: string;
  format: GamingFormat;
  formatLabel: string;
  platform: GamingPlatform;
  skillLevel: SkillLevel;
  host: User;

  // Timing & Location
  date: string;
  time: string;
  locationArea: string; // e.g. "Baner GameZone" or "Discord Server"
  venueDetails?: string;

  // Slots
  totalSlots: number;
  filledSlots: number;
  slots: GamingPlayerSlot[];

  // Details
  description: string;
  voiceChatRequired: boolean;
  voiceChatLink?: string;
  entryFeeInr: number;
  tags: string[];

  // User state
  userJoinedStatus?: 'none' | 'request_pending' | 'joined';
  isTrending?: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  gameTitle: string;
  bannerImage: string;
  organizer: string;
  date: string;
  prizePoolInr: number;
  entryFeeInr: number;
  format: string; // e.g. "5v5 Single Elimination"
  registeredTeams: number;
  maxTeams: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  location: string;
}
