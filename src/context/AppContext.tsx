/**
 * The Spot - Master Application Reactive State Context
 */

import React, { createContext, useContext, useState } from 'react';
import { EventItem, EventStatus } from '../types/event';
import { GamingSession, Tournament } from '../types/gaming';
import { Squad } from '../types/squad';
import { Community } from '../types/community';
import { Conversation, ChatMessage } from '../types/chat';
import { FilterOptions } from '../types';
import { mockEvents } from '../data/mockEvents';
import { mockGamingSessions, mockTournaments } from '../data/mockGaming';
import { mockSquads } from '../data/mockSquads';
import { mockCommunities } from '../data/mockCommunities';
import { mockConversations } from '../data/mockChats';
import { currentUser } from '../data/mockUsers';

export interface PendingHostRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userAvatar: string;
  requestedAt: string;
  tickets: number;
  totalPriceInr: number;
  status: 'pending' | 'approved' | 'declined';
}

interface AppContextType {
  // Events
  events: EventItem[];
  bookmarkedEventIds: string[];
  toggleBookmarkEvent: (id: string) => void;
  updateEventBookingStatus: (id: string, status: EventStatus) => void;
  addNewEvent: (event: Omit<EventItem, 'id' | 'host' | 'confirmedCount'>) => EventItem;

  // Gaming
  gamingSessions: GamingSession[];
  tournaments: Tournament[];
  joinGamingSession: (id: string) => void;
  leaveGamingSession: (id: string) => void;
  addNewGamingSession: (session: Omit<GamingSession, 'id' | 'host' | 'filledSlots' | 'slots'>) => GamingSession;

  // Squads
  squads: Squad[];
  toggleJoinSquad: (id: string) => void;
  addNewSquad: (squad: Omit<Squad, 'id' | 'leader' | 'memberCount' | 'members'>) => Squad;

  // Communities
  communities: Community[];
  toggleJoinCommunity: (id: string) => void;
  addNewCommunity: (comm: Omit<Community, 'id' | 'organizer' | 'memberCount'>) => Community;

  // Inbox & Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;

  // Host Dashboard
  hostRequests: PendingHostRequest[];
  approveHostRequest: (requestId: string) => void;
  declineHostRequest: (requestId: string) => void;

  // Global Filters & Search
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  updateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  resetFilters: () => void;
}

const initialFilters: FilterOptions = {
  searchQuery: '',
  category: 'all',
  dateFilter: 'all',
  budgetMaxInr: 0,
  maxDistanceKm: 0,
  neighborhood: 'all',
};

const initialHostRequests: PendingHostRequest[] = [
  {
    id: 'req_1',
    eventId: 'evt_baner_mixer',
    eventTitle: 'Baner Tech & Creators Indie Mixer',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    requestedAt: '15m ago',
    tickets: 2,
    totalPriceInr: 598,
    status: 'pending',
  },
  {
    id: 'req_2',
    eventId: 'evt_baner_mixer',
    eventTitle: 'Baner Tech & Creators Indie Mixer',
    userName: 'Vikram Patel',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    requestedAt: '1h ago',
    tickets: 1,
    totalPriceInr: 299,
    status: 'pending',
  },
  {
    id: 'req_3',
    eventId: 'evt_baner_mixer',
    eventTitle: 'Baner Tech & Creators Indie Mixer',
    userName: 'Sneha Rao',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    requestedAt: '3h ago',
    tickets: 1,
    totalPriceInr: 299,
    status: 'pending',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<string[]>(['evt_kp_rooftop']);
  const [gamingSessions, setGamingSessions] = useState<GamingSession[]>(mockGamingSessions);
  const [tournaments] = useState<Tournament[]>(mockTournaments);
  const [squads, setSquads] = useState<Squad[]>(mockSquads);
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [hostRequests, setHostRequests] = useState<PendingHostRequest[]>(initialHostRequests);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // Toggle Bookmark
  const toggleBookmarkEvent = (id: string) => {
    setBookmarkedEventIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // RSVP / Join Event with strict state transition & duplicate prevention
  const updateEventBookingStatus = (id: string, status: EventStatus) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id === id) {
          const oldStatus = evt.userBookingStatus || 'available';
          if (oldStatus === status) {
            return evt; // Duplicate prevention: no-op if status is unchanged
          }

          let delta = 0;
          if (status === 'confirmed' && oldStatus !== 'confirmed') {
            delta = 1;
          } else if (oldStatus === 'confirmed' && status !== 'confirmed') {
            delta = -1;
          }

          return {
            ...evt,
            userBookingStatus: status,
            confirmedCount: Math.max(0, evt.confirmedCount + delta),
            availableSpots: Math.max(0, evt.availableSpots - delta),
          };
        }
        return evt;
      })
    );
  };

  // Add New Event
  const addNewEvent = (eventData: Omit<EventItem, 'id' | 'host' | 'confirmedCount'>): EventItem => {
    const newEvt: EventItem = {
      ...eventData,
      id: `evt_user_${Date.now()}`,
      host: currentUser,
      confirmedCount: 1, // host is attending
      userBookingStatus: 'confirmed',
    };
    setEvents(prev => [newEvt, ...prev]);
    return newEvt;
  };

  // Gaming
  const joinGamingSession = (id: string) => {
    setGamingSessions(prev =>
      prev.map(sess => {
        if (sess.id === id) {
          const newFilled = Math.min(sess.totalSlots, sess.filledSlots + 1);
          return {
            ...sess,
            filledSlots: newFilled,
            userJoinedStatus: 'joined',
          };
        }
        return sess;
      })
    );
  };

  const leaveGamingSession = (id: string) => {
    setGamingSessions(prev =>
      prev.map(sess => {
        if (sess.id === id) {
          return {
            ...sess,
            filledSlots: Math.max(1, sess.filledSlots - 1),
            userJoinedStatus: 'none',
          };
        }
        return sess;
      })
    );
  };

  const addNewGamingSession = (
    sessionData: Omit<GamingSession, 'id' | 'host' | 'filledSlots' | 'slots'>
  ): GamingSession => {
    const newSess: GamingSession = {
      ...sessionData,
      id: `game_user_${Date.now()}`,
      host: currentUser,
      filledSlots: 1,
      userJoinedStatus: 'joined',
      slots: [
        { slotIndex: 1, role: 'Host', isHost: true, user: currentUser },
      ],
    };
    setGamingSessions(prev => [newSess, ...prev]);
    return newSess;
  };

  // Squads
  const toggleJoinSquad = (id: string) => {
    setSquads(prev =>
      prev.map(sqd => {
        if (sqd.id === id) {
          const isMember = sqd.joinStatus === 'member';
          return {
            ...sqd,
            joinStatus: isMember ? 'none' : 'member',
            isUserMember: !isMember,
            memberCount: isMember ? Math.max(1, sqd.memberCount - 1) : sqd.memberCount + 1,
          };
        }
        return sqd;
      })
    );
  };

  const addNewSquad = (
    squadData: Omit<Squad, 'id' | 'leader' | 'memberCount' | 'members'>
  ): Squad => {
    const newSquad: Squad = {
      ...squadData,
      id: `sqd_user_${Date.now()}`,
      leader: currentUser,
      memberCount: 1,
      isUserMember: true,
      joinStatus: 'member',
      members: [{ user: currentUser, role: 'Leader', joinedAt: 'Just now' }],
    };
    setSquads(prev => [newSquad, ...prev]);
    return newSquad;
  };

  // Communities
  const toggleJoinCommunity = (id: string) => {
    setCommunities(prev =>
      prev.map(comm => {
        if (comm.id === id) {
          const isMember = comm.joinStatus === 'member';
          return {
            ...comm,
            isJoined: !isMember,
            joinStatus: isMember ? 'none' : 'member',
            memberCount: isMember ? Math.max(0, comm.memberCount - 1) : comm.memberCount + 1,
          };
        }
        return comm;
      })
    );
  };

  const addNewCommunity = (
    commData: Omit<Community, 'id' | 'organizer' | 'memberCount'>
  ): Community => {
    const newComm: Community = {
      ...commData,
      id: `comm_user_${Date.now()}`,
      organizer: currentUser,
      memberCount: 1,
      isJoined: true,
      joinStatus: 'member',
    };
    setCommunities(prev => [newComm, ...prev]);
    return newComm;
  };

  // Chat & Messaging
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      isMe: true,
      status: 'delivered',
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: `You: ${text.trim()}`,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  // Host Dashboard Approvals
  const approveHostRequest = (requestId: string) => {
    setHostRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status: 'approved' } : req))
    );
  };

  const declineHostRequest = (requestId: string) => {
    setHostRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status: 'declined' } : req))
    );
  };

  // Filters
  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        bookmarkedEventIds,
        toggleBookmarkEvent,
        updateEventBookingStatus,
        addNewEvent,
        gamingSessions,
        tournaments,
        joinGamingSession,
        leaveGamingSession,
        addNewGamingSession,
        squads,
        toggleJoinSquad,
        addNewSquad,
        communities,
        toggleJoinCommunity,
        addNewCommunity,
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        hostRequests,
        approveHostRequest,
        declineHostRequest,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
