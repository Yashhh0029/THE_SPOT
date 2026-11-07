/**
 * The Spot - Unified Cross-Platform Icon System
 * Crisp, lightweight iconography that works 100% reliably on all platforms
 */

import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

export type IconName =
  | 'home'
  | 'compass'
  | 'plus'
  | 'message-square'
  | 'user'
  | 'calendar'
  | 'clock'
  | 'map-pin'
  | 'tag'
  | 'users'
  | 'gamepad'
  | 'sparkles'
  | 'star'
  | 'shield-check'
  | 'search'
  | 'filter'
  | 'x'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'share'
  | 'bookmark'
  | 'bookmark-filled'
  | 'send'
  | 'check'
  | 'alert-circle'
  | 'activity'
  | 'trophy'
  | 'zap'
  | 'music'
  | 'flame'
  | 'camera'
  | 'heart'
  | 'arrow-right'
  | 'arrow-left'
  | 'log-out'
  | 'settings'
  | 'info';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

// Clean unicode mapping for instant, zero-dependency native rendering
const iconGlyphs: Record<IconName, string> = {
  'home': '⌂',
  'compass': '🧭',
  'plus': '+',
  'message-square': '💬',
  'user': '👤',
  'calendar': '📅',
  'clock': '🕒',
  'map-pin': '📍',
  'tag': '🏷️',
  'users': '👥',
  'gamepad': '🎮',
  'sparkles': '✨',
  'star': '★',
  'shield-check': '🛡️',
  'search': '🔍',
  'filter': '⚡',
  'x': '✕',
  'chevron-right': '›',
  'chevron-left': '‹',
  'chevron-down': '⌄',
  'share': '↗',
  'bookmark': '🔖',
  'bookmark-filled': '🏷️',
  'send': '➢',
  'check': '✓',
  'alert-circle': 'ℹ',
  'activity': '⚡',
  'trophy': '🏆',
  'zap': '⚡',
  'music': '🎵',
  'flame': '🔥',
  'camera': '📷',
  'heart': '♥',
  'arrow-right': '→',
  'arrow-left': '←',
  'log-out': '↪',
  'settings': '⚙',
  'info': 'ⓘ',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = colors.textPrimary,
  style,
}) => {
  const glyph = iconGlyphs[name] || '•';

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text
        style={[
          styles.glyph,
          {
            fontSize: size * 0.88,
            color,
            lineHeight: size,
          },
        ]}
      >
        {glyph}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    textAlign: 'center',
    fontWeight: '700',
  },
});
