/**
 * The Spot - Cinematic Welcome Screen
 * Highlights the 3 pillars: Parties & Experiences · Gaming · Social Connections
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLoginPress: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLoginPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />
      <View style={styles.container}>
        {/* Top Header Badge */}
        <View style={styles.topSection}>
          <View style={styles.logoPill}>
            <Text style={styles.logoText}>THE SPOT</Text>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.cityBadge}>📍 Launching in Pune, India</Text>
        </View>

        {/* Central Vision & Pillars */}
        <View style={styles.centerContent}>
          <Text style={styles.heroTitle}>
            Discover.{'\n'}
            <Text style={styles.heroTitleGradient}>Connect.</Text>{'\n'}
            Experience.
          </Text>

          <Text style={styles.heroSubtitle}>
            Your all-in-one social entertainment hub for parties, competitive gaming lobbies, squads, and real-world experiences.
          </Text>

          {/* 3 Pillars Highlights */}
          <View style={styles.pillarsContainer}>
            <View style={styles.pillarItem}>
              <View style={[styles.pillarIconCircle, { borderColor: colors.primary }]}>
                <Icon name="sparkles" size={18} color={colors.secondary} />
              </View>
              <View style={styles.pillarTextCol}>
                <Text style={styles.pillarHeading}>Parties & Experiences</Text>
                <Text style={styles.pillarDesc}>Rooftop sundowners, secret warehouse raves & mixers in KP & Baner.</Text>
              </View>
            </View>

            <View style={styles.pillarItem}>
              <View style={[styles.pillarIconCircle, { borderColor: colors.cyanGaming }]}>
                <Icon name="gamepad" size={18} color={colors.cyanGaming} />
              </View>
              <View style={styles.pillarTextCol}>
                <Text style={styles.pillarHeading}>Gaming & Competitions</Text>
                <Text style={styles.pillarDesc}>Valorant LANs, EA FC 25 clashes, turf cricket derbies & tabletop nights.</Text>
              </View>
            </View>

            <View style={styles.pillarItem}>
              <View style={[styles.pillarIconCircle, { borderColor: colors.accent }]}>
                <Icon name="users" size={18} color={colors.accent} />
              </View>
              <View style={styles.pillarTextCol}>
                <Text style={styles.pillarHeading}>Social Connections</Text>
                <Text style={styles.pillarDesc}>Discover compatible squads, join niche communities & chat seamlessly.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom CTA Actions */}
        <View style={styles.bottomSection}>
          <Button
            title="Get Started"
            onPress={onGetStarted}
            size="lg"
            variant="primary"
            fullWidth
            icon="arrow-right"
            iconPosition="right"
            style={styles.getStartedBtn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginQuestion}>Already have an account? </Text>
            <TouchableOpacity onPress={onLoginPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  logoPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginLeft: 3,
  },
  cityBadge: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.secondary,
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  centerContent: {
    paddingVertical: spacing.md,
  },
  heroTitle: {
    fontSize: typography.fontSize.displayLg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    lineHeight: 46,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  heroTitleGradient: {
    color: colors.secondary,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  pillarsContainer: {
    gap: spacing.base,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillarIconCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  pillarTextCol: {
    flex: 1,
  },
  pillarHeading: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  pillarDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  bottomSection: {
    paddingBottom: spacing.sm,
  },
  getStartedBtn: {
    marginBottom: spacing.base,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginQuestion: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
  },
});
