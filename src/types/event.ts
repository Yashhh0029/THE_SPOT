/**
 * Event and Party Models
 */

import { User } from './user';

export type EventCategory = 
  | 'party'
  | 'techno'
  | 'rooftop'
  | 'indie_music'
  | 'boardgames'
  | 'trivia'
  | 'sports'
  | 'mixer';

export type EventStatus = 
  | 'available' 
  | 'request_pending' 
  | 'confirmed' 
  | 'full' 
  | 'cancelled';

export interface EventRule {
  id: string;
  icon: string;
  text: string;
}

export interface EventAttendee {
  id: string;
  user: User;
  status: 'pending' | 'confirmed' | 'checked_in' | 'declined';
  registeredAt: string;
  ticketCount: number;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  category: EventCategory;
  categoryLabel: string;
  description: string;
  coverImage: string;
  host: User;
  
  // Timing
  date: string; // "Tonight", "Tomorrow", "Sat, Nov 9"
  time: string; // "8:00 PM - 1:00 AM"
  rawDate: string; // ISO date string

  // Location
  locationArea: string; // e.g. "Koregaon Park"
  venueName: string; // e.g. "High Spirits Cafe" or "Private Villa"
  fullAddress?: string;
  isPrivateAddress: boolean;
  distanceKm: number;

  // Tickets & Pricing
  priceInr: number; // 0 for free
  capacity: number;
  confirmedCount: number;
  availableSpots: number;

  // Configuration
  visibility: 'public' | 'private' | 'invite_only';
  requiresHostApproval: boolean;
  dressCode?: string;
  perks: string[];
  rules: EventRule[];

  // User interaction state
  isBookmarked?: boolean;
  userBookingStatus?: EventStatus;
  isFeatured?: boolean;
  isTonight?: boolean;
  isTrending?: boolean;
}
