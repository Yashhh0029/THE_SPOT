/**
 * Chat and Inbox Models
 */

import { User } from './user';

export type ConversationType = 'direct' | 'squad' | 'event' | 'community';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  participants: User[];
  messages: ChatMessage[];
  relatedItemId?: string; // event id or squad id
}
