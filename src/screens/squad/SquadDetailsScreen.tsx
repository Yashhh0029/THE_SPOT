/**
 * The Spot - Squad Details Screen
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
import { Squad } from '../../types/squad';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface SquadDetailsScreenProps {
  squad: Squad;
  onBack: () => void;
  onOpenSquadChat?: (squadId: string) => void;
}

export const SquadDetailsScreen: React.FC<SquadDetailsScreenProps> = ({
  squad,
  onBack,
  onOpenSquadChat,
}) => {
  const { toggleJoinSquad } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isMember = squad.isUserMember || squad.joinStatus === 'member';

  const handleJoinToggle = () => {
    toggleJoinSquad(squad.id);
    if (isMember) {
      showToast('You left the squad.');
    } else {
      showToast('You joined this squad! Chat channel unlocked.');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => showToast('Squad invite link copied!')}
          style={styles.iconBtn}
        >
          <Icon name="share" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {toastMsg && (
          <View style={styles.toast}>
            <Icon name="check" size={14} color={colors.emeraldSuccess} />
            <Text style={styles.toastText}>{toastMsg}</Text>
          </View>
        )}

        {/* Squad Identity Header */}
        <View style={styles.identitySection}>
          <Avatar uri={squad.avatar} name={squad.name} size={72} />
          <View style={styles.nameRow}>
            <Text style={styles.squadName}>{squad.name}</Text>
            <Text style={styles.tagBadge}>{squad.tag}</Text>
          </View>
          <View style={styles.vibePillRow}>
            <View style={styles.vibePill}>
              <Text style={styles.vibeText}>{squad.vibe}</Text>
            </View>
            <View style={styles.locationPill}>
              <Icon name="map-pin" size={11} color={colors.secondary} />
              <Text style={styles.locationPillText}>{squad.locationArea}, Pune</Text>
            </View>
          </View>

          {/* Compatibility Match Meter - Honest, Grounded */}
          <View style={styles.compatibilityMeter}>
            <View style={styles.compatTextRow}>
              <Text style={styles.compatLabel}>Compatibility Match</Text>
              <Text style={styles.matchValue}>{squad.compatibilityScore}%</Text>
            </View>
            <View style={styles.compatBarBg}>
              <View style={[styles.compatBarFill, { width: `${squad.compatibilityScore}%` }]} />
            </View>
            <Text style={styles.matchSub}>Calculated from shared game titles & Pune neighborhood</Text>
          </View>
        </View>

        {/* Performance Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{squad.stats.matchesPlayed}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.emeraldSuccess }]}>
              {squad.stats.winRatePercent}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: colors.cyanGaming }]}>
              {squad.stats.activityScore}
            </Text>
            <Text style={styles.statLabel}>Activity</Text>
          </View>
        </View>

        {/* Focus Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Games & Activities</Text>
          <View style={styles.gamesRow}>
            {squad.focusGames.map((game, i) => (
              <Badge key={i} label={game} variant="gaming" size="md" />
            ))}
          </View>
        </View>

        {/* Squad Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Squad</Text>
          <Text style={styles.descText}>{squad.description}</Text>
        </View>

        {/* Squad Roster Members */}
        <View style={styles.section}>
          <View style={styles.rosterHeader}>
            <Text style={styles.sectionTitle}>Squad Members</Text>
            <Text style={styles.memberCount}>
              {squad.memberCount} / {squad.maxMembers} Members
            </Text>
          </View>

          <View style={styles.membersList}>
            {squad.members.map((member, i) => (
              <View key={i} style={styles.memberCard}>
                <Avatar uri={member.user.avatar} name={member.user.name} size={38} />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.user.name}</Text>
                  <Text style={styles.memberMeta}>
                    {member.user.locationArea} · {member.joinedAt}
                  </Text>
                </View>
                <Badge
                  label={member.role}
                  variant={member.role === 'Leader' ? 'accent' : 'primary'}
                  size="sm"
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        {isMember && onOpenSquadChat && (
          <Button
            title="Squad Chat"
            variant="secondary"
            icon="message-square"
            onPress={() => onOpenSquadChat(squad.id)}
            style={{ flex: 1, marginRight: spacing.md }}
          />
        )}
        <Button
          title={isMember ? 'Leave Squad' : 'Join This Squad (+)'}
          variant={isMember ? 'danger' : 'primary'}
          onPress={handleJoinToggle}
          style={{ flex: 2 }}
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
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
  identitySection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  squadName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  tagBadge: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyanGaming,
    backgroundColor: colors.backgroundSurface3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: spacing.xs + 2,
  },
  vibePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.xs,
  },
  vibePill: {
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  vibeText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  locationPillText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: 3,
  },
  compatibilityMeter: {
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.xl,
    padding: spacing.base,
    width: '100%',
    marginTop: spacing.md,
  },
  compatTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compatLabel: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.secondary,
  },
  compatBarBg: {
    height: 5,
    backgroundColor: colors.backgroundSurface3,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: 6,
  },
  compatBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
  },
  matchSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    lineHeight: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  statNumber: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  gamesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  descText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  rosterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  memberCount: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  membersList: {
    gap: spacing.xs + 2,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  memberInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  memberName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  memberMeta: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
});
