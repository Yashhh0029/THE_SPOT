/**
 * The Spot - Reusable High-Performance Button Component
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getContainerStyles = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Size
    if (size === 'sm') list.push(styles.sizeSm);
    if (size === 'md') list.push(styles.sizeMd);
    if (size === 'lg') list.push(styles.sizeLg);

    // Variant
    switch (variant) {
      case 'primary':
        list.push(styles.variantPrimary);
        break;
      case 'secondary':
        list.push(styles.variantSecondary);
        break;
      case 'outline':
        list.push(styles.variantOutline);
        break;
      case 'ghost':
        list.push(styles.variantGhost);
        break;
      case 'danger':
        list.push(styles.variantDanger);
        break;
      case 'success':
        list.push(styles.variantSuccess);
        break;
    }

    if (fullWidth) list.push(styles.fullWidth);
    if (disabled || loading) list.push(styles.disabled);
    if (style) list.push(style);

    return list;
  };

  const getTextColor = (): string => {
    if (disabled) return colors.textDisabled;
    switch (variant) {
      case 'primary':
        return colors.textPrimary;
      case 'secondary':
        return colors.textPrimary;
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.textSecondary;
      case 'danger':
        return colors.textPrimary;
      case 'success':
        return colors.textPrimary;
      default:
        return colors.textPrimary;
    }
  };

  const iconColor = getTextColor();
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyles()}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
          )}
          <Text
            style={[
              styles.text,
              size === 'sm' && styles.textSm,
              size === 'lg' && styles.textLg,
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  // Sizes
  sizeSm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  sizeMd: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  sizeLg: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },
  // Variants
  variantPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  variantSecondary: {
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variantGhost: {
    backgroundColor: 'transparent',
  },
  variantDanger: {
    backgroundColor: colors.roseDanger,
  },
  variantSuccess: {
    backgroundColor: colors.emeraldSuccess,
  },
  // Text
  text: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  textSm: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  textLg: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  iconLeft: {
    marginRight: spacing.xs + 2,
  },
  iconRight: {
    marginLeft: spacing.xs + 2,
  },
});
