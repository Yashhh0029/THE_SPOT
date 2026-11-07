/**
 * The Spot - Application Top Header Component with Spotlight Motif
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon } from '../common/Icon';
import { Spotlight } from '../common/Spotlight';
import { useTonightMode } from '../../hooks/useTonightMode';

interface AppHeaderProps {
  currentNeighborhood: string;
  onNeighborhoodPress: () => void;
  onNotificationPress?: () => void;
  unreadNotifications?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentNeighborhood,
  onNeighborhoodPress,
  onNotificationPress,
  unreadNotifications = true,
}) => {
  const { isTonightMode } = useTonightMode();

  return (
    <View style={styles.container}>
      {/* Brand Title with Spotlight Motif */}
      <View style={styles.brandRow}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>THE SPOT</Text>
          <Spotlight variant="dot" size={6} color={colors.secondary} style={styles.brandSpotlight} />
        </View>

        {/* Location Dropdown Pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNeighborhoodPress}
          style={styles.locationPill}
        >
          <Icon name="map-pin" size={12} color={colors.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {currentNeighborhood}, Pune
          </Text>
          <Icon name="chevron-down" size={11} color={colors.textSecondary} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>

      {/* Right Icons with Tonight Indicator */}
      <View style={styles.rightIcons}>
        {isTonightMode && (
          <View style={styles.tonightPill}>
            <Spotlight variant="pulse" size={7} color={colors.roseDanger} style={{ marginRight: 4 }} />
            <Text style={styles.tonightPillText}>LIVE TONIGHT</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNotificationPress}
          style={styles.iconBtn}
        >
          <Icon name="sparkles" size={17} color={colors.textPrimary} />
          {unreadNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? 12 : spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  brandText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  brandSpotlight: {
    marginLeft: 3,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    maxWidth: 170,
  },
  locationText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: 5,
    marginRight: 4,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tonightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseDanger,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  tonightPillText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.heavy,
    color: colors.roseDanger,
    letterSpacing: 0.5,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
});
