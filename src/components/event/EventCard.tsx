/**
 * The Spot - Premium EventCard Component
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
import { Avatar } from '../common/Avatar';
import { Icon } from '../common/Icon';

interface EventCardProps {
  event: EventItem;
  onPress: () => void;
  onBookmarkToggle?: () => void;
  isBookmarked?: boolean;
  style?: ViewStyle;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onBookmarkToggle,
  isBookmarked = false,
  style,
}) => {
  const isFree = event.priceInr === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        event.isTonight && styles.cardTonight,
        style,
      ]}
    >
      {/* Cover Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.coverImage }} style={styles.coverImage} />
        
        {/* Top Badges Overlay */}
        <View style={styles.imageTopOverlay}>
          <View style={styles.badgeRow}>
            {event.isTonight && (
              <Badge label="Tonight" variant="accent" icon="flame" size="sm" style={styles.badgeMargin} />
            )}
            <Badge label={event.categoryLabel} variant="primary" size="sm" />
          </View>

          {onBookmarkToggle && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onBookmarkToggle();
              }}
              style={styles.bookmarkBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon
                name={isBookmarked ? 'bookmark-filled' : 'bookmark'}
                size={14}
                color={isBookmarked ? colors.secondary : colors.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Price Tag Overlay */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            {isFree ? 'FREE RSVP' : `₹${event.priceInr}`}
          </Text>
        </View>
      </View>

      {/* Card Content Body */}
      <View style={styles.content}>
        {/* Date & Time Row */}
        <View style={styles.metaRow}>
          <Icon name="calendar" size={13} color={colors.secondary} />
          <Text style={styles.dateText}>
            {event.date} · {event.time.split('-')[0].trim()}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Location Row */}
        <View style={styles.metaRow}>
          <Icon name="map-pin" size={13} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {event.locationArea}, Pune · {event.distanceKm} km away
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer: Host & Capacity/Status */}
        <View style={styles.footerRow}>
          <View style={styles.hostSnippet}>
            <Avatar uri={event.host.avatar} name={event.host.name} size={24} />
            <Text style={styles.hostName} numberOfLines={1}>
              {event.host.name}
            </Text>
          </View>

          {event.userBookingStatus === 'confirmed' ? (
            <Badge label="Confirmed" variant="success" icon="check" size="sm" />
          ) : event.userBookingStatus === 'request_pending' ? (
            <Badge label="Requested" variant="warning" icon="clock" size="sm" />
          ) : (
            <View style={styles.spotsContainer}>
              <Text style={styles.spotsText}>
                <Text style={styles.spotsHighlight}>{event.availableSpots}</Text> spots left
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
    marginBottom: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTonight: {
    borderColor: colors.borderHighlight,
    shadowColor: colors.secondary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: colors.backgroundSurface2,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageTopOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeMargin: {
    marginRight: 6,
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(9, 7, 17, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
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
  content: {
    padding: spacing.md + 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: 6,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  hostName: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: typography.fontWeight.medium,
  },
  spotsContainer: {
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  spotsText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
  },
  spotsHighlight: {
    color: colors.accent,
    fontWeight: typography.fontWeight.bold,
  },
});
