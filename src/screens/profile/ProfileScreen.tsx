/**
 * The Spot - User Profile Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { EventItem } from '../../types/event';

interface ProfileScreenProps {
  onOpenHostDashboard: () => void;
  onEventPress: (event: EventItem) => void;
  onLogoutPress: () => void;
}

type ProfileTab = 'tickets' | 'squads' | 'hosted' | 'badges';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenHostDashboard,
  onEventPress,
  onLogoutPress,
}) => {
  const { user } = useAuth();
  const { events, squads } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('tickets');

  // Booked / Attending events
  const attendingEvents = events.filter(
    e => e.userBookingStatus === 'confirmed' || e.userBookingStatus === 'request_pending'
  );

  // User hosted events
  const hostedEvents = events.filter(e => e.host.id === user.id);

  // User squads
  const userSquads = squads.filter(s => s.isUserMember || s.joinStatus === 'member');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Actions Bar */}
        <View style={styles.topActions}>
          <Text style={styles.screenHeading}>Profile</Text>
          <TouchableOpacity onPress={onLogoutPress} style={styles.logoutBtn}>
            <Icon name="log-out" size={16} color={colors.roseDanger} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <Avatar uri={user.avatar} name={user.name} size={76} />

          <View style={styles.nameRow}>
            <Text style={styles.fullName}>{user.name}</Text>
            {user.isVerifiedHost && (
              <Badge label="Host" variant="primary" size="sm" style={{ marginLeft: 6 }} />
            )}
          </View>
          <Text style={styles.username}>@{user.username}</Text>

          <View style={styles.locationPill}>
            <Icon name="map-pin" size={12} color={colors.secondary} />
            <Text style={styles.locationText}>{user.locationArea}</Text>
          </View>

          <Text style={styles.bioText}>{user.bio}</Text>

          {/* Quick Metrics */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.hostedCount}</Text>
              <Text style={styles.statLabel}>Hosted</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.attendedCount}</Text>
              <Text style={styles.statLabel}>Attended</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>★ {user.rating}</Text>
              <Text style={styles.statLabel}>{user.reviewCount} Reviews</Text>
            </View>
          </View>
        </View>

        {/* Host Mode Entry Banner */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onOpenHostDashboard}
          style={styles.hostBanner}
        >
          <View style={styles.hostBannerLeft}>
            <View style={styles.hostIconCircle}>
              <Icon name="sparkles" size={20} color={colors.secondary} />
            </View>
            <View style={styles.hostBannerText}>
              <Text style={styles.hostBannerTitle}>Host Dashboard & Analytics</Text>
              <Text style={styles.hostBannerSub}>
                Manage guest approvals, check-ins & tickets
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={18} color={colors.secondary} />
        </TouchableOpacity>

        {/* Tabs Bar */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('tickets')}
            style={[styles.tabBtn, activeTab === 'tickets' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'tickets' && styles.tabBtnTextActive]}>
              Tickets ({attendingEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('squads')}
            style={[styles.tabBtn, activeTab === 'squads' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'squads' && styles.tabBtnTextActive]}>
              Squads ({userSquads.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('hosted')}
            style={[styles.tabBtn, activeTab === 'hosted' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'hosted' && styles.tabBtnTextActive]}>
              Hosted ({hostedEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('badges')}
            style={[styles.tabBtn, activeTab === 'badges' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'badges' && styles.tabBtnTextActive]}>
              Badges
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: TICKETS / RSVPS (MATCHING TICKET MOMENT SIGNATURE) */}
        {activeTab === 'tickets' && (
          <View style={styles.tabContent}>
            {attendingEvents.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No active passes</Text>
                <Text style={styles.emptySub}>Book a party or game night in Pune to see your passes here.</Text>
              </View>
            ) : (
              attendingEvents.map(evt => {
                const isConfirmed = evt.userBookingStatus === 'confirmed';
                const ticketCode = `SPT-${evt.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

                return (
                  <TouchableOpacity
                    key={evt.id}
                    activeOpacity={0.88}
                    onPress={() => onEventPress(evt)}
                    style={styles.ticketWalletCard}
                  >
                    {/* Holographic top accent stripe */}
                    <View style={styles.ticketAccentStripe} />

                    {/* Top Section */}
                    <View style={styles.ticketTopSection}>
                      <View style={styles.ticketHeader}>
                        <Badge
                          label={isConfirmed ? 'CONFIRMED PASS (DEMO)' : 'HOST APPROVAL PENDING'}
                          variant={isConfirmed ? 'success' : 'warning'}
                          icon={isConfirmed ? 'check' : 'clock'}
                          size="sm"
                        />
                        <Text style={styles.ticketPrice}>
                          {evt.priceInr === 0 ? 'FREE ENTRY' : `₹${evt.priceInr}`}
                        </Text>
                      </View>

                      <Text style={styles.ticketTitle} numberOfLines={2}>
                        {evt.title}
                      </Text>

                      <View style={styles.ticketMetaRow}>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel}>DATE & TIME</Text>
                          <Text style={styles.metaValue}>{evt.date} · {evt.time.split('-')[0].trim()}</Text>
                        </View>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel}>VENUE</Text>
                          <Text style={styles.metaValue} numberOfLines={1}>{evt.locationArea}, Pune</Text>
                        </View>
                      </View>
                    </View>

                    {/* Perforation Line with Cut-out Notches */}
                    <View style={styles.perforationRow}>
                      <View style={[styles.notch, styles.notchLeft]} />
                      <View style={styles.dashedDivider} />
                      <View style={[styles.notch, styles.notchRight]} />
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.ticketBottomSection}>
                      <View>
                        <Text style={styles.ticketCodeText}>PASS #{ticketCode}</Text>
                        <Text style={styles.ticketSubText}>
                          {isConfirmed ? 'Demo pass · Tap to inspect QR' : 'Host reviewing your request'}
                        </Text>
                      </View>
                      <Icon name="chevron-right" size={16} color={colors.secondary} />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {/* TAB 2: SQUADS */}
        {activeTab === 'squads' && (
          <View style={styles.tabContent}>
            {userSquads.map(sqd => (
              <View key={sqd.id} style={styles.squadSnippetCard}>
                <Avatar uri={sqd.avatar} name={sqd.name} size={44} />
                <View style={styles.squadSnippetInfo}>
                  <Text style={styles.squadSnippetName}>{sqd.name}</Text>
                  <Text style={styles.squadSnippetMeta}>
                    {sqd.vibe} · {sqd.memberCount} Members
                  </Text>
                </View>
                <Badge label="Member" variant="gaming" size="sm" />
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: HOSTED */}
        {activeTab === 'hosted' && (
          <View style={styles.tabContent}>
            {hostedEvents.map(evt => (
              <TouchableOpacity
                key={evt.id}
                onPress={() => onEventPress(evt)}
                style={styles.hostedCard}
              >
                <Text style={styles.hostedTitle}>{evt.title}</Text>
                <Text style={styles.hostedMeta}>
                  {evt.date} · {evt.confirmedCount} Attendees Confirmed
                </Text>
                <Badge label={`₹${evt.priceInr} / person`} variant="secondary" size="sm" style={{ marginTop: 6 }} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 4: BADGES */}
        {activeTab === 'badges' && (
          <View style={styles.tabContent}>
            {user.badges.map(b => (
              <View key={b.id} style={styles.badgeItemCard}>
                <View style={styles.badgeIconBox}>
                  <Icon name="sparkles" size={20} color={b.color} />
                </View>
                <View style={styles.badgeTextCol}>
                  <Text style={styles.badgeName}>{b.name}</Text>
                  <Text style={styles.badgeDesc}>{b.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  screenHeading: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roseLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.roseDanger,
  },
  logoutText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.roseDanger,
    marginLeft: 4,
  },
  profileHeaderCard: {
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing.base,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  fullName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  username: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  locationText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: typography.fontWeight.medium,
  },
  bioText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.md,
    maxWidth: 300,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderSubtle,
  },
  hostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginBottom: spacing.lg,
  },
  hostBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hostIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hostBannerText: {
    flex: 1,
  },
  hostBannerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  hostBannerSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.lg,
    padding: 3,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.textPrimary,
  },
  tabContent: {
    gap: spacing.sm,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  emptySub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  ticketWalletCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderHighlight,
    marginBottom: spacing.base,
    position: 'relative',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  ticketAccentStripe: {
    height: 3,
    backgroundColor: colors.secondary,
  },
  ticketTopSection: {
    padding: spacing.base,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  ticketPrice: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  ticketTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  ticketMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginTop: 2,
  },
  perforationRow: {
    position: 'relative',
    height: 18,
    justifyContent: 'center',
  },
  notch: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.background,
  },
  notchLeft: {
    left: -9,
  },
  notchRight: {
    right: -9,
  },
  dashedDivider: {
    marginHorizontal: 16,
    height: 1,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
  },
  ticketBottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSurface2,
  },
  ticketCodeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.mono,
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.8,
  },
  ticketSubText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  squadSnippetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  squadSnippetInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  squadSnippetName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  squadSnippetMeta: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  hostedCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  hostedTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  hostedMeta: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  badgeIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeTextCol: {
    flex: 1,
  },
  badgeName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  badgeDesc: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
