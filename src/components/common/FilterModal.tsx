/**
 * The Spot - Global Experience Filters Modal
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { ModalSheet } from './ModalSheet';
import { Button } from './Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
}) => {
  const { filters, updateFilter, resetFilters } = useApp();

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Filter Experiences"
      subtitle="Refine parties, gaming lobbies & meetups in Pune"
      maxHeightRatio={0.8}
    >
      <View style={styles.container}>
        {/* Date Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>When</Text>
          <View style={styles.chipsRow}>
            {[
              { id: 'all', text: 'Any Date' },
              { id: 'tonight', text: '🔥 Tonight' },
              { id: 'tomorrow', text: 'Tomorrow' },
              { id: 'this_weekend', text: 'This Weekend' },
            ].map(d => {
              const isSelected = filters.dateFilter === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  onPress={() => updateFilter('dateFilter', d.id as any)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {d.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Budget Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Entry Budget</Text>
          <View style={styles.chipsRow}>
            {[
              { budget: 0, text: 'Any Price' },
              { budget: 1, text: 'Free RSVP Only' },
              { budget: 500, text: 'Under ₹500' },
              { budget: 1000, text: 'Under ₹1,000' },
            ].map(b => {
              const isSelected = filters.budgetMaxInr === b.budget;
              return (
                <TouchableOpacity
                  key={b.text}
                  onPress={() => updateFilter('budgetMaxInr', b.budget)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {b.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Distance Filter */}
        <View style={styles.section}>
          <Text style={styles.label}>Distance from Pune Center</Text>
          <View style={styles.chipsRow}>
            {[
              { dist: 0, text: 'Any Distance' },
              { dist: 5, text: 'Within 5 km' },
              { dist: 10, text: 'Within 10 km' },
              { dist: 25, text: 'Within 25 km' },
            ].map(d => {
              const isSelected = filters.maxDistanceKm === d.dist;
              return (
                <TouchableOpacity
                  key={d.text}
                  onPress={() => updateFilter('maxDistanceKm', d.dist)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {d.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button
            title="Reset All"
            variant="ghost"
            onPress={resetFilters}
            style={{ flex: 1, marginRight: spacing.md }}
          />
          <Button
            title="Apply Filters"
            variant="primary"
            onPress={onClose}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: spacing.base,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },
  chipTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
