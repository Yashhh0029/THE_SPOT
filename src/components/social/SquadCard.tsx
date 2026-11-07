/**
 * The Spot - Reusable SquadCard Component
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Squad } from '../../types/squad';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Badge } from '../common/Badge';
import { Avatar, AvatarGroup } from '../common/Avatar';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface SquadCardProps {
  squad: Squad;
  onPress: () => void;
  onJoinToggle?: () => void;
  style?: ViewStyle;
}

export const SquadCard: React.FC<SquadCardProps> = ({
  squad,
  onPress,
  onJoinToggle,
  style,
}) => {
  const isMember = squad.isUserMember || squad.joinStatus === 'member';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, style]}
    >
      {/* Header: Squad Avatar, Name, Compatibility Badge */}
      <View style={styles.headerRow}>
        <Avatar uri={squad.avatar} name={squad.name} size={48} />
        <View style={styles.titleColumn}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{squad.name}</Text>
            <Text style={styles.tag}>{squad.tag}</Text>
          </View>
          <Text style={styles.vibeText}>{squad.vibe}</Text>
        </View>

        {/* Compatibility Match Meter */}
        <View style={styles.matchMeter}>
          <Text style={styles.matchPercent}>{squad.compatibilityScore}%</Text>
          <Text style={styles.matchLabel}>Match</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {squad.description}
      </Text>

      {/* Focus Games Badges */}
      <View style={styles.gamesRow}>
        {squad.focusGames.map((game, i) => (
          <Badge key={i} label={game} variant="gaming" size="sm" style={styles.gameBadge} />
        ))}
      </View>

      <View style={styles.divider} />

      {/* Footer: Member Stack & Action */}
      <View style={styles.footerRow}>
        <View style={styles.memberInfo}>
          <AvatarGroup
            users={squad.members.map(m => ({ avatar: m.user.avatar, name: m.user.name }))}
            size={24}
            maxVisible={3}
          />
          <Text style={styles.memberCountText}>
            {squad.memberCount}/{squad.maxMembers} Members
          </Text>
        </View>

        <Button
          title={isMember ? 'Joined' : 'Join Squad'}
          variant={isMember ? 'secondary' : 'primary'}
          size="sm"
          onPress={onJoinToggle || onPress}
          icon={isMember ? 'check' : 'plus'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleColumn: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  tag: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.cyanGaming,
    marginLeft: 6,
    backgroundColor: colors.backgroundSurface3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  vibeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  matchMeter: {
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  matchPercent: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.secondary,
  },
  matchLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  gamesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  gameBadge: {
    marginRight: 0,
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
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
