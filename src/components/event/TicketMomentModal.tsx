/**
 * The Spot - Signature Ticket Moment Modal
 * Memorable, celebratory perforated ticket with subtle holographic edge and confetti
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { EventItem } from '../../types/event';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';
import { Spotlight } from '../common/Spotlight';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TicketMomentModalProps {
  visible: boolean;
  onClose: () => void;
  event: EventItem | null;
  onViewTicketInProfile?: () => void;
}

export const TicketMomentModal: React.FC<TicketMomentModalProps> = ({
  visible,
  onClose,
  event,
  onViewTicketInProfile,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Floating confetti dots
  const confettiAnims = useRef(
    Array.from({ length: 14 }).map(() => ({
      y: new Animated.Value(0),
      x: (Math.random() - 0.5) * 160,
      opacity: new Animated.Value(1),
      color: [colors.secondary, colors.cyanGaming, colors.accent, '#FFD700'][
        Math.floor(Math.random() * 4)
      ],
      size: Math.random() * 6 + 4,
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        ...confettiAnims.map(c =>
          Animated.sequence([
            Animated.parallel([
              Animated.timing(c.y, {
                toValue: -120 - Math.random() * 80,
                duration: 900,
                useNativeDriver: true,
              }),
              Animated.timing(c.opacity, {
                toValue: 0,
                duration: 900,
                useNativeDriver: true,
              }),
            ]),
          ])
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      confettiAnims.forEach(c => {
        c.y.setValue(0);
        c.opacity.setValue(1);
      });
    }
  }, [visible, scaleAnim, opacityAnim, confettiAnims]);

  if (!event) return null;

  const ticketCode = `SPT-${event.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Confetti Floating Particles */}
        {confettiAnims.map((c, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confettiParticle,
              {
                width: c.size,
                height: c.size,
                borderRadius: c.size / 2,
                backgroundColor: c.color,
                transform: [
                  { translateY: c.y },
                  { translateX: c.x },
                ],
                opacity: c.opacity,
              },
            ]}
          />
        ))}

        <Animated.View
          style={[
            styles.ticketWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Holographic Header Bar */}
          <View style={styles.celebrationTop}>
            <Spotlight variant="pulse" size={16} color={colors.secondary} />
            <Text style={styles.celebrationTitle}>Spot Confirmed!</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="x" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* THE PERFORATED TICKET CARD */}
          <View style={styles.ticketCard}>
            {/* Holographic glowing border overlay */}
            <View style={styles.holographicGlow} />

            {/* Top Half of Ticket */}
            <View style={styles.ticketTop}>
              <View style={styles.ticketHeaderRow}>
                <Badge label={event.categoryLabel} variant="primary" size="sm" />
                <Text style={styles.verifiedText}>CONFIRMED RSVP (LOCAL DEMO PASS)</Text>
              </View>

              <Text style={styles.eventTitle} numberOfLines={2}>
                {event.title}
              </Text>

              <View style={styles.ticketMetaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>DATE & TIME</Text>
                  <Text style={styles.metaValue}>{event.date}</Text>
                  <Text style={styles.metaSub}>{event.time.split('-')[0].trim()}</Text>
                </View>

                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>PUNE VENUE</Text>
                  <Text style={styles.metaValue}>{event.locationArea}</Text>
                  <Text style={styles.metaSub} numberOfLines={1}>{event.venueName}</Text>
                </View>
              </View>
            </View>

            {/* Perforation Line with Left and Right Notches */}
            <View style={styles.perforationContainer}>
              <View style={[styles.notch, styles.notchLeft]} />
              <View style={styles.dashedLine} />
              <View style={[styles.notch, styles.notchRight]} />
            </View>

            {/* Bottom Half of Ticket */}
            <View style={styles.ticketBottom}>
              <View style={styles.barcodeSection}>
                {/* Mock Barcode Lines */}
                <View style={styles.barcodeLines}>
                  {[3, 1, 4, 2, 1, 5, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1, 3].map((w, idx) => (
                    <View
                      key={idx}
                      style={[styles.barcodeBar, { width: w, marginRight: 2 }]}
                    />
                  ))}
                </View>
                <Text style={styles.ticketCodeText}>#{ticketCode}</Text>
                <Text style={styles.simulationDisclaimer}>Simulation pass · Not an external merchant ticket</Text>
              </View>

              <View style={styles.ticketGuestInfo}>
                <Text style={styles.guestLabel}>ADMIT</Text>
                <Text style={styles.guestValue}>1 Spot</Text>
                <Text style={styles.guestSub}>
                  {event.priceInr === 0 ? 'Free Entry' : `₹${event.priceInr}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button
              title="View Ticket in Profile"
              variant="primary"
              size="md"
              fullWidth
              onPress={() => {
                onClose();
                if (onViewTicketInProfile) onViewTicketInProfile();
              }}
              icon="bookmark"
              style={{ marginBottom: spacing.sm }}
            />

            <Button
              title="Done"
              variant="ghost"
              size="sm"
              onPress={onClose}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 3, 10, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  confettiParticle: {
    position: 'absolute',
    top: '40%',
  },
  ticketWrapper: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  celebrationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  celebrationTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketCard: {
    width: '100%',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.holographicBorder,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
    position: 'relative',
  },
  holographicGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.secondary,
  },
  ticketTop: {
    padding: spacing.base,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  verifiedText: {
    fontSize: typography.fontSize.xxs,
    fontWeight: typography.fontWeight.heavy,
    color: colors.emeraldSuccess,
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  ticketMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 2,
  },
  metaSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  perforationContainer: {
    position: 'relative',
    height: 20,
    justifyContent: 'center',
  },
  notch: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(5, 3, 10, 0.82)',
  },
  notchLeft: {
    left: -10,
  },
  notchRight: {
    right: -10,
  },
  dashedLine: {
    marginHorizontal: 16,
    height: 1,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderStyle: 'dashed',
  },
  ticketBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    backgroundColor: colors.backgroundSurface2,
  },
  barcodeSection: {
    flex: 1,
  },
  barcodeLines: {
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
    marginBottom: 4,
  },
  barcodeBar: {
    height: '100%',
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  ticketCodeText: {
    fontSize: typography.fontSize.xxs,
    fontFamily: typography.fontFamily.mono,
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  simulationDisclaimer: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },
  ticketGuestInfo: {
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  guestLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.bold,
  },
  guestValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  guestSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.secondary,
  },
  actionsContainer: {
    width: '100%',
    marginTop: spacing.base,
  },
});
