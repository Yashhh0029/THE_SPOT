/**
 * The Spot - Category Chip Filter Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon, IconName } from './Icon';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: IconName;
  badgeCount?: number;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected,
  onPress,
  icon,
  badgeCount,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.chip,
        isSelected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={14}
          color={isSelected ? colors.textPrimary : colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          isSelected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {badgeCount !== undefined && badgeCount > 0 && (
        <Text
          style={[
            styles.badge,
            isSelected ? styles.badgeSelected : styles.badgeUnselected,
          ]}
        >
          {badgeCount}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  chipUnselected: {
    backgroundColor: colors.backgroundSurface2,
    borderColor: colors.borderDefault,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  labelSelected: {
    color: colors.textPrimary,
  },
  labelUnselected: {
    color: colors.textSecondary,
  },
  badge: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: colors.textPrimary,
  },
  badgeUnselected: {
    backgroundColor: colors.backgroundSurface3,
    color: colors.textMuted,
  },
});
