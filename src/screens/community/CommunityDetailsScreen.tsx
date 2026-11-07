/**
 * The Spot - Community Details Screen
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
import { Community } from '../../types/community';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface CommunityDetailsScreenProps {
  community: Community;
  onBack: () => void;
  onExploreEvents?: () => void;
}

export const CommunityDetailsScreen: React.FC<CommunityDetailsScreenProps> = ({
  community,
  onBack,
  onExploreEvents,
}) => {
  const { toggleJoinCommunity } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isJoined = community.isJoined || community.joinStatus === 'member';

  const handleToggleJoin = () => {
    toggleJoinCommunity(community.id);
    if (isJoined) {
      showToast('You left the community.');
    } else {
      showToast('Welcome! You joined this community.');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => showToast('Community link copied to clipboard!')}
          style={styles.iconBtn}
        >
          <Icon name="share" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: community.bannerImage }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
        </View>

        {/* Content */}
        <View style={styles.body}>
          {toastMsg && (
            <View style={styles.toast}>
              <Icon name="check" size={14} color={colors.emeraldSuccess} />
              <Text style={styles.toastText}>{toastMsg}</Text>
            </View>
          )}

          {/* Avatar & Title Row */}
          <View style={styles.avatarRow}>
            <Avatar
              uri={community.avatarImage}
              name={community.name}
              size={64}
              style={styles.communityAvatar}
            />
            <Badge label={community.categoryLabel} variant="primary" size="md" />
          </View>

          <Text style={styles.name}>{community.name}</Text>
          <Text style={styles.tagline}>{community.tagline}</Text>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{community.memberCount.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{community.activeEventsCount}</Text>
              <Text style={styles.statLabel}>Active Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{community.activeGamingCount}</Text>
              <Text style={styles.statLabel}>Game Lobbies</Text>
            </View>
          </View>

          {/* Organizer Card */}
          <View style={styles.organizerCard}>
            <Avatar uri={community.organizer.avatar} name={community.organizer.name} size={40} />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerLabel}>Community Organizer</Text>
              <Text style={styles.organizerName}>{community.organizer.name}</Text>
            </View>
            <Badge label="Verified" variant="primary" size="sm" />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Community</Text>
            <Text style={styles.descText}>{community.description}</Text>
          </View>

          {/* Rules */}
          {community.rules && community.rules.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Community Guidelines</Text>
              <View style={styles.rulesList}>
                {community.rules.map((rule, i) => (
                  <View key={i} style={styles.ruleItem}>
                    <Icon name="shield-check" size={14} color={colors.secondary} />
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tags */}
          <View style={styles.tagsRow}>
            {community.tags.map((tag, i) => (
              <Badge key={i} label={`#${tag}`} variant="neutral" size="sm" />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        {onExploreEvents && (
          <Button
            title="Browse Events"
            variant="secondary"
            onPress={onExploreEvents}
            style={{ flex: 1, marginRight: spacing.md }}
          />
        )}
        <Button
          title={isJoined ? 'Joined Community ✓' : 'Join Community (+)'}
          variant={isJoined ? 'secondary' : 'primary'}
          onPress={handleToggleJoin}
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(9, 7, 17, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    height: 200,
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
    backgroundColor: 'rgba(9, 7, 17, 0.45)',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  body: {
    paddingHorizontal: spacing.base,
    marginTop: -32,
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  communityAvatar: {
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  tagline: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statCol: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderSubtle,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  organizerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  organizerLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.bold,
  },
  organizerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  descText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  rulesList: {
    gap: spacing.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
});
