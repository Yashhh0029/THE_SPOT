/**
 * The Spot - QuickPlay Matchmaking Card
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon } from '../common/Icon';
import { Badge } from '../common/Badge';

interface QuickPlayBannerProps {
  onMatchFound?: (game: string) => void;
  style?: ViewStyle;
}

const quickGames = ['Valorant', 'EA FC 25', 'Turf Cricket', 'BGMI', 'Board Games'];

export const QuickPlayBanner: React.FC<QuickPlayBannerProps> = ({
  onMatchFound,
  style,
}) => {
  const [selectedGame, setSelectedGame] = useState('Valorant');
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const startQuickMatch = () => {
    setIsSearching(true);
    setMatchFound(false);
    setTimeout(() => {
      setIsSearching(false);
      setMatchFound(true);
      if (onMatchFound) onMatchFound(selectedGame);
    }, 2200);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Icon name="zap" size={18} color={colors.cyanGaming} />
          <Text style={styles.title}>Pune QuickPlay™ Matchmaker</Text>
        </View>
        <Badge label="Instant Queue" variant="gaming" size="sm" />
      </View>

      <Text style={styles.subtitle}>
        Jump into an open lobby in Pune in under 2 minutes. Select your game:
      </Text>

      {/* Game Selector Chips */}
      <View style={styles.chipsRow}>
        {quickGames.map(game => {
          const isSelected = selectedGame === game;
          return (
            <TouchableOpacity
              key={game}
              onPress={() => setSelectedGame(game)}
              disabled={isSearching}
              style={[
                styles.gameChip,
                isSelected ? styles.gameChipSelected : styles.gameChipUnselected,
              ]}
            >
              <Text
                style={[
                  styles.gameChipText,
                  isSelected && styles.gameChipTextSelected,
                ]}
              >
                {game}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action / Searching Status */}
      {matchFound ? (
        <View style={styles.matchFoundBox}>
          <Icon name="check" size={16} color={colors.emeraldSuccess} />
          <Text style={styles.matchFoundText}>
            Squad Found! Joined lobby for {selectedGame} (Baner & KP).
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={startQuickMatch}
          disabled={isSearching}
          activeOpacity={0.8}
          style={styles.actionBtn}
        >
          {isSearching ? (
            <View style={styles.searchingRow}>
              <ActivityIndicator size="small" color={colors.textPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.actionText}>Scanning Pune Players for {selectedGame}...</Text>
            </View>
          ) : (
            <View style={styles.searchingRow}>
              <Icon name="gamepad" size={16} color={colors.textPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.actionText}>Find Me a Squad for {selectedGame}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    marginBottom: spacing.lg,
    shadowColor: colors.cyanGaming,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: 6,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
    marginBottom: spacing.base,
  },
  gameChip: {
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  gameChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  gameChipUnselected: {
    backgroundColor: colors.backgroundSurface3,
    borderColor: colors.borderDefault,
  },
  gameChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  gameChipTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  matchFoundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emeraldLight,
    borderColor: colors.emeraldSuccess,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  matchFoundText: {
    color: colors.emeraldSuccess,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
