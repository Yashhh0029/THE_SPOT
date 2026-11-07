/**
 * User and Profile Models
 */

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  locationArea: string; // e.g. "Koregaon Park, Pune"
  city: string;
  isVerifiedHost?: boolean;
  isProGamer?: boolean;
  rating: number; // e.g. 4.9
  reviewCount: number;
  interests: string[];
  favoriteGames: string[];
  hostedCount: number;
  attendedCount: number;
  squadCount: number;
  communityCount: number;
  badges: UserBadge[];
  joinedDate: string;
  phone?: string;
  email?: string;
}
