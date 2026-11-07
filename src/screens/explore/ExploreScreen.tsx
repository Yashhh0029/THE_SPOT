/**
 * The Spot - Comprehensive Explore & Radar Discovery Screen
 * "The Spot is a living map of tonight."
 * Allows switching between Radar Nearby view and List view
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
import { SearchBar } from '../../components/common/SearchBar';
import { CategoryChip } from '../../components/common/CategoryChip';
import { EventCard } from '../../components/event/EventCard';
import { GamingCard } from '../../components/gaming/GamingCard';
import { SquadCard } from '../../components/social/SquadCard';
import { CommunityCard } from '../../components/social/CommunityCard';
import { EmptyState } from '../../components/common/EmptyState';
import { RadarNearby } from '../../components/radar/RadarNearby';
import { Spotlight } from '../../components/common/Spotlight';
import { EventItem } from '../../types/event';
import { GamingSession } from '../../types/gaming';
import { Squad } from '../../types/squad';
import { Community } from '../../types/community';
import { Icon } from '../../components/common/Icon';

interface ExploreScreenProps {
  onEventPress: (event: EventItem) => void;
  onGamingPress: (session: GamingSession) => void;
  onSquadPress: (squad: Squad) => void;
  onCommunityPress: (community: Community) => void;
  onOpenFilterModal: () => void;
  initialCategory?: string;
}

type ExploreTab = 'all' | 'parties' | 'gaming' | 'squads' | 'communities';
type ViewMode = 'radar' | 'list';

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onEventPress,
  onGamingPress,
  onSquadPress,
  onCommunityPress,
  onOpenFilterModal,
  initialCategory = 'all',
}) => {
  const {
    events,
    gamingSessions,
    squads,
    communities,
    bookmarkedEventIds,
    toggleBookmarkEvent,
    joinGamingSession,
    toggleJoinSquad,
    toggleJoinCommunity,
    filters,
    updateFilter,
  } = useApp();

  const [viewMode, setViewMode] = useState<ViewMode>('radar'); // Default to living radar view!
  const [activeTab, setActiveTab] = useState<ExploreTab>(initialCategory as ExploreTab);
  const [quickDateFilter, setQuickDateFilter] = useState<'all' | 'tonight' | 'weekend'>('all');

  const query = filters.searchQuery.toLowerCase().trim();

  // Filtered Events
  const filteredEvents = events.filter(evt => {
    if (activeTab !== 'all' && activeTab !== 'parties') return false;
    if (query && !evt.title.toLowerCase().includes(query) && !evt.locationArea.toLowerCase().includes(query) && !evt.categoryLabel.toLowerCase().includes(query)) {
      return false;
    }
    if (quickDateFilter === 'tonight' && !evt.isTonight && evt.date !== 'Tonight') return false;
    if (quickDateFilter === 'weekend' && !evt.date.toLowerCase().includes('sat') && !evt.date.toLowerCase().includes('sun')) return false;
    return true;
  });

  // Filtered Gaming
  const filteredGaming = gamingSessions.filter(sess => {
    if (activeTab !== 'all' && activeTab !== 'gaming') return false;
    if (query && !sess.gameTitle.toLowerCase().includes(query) && !sess.title.toLowerCase().includes(query) && !sess.locationArea.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });

  // Filtered Squads
  const filteredSquads = squads.filter(sqd => {
    if (activeTab !== 'all' && activeTab !== 'squads') return false;
    if (query && !sqd.name.toLowerCase().includes(query) && !sqd.focusGames.some(g => g.toLowerCase().includes(query))) {
      return false;
    }
    return true;
  });

  // Filtered Communities
  const filteredCommunities = communities.filter(comm => {
    if (activeTab !== 'all' && activeTab !== 'communities') return false;
    if (query && !comm.name.toLowerCase().includes(query) && !comm.tags.some(t => t.toLowerCase().includes(query))) {
      return false;
    }
    return true;
  });

  const totalResults =
    filteredEvents.length + filteredGaming.length + filteredSquads.length + filteredCommunities.length;

  const handleRadarItemSelect = (
    item: EventItem | GamingSession,
    type: 'party' | 'gaming' | 'chill'
  ) => {
    if (type === 'party') {
      onEventPress(item as EventItem);
    } else {
      onGamingPress(item as GamingSession);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Top Header with Radar / List Toggle */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerTitle}>Living Map</Text>
              <Spotlight variant="dot" size={6} color={colors.secondary} style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.headerSubtitle}>Real-time energy in Pune</Text>
          </View>

          {/* View Mode Toggle Pill */}
          <View style={styles.viewModeToggle}>
            <TouchableOpacity
              onPress={() => setViewMode('radar')}
              style={[styles.toggleBtn, viewMode === 'radar' && styles.toggleBtnActive]}
            >
              <Icon
                name="compass"
                size={13}
                color={viewMode === 'radar' ? colors.textPrimary : colors.textSecondary}
              />
              <Text style={[styles.toggleBtnText, viewMode === 'radar' && styles.toggleBtnTextActive]}>
                Radar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            >
              <Icon
                name="search"
                size={13}
                color={viewMode === 'list' ? colors.textPrimary : colors.textSecondary}
              />
              <Text style={[styles.toggleBtnText, viewMode === 'list' && styles.toggleBtnTextActive]}>
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={filters.searchQuery}
          onChangeText={txt => updateFilter('searchQuery', txt)}
          placeholder="Filter by keyword, neighborhood, game..."
          onFilterPress={onOpenFilterModal}
          hasActiveFilters={quickDateFilter !== 'all'}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollResults}
      >
        {/* VIEW MODE 1: RADAR NEARBY */}
        {viewMode === 'radar' ? (
          <View>
            <View style={styles.radarSectionHeader}>
              <View style={styles.radarSectionTitleRow}>
                <Spotlight variant="pulse" size={10} color={colors.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.radarSectionTitle}>Pune Radar Nearby</Text>
              </View>
              <Text style={styles.radarSectionSub}>Tap any beacon to inspect</Text>
            </View>

            <RadarNearby
              events={events}
              gamingSessions={gamingSessions}
              onSelectItem={handleRadarItemSelect}
            />

            {/* Quick List preview below radar */}
            <View style={{ marginTop: spacing.base }}>
              <Text style={styles.subSectionTitle}>All Beacons Near You ({events.length + gamingSessions.length})</Text>
              {events.slice(0, 2).map(evt => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onPress={() => onEventPress(evt)}
                  isBookmarked={bookmarkedEventIds.includes(evt.id)}
                  onBookmarkToggle={() => toggleBookmarkEvent(evt.id)}
                />
              ))}
            </View>
          </View>
        ) : (
          /* VIEW MODE 2: LIST VIEW */
          <View>
            {/* Horizontal Category Scroller */}
            <View style={styles.categoryScrollWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryChipsList}
              >
                <CategoryChip
                  label="All Experiences"
                  icon="sparkles"
                  isSelected={activeTab === 'all'}
                  onPress={() => setActiveTab('all')}
                />
                <CategoryChip
                  label="Parties & Events"
                  icon="music"
                  badgeCount={events.length}
                  isSelected={activeTab === 'parties'}
                  onPress={() => setActiveTab('parties')}
                />
                <CategoryChip
                  label="Gaming & LANs"
                  icon="gamepad"
                  badgeCount={gamingSessions.length}
                  isSelected={activeTab === 'gaming'}
                  onPress={() => setActiveTab('gaming')}
                />
                <CategoryChip
                  label="Squads"
                  icon="users"
                  badgeCount={squads.length}
                  isSelected={activeTab === 'squads'}
                  onPress={() => setActiveTab('squads')}
                />
                <CategoryChip
                  label="Communities"
                  icon="star"
                  badgeCount={communities.length}
                  isSelected={activeTab === 'communities'}
                  onPress={() => setActiveTab('communities')}
                />
              </ScrollView>
            </View>

            {/* Quick Date Pills */}
            {(activeTab === 'all' || activeTab === 'parties') && (
              <View style={styles.quickDateRow}>
                <TouchableOpacity
                  onPress={() => setQuickDateFilter('all')}
                  style={[styles.datePill, quickDateFilter === 'all' && styles.datePillActive]}
                >
                  <Text style={[styles.datePillText, quickDateFilter === 'all' && styles.datePillTextActive]}>
                    Anytime
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setQuickDateFilter('tonight')}
                  style={[styles.datePill, quickDateFilter === 'tonight' && styles.datePillActive]}
                >
                  <Text style={[styles.datePillText, quickDateFilter === 'tonight' && styles.datePillTextActive]}>
                    🔥 Tonight
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setQuickDateFilter('weekend')}
                  style={[styles.datePill, quickDateFilter === 'weekend' && styles.datePillActive]}
                >
                  <Text style={[styles.datePillText, quickDateFilter === 'weekend' && styles.datePillTextActive]}>
                    This Weekend
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {totalResults === 0 ? (
              <EmptyState
                icon="search"
                title="No matching experiences found"
                description="Try another Pune neighborhood or reset your filters."
                actionTitle="Reset Search"
                onActionPress={() => {
                  updateFilter('searchQuery', '');
                  setQuickDateFilter('all');
                  setActiveTab('all');
                }}
              />
            ) : (
              <>
                {/* Events */}
                {filteredEvents.length > 0 && (
                  <View style={styles.resultsBlock}>
                    <Text style={styles.blockTitle}>Parties & Events ({filteredEvents.length})</Text>
                    {filteredEvents.map(evt => (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        onPress={() => onEventPress(evt)}
                        isBookmarked={bookmarkedEventIds.includes(evt.id)}
                        onBookmarkToggle={() => toggleBookmarkEvent(evt.id)}
                      />
                    ))}
                  </View>
                )}

                {/* Gaming */}
                {filteredGaming.length > 0 && (
                  <View style={styles.resultsBlock}>
                    <Text style={styles.blockTitle}>Gaming Lobbies ({filteredGaming.length})</Text>
                    {filteredGaming.map(session => (
                      <GamingCard
                        key={session.id}
                        session={session}
                        onPress={() => onGamingPress(session)}
                        onJoinPress={() => joinGamingSession(session.id)}
                      />
                    ))}
                  </View>
                )}

                {/* Squads */}
                {filteredSquads.length > 0 && (
                  <View style={styles.resultsBlock}>
                    <Text style={styles.blockTitle}>Squads ({filteredSquads.length})</Text>
                    {filteredSquads.map(sqd => (
                      <SquadCard
                        key={sqd.id}
                        squad={sqd}
                        onPress={() => onSquadPress(sqd)}
                        onJoinToggle={() => toggleJoinSquad(sqd.id)}
                      />
                    ))}
                  </View>
                )}

                {/* Communities */}
                {filteredCommunities.length > 0 && (
                  <View style={styles.resultsBlock}>
                    <Text style={styles.blockTitle}>Communities ({filteredCommunities.length})</Text>
                    {filteredCommunities.map(comm => (
                      <CommunityCard
                        key={comm.id}
                        community={comm}
                        onPress={() => onCommunityPress(comm)}
                        onJoinToggle={() => toggleJoinCommunity(comm.id)}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
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
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleBtnText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  toggleBtnTextActive: {
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
  },
  radarSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  radarSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarSectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  radarSectionSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
  },
  subSectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  categoryScrollWrapper: {
    marginBottom: spacing.xs,
  },
  categoryChipsList: {
    paddingBottom: spacing.xs,
  },
  quickDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  datePill: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  datePillActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.borderHighlight,
  },
  datePillText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  datePillTextActive: {
    color: colors.secondary,
  },
  scrollResults: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xs,
  },
  resultsBlock: {
    marginBottom: spacing.md,
  },
  blockTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
