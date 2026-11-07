/**
 * The Spot - Badge & Pill Tag Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon, IconName } from './Icon';

export type BadgeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'gaming' 
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: IconName;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  icon,
  size = 'md',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primaryLight, border: colors.borderHighlight, text: colors.secondary };
      case 'secondary':
        return { bg: colors.secondaryLight, border: colors.secondaryGlow, text: colors.secondary };
      case 'accent':
        return { bg: colors.accentLight, border: colors.accentGlow, text: colors.accent };
      case 'success':
        return { bg: colors.emeraldLight, border: colors.emeraldSuccess, text: colors.emeraldSuccess };
      case 'warning':
        return { bg: colors.amberLight, border: colors.amberWarning, text: colors.amberWarning };
      case 'danger':
        return { bg: colors.roseLight, border: colors.roseDanger, text: colors.roseDanger };
      case 'gaming':
        return { bg: colors.cyanGamingLight, border: colors.cyanGaming, text: colors.cyanGaming };
      case 'neutral':
      default:
        return { bg: colors.backgroundSurface2, border: colors.borderSubtle, text: colors.textSecondary };
    }
  };

  const current = getColors();

  return (
    <View
      style={[
        styles.container,
        size === 'sm' ? styles.containerSm : styles.containerMd,
        {
          backgroundColor: current.bg,
          borderColor: current.border,
        },
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={size === 'sm' ? 10 : 12}
          color={current.text}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: current.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    borderWidth: 1,
  },
  containerSm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
  },
  containerMd: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm + 2,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  textSm: {
    fontSize: typography.fontSize.xxs,
    letterSpacing: 0.3,
  },
  textMd: {
    fontSize: typography.fontSize.xs,
    letterSpacing: 0.2,
  },
});
