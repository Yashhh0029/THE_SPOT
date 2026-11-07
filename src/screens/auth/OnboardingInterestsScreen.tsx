/**
 * The Spot - Onboarding Interests & Gaming Preferences Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface OnboardingInterestsScreenProps {
  onContinue: (interests: string[], games: string[]) => void;
  onSkip?: () => void;
}

const availableInterests = [
  'Rooftop Sundowners',
  'Underground Techno',
  'Craft Beer Mixers',
  'Board Game Nights',
  'Indie Live Music',
  'Turf Sports & Box Cricket',
  'Standup Comedy',
  'Late Night Chai Hangouts',
  'Film & Pop Trivia',
  'Creative Photography',
];

const availableGames = [
  'Valorant',
  'Battlegrounds Mobile (BGMI)',
  'EA Sports FC 25',
  'Turf Cricket & Football',
  'Settlers of Catan',
  'Secret Hitler',
  'CS2 / Counter-Strike',
  'Dungeons & Dragons',
  'Rocket League',
  'Chess & Strategy',
];

export const OnboardingInterestsScreen: React.FC<OnboardingInterestsScreenProps> = ({
  onContinue,
  onSkip,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Rooftop Sundowners',
    'Underground Techno',
    'Board Game Nights',
  ]);
  const [selectedGames, setSelectedGames] = useState<string[]>([
    'Valorant',
    'EA Sports FC 25',
    'Turf Cricket & Football',
  ]);

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleGame = (item: string) => {
    setSelectedGames(prev =>
      prev.includes(item) ? prev.filter(g => g !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    onContinue(selectedInterests, selectedGames);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topRow}>
          <Text style={styles.stepIndicator}>STEP 1 OF 2</Text>
          {onSkip && (
            <TouchableOpacity onPress={onSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.heading}>What excites you in Pune?</Text>
        <Text style={styles.subheading}>
          The Spot curates your home feed based on the parties you like and games you play.
        </Text>

        {/* Section 1: Social & Party Interests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="sparkles" size={16} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Social & Party Vibes</Text>
            <Text style={styles.countBadge}>({selectedInterests.length} selected)</Text>
          </View>

          <View style={styles.chipsContainer}>
            {availableInterests.map(item => {
              const isSelected = selectedInterests.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.75}
                  onPress={() => toggleInterest(item)}
                  style={[
                    styles.chip,
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Gaming Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="gamepad" size={16} color={colors.cyanGaming} />
            <Text style={styles.sectionTitle}>Games You Play & Watch</Text>
            <Text style={styles.countBadge}>({selectedGames.length} selected)</Text>
          </View>

          <View style={styles.chipsContainer}>
            {availableGames.map(game => {
              const isSelected = selectedGames.includes(game);
              return (
                <TouchableOpacity
                  key={game}
                  activeOpacity={0.75}
                  onPress={() => toggleGame(game)}
                  style={[
                    styles.chip,
                    isSelected ? styles.gamingChipSelected : styles.chipUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected ? styles.gamingChipTextSelected : styles.chipTextUnselected,
                    ]}
                  >
                    {game}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Button */}
        <Button
          title="Continue to Location"
          onPress={handleNext}
          size="lg"
          variant="primary"
          fullWidth
          icon="arrow-right"
          iconPosition="right"
          style={styles.continueBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stepIndicator: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
    letterSpacing: 1,
  },
  skipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  heading: {
    fontSize: typography.fontSize.displaySm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginLeft: spacing.xs + 2,
  },
  countBadge: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginLeft: spacing.xs + 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  gamingChipSelected: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
    borderColor: colors.cyanGaming,
  },
  chipUnselected: {
    backgroundColor: colors.backgroundSurface2,
    borderColor: colors.borderDefault,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  chipTextSelected: {
    color: colors.textPrimary,
  },
  gamingChipTextSelected: {
    color: colors.cyanGaming,
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
  continueBtn: {
    marginTop: spacing.base,
  },
});
