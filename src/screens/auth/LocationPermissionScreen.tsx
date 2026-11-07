/**
 * The Spot - Pune Neighborhood & Location Screen
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

interface LocationPermissionScreenProps {
  onComplete: (neighborhood: string) => void;
  initialNeighborhood?: string;
}

const puneNeighborhoods = [
  { id: 'kp', name: 'Koregaon Park', vibe: 'Rooftops, Cafes & Nightlife', icon: 'sparkles' },
  { id: 'baner', name: 'Baner', vibe: 'High Street, LAN Cafes & Tech Crowd', icon: 'gamepad' },
  { id: 'kalyani', name: 'Kalyani Nagar', vibe: 'Underground Music & Mariplex Lounges', icon: 'music' },
  { id: 'viman', name: 'Viman Nagar', vibe: 'Student Hangouts, Standup & Esports', icon: 'users' },
  { id: 'fcroad', name: 'FC Road / Deccan', vibe: 'Turfs, Boardgame Cafes & Chai Circles', icon: 'activity' },
  { id: 'hinjewadi', name: 'Hinjewadi', vibe: 'Friday Mixers & IT After-Hours', icon: 'zap' },
  { id: 'aundh', name: 'Aundh', vibe: 'Art Spaces & Cozy Lounges', icon: 'star' },
  { id: 'kothrud', name: 'Kothrud', vibe: 'Sports Arenas & Cultural Meetups', icon: 'heart' },
];

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onComplete,
  initialNeighborhood = 'Koregaon Park',
}) => {
  const [selectedArea, setSelectedArea] = useState(initialNeighborhood);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Text style={styles.stepIndicator}>STEP 2 OF 2</Text>
        </View>

        {/* Hero Graphic / Pin */}
        <View style={styles.iconCircle}>
          <Icon name="map-pin" size={32} color={colors.secondary} />
        </View>

        <Text style={styles.heading}>Where are you in Pune?</Text>
        <Text style={styles.subheading}>
          The Spot shows you parties happening tonight, turf matches, and squads within your immediate area.
        </Text>

        {/* Neighborhood List */}
        <View style={styles.list}>
          {puneNeighborhoods.map(area => {
            const isSelected = selectedArea === area.name;
            return (
              <TouchableOpacity
                key={area.id}
                activeOpacity={0.8}
                onPress={() => setSelectedArea(area.name)}
                style={[
                  styles.areaCard,
                  isSelected ? styles.areaCardSelected : styles.areaCardUnselected,
                ]}
              >
                <View style={styles.areaInfo}>
                  <Text style={[styles.areaName, isSelected && styles.areaNameSelected]}>
                    {area.name}
                  </Text>
                  <Text style={styles.areaVibe}>{area.vibe}</Text>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected ? styles.radioSelected : styles.radioUnselected,
                  ]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          title={`Set Location & Explore Pune`}
          onPress={() => onComplete(selectedArea)}
          size="lg"
          variant="primary"
          fullWidth
          icon="check"
          style={styles.finishBtn}
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
    marginBottom: spacing.base,
  },
  stepIndicator: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.primary,
    letterSpacing: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1.5,
    borderColor: colors.borderHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
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
  list: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  areaCardSelected: {
    backgroundColor: colors.backgroundSurface2,
    borderColor: colors.secondary,
  },
  areaCardUnselected: {
    backgroundColor: colors.backgroundElevated,
    borderColor: colors.borderDefault,
  },
  areaInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  areaName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  areaNameSelected: {
    color: colors.secondary,
  },
  areaVibe: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.secondary,
  },
  radioUnselected: {
    borderColor: colors.borderDefault,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.secondary,
  },
  finishBtn: {
    marginTop: spacing.sm,
  },
});
