/**
 * Community Models
 */

import { User } from './user';

export type CommunityCategory = 
  | 'nightlife' 
  | 'gaming' 
  | 'music_arts' 
  | 'outdoors' 
  | 'tech_creators';

export interface Community {
  id: string;
  name: string;
  tagline: string;
  category: CommunityCategory;
  categoryLabel: string;
  bannerImage: string;
  avatarImage: string;
  memberCount: number;
  organizer: User;
  description: string;
  rules: string[];
  activeEventsCount: number;
  activeGamingCount: number;
  tags: string[];
  isJoined?: boolean;
  joinStatus?: 'none' | 'request_pending' | 'member';
  locationArea: string;
}
