/**
 * The Spot - Event & Party Details Screen with Ticket Moment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { EventItem } from '../../types/event';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Avatar, AvatarGroup } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { Spotlight } from '../../components/common/Spotlight';
import { TicketMomentModal } from '../../components/event/TicketMomentModal';

interface EventDetailsScreenProps {
  event: EventItem;
  onBack: () => void;
  onHostPress?: () => void;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  event,
  onBack,
  onHostPress,
}) => {
  const {
    bookmarkedEventIds,
    toggleBookmarkEvent,
    updateEventBookingStatus,
  } = useApp();

  const [bookingToast, setBookingToast] = useState<string | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const isBookmarked = bookmarkedEventIds.includes(event.id);
  const currentStatus = event.userBookingStatus || 'available';

  const handleBookingAction = () => {
    if (currentStatus === 'confirmed') {
      // Open the ticket celebration pass
      setIsTicketModalOpen(true);
    } else if (currentStatus === 'request_pending') {
      // Withdraw request
      updateEventBookingStatus(event.id, 'available');
      showToast('Join request withdrawn.');
    } else {
      // Book or Request
      if (event.requiresHostApproval) {
        updateEventBookingStatus(event.id, 'request_pending');
        showToast('Request sent to host! You will be notified once approved.');
      } else {
        updateEventBookingStatus(event.id, 'confirmed');
        // Trigger the signature Ticket Moment!
        setIsTicketModalOpen(true);
      }
    }
  };

  const handleCancelBooking = () => {
    updateEventBookingStatus(event.id, 'cancelled');
    showToast('Booking cancelled.');
  };

  const showToast = (msg: string) => {
    setBookingToast(msg);
    setTimeout(() => setBookingToast(null), 4000);
  };

  const isFree = event.priceInr === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Top Floating Action Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={onBack} style={styles.floatingBtn}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => toggleBookmarkEvent(event.id)}
            style={styles.floatingBtn}
          >
            <Icon
              name={isBookmarked ? 'bookmark-filled' : 'bookmark'}
              size={18}
              color={isBookmarked ? colors.secondary : colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showToast('Event link copied to clipboard!')}
            style={[styles.floatingBtn, { marginLeft: spacing.sm }]}
          >
            <Icon name="share" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover Image Header with Spotlight Beam */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: event.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay} />

          <View style={styles.coverBadgeRow}>
            <Badge label={event.categoryLabel} variant="primary" size="md" />
            {event.isTonight && (
              <View style={styles.tonightSpotlightPill}>
                <Spotlight variant="pulse" size={8} color={colors.roseDanger} style={{ marginRight: 4 }} />
                <Text style={styles.tonightPillText}>LIVE TONIGHT</Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Toast Notification */}
          {bookingToast && (
            <View style={styles.toast}>
              <Icon name="check" size={14} color={colors.emeraldSuccess} />
              <Text style={styles.toastText}>{bookingToast}</Text>
            </View>
          )}

          {/* Confirmed Banner (if already booked) */}
          {currentStatus === 'confirmed' && (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => setIsTicketModalOpen(true)}
              style={styles.confirmedBanner}
            >
              <View style={styles.confirmedBannerLeft}>
                <Spotlight variant="pulse" size={12} color={colors.emeraldSuccess} style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.confirmedBannerTitle}>You’re Going! Tap to View Ticket</Text>
                  <Text style={styles.confirmedBannerSub}>Pass #SPT-{event.id.slice(-6).toUpperCase()}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color={colors.emeraldSuccess} />
            </TouchableOpacity>
          )}

          {/* Title & Tagline */}
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.tagline}>{event.tagline}</Text>

          {/* Host Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onHostPress}
            style={styles.hostCard}
          >
            <Avatar uri={event.host.avatar} name={event.host.name} size={44} />
            <View style={styles.hostInfo}>
              <View style={styles.hostNameRow}>
                <Text style={styles.hostName}>{event.host.name}</Text>
                {event.host.isVerifiedHost && (
                  <Badge label="Verified Host" variant="primary" size="sm" style={{ marginLeft: 6 }} />
                )}
              </View>
              <Text style={styles.hostRating}>
                ★ {event.host.rating} ({event.host.reviewCount} reviews) · {event.host.hostedCount} events hosted
              </Text>
            </View>
          </TouchableOpacity>

          {/* Key Info Cards (Date & Time, Venue) */}
          <View style={styles.infoCardsGrid}>
            {/* Date Card */}
            <View style={styles.infoCard}>
              <Icon name="calendar" size={18} color={colors.secondary} />
              <View style={styles.infoCardText}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{event.date}</Text>
                <Text style={styles.infoSub}>{event.time}</Text>
              </View>
            </View>

            {/* Venue Card */}
            <View style={styles.infoCard}>
              <Icon name="map-pin" size={18} color={colors.accent} />
              <View style={styles.infoCardText}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.locationArea}, Pune</Text>
                <Text style={styles.infoSub} numberOfLines={1}>
                  {event.isPrivateAddress ? '🔒 Address revealed upon RSVP' : event.venueName}
                </Text>
              </View>
            </View>
          </View>

          {/* Capacity Progress Meter */}
          <View style={styles.capacityBox}>
            <View style={styles.capacityHeader}>
              <Text style={styles.capacityTitle}>Event Attendance</Text>
              <Text style={styles.capacityNumbers}>
                <Text style={styles.confirmedHighlight}>{event.confirmedCount}</Text> / {event.capacity} confirmed
              </Text>
            </View>
            <View style={styles.capacityBar}>
              <View
                style={[
                  styles.capacityFill,
                  { width: `${Math.min(100, (event.confirmedCount / event.capacity) * 100)}%` },
                ]}
              />
            </View>
            <View style={styles.attendeesSnippet}>
              <AvatarGroup
                users={[
                  { avatar: event.host.avatar, name: event.host.name },
                  { name: 'Priya' },
                  { name: 'Vikram' },
                ]}
                size={26}
              />
              <Text style={styles.attendeesText}>
                +{event.confirmedCount > 3 ? event.confirmedCount - 3 : 0} others attending
              </Text>
            </View>
          </View>

          {/* About Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About the Experience</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          {/* Perks */}
          {event.perks && event.perks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>What’s Included</Text>
              <View style={styles.perksList}>
                {event.perks.map((perk, i) => (
                  <View key={i} style={styles.perkItem}>
                    <Icon name="check" size={14} color={colors.emeraldSuccess} />
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Rules & Etiquette</Text>
              <View style={styles.rulesList}>
                {event.rules.map(rule => (
                  <View key={rule.id} style={styles.ruleItem}>
                    <Icon name="shield-check" size={14} color={colors.secondary} />
                    <Text style={styles.ruleText}>{rule.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceColumn}>
          <Text style={styles.priceLabel}>Entry Price</Text>
          <Text style={styles.priceValue}>
            {isFree ? 'Free RSVP' : `₹${event.priceInr}`}
            {!isFree && <Text style={styles.priceSub}> / person</Text>}
          </Text>
        </View>

        {currentStatus === 'confirmed' ? (
          <View style={styles.confirmedActionsRow}>
            <Button
              title="View Ticket 🎫"
              variant="success"
              size="md"
              onPress={() => setIsTicketModalOpen(true)}
              style={{ flex: 1.6, marginRight: spacing.sm }}
            />
            <Button
              title="Cancel"
              variant="ghost"
              size="md"
              onPress={handleCancelBooking}
              style={{ flex: 0.8 }}
            />
          </View>
        ) : (
          <Button
            title={
              currentStatus === 'request_pending'
                ? 'Request Sent (Withdraw)'
                : event.requiresHostApproval
                ? 'Request to Join'
                : `Book Spot (${event.availableSpots} left)`
            }
            variant={currentStatus === 'request_pending' ? 'secondary' : 'primary'}
            size="lg"
            onPress={handleBookingAction}
            style={styles.bookBtn}
          />
        )}
      </View>

      {/* THE SIGNATURE TICKET MOMENT MODAL */}
      <TicketMomentModal
        visible={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        event={event}
        onViewTicketInProfile={onHostPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  floatingHeader: {
    position: 'absolute',
    top: 40,
    left: spacing.base,
    right: spacing.base,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(9, 7, 17, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  coverContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.backgroundSurface2,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 7, 17, 0.35)',
  },
  coverBadgeRow: {
    position: 'absolute',
    bottom: spacing.base,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tonightSpotlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 17, 38, 0.85)',
    borderWidth: 1,
    borderColor: colors.roseDanger,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginLeft: 6,
  },
  tonightPillText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.roseDanger,
    letterSpacing: 0.5,
  },
  body: {
    padding: spacing.base,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldSuccess,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.base,
  },
  toastText: {
    color: colors.emeraldSuccess,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.sm,
    flex: 1,
  },
  confirmedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.emeraldLight,
    borderWidth: 1,
    borderColor: colors.emeraldSuccess,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  confirmedBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  confirmedBannerTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.emeraldSuccess,
  },
  confirmedBannerSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  title: {
    fontSize: typography.fontSize.displaySm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    lineHeight: 34,
    marginBottom: 6,
  },
  tagline: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  hostInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  hostRating: {
    fontSize: typography.fontSize.xxs,
    color: colors.secondary,
    marginTop: 2,
    fontWeight: typography.fontWeight.medium,
  },
  infoCardsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  infoCardText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.bold,
  },
  infoValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  infoSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  capacityBox: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.xl,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  capacityTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  capacityNumbers: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  confirmedHighlight: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
  capacityBar: {
    height: 6,
    backgroundColor: colors.backgroundSurface3,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  capacityFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  attendeesSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  perksList: {
    gap: spacing.sm,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perkText: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  rulesList: {
    gap: spacing.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  priceColumn: {
    marginRight: spacing.md,
  },
  priceLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  priceSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.regular,
  },
  confirmedActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookBtn: {
    flex: 1,
  },
});
