/**
 * The Spot - Signature Spotlight Hero Component
 * "A Living Map of Tonight" featured centerpiece with glowing spotlight motif
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { EventItem } from '../../types/event';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Spotlight } from '../common/Spotlight';

interface FeaturedEventHeroProps {
  event: EventItem;
  onPress: () => void;
  style?: ViewStyle;
}

export const FeaturedEventHero: React.FC<FeaturedEventHeroProps> = ({
  event,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[styles.container, style]}
    >
      {/* Background Cover Image */}
      <Image source={{ uri: event.coverImage }} style={styles.bannerImage} />
      
      {/* Dark Multi-layer Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Spotlight Beam Top Accent */}
      <View style={styles.spotlightBeam} />

      <View style={styles.content}>
        {/* Top Badges */}
        <View style={styles.topRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.spotlightBadge}>
              <Spotlight variant="pulse" size={10} color={colors.secondary} style={{ marginRight: 6 }} />
              <Text style={styles.spotlightBadgeText}>THE SPOTLIGHT</Text>
            </View>
            <Badge label={event.categoryLabel} variant="primary" size="sm" style={{ marginLeft: 6 }} />
          </View>

          <View style={styles.pricePill}>
            <Text style={styles.priceText}>
              {event.priceInr === 0 ? 'FREE RSVP' : `₹${event.priceInr}`}
            </Text>
          </View>
        </View>

        {/* Center Title & Tagline */}
        <View style={styles.centerBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.tagline} numberOfLines={1}>
            {event.tagline}
          </Text>
        </View>

        {/* Details & Location */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={13} color={colors.secondary} />
            <Text style={styles.detailText}>{event.date} · {event.time.split('-')[0].trim()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="map-pin" size={13} color={colors.textSecondary} />
            <Text style={styles.detailText}>{event.locationArea}, Pune</Text>
          </View>
        </View>

        {/* Action Bottom Row */}
        <View style={styles.actionRow}>
          <View style={styles.spotsBadge}>
            <Text style={styles.spotsCount}>🔥 Only {event.availableSpots} spots left</Text>
          </View>
          <Button
            title="Book Spot"
            onPress={onPress}
            size="sm"
            variant="primary"
            icon="arrow-right"
            iconPosition="right"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 260,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.borderHighlight,
    marginBottom: spacing.base,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 7, 17, 0.68)',
  },
  spotlightBeam: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(214, 91, 255, 0.25)',
  },
  content: {
    ...StyleSheet.absoluteFill,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 17, 38, 0.85)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
  },
  spotlightBadgeText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.secondary,
    letterSpacing: 0.8,
  },
  pricePill: {
    backgroundColor: 'rgba(9, 7, 17, 0.85)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
  },
  priceText: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  centerBlock: {
    marginTop: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 4,
  },
  tagline: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 5,
    fontWeight: typography.fontWeight.medium,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  spotsBadge: {
    backgroundColor: 'rgba(23, 17, 38, 0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  spotsCount: {
    fontSize: typography.fontSize.xxs,
    color: colors.accent,
    fontWeight: typography.fontWeight.bold,
  },
});
