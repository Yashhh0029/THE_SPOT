/**
 * The Spot - Create Selection Flow Bottom Sheet
 * 4 primary options: Party/Event, Gaming Session, Tournament, Community
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
import { ModalSheet } from '../../components/common/ModalSheet';
import { Icon, IconName } from '../../components/common/Icon';

interface CreateChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: 'event' | 'gaming' | 'tournament' | 'community') => void;
}

interface ChoiceItem {
  id: 'event' | 'gaming' | 'tournament' | 'community';
  title: string;
  description: string;
  icon: IconName;
  accentColor: string;
  badge: string;
}

const choices: ChoiceItem[] = [
  {
    id: 'event',
    title: 'Host a Party or Experience',
    description: 'Rooftop sundowners, indie gigs, secret warehouse raves, or casual mixers.',
    icon: 'sparkles',
    accentColor: colors.secondary,
    badge: 'Popular',
  },
  {
    id: 'gaming',
    title: 'Create a Gaming Session',
    description: 'Recruit players for LAN cafes in Baner/KP, online competitive 5-stacks, or turf matches.',
    icon: 'gamepad',
    accentColor: colors.cyanGaming,
    badge: 'Fast Lobby',
  },
  {
    id: 'tournament',
    title: 'Organize a Tournament',
    description: 'Competitive brackets for Valorant, EA FC 25, or box cricket with prize pools.',
    icon: 'trophy',
    accentColor: colors.accent,
    badge: 'Esports & Turf',
  },
  {
    id: 'community',
    title: 'Launch a Pune Community',
    description: 'Build an ongoing circle around electronic music, tabletop gaming, or fitness.',
    icon: 'users',
    accentColor: colors.primary,
    badge: 'Grow Circle',
  },
];

export const CreateChoiceModal: React.FC<CreateChoiceModalProps> = ({
  visible,
  onClose,
  onSelectOption,
}) => {
  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Create on The Spot"
      subtitle="What would you like to bring to Pune?"
      maxHeightRatio={0.8}
    >
      <View style={styles.list}>
        {choices.map(choice => (
          <TouchableOpacity
            key={choice.id}
            activeOpacity={0.82}
            onPress={() => {
              onClose();
              onSelectOption(choice.id);
            }}
            style={styles.choiceCard}
          >
            <View style={[styles.iconCircle, { borderColor: choice.accentColor }]}>
              <Icon name={choice.icon} size={22} color={choice.accentColor} />
            </View>

            <View style={styles.textColumn}>
              <View style={styles.titleRow}>
                <Text style={styles.choiceTitle}>{choice.title}</Text>
                <View style={[styles.badge, { backgroundColor: colors.backgroundSurface3 }]}>
                  <Text style={[styles.badgeText, { color: choice.accentColor }]}>
                    {choice.badge}
                  </Text>
                </View>
              </View>
              <Text style={styles.choiceDesc}>{choice.description}</Text>
            </View>

            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textColumn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  choiceTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  choiceDesc: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
