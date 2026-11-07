/**
 * The Spot - Signature Radar Nearby Interactive Discovery
 * "The Spot is a living map of tonight."
 * Distance calculated using real Haversine formula from Pune coordinates
 * Explicitly labeled as simulated reference data in development.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { EventItem } from '../../types/event';
import { GamingSession } from '../../types/gaming';
import {
  PUNE_NEIGHBORHOOD_COORDS,
  calculateHaversineDistanceKm,
  calculateBearingAngleDeg,
  getSafeDisplayLocation,
} from '../../utils/geo';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { Spotlight } from '../common/Spotlight';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RADAR_SIZE = Math.min(SCREEN_WIDTH - 32, 340);
const CENTER = RADAR_SIZE / 2;

export interface RadarPoint {
  id: string;
  type: 'party' | 'gaming' | 'chill';
  title: string;
  categoryLabel: string;
  distanceKm: number;
  time: string;
  spotsLeft: number;
  priceInr: number;
  locationArea: string;
  safeVenueText: string;
  isAddressProtected: boolean;
  angleDeg: number;
  originalItem: EventItem | GamingSession;
  isMockData: boolean;
}

interface RadarNearbyProps {
  events: EventItem[];
  gamingSessions: GamingSession[];
  userNeighborhood?: string;
  onSelectItem: (item: EventItem | GamingSession, type: 'party' | 'gaming' | 'chill') => void;
  selectedRadiusKm?: number;
  onRadiusChange?: (km: number) => void;
}

export const RadarNearby: React.FC<RadarNearbyProps> = ({
  events,
  gamingSessions,
  userNeighborhood = 'Koregaon Park',
  onSelectItem,
  selectedRadiusKm = 10,
  onRadiusChange,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<RadarPoint | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'party' | 'gaming' | 'chill'>('all');
  const [maxRadius, setMaxRadius] = useState<number>(selectedRadiusKm);

  // Rotating sweep beam
  const sweepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 3800,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [sweepAnim]);

  // Center coordinate from user's current Pune neighborhood
  const userCenterCoord =
    PUNE_NEIGHBORHOOD_COORDS[userNeighborhood] || PUNE_NEIGHBORHOOD_COORDS['Koregaon Park'];

  // Convert real items to radar points using Haversine distance and bearing
  const points: RadarPoint[] = [
    // Parties
    ...events.map(evt => {
      const targetCoord =
        PUNE_NEIGHBORHOOD_COORDS[evt.locationArea] || {
          latitude: userCenterCoord.latitude + 0.02,
          longitude: userCenterCoord.longitude + 0.015,
        };

      // Genuine Haversine distance
      const distance = calculateHaversineDistanceKm(userCenterCoord, targetCoord);
      const angle = calculateBearingAngleDeg(userCenterCoord, targetCoord);
      const isConfirmed = evt.userBookingStatus === 'confirmed';
      const safeLoc = getSafeDisplayLocation(
        evt.locationArea,
        evt.venueName,
        evt.isPrivateAddress,
        isConfirmed
      );

      return {
        id: `radar_evt_${evt.id}`,
        type: 'party' as const,
        title: evt.title,
        categoryLabel: evt.categoryLabel,
        distanceKm: Math.max(0.6, distance),
        time: evt.time.split('-')[0].trim(),
        spotsLeft: evt.availableSpots,
        priceInr: evt.priceInr,
        locationArea: evt.locationArea,
        safeVenueText: safeLoc.venueText,
        isAddressProtected: safeLoc.isProtected,
        angleDeg: angle,
        originalItem: evt,
        isMockData: true,
      };
    }),

    // Gaming Sessions
    ...gamingSessions.map((sess, idx) => {
      const targetCoord =
        PUNE_NEIGHBORHOOD_COORDS[sess.locationArea] || {
          latitude: userCenterCoord.latitude - 0.018 - idx * 0.008,
          longitude: userCenterCoord.longitude + 0.012 - idx * 0.005,
        };

      const distance = calculateHaversineDistanceKm(userCenterCoord, targetCoord);
      const angle = calculateBearingAngleDeg(userCenterCoord, targetCoord);

      return {
        id: `radar_game_${sess.id}`,
        type: 'gaming' as const,
        title: sess.title,
        categoryLabel: sess.gameTitle,
        distanceKm: Math.max(0.8, distance),
        time: sess.time.split('-')[0].trim(),
        spotsLeft: sess.totalSlots - sess.filledSlots,
        priceInr: sess.entryFeeInr,
        locationArea: sess.locationArea,
        safeVenueText: sess.venueDetails || `${sess.locationArea}, Pune`,
        isAddressProtected: false,
        angleDeg: angle,
        originalItem: sess,
        isMockData: true,
      };
    }),
  ];

  // Filter by category and radius
  const filteredPoints = points.filter(p => {
    if (activeCategory !== 'all' && p.type !== activeCategory) return false;
    if (p.distanceKm > maxRadius) return false;
    return true;
  });

  const spin = sweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getMarkerPosition = (point: RadarPoint) => {
    const rad = (point.angleDeg * Math.PI) / 180;
    const ratio = Math.min(1, point.distanceKm / maxRadius);
    const r = ratio * (CENTER - 28);
    const x = CENTER + r * Math.cos(rad);
    const y = CENTER + r * Math.sin(rad);
    return { x, y };
  };

  const getMarkerColor = (type: 'party' | 'gaming' | 'chill') => {
    if (type === 'party') return colors.radarParty;
    if (type === 'gaming') return colors.radarGaming;
    return colors.radarChill;
  };

  return (
    <View style={styles.container}>
      {/* Simulation Provenance Tag */}
      <View style={styles.provenanceRow}>
        <View style={styles.provenanceDot} />
        <Text style={styles.provenanceText}>
          RADAR ACTIVE · CENTERED AT {userNeighborhood.toUpperCase()} (PUNE)
        </Text>
      </View>

      {/* Top Filter Controls */}
      <View style={styles.controlsRow}>
        <View style={styles.categoryFilters}>
          {(['all', 'party', 'gaming'] as const).map(cat => {
            const isSelected = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {cat === 'all' ? 'All Pulse' : cat === 'party' ? 'Parties' : 'Gaming'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Radius selector */}
        <View style={styles.radiusSelector}>
          {[3, 5, 10].map(km => {
            const isSelected = maxRadius === km;
            return (
              <TouchableOpacity
                key={km}
                onPress={() => {
                  setMaxRadius(km);
                  if (onRadiusChange) onRadiusChange(km);
                }}
                style={[styles.radiusPill, isSelected && styles.radiusPillActive]}
              >
                <Text style={[styles.radiusPillText, isSelected && styles.radiusPillTextActive]}>
                  {km}km
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Radar Disc Canvas */}
      <View style={styles.radarWrapper}>
        <View style={[styles.radarDisc, { width: RADAR_SIZE, height: RADAR_SIZE }]}>
          {/* Concentric Distance Rings */}
          <View style={[styles.ring, { width: RADAR_SIZE * 0.33, height: RADAR_SIZE * 0.33 }]} />
          <View style={[styles.ring, { width: RADAR_SIZE * 0.66, height: RADAR_SIZE * 0.66 }]} />
          <View style={[styles.ring, { width: RADAR_SIZE - 2, height: RADAR_SIZE - 2 }]} />

          {/* Crosshair Grids */}
          <View style={styles.horizontalLine} />
          <View style={styles.verticalLine} />

          {/* Distance Labels */}
          <Text style={[styles.ringLabel, { top: CENTER - RADAR_SIZE * 0.165 - 8 }]}>
            {(maxRadius * 0.33).toFixed(1)}km
          </Text>
          <Text style={[styles.ringLabel, { top: CENTER - RADAR_SIZE * 0.33 - 8 }]}>
            {(maxRadius * 0.66).toFixed(1)}km
          </Text>
          <Text style={[styles.ringLabel, { top: 6 }]}>
            {maxRadius}km
          </Text>

          {/* Rotating Sweep Beam */}
          <Animated.View
            style={[
              styles.sweepLine,
              {
                width: CENTER,
                transform: [
                  { translateX: CENTER / 2 },
                  { rotate: spin },
                  { translateX: -CENTER / 2 },
                ],
              },
            ]}
          />

          {/* Center User Position with Spotlight */}
          <View style={[styles.centerUser, { top: CENTER - 10, left: CENTER - 10 }]}>
            <Spotlight variant="pulse" size={12} color={colors.primary} />
          </View>

          {/* Radar Experience Markers */}
          {filteredPoints.map(point => {
            const { x, y } = getMarkerPosition(point);
            const isSelected = selectedPoint?.id === point.id;
            const markerColor = getMarkerColor(point.type);

            return (
              <TouchableOpacity
                key={point.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPoint(point)}
                style={[
                  styles.markerTouch,
                  {
                    left: x - 14,
                    top: y - 14,
                  },
                ]}
              >
                <Spotlight
                  variant={isSelected ? 'pulse' : 'dot'}
                  size={isSelected ? 14 : 10}
                  color={markerColor}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Marker Detail Card */}
      {selectedPoint ? (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewTagRow}>
              <Badge
                label={selectedPoint.categoryLabel}
                variant={selectedPoint.type === 'gaming' ? 'gaming' : 'primary'}
                size="sm"
              />
              <Text style={styles.distanceBadge}>
                📍 ~{selectedPoint.distanceKm} km away ({selectedPoint.locationArea}) • Demo Geo
              </Text>
            </View>

            <TouchableOpacity onPress={() => setSelectedPoint(null)} style={styles.closeBtn}>
              <Icon name="x" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.previewTitle} numberOfLines={1}>
            {selectedPoint.title}
          </Text>

          {/* Address Privacy Notice */}
          <View style={styles.venueRow}>
            <Icon
              name={selectedPoint.isAddressProtected ? 'shield-check' : 'map-pin'}
              size={12}
              color={selectedPoint.isAddressProtected ? colors.secondary : colors.textSecondary}
            />
            <Text
              style={[
                styles.venueText,
                selectedPoint.isAddressProtected && styles.venueTextProtected,
              ]}
              numberOfLines={1}
            >
              {selectedPoint.safeVenueText}
            </Text>
          </View>

          <View style={styles.previewMetaRow}>
            <Text style={styles.previewTime}>🕒 {selectedPoint.time}</Text>
            <Text style={styles.previewSpots}>🔥 {selectedPoint.spotsLeft} spots available</Text>
            <Text style={styles.previewPrice}>
              {selectedPoint.priceInr === 0 ? 'Free' : `₹${selectedPoint.priceInr}`}
            </Text>
          </View>

          <Button
            title="Inspect & Join Spot"
            variant="primary"
            size="sm"
            onPress={() => onSelectItem(selectedPoint.originalItem, selectedPoint.type)}
            icon="arrow-right"
            iconPosition="right"
            style={{ marginTop: spacing.sm }}
          />
        </View>
      ) : (
        <View style={styles.radarHintBox}>
          <Icon name="compass" size={16} color={colors.secondary} />
          <Text style={styles.radarHintText}>
            Tap any glowing beacon to preview experiences in Pune. Distances calculated via spherical Haversine formula from reference coordinates.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.radarBackground,
    borderRadius: radius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  provenanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundSurface2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  provenanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emeraldSuccess,
    marginRight: 6,
  },
  provenanceText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.base,
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 4,
  },
  filterChip: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  filterChipText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.textPrimary,
  },
  radiusSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.full,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  radiusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  radiusPillActive: {
    backgroundColor: colors.primary,
  },
  radiusPillText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
  },
  radiusPillTextActive: {
    color: colors.textPrimary,
  },
  radarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  radarDisc: {
    borderRadius: 999,
    backgroundColor: '#090616',
    borderWidth: 1,
    borderColor: colors.radarRing,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.radarRing,
  },
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: colors.radarGrid,
  },
  verticalLine: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: colors.radarGrid,
  },
  ringLabel: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    backgroundColor: colors.radarBackground,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  sweepLine: {
    position: 'absolute',
    top: CENTER,
    left: CENTER,
    height: 1.5,
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },
  centerUser: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  markerTouch: {
    position: 'absolute',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  previewCard: {
    width: '100%',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginTop: spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  previewTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  distanceBadge: {
    fontSize: typography.fontSize.xxs,
    color: colors.secondary,
    marginLeft: spacing.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  venueText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  venueTextProtected: {
    color: colors.secondary,
    fontStyle: 'italic',
  },
  previewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  previewTime: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
  },
  previewSpots: {
    fontSize: typography.fontSize.xxs,
    color: colors.accent,
    fontWeight: typography.fontWeight.semibold,
  },
  previewPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  radarHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  radarHintText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
