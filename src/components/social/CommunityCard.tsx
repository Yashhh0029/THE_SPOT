/**
 * The Spot - Reusable CommunityCard Component
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
import { Community } from '../../types/community';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface CommunityCardProps {
  community: Community;
  onPress: () => void;
  onJoinToggle?: () => void;
  style?: ViewStyle;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onPress,
  onJoinToggle,
  style,
}) => {
  const isJoined = community.isJoined || community.joinStatus === 'member';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, style]}
    >
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        <Image source={{ uri: community.bannerImage }} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
        <Badge
          label={community.categoryLabel}
          variant="primary"
          size="sm"
          style={styles.categoryBadge}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.avatarRow}>
          <Avatar
            uri={community.avatarImage}
            name={community.name}
            size={48}
            style={styles.communityAvatar}
          />
          <View style={styles.memberStats}>
            <Icon name="users" size={13} color={colors.secondary} />
            <Text style={styles.memberCountText}>
              {community.memberCount.toLocaleString()} members
            </Text>
          </View>
        </View>

        <Text style={styles.name}>{community.name}</Text>
        <Text style={styles.tagline} numberOfLines={2}>
          {community.tagline}
        </Text>

        {/* Activity Counters */}
        <View style={styles.activityRow}>
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{community.activeEventsCount}</Text>
            <Text style={styles.activityLabel}>Active Events</Text>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>{community.activeGamingCount}</Text>
            <Text style={styles.activityLabel}>Game Lobbies</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Button
          title={isJoined ? 'Joined Community' : 'Join Community'}
          variant={isJoined ? 'secondary' : 'primary'}
          size="sm"
          fullWidth
          onPress={onJoinToggle || onPress}
          icon={isJoined ? 'check' : 'plus'}
        />
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
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerContainer: {
    height: 90,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.backgroundSurface2,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 7, 17, 0.4)',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  content: {
    padding: spacing.md,
    paddingTop: 0,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -24,
    marginBottom: spacing.sm,
  },
  communityAvatar: {
    borderWidth: 2,
    borderColor: colors.backgroundElevated,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  memberCountText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: 5,
    fontWeight: typography.fontWeight.semibold,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundSurface2,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  activityItem: {
    alignItems: 'center',
  },
  activityValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
  },
  activityLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    marginTop: 2,
  },
  activityDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderSubtle,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginBottom: spacing.md,
  },
});
