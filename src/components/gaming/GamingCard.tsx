/**
 * The Spot - High-Energy GamingCard Component
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { GamingSession } from '../../types/gaming';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface GamingCardProps {
  session: GamingSession;
  onPress: () => void;
  onJoinPress?: () => void;
  style?: ViewStyle;
}

export const GamingCard: React.FC<GamingCardProps> = ({
  session,
  onPress,
  onJoinPress,
  style,
}) => {
  const isJoined = session.userJoinedStatus === 'joined';
  const isPending = session.userJoinedStatus === 'request_pending';
  const isFull = session.filledSlots >= session.totalSlots;
  const slotsRemaining = session.totalSlots - session.filledSlots;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, style]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: session.coverImage }} style={styles.coverImage} />
        <View style={styles.topOverlay}>
          <Badge label={session.platform} variant="gaming" size="sm" />
          <Badge
            label={session.skillLevel.toUpperCase()}
            variant={session.skillLevel === 'competitive' ? 'accent' : 'primary'}
            size="sm"
          />
        </View>

        <View style={styles.formatTag}>
          <Text style={styles.formatText}>{session.formatLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Game Title & Timing */}
        <View style={styles.headerRow}>
          <Text style={styles.gameTitle}>{session.gameTitle}</Text>
          <View style={styles.timingBadge}>
            <Icon name="clock" size={11} color={colors.secondary} />
            <Text style={styles.timingText}>{session.date} · {session.time.split('-')[0].trim()}</Text>
          </View>
        </View>

        {/* Session Title */}
        <Text style={styles.title} numberOfLines={2}>
          {session.title}
        </Text>

        {/* Location & Tags */}
        <View style={styles.metaRow}>
          <Icon name="map-pin" size={12} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {session.locationArea} {session.venueDetails ? `· ${session.venueDetails}` : ''}
          </Text>
        </View>

        {/* Player Roster Slots Rack (Visual Avatars & Open Slots) */}
        <View style={styles.slotsRackContainer}>
          <View style={styles.slotsTextRow}>
            <Text style={styles.slotsLabel}>SQUAD ROSTER</Text>
            <Text style={styles.slotsValue}>
              <Text style={styles.slotsFilled}>{session.filledSlots}</Text>/{session.totalSlots} Players Ready
            </Text>
          </View>

          {/* Visual Slot Pills */}
          <View style={styles.slotsRow}>
            {Array.from({ length: Math.min(6, session.totalSlots) }).map((_, idx) => {
              const isFilled = idx < session.filledSlots;
              const slotInfo = session.slots && session.slots[idx];
              const isHost = idx === 0;

              return (
                <View
                  key={idx}
                  style={[
                    styles.slotPill,
                    isFilled ? styles.slotPillFilled : styles.slotPillOpen,
                  ]}
                >
                  <Text
                    style={[
                      styles.slotPillText,
                      isFilled ? styles.slotPillTextFilled : styles.slotPillTextOpen,
                    ]}
                  >
                    {isHost ? '👑 Host' : isFilled ? `P${idx + 1}` : '+ Open'}
                  </Text>
                </View>
              );
            })}
            {session.totalSlots > 6 && (
              <View style={styles.slotMorePill}>
                <Text style={styles.slotMoreText}>+{session.totalSlots - 6}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Host & Action */}
        <View style={styles.footerRow}>
          <View style={styles.hostSnippet}>
            <Avatar uri={session.host.avatar} name={session.host.name} size={24} />
            <Text style={styles.hostName} numberOfLines={1}>
              Host: {session.host.name}
            </Text>
          </View>

          {isJoined ? (
            <Badge label="In Squad" variant="success" icon="check" size="sm" />
          ) : isPending ? (
            <Badge label="Requested" variant="warning" icon="clock" size="sm" />
          ) : isFull ? (
            <Badge label="Lobby Full" variant="neutral" size="sm" />
          ) : (
            <Button
              title={`Join (${slotsRemaining} left)`}
              onPress={onJoinPress || onPress}
              size="sm"
              variant="primary"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
    marginBottom: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: colors.backgroundSurface2,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formatTag: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(9, 7, 17, 0.85)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
  },
  formatText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
  },
  content: {
    padding: spacing.md + 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gameTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyanGaming,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    fontSize: typography.fontSize.xxs,
    color: colors.secondary,
    marginLeft: 4,
    fontWeight: typography.fontWeight.semibold,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  slotsRackContainer: {
    backgroundColor: colors.backgroundSurface2,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    marginBottom: spacing.sm,
  },
  slotsTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  slotsLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.cyanGaming,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  slotsValue: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },
  slotsFilled: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.heavy,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  slotPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  slotPillFilled: {
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    borderColor: colors.cyanGaming,
  },
  slotPillOpen: {
    backgroundColor: 'transparent',
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
  },
  slotPillText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  slotPillTextFilled: {
    color: colors.cyanGaming,
  },
  slotPillTextOpen: {
    color: colors.textMuted,
  },
  slotMorePill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface3,
  },
  slotMoreText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginBottom: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  hostName: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: typography.fontWeight.medium,
  },
});
