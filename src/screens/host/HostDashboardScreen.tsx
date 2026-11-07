/**
 * The Spot - Host Dashboard & Operations Screen
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
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { EventItem } from '../../types/event';

interface HostDashboardScreenProps {
  onBack: () => void;
  onOpenCreate: () => void;
  onEventPress: (event: EventItem) => void;
}

export const HostDashboardScreen: React.FC<HostDashboardScreenProps> = ({
  onBack,
  onOpenCreate,
  onEventPress,
}) => {
  const { user } = useAuth();
  const { events, hostRequests, approveHostRequest, declineHostRequest } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // User's hosted events
  const myHostedEvents = events.filter(e => e.host.id === user.id);

  // Calculate live host statistics
  const totalRegistrations = myHostedEvents.reduce((acc, e) => acc + e.confirmedCount, 0);
  const totalRevenue = myHostedEvents.reduce((acc, e) => acc + e.confirmedCount * e.priceInr, 0);

  const pendingRequests = hostRequests.filter(r => r.status === 'pending');

  const handleApprove = (id: string, name: string) => {
    approveHostRequest(id);
    showToast(`Approved ${name}'s registration! Ticket issued.`);
  };

  const handleDecline = (id: string, name: string) => {
    declineHostRequest(id);
    showToast(`Declined ${name}'s request.`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Host Operations</Text>
          <Text style={styles.headerSubtitle}>Pune Event Management & Guest Screening</Text>
        </View>

        <TouchableOpacity onPress={onOpenCreate} style={styles.createBtn}>
          <Icon name="plus" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {toastMsg && (
          <View style={styles.toast}>
            <Icon name="check" size={14} color={colors.emeraldSuccess} />
            <Text style={styles.toastText}>{toastMsg}</Text>
          </View>
        )}

        {/* Top 4 Metrics Summary Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalRegistrations}</Text>
            <Text style={styles.metricLabel}>Total Guests</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.emeraldSuccess }]}>
              ₹{totalRevenue.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.secondary }]}>
              {myHostedEvents.length}
            </Text>
            <Text style={styles.metricLabel}>Active Events</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: colors.amberWarning }]}>
              ★ {user.rating}
            </Text>
            <Text style={styles.metricLabel}>Host Rating</Text>
          </View>
        </View>

        {/* Section 1: Guest Screening Queue */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pending Guest Requests</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{pendingRequests.length} pending</Text>
            </View>
          </View>

          {pendingRequests.length === 0 ? (
            <View style={styles.emptyRequests}>
              <Icon name="check" size={24} color={colors.emeraldSuccess} />
              <Text style={styles.emptyRequestsTitle}>Queue All Clear!</Text>
              <Text style={styles.emptyRequestsSub}>No pending guest requests waiting for approval.</Text>
            </View>
          ) : (
            pendingRequests.map(req => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestTop}>
                  <Avatar uri={req.userAvatar} name={req.userName} size={42} />
                  <View style={styles.requestInfo}>
                    <Text style={styles.reqUserName}>{req.userName}</Text>
                    <Text style={styles.reqEventName} numberOfLines={1}>
                      For: {req.eventTitle}
                    </Text>
                    <Text style={styles.reqMeta}>
                      {req.tickets} ticket(s) · ₹{req.totalPriceInr} · Requested {req.requestedAt}
                    </Text>
                  </View>
                </View>

                {/* Approve / Decline Action Buttons */}
                <View style={styles.requestActions}>
                  <Button
                    title="Decline"
                    variant="ghost"
                    size="sm"
                    onPress={() => handleDecline(req.id, req.userName)}
                    style={{ flex: 1, marginRight: spacing.sm }}
                  />
                  <Button
                    title="Approve Ticket ✓"
                    variant="success"
                    size="sm"
                    onPress={() => handleApprove(req.id, req.userName)}
                    style={{ flex: 1.5 }}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Section 2: Manage My Hosted Experiences */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Hosted Experiences</Text>
          </View>

          {myHostedEvents.map(evt => (
            <TouchableOpacity
              key={evt.id}
              activeOpacity={0.85}
              onPress={() => onEventPress(evt)}
              style={styles.eventItemCard}
            >
              <View style={styles.eventCardTop}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={styles.eventItemTitle}>{evt.title}</Text>
                  <Text style={styles.eventItemLocation}>
                    📍 {evt.locationArea}, Pune · 📅 {evt.date}
                  </Text>
                </View>
                <Badge
                  label={evt.priceInr === 0 ? 'FREE' : `₹${evt.priceInr}`}
                  variant="primary"
                  size="sm"
                />
              </View>

              <View style={styles.eventStatsRow}>
                <Text style={styles.attendanceStat}>
                  <Text style={styles.statBold}>{evt.confirmedCount}</Text> of {evt.capacity} attending
                </Text>

                <Badge
                  label={evt.visibility.toUpperCase()}
                  variant="neutral"
                  size="sm"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* New Experience CTA */}
        <Button
          title="Host Another Experience (+)"
          onPress={onOpenCreate}
          size="lg"
          variant="primary"
          fullWidth
          style={{ marginTop: spacing.base }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  createBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.sm,
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  countBadgeText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent,
  },
  emptyRequests: {
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  emptyRequestsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  emptyRequestsSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  requestCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing.sm,
  },
  requestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  requestInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  reqUserName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  reqEventName: {
    fontSize: typography.fontSize.xxs,
    color: colors.secondary,
    marginTop: 1,
  },
  reqMeta: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventItemCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing.sm,
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  eventItemTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  eventItemLocation: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  eventStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.sm,
  },
  attendanceStat: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  statBold: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
});
