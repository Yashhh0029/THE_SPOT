/**
 * The Spot - Inbox & Conversations Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Conversation, ConversationType } from '../../types/chat';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Icon } from '../../components/common/Icon';

interface InboxScreenProps {
  onSelectConversation: (conversation: Conversation) => void;
}

type TabFilter = 'all' | 'direct' | 'squad' | 'event';

export const InboxScreen: React.FC<InboxScreenProps> = ({
  onSelectConversation,
}) => {
  const { conversations } = useApp();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filteredConversations = conversations.filter(c => {
    if (activeTab === 'all') return true;
    return c.type === activeTab;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Inbox & Chats</Text>
          {totalUnread > 0 && (
            <View style={styles.unreadPill}>
              <Text style={styles.unreadPillText}>{totalUnread} new</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSubtitle}>
          Direct messages, squad coordination & event announcements
        </Text>
      </View>

      {/* Segmented Filter Bar */}
      <View style={styles.tabFilterBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          style={[styles.tabFilterBtn, activeTab === 'all' && styles.tabFilterBtnActive]}
        >
          <Text style={[styles.tabFilterText, activeTab === 'all' && styles.tabFilterTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('direct')}
          style={[styles.tabFilterBtn, activeTab === 'direct' && styles.tabFilterBtnActive]}
        >
          <Text style={[styles.tabFilterText, activeTab === 'direct' && styles.tabFilterTextActive]}>
            Direct
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('squad')}
          style={[styles.tabFilterBtn, activeTab === 'squad' && styles.tabFilterBtnActive]}
        >
          <Text style={[styles.tabFilterText, activeTab === 'squad' && styles.tabFilterTextActive]}>
            Squads
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('event')}
          style={[styles.tabFilterBtn, activeTab === 'event' && styles.tabFilterBtnActive]}
        >
          <Text style={[styles.tabFilterText, activeTab === 'event' && styles.tabFilterTextActive]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {filteredConversations.length === 0 ? (
          <EmptyState
            icon="message-square"
            title="No conversations yet"
            description="Join an event or connect with a squad to start chatting."
            actionTitle="Explore Events"
            onActionPress={() => setActiveTab('all')}
          />
        ) : (
          filteredConversations.map(conv => {
            const hasUnread = conv.unreadCount > 0;

            return (
              <TouchableOpacity
                key={conv.id}
                activeOpacity={0.8}
                onPress={() => onSelectConversation(conv)}
                style={[styles.convCard, hasUnread && styles.convCardUnread]}
              >
                <Avatar
                  uri={conv.avatar}
                  name={conv.title}
                  size={50}
                  isOnline={conv.isOnline}
                />

                <View style={styles.convContent}>
                  <View style={styles.convHeaderRow}>
                    <Text style={styles.convTitle} numberOfLines={1}>
                      {conv.title}
                    </Text>
                    <Text style={[styles.timeText, hasUnread && styles.timeTextUnread]}>
                      {conv.lastMessageTime}
                    </Text>
                  </View>

                  <View style={styles.convBodyRow}>
                    <Text
                      style={[styles.lastMessageText, hasUnread && styles.lastMessageUnread]}
                      numberOfLines={1}
                    >
                      {conv.lastMessage}
                    </Text>

                    {hasUnread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                      </View>
                    )}
                  </View>

                  {/* Type Tag */}
                  <View style={styles.typeBadgeRow}>
                    <Badge
                      label={
                        conv.type === 'squad'
                          ? 'Squad Chat'
                          : conv.type === 'event'
                          ? 'Event Group'
                          : 'Direct Message'
                      }
                      variant={conv.type === 'squad' ? 'gaming' : 'neutral'}
                      size="sm"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  unreadPill: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  unreadPillText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabFilterBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSurface2,
    marginHorizontal: spacing.base,
    borderRadius: radius.lg,
    padding: 3,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  tabFilterBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  tabFilterBtnActive: {
    backgroundColor: colors.primary,
  },
  tabFilterText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },
  tabFilterTextActive: {
    color: colors.textPrimary,
  },
  scrollList: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  convCardUnread: {
    borderColor: colors.borderHighlight,
    backgroundColor: colors.backgroundSurface2,
  },
  convContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  convHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  convTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  timeText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
  },
  timeTextUnread: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
  convBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lastMessageText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  lastMessageUnread: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
});
