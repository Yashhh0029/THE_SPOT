/**
 * The Spot - Gaming Hub & Tournaments Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { GamingSession } from '../../types/gaming';
import { GamingCard } from '../../components/gaming/GamingCard';
import { QuickPlayBanner } from '../../components/gaming/QuickPlayBanner';
import { CategoryChip } from '../../components/common/CategoryChip';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface GamingHubScreenProps {
  onSessionPress: (session: GamingSession) => void;
  onOpenCreateGaming: () => void;
  onBack?: () => void;
}

type GamingFormatFilter = 'all' | 'lan_cafe' | 'online' | 'turf' | 'boardgame_cafe';

export const GamingHubScreen: React.FC<GamingHubScreenProps> = ({
  onSessionPress,
  onOpenCreateGaming,
  onBack,
}) => {
  const { gamingSessions, tournaments, joinGamingSession } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<GamingFormatFilter>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredSessions = gamingSessions.filter(s => {
    if (selectedFormat === 'all') return true;
    return s.format === selectedFormat;
  });

  const handleMatchFound = (game: string) => {
    setToastMessage(`Joined Pune lobby for ${game}! Voice chat info sent to inbox.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Icon name="arrow-left" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.headerTitle}>Gaming & Esports Hub</Text>
            <Text style={styles.headerSubtitle}>LAN cafes, turf arenas, and competitive lobbies in Pune</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onOpenCreateGaming} style={styles.createBtn}>
          <Icon name="plus" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Toast */}
        {toastMessage && (
          <View style={styles.toast}>
            <Icon name="check" size={14} color={colors.emeraldSuccess} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* QuickPlay Matchmaker */}
        <QuickPlayBanner onMatchFound={handleMatchFound} />

        {/* Format Filter Chips */}
        <View style={styles.formatChipsRow}>
          <CategoryChip
            label="All Formats"
            icon="gamepad"
            isSelected={selectedFormat === 'all'}
            onPress={() => setSelectedFormat('all')}
          />
          <CategoryChip
            label="LAN Cafes (Respawn/Mariplex)"
            icon="zap"
            isSelected={selectedFormat === 'lan_cafe'}
            onPress={() => setSelectedFormat('lan_cafe')}
          />
          <CategoryChip
            label="Turf Arenas (Cricket & Football)"
            icon="activity"
            isSelected={selectedFormat === 'turf'}
            onPress={() => setSelectedFormat('turf')}
          />
          <CategoryChip
            label="Board Game Lounges"
            icon="sparkles"
            isSelected={selectedFormat === 'boardgame_cafe'}
            onPress={() => setSelectedFormat('boardgame_cafe')}
          />
          <CategoryChip
            label="Online Scrims"
            icon="users"
            isSelected={selectedFormat === 'online'}
            onPress={() => setSelectedFormat('online')}
          />
        </View>

        {/* Active Gaming Lobbies */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Open Pune Gaming Sessions ({filteredSessions.length})
          </Text>
        </View>

        {filteredSessions.map(session => (
          <GamingCard
            key={session.id}
            session={session}
            onPress={() => onSessionPress(session)}
            onJoinPress={() => joinGamingSession(session.id)}
          />
        ))}

        {/* Tournaments & Championships Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pune Tournaments & Leagues</Text>
          <Text style={styles.sectionSub}>Compete for prize pools and local esports glory</Text>
        </View>

        {tournaments.map(tourn => (
          <View key={tourn.id} style={styles.tournCard}>
            <Image source={{ uri: tourn.bannerImage }} style={styles.tournImage} />
            <View style={styles.tournOverlay} />

            <View style={styles.tournContent}>
              <View style={styles.tournTop}>
                <Badge label={tourn.gameTitle} variant="gaming" size="sm" />
                <View style={styles.prizeBadge}>
                  <Text style={styles.prizeText}>₹{(tourn.prizePoolInr / 1000)}K Prize Pool</Text>
                </View>
              </View>

              <Text style={styles.tournTitle}>{tourn.title}</Text>
              <Text style={styles.tournMeta}>
                📍 {tourn.location} · 📅 {tourn.date}
              </Text>
              <Text style={styles.tournFormat}>
                {tourn.format} · {tourn.registeredTeams}/{tourn.maxTeams} Teams Registered
              </Text>

              <Button
                title={`Register Team (Entry ₹${tourn.entryFeeInr})`}
                onPress={() => alert(`Registration details for ${tourn.title} sent to your email!`)}
                size="sm"
                variant="primary"
                style={{ marginTop: spacing.sm }}
              />
            </View>
          </View>
        ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  createBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xs,
  },
  toast: {
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
  formatChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.base,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tournCard: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginBottom: spacing.base,
  },
  tournImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tournOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 7, 17, 0.75)',
  },
  tournContent: {
    ...StyleSheet.absoluteFill,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  tournTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prizeBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
    borderWidth: 1,
    borderColor: colors.cyanGaming,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  prizeText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyanGaming,
  },
  tournTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  tournMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    marginTop: 2,
  },
  tournFormat: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
