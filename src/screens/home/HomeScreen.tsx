/**
 * The Spot - Home / Discover Screen
 * "The Spot is a living map of tonight."
 * Featuring: Vibe Switcher (PARTY | GAME | CHILL), Spotlight Hero, and Tonight Mode
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
import { useAuth } from '../../context/AuthContext';
import { useTonightMode } from '../../hooks/useTonightMode';
import { AppHeader } from '../../components/navigation/AppHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { FeaturedEventHero } from '../../components/event/FeaturedEventHero';
import { EventCard } from '../../components/event/EventCard';
import { GamingCard } from '../../components/gaming/GamingCard';
import { QuickPlayBanner } from '../../components/gaming/QuickPlayBanner';
import { SquadCard } from '../../components/social/SquadCard';
import { CommunityCard } from '../../components/social/CommunityCard';
import { VibeSwitcher, VibeMode } from '../../components/home/VibeSwitcher';
import { Spotlight } from '../../components/common/Spotlight';
import { EventItem } from '../../types/event';
import { GamingSession } from '../../types/gaming';
import { Squad } from '../../types/squad';
import { Community } from '../../types/community';
import { Icon } from '../../components/common/Icon';

interface HomeScreenProps {
  onEventPress: (event: EventItem) => void;
  onGamingPress: (session: GamingSession) => void;
  onSquadPress: (squad: Squad) => void;
  onCommunityPress: (community: Community) => void;
  onOpenCreate: () => void;
  onOpenLocationModal: () => void;
  onOpenFilterModal: () => void;
  onNavigateToExplore: (category?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onEventPress,
  onGamingPress,
  onSquadPress,
  onCommunityPress,
  onOpenCreate,
  onOpenLocationModal,
  onOpenFilterModal,
  onNavigateToExplore,
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

  const { user, selectedNeighborhood } = useAuth();
  const { isTonightMode, hoursUntilMidnight } = useTonightMode();

  const [currentVibe, setCurrentVibe] = useState<VibeMode>('all');
  const [quickPlayToast, setQuickPlayToast] = useState<string | null>(null);

  // Featured Hero (first featured or top event)
  const featuredEvent = events.find(e => e.isFeatured) || events[0];

  // Tonight activity counts (grounded strictly in local data)
  const tonightEventsCount = events.filter(e => e.isTonight || e.date.toLowerCase().includes('tonight')).length;
  const tonightGamingCount = gamingSessions.filter(g => g.date.toLowerCase().includes('tonight')).length;

  // Filter & prioritize content based on current vibe mode without permanent loss of categories
  const primaryEvents = events.filter(e => {
    if (currentVibe === 'chill') return e.category === 'boardgames' || e.category === 'mixer';
    if (currentVibe === 'party') return e.category === 'rooftop' || e.category === 'techno' || e.category === 'party';
    if (currentVibe === 'game') return false;
    return true; // 'all'
  });

  const secondaryEvents = events.filter(e => {
    if (currentVibe === 'game') return true; // Show events as secondary in game mode
    if (currentVibe === 'chill') return e.category !== 'boardgames' && e.category !== 'mixer';
    return false;
  });

  const primaryGaming = gamingSessions.filter(g => {
    if (currentVibe === 'chill') return g.category === 'tabletop';
    if (currentVibe === 'party') return false;
    return true; // 'all' or 'game'
  });

  const secondaryGaming = gamingSessions.filter(g => {
    if (currentVibe === 'party') return true; // Show gaming as secondary in party mode
    if (currentVibe === 'chill') return g.category !== 'tabletop';
    return false;
  });

  const handleMatchFound = (game: string) => {
    setQuickPlayToast(`Lobby found for ${game}! Connecting to voice server...`);
    setTimeout(() => setQuickPlayToast(null), 4500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Top Header with Spotlight motif */}
      <AppHeader
        currentNeighborhood={selectedNeighborhood}
        onNeighborhoodPress={onOpenLocationModal}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personalized Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSmall}>
            {isTonightMode ? 'Tonight in' : 'Explore'} {selectedNeighborhood},
          </Text>
          <Text style={styles.greetingName}>{user.name.split(' ')[0]} ✨</Text>
        </View>

        {/* Tonight Mode Ambient Banner - Factual & Contextual */}
        {isTonightMode && (
          <View style={styles.tonightAlertBar}>
            <Spotlight variant="pulse" size={10} color={colors.tonightAccent} style={{ marginRight: 8 }} />
            <Text style={styles.tonightAlertText}>
              <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Tonight Mode Active:</Text>{' '}
              {tonightEventsCount} events and {tonightGamingCount} gaming sessions scheduled for tonight in Pune.
            </Text>
          </View>
        )}

        {/* Search Bar */}
        <SearchBar
          value={filters.searchQuery}
          onChangeText={txt => updateFilter('searchQuery', txt)}
          placeholder="Search parties, gaming cafes, squads..."
          onFilterPress={onOpenFilterModal}
          hasActiveFilters={filters.dateFilter !== 'all' || filters.budgetMaxInr > 0}
          style={styles.searchBar}
        />

        {/* SIGNATURE FEATURE: VIBE SWITCHER */}
        <VibeSwitcher
          currentVibe={currentVibe}
          onSelectVibe={setCurrentVibe}
        />

        {/* Toast Notification */}
        {quickPlayToast && (
          <View style={styles.toastBox}>
            <Icon name="check" size={16} color={colors.emeraldSuccess} />
            <Text style={styles.toastText}>{quickPlayToast}</Text>
          </View>
        )}

        {/* SIGNATURE FEATURE: SPOTLIGHT HERO (Shown in all, party, and chill modes) */}
        {featuredEvent && currentVibe !== 'game' && (
          <FeaturedEventHero
            event={featuredEvent}
            onPress={() => onEventPress(featuredEvent)}
          />
        )}

        {/* VIBE MODE = 'GAME': Show QuickPlay first */}
        {currentVibe === 'game' && (
          <QuickPlayBanner onMatchFound={handleMatchFound} />
        )}

        {/* VIBE MODE = 'GAME': Primary Gaming Sessions */}
        {currentVibe === 'game' && primaryGaming.length > 0 && (
          <>
            <SectionHeader
              title="Active Gaming Lobbies & Sessions"
              subtitle="Join active Pune rosters for LAN & online play"
              badge="Live"
              actionText="View Hub"
              onActionPress={() => onNavigateToExplore('gaming')}
            />
            {primaryGaming.map(session => (
              <GamingCard
                key={session.id}
                session={session}
                onPress={() => onGamingPress(session)}
                onJoinPress={() => joinGamingSession(session.id)}
              />
            ))}
          </>
        )}

        {/* Primary Events / Parties Section (for all, party, chill) */}
        {primaryEvents.length > 0 && (
          <>
            <SectionHeader
              title={
                currentVibe === 'chill'
                  ? 'Cozy Cafes & Board Game Nights'
                  : currentVibe === 'party'
                  ? 'Trending Pune Parties & Sundowners'
                  : 'Happening Tonight in Pune'
              }
              subtitle="Confirmed spots & secret locations near you"
              badge={currentVibe === 'party' ? 'Party' : 'Live'}
              actionText="See all"
              onActionPress={() => onNavigateToExplore('parties')}
            />
            {primaryEvents.map(evt => (
              <EventCard
                key={evt.id}
                event={evt}
                onPress={() => onEventPress(evt)}
                isBookmarked={bookmarkedEventIds.includes(evt.id)}
                onBookmarkToggle={() => toggleBookmarkEvent(evt.id)}
              />
            ))}
          </>
        )}

        {/* VIBE MODE = 'ALL' or 'CHILL': Primary Gaming Sessions */}
        {currentVibe !== 'game' && primaryGaming.length > 0 && (
          <>
            {currentVibe === 'all' && (
              <QuickPlayBanner onMatchFound={handleMatchFound} />
            )}

            <SectionHeader
              title={currentVibe === 'chill' ? 'Tabletop Lounges' : 'Gaming Sessions & Lobbies'}
              subtitle="Join active Pune rosters for LAN & online play"
              badge="Live"
              actionText="View Hub"
              onActionPress={() => onNavigateToExplore('gaming')}
            />
            {primaryGaming.slice(0, 3).map(session => (
              <GamingCard
                key={session.id}
                session={session}
                onPress={() => onGamingPress(session)}
                onJoinPress={() => joinGamingSession(session.id)}
              />
            ))}
          </>
        )}

        {/* Secondary Gaming Section in PARTY Mode (so gaming doesn't disappear) */}
        {currentVibe === 'party' && secondaryGaming.length > 0 && (
          <>
            <SectionHeader
              title="Gaming & LAN Lounges Tonight"
              subtitle="Looking for late-night gaming in Pune?"
              badge="Gaming"
              actionText="View Hub"
              onActionPress={() => onNavigateToExplore('gaming')}
            />
            {secondaryGaming.slice(0, 2).map(session => (
              <GamingCard
                key={session.id}
                session={session}
                onPress={() => onGamingPress(session)}
                onJoinPress={() => joinGamingSession(session.id)}
              />
            ))}
          </>
        )}

        {/* Secondary Events in GAME Mode (so parties don't disappear) */}
        {currentVibe === 'game' && secondaryEvents.length > 0 && (
          <>
            <SectionHeader
              title="Tonight’s Parties & Socials"
              subtitle="Going out after your gaming session?"
              badge="Parties"
              actionText="See all"
              onActionPress={() => onNavigateToExplore('parties')}
            />
            {secondaryEvents.slice(0, 2).map(evt => (
              <EventCard
                key={evt.id}
                event={evt}
                onPress={() => onEventPress(evt)}
                isBookmarked={bookmarkedEventIds.includes(evt.id)}
                onBookmarkToggle={() => toggleBookmarkEvent(evt.id)}
              />
            ))}
          </>
        )}

        {/* Squad Discovery */}
        <SectionHeader
          title="Find Your Squad"
          subtitle="Compatible players & crews looking for teammates"
          actionText="Explore Squads"
          onActionPress={() => onNavigateToExplore('squads')}
        />
        {squads.slice(0, 2).map(squad => (
          <SquadCard
            key={squad.id}
            squad={squad}
            onPress={() => onSquadPress(squad)}
            onJoinToggle={() => toggleJoinSquad(squad.id)}
          />
        ))}

        {/* Pune Communities */}
        <SectionHeader
          title="Pune Communities"
          subtitle="Join active circles for nightlife, tech & board games"
          actionText="All Communities"
          onActionPress={() => onNavigateToExplore('communities')}
        />
        {communities.slice(0, 2).map(comm => (
          <CommunityCard
            key={comm.id}
            community={comm}
            onPress={() => onCommunityPress(comm)}
            onJoinToggle={() => toggleJoinCommunity(comm.id)}
          />
        ))}

        {/* Host / Create CTA Promo Card */}
        <View style={styles.createPromoCard}>
          <View style={styles.promoIconRow}>
            <Spotlight variant="pulse" size={14} color={colors.secondary} style={{ marginRight: 6 }} />
            <Text style={styles.promoTag}>LIVING MAP OF PUNE</Text>
          </View>
          <Text style={styles.promoTitle}>Host an experience or create a gaming lobby</Text>
          <Text style={styles.promoDesc}>
            Publish in minutes, set private address controls, and screen your guests with ease.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onOpenCreate}
            style={styles.promoBtn}
          >
            <Text style={styles.promoBtnText}>Create on The Spot (+)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  greetingSection: {
    marginBottom: spacing.xs,
  },
  greetingSmall: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  greetingName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  tonightAlertBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 78, 120, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 78, 120, 0.35)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  tonightAlertText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  searchBar: {
    marginBottom: spacing.xs,
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldSuccess,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
  },
  toastText: {
    color: colors.emeraldSuccess,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.sm,
    flex: 1,
  },
  createPromoCard: {
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  promoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  promoTag: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.secondary,
    letterSpacing: 1,
  },
  promoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 24,
  },
  promoDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.base,
  },
  promoBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBtnText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
