/**
 * The Spot - Reusable SearchBar with Filter Trigger
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search parties, games, squads in Pune...',
  onFilterPress,
  hasActiveFilters = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <Icon name="search" size={16} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          selectionColor={colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearBtn}
          >
            <Icon name="x" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.8}
          style={[
            styles.filterBtn,
            hasActiveFilters && styles.filterBtnActive,
          ]}
        >
          <Icon
            name="filter"
            size={16}
            color={hasActiveFilters ? colors.textPrimary : colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
});
