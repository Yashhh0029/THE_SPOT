/**
 * The Spot - Realistic Mock Squads in Pune
 */

import { Squad } from '../types/squad';
import { mockUsers, currentUser } from './mockUsers';

export const mockSquads: Squad[] = [
  {
    id: 'sqd_viman_valkyries',
    name: 'Viman Valkyries',
    tag: '[VKYR]',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    focusGames: ['Valorant', 'Apex Legends', 'CS2'],
    vibe: 'Competitive & High Comms',
    compatibilityScore: 98,
    memberCount: 5,
    maxMembers: 6,
    leader: mockUsers.usr_rohit,
    members: [
      { user: mockUsers.usr_rohit, role: 'Leader', joinedAt: 'Jan 2025' },
      { user: currentUser, role: 'Member', joinedAt: 'Feb 2025' },
      { user: mockUsers.usr_kabir, role: 'Member', joinedAt: 'March 2025' },
      { user: mockUsers.usr_tanya, role: 'Member', joinedAt: 'March 2025' },
    ],
    locationArea: 'Baner & Viman Nagar, Pune',
    description: 'Premier tier-2 competitive Valorant squad pushing for regional tournaments. We do scrims every Tuesday & Thursday night, with LAN sessions every alternate weekend.',
    stats: {
      matchesPlayed: 142,
      winRatePercent: 68,
      activityScore: 'Daily Active',
    },
    isUserMember: true,
    joinStatus: 'member',
  },
  {
    id: 'sqd_pune_strikerz',
    name: 'Pune Box Strikerz',
    tag: '[PSTR]',
    avatar: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
    focusGames: ['Turf Cricket', '5-a-Side Football', 'Badminton'],
    vibe: 'High Stamina & Good Vibes',
    compatibilityScore: 94,
    memberCount: 9,
    maxMembers: 12,
    leader: mockUsers.usr_kabir,
    members: [
      { user: mockUsers.usr_kabir, role: 'Leader', joinedAt: 'Dec 2024' },
      { user: currentUser, role: 'Member', joinedAt: 'Jan 2025' },
    ],
    locationArea: 'FC Road & Koregaon Park, Pune',
    description: 'Weekend warriors who rent floodlit sports turfs in Deccan and KP. Always up for friendly matches and box cricket leagues followed by midnight biryani runs.',
    stats: {
      matchesPlayed: 48,
      winRatePercent: 62,
      activityScore: 'Weekends',
    },
    isUserMember: true,
    joinStatus: 'member',
  },
  {
    id: 'sqd_catan_cartel',
    name: 'Deccan Strategy Guild',
    tag: '[DSG]',
    avatar: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1200&auto=format&fit=crop&q=80',
    focusGames: ['Catan', 'Secret Hitler', 'Dune: Imperium', 'Root'],
    vibe: 'Brainy, Chill & Craft Coffee',
    compatibilityScore: 91,
    memberCount: 7,
    maxMembers: 10,
    leader: mockUsers.usr_ananya,
    members: [
      { user: mockUsers.usr_ananya, role: 'Leader', joinedAt: 'Nov 2024' },
    ],
    locationArea: 'FC Road & Model Colony, Pune',
    description: 'A close-knit group exploring heavy eurogames, social deduction, and story-driven campaigns. We meet weekly at quiet book cafes in Shivajinagar.',
    stats: {
      matchesPlayed: 86,
      winRatePercent: 50,
      activityScore: 'Twice a week',
    },
    isUserMember: false,
    joinStatus: 'none',
  },
];
