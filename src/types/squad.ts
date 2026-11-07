/**
 * Squad Models
 */

import { User } from './user';

export interface SquadMember {
  user: User;
  role: 'Leader' | 'Co-Leader' | 'Member';
  joinedAt: string;
}

export interface Squad {
  id: string;
  name: string;
  tag: string; // e.g. "[VKYR]"
  avatar: string;
  coverImage: string;
  focusGames: string[];
  vibe: string; // e.g. "Competitive & Fun", "Late-night grinders"
  compatibilityScore: number; // e.g. 96 (%)
  memberCount: number;
  maxMembers: number;
  leader: User;
  members: SquadMember[];
  locationArea: string;
  description: string;
  stats: {
    matchesPlayed: number;
    winRatePercent: number;
    activityScore: string;
  };
  isUserMember?: boolean;
  joinStatus?: 'none' | 'request_pending' | 'member';
}
