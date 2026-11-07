/**
 * The Spot - Gaming Session Details Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { GamingSession } from '../../types/gaming';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface GamingSessionDetailsScreenProps {
  session: GamingSession;
  onBack: () => void;
  onOpenChat?: () => void;
}

export const GamingSessionDetailsScreen: React.FC<GamingSessionDetailsScreenProps> = ({
  session,
  onBack,
  onOpenChat,
}) => {
  const { joinGamingSession, leaveGamingSession } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isJoined = session.userJoinedStatus === 'joined';
  const isFull = session.filledSlots >= session.totalSlots;
  const spotsLeft = session.totalSlots - session.filledSlots;

  const handleToggleJoin = () => {
    if (isJoined) {
      leaveGamingSession(session.id);
      showToast('You left the squad lobby.');
    } else {
      joinGamingSession(session.id);
      showToast('You locked your slot in this squad!');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Floating Back Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={onBack} style={styles.floatingBtn}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => showToast('Session link copied to clipboard!')}
          style={styles.floatingBtn}
        >
          <Icon name="share" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover Header */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: session.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay} />

          <View style={styles.badgesRow}>
            <Badge label={session.gameTitle} variant="gaming" size="md" />
            <Badge label={session.platform} variant="primary" size="md" style={{ marginLeft: 6 }} />
          </View>
        </View>

        {/* Content */}
        <View style={styles.body}>
          {toastMsg && (
            <View style={styles.toast}>
              <Icon name="check" size={14} color={colors.emeraldSuccess} />
              <Text style={styles.toastText}>{toastMsg}</Text>
            </View>
          )}

          <Text style={styles.title}>{session.title}</Text>

          {/* Quick Info Badges */}
          <View style={styles.metaPillsRow}>
            <View style={styles.metaPill}>
              <Icon name="clock" size={12} color={colors.secondary} />
              <Text style={styles.metaPillText}>{session.date} · {session.time}</Text>
            </View>
            <View style={styles.metaPill}>
              <Icon name="map-pin" size={12} color={colors.cyanGaming} />
              <Text style={styles.metaPillText}>{session.locationArea}</Text>
            </View>
            <View style={styles.metaPill}>
              <Icon name="zap" size={12} color={colors.accent} />
              <Text style={styles.metaPillText}>{session.formatLabel}</Text>
            </View>
          </View>

          {/* Host Card */}
          <View style={styles.hostCard}>
            <Avatar uri={session.host.avatar} name={session.host.name} size={42} />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>{session.host.name} (Host)</Text>
              <Text style={styles.hostStats}>
                ★ {session.host.rating} · Skill Level: {session.skillLevel.toUpperCase()}
              </Text>
            </View>
            {onOpenChat && (
              <Button title="Chat" size="sm" variant="secondary" icon="message-square" onPress={onOpenChat} />
            )}
          </View>

          {/* Squad Roster & Slots */}
          <View style={styles.rosterSection}>
            <View style={styles.rosterHeader}>
              <Text style={styles.sectionHeading}>Squad Roster</Text>
              <Text style={styles.rosterCount}>
                <Text style={{ color: colors.cyanGaming, fontWeight: '700' }}>{session.filledSlots}</Text>/{session.totalSlots} Slots Filled
              </Text>
            </View>

            <View style={styles.slotsList}>
              {Array.from({ length: session.totalSlots }).map((_, index) => {
                const isSlotFilled = index < session.filledSlots;
                const isHostSlot = index === 0;

                return (
                  <View
                    key={index}
                    style={[
                      styles.slotCard,
                      isSlotFilled ? styles.slotFilled : styles.slotOpen,
                    ]}
                  >
                    <View style={styles.slotLeft}>
                      <View style={styles.slotIndexBadge}>
                        <Text style={styles.slotIndexText}>#{index + 1}</Text>
                      </View>
                      <Text style={styles.slotPlayerName}>
                        {isHostSlot
                          ? `${session.host.name} (Host)`
                          : isSlotFilled
                          ? `Teammate #${index + 1}`
                          : 'Open Slot (Available)'}
                      </Text>
                    </View>

                    <Badge
                      label={isSlotFilled ? 'Locked' : 'Open'}
                      variant={isSlotFilled ? 'success' : 'neutral'}
                      size="sm"
                    />
                  </View>
                );
              })}
            </View>
          </View>

          {/* About / Brief */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Session Description</Text>
            <Text style={styles.descText}>{session.description}</Text>
          </View>

          {/* Voice Chat / Venue Details */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Voice & Venue Details</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Location & Setup:</Text>
              <Text style={styles.detailValue}>
                {session.venueDetails || `${session.locationArea}, Pune`}
              </Text>

              {session.voiceChatRequired && (
                <>
                  <Text style={[styles.detailLabel, { marginTop: spacing.sm }]}>Voice Server:</Text>
                  <Text style={styles.detailLink}>
                    {session.voiceChatLink || 'Discord Server (Invite shared upon joining)'}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {session.tags.map((t, i) => (
              <Badge key={i} label={t} variant="neutral" size="sm" />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.feeColumn}>
          <Text style={styles.feeLabel}>Entry Fee</Text>
          <Text style={styles.feeValue}>
            {session.entryFeeInr === 0 ? 'Free' : `₹${session.entryFeeInr}`}
          </Text>
        </View>

        <Button
          title={
            isJoined
              ? 'Leave Squad Slot'
              : isFull
              ? 'Lobby Full'
              : `Join Squad (${spotsLeft} left)`
          }
          variant={isJoined ? 'secondary' : isFull ? 'outline' : 'primary'}
          disabled={!isJoined && isFull}
          size="lg"
          onPress={handleToggleJoin}
          style={styles.actionBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  floatingHeader: {
    position: 'absolute',
    top: 40,
    left: spacing.base,
    right: spacing.base,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(9, 7, 17, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.backgroundSurface2,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 7, 17, 0.4)',
  },
  badgesRow: {
    position: 'absolute',
    bottom: spacing.base,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    padding: spacing.base,
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
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: spacing.sm,
  },
  metaPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  metaPillText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginLeft: 5,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  hostInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  hostName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  hostStats: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rosterSection: {
    marginBottom: spacing.xl,
  },
  rosterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  rosterCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  slotsList: {
    gap: spacing.xs + 2,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  slotFilled: {
    backgroundColor: colors.backgroundSurface2,
    borderColor: colors.borderDefault,
  },
  slotOpen: {
    backgroundColor: colors.backgroundElevated,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotIndexBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  slotIndexText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  slotPlayerName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  descText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  detailBox: {
    backgroundColor: colors.backgroundSurface2,
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginTop: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.bold,
  },
  detailValue: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    marginTop: 2,
  },
  detailLink: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeight.semibold,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.xl,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  feeColumn: {
    marginRight: spacing.md,
  },
  feeLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  feeValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  actionBtn: {
    flex: 1,
  },
});
