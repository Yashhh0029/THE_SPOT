/**
 * The Spot - Signature Vibe Switcher Segmented Control
 * PARTY | GAME | CHILL
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon, IconName } from '../common/Icon';
import { Spotlight } from '../common/Spotlight';

export type VibeMode = 'all' | 'party' | 'game' | 'chill';

interface VibeSwitcherProps {
  currentVibe: VibeMode;
  onSelectVibe: (vibe: VibeMode) => void;
  style?: ViewStyle;
}

interface VibeOption {
  id: VibeMode;
  label: string;
  icon: IconName;
  accent: string;
  sublabel: string;
}

const vibes: VibeOption[] = [
  { id: 'all', label: 'TONIGHT', icon: 'flame', accent: colors.secondary, sublabel: 'All Energy' },
  { id: 'party', label: 'PARTY', icon: 'sparkles', accent: colors.primary, sublabel: 'Raves & Mixers' },
  { id: 'game', label: 'GAME', icon: 'gamepad', accent: colors.cyanGaming, sublabel: 'LANs & Turfs' },
  { id: 'chill', label: 'CHILL', icon: 'heart', accent: colors.accent, sublabel: 'Cafes & Jams' },
];

export const VibeSwitcher: React.FC<VibeSwitcherProps> = ({
  currentVibe,
  onSelectVibe,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.segmentTrack}>
        {vibes.map(v => {
          const isSelected = currentVibe === v.id;

          return (
            <TouchableOpacity
              key={v.id}
              activeOpacity={0.8}
              onPress={() => onSelectVibe(v.id)}
              style={[
                styles.vibeBtn,
                isSelected && [
                  styles.vibeBtnSelected,
                  { borderColor: v.accent, shadowColor: v.accent },
                ],
              ]}
            >
              <View style={styles.btnContent}>
                {isSelected ? (
                  <Spotlight variant="dot" size={7} color={v.accent} style={{ marginRight: 5 }} />
                ) : (
                  <Icon name={v.icon} size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                )}
                <Text
                  style={[
                    styles.vibeLabel,
                    isSelected
                      ? [styles.vibeLabelSelected, { color: colors.textPrimary }]
                      : styles.vibeLabelInactive,
                  ]}
                >
                  {v.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  segmentTrack: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  vibeBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  vibeBtnSelected: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vibeLabel: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  vibeLabelSelected: {
    fontWeight: typography.fontWeight.heavy,
  },
  vibeLabelInactive: {
    color: colors.textSecondary,
  },
});
