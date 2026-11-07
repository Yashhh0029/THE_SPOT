/**
 * The Spot - Pune Neighborhood Selector Modal
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
import { ModalSheet } from './ModalSheet';
import { Icon } from './Icon';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedNeighborhood: string;
  onSelectNeighborhood: (area: string) => void;
}

const neighborhoods = [
  { name: 'Koregaon Park', vibe: 'Rooftops, Cafes & Nightlife' },
  { name: 'Baner', vibe: 'High Street, LAN Cafes & Tech' },
  { name: 'Kalyani Nagar', vibe: 'Underground Music & Mariplex' },
  { name: 'Viman Nagar', vibe: 'Student Hangouts, Standup & Esports' },
  { name: 'FC Road', vibe: 'Turfs, Boardgame Cafes & Chai' },
  { name: 'Hinjewadi', vibe: 'Friday Mixers & IT After-Hours' },
  { name: 'Aundh', vibe: 'Art Spaces & Lounges' },
  { name: 'Kothrud', vibe: 'Sports Arenas & Cultural Meetups' },
];

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  selectedNeighborhood,
  onSelectNeighborhood,
}) => {
  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Select Pune Neighborhood"
      subtitle="Discover experiences in your local area"
      maxHeightRatio={0.75}
    >
      <View style={styles.list}>
        {neighborhoods.map(area => {
          const isSelected = selectedNeighborhood === area.name;
          return (
            <TouchableOpacity
              key={area.name}
              activeOpacity={0.8}
              onPress={() => {
                onSelectNeighborhood(area.name);
                onClose();
              }}
              style={[
                styles.itemCard,
                isSelected ? styles.itemCardSelected : styles.itemCardUnselected,
              ]}
            >
              <View style={styles.textCol}>
                <Text style={[styles.name, isSelected && styles.nameSelected]}>
                  {area.name}
                </Text>
                <Text style={styles.vibe}>{area.vibe}</Text>
              </View>

              {isSelected && (
                <Icon name="check" size={16} color={colors.secondary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  itemCardSelected: {
    backgroundColor: colors.backgroundSurface2,
    borderColor: colors.secondary,
  },
  itemCardUnselected: {
    backgroundColor: colors.backgroundElevated,
    borderColor: colors.borderDefault,
  },
  textCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  nameSelected: {
    color: colors.secondary,
  },
  vibe: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
  },
});
