/**
 * The Spot - Guided Multi-Step Event Creation Modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { EventCategory, EventItem } from '../../types/event';
import { ModalSheet } from '../../components/common/ModalSheet';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Icon } from '../../components/common/Icon';

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: (event: EventItem) => void;
}

const categories: Array<{ id: EventCategory; label: string }> = [
  { id: 'party', label: 'Party & Social' },
  { id: 'techno', label: 'Techno / Music' },
  { id: 'rooftop', label: 'Rooftop & Sunset' },
  { id: 'mixer', label: 'Tech & Creator Mixer' },
  { id: 'boardgames', label: 'Board Games' },
  { id: 'trivia', label: 'Trivia & Comedy' },
];

const neighborhoods = [
  'Koregaon Park',
  'Baner',
  'Kalyani Nagar',
  'Viman Nagar',
  'FC Road',
  'Hinjewadi',
  'Aundh',
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { addNewEvent } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<EventCategory>('party');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Tomorrow, Sat');
  const [time, setTime] = useState('8:00 PM - 1:00 AM');
  const [locationArea, setLocationArea] = useState('Koregaon Park');
  const [venueName, setVenueName] = useState('');
  const [isPrivateAddress, setIsPrivateAddress] = useState(false);
  const [priceInr, setPriceInr] = useState('499');
  const [capacity, setCapacity] = useState('40');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        setErrorMsg('Please enter an event title.');
        return;
      }
      if (!description.trim()) {
        setErrorMsg('Please add a short description.');
        return;
      }
      setErrorMsg('');
      setStep(2);
    } else if (step === 2) {
      if (!venueName.trim()) {
        setErrorMsg('Please enter the venue name or landmark.');
        return;
      }
      setErrorMsg('');
      setStep(3);
    } else if (step === 3) {
      const cap = parseInt(capacity, 10);
      if (isNaN(cap) || cap < 2) {
        setErrorMsg('Please enter a valid capacity (at least 2).');
        return;
      }
      setErrorMsg('');
      setStep(4);
    }
  };

  const handlePublish = () => {
    const numPrice = parseInt(priceInr, 10) || 0;
    const numCapacity = parseInt(capacity, 10) || 30;

    const newEvt = addNewEvent({
      title: title.trim(),
      tagline: tagline.trim() || 'Curated social experience on The Spot',
      category,
      categoryLabel: categories.find(c => c.id === category)?.label || 'Social',
      description: description.trim(),
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      date,
      time,
      rawDate: new Date().toISOString(),
      locationArea,
      venueName: venueName.trim(),
      isPrivateAddress,
      distanceKm: 1.8,
      priceInr: numPrice,
      capacity: numCapacity,
      availableSpots: numCapacity - 1,
      visibility,
      requiresHostApproval: requiresApproval,
      perks: ['Host Welcome Meet', 'Guest Screening for Safety'],
      rules: [{ id: 'r1', icon: 'shield-check', text: 'Respect fellow guests and venue rules.' }],
      isTrending: true,
    });

    onCreated(newEvt);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setTagline('');
    setDescription('');
    setVenueName('');
    setErrorMsg('');
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title={`Host an Experience (${step}/4)`}
      subtitle={
        step === 1
          ? 'Basics & Category'
          : step === 2
          ? 'Date & Pune Location'
          : step === 3
          ? 'Pricing & Guest Screening'
          : 'Preview & Confirmation'
      }
      maxHeightRatio={0.92}
    >
      {/* Progress Dots */}
      <View style={styles.stepIndicatorRow}>
        {[1, 2, 3, 4].map(s => (
          <View
            key={s}
            style={[styles.stepDot, s <= step ? styles.stepDotActive : styles.stepDotInactive]}
          />
        ))}
      </View>

      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Icon name="alert-circle" size={14} color={colors.roseDanger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {/* STEP 1: BASICS */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Sunset Vinyl Social & House Grooves"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tagline (One-liner)</Text>
            <TextInput
              value={tagline}
              onChangeText={setTagline}
              placeholder="e.g. Deep melodic house, craft cocktails & warm golden hour"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipsRow}>
              {categories.map(c => {
                const isSelected = category === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setCategory(c.id)}
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>What should guests expect? *</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the music, the crowd, dress code, and what makes this party special..."
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
            />
          </View>

          <Button title="Next: Location & Time" onPress={handleNext} fullWidth size="lg" />
        </View>
      )}

      {/* STEP 2: TIMING & PUNE LOCATION */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="e.g. Tonight or Sat, Nov 14"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time Window</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="e.g. 8:00 PM - 1:00 AM"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pune Neighborhood</Text>
            <View style={styles.chipsRow}>
              {neighborhoods.map(area => {
                const isSelected = locationArea === area;
                return (
                  <TouchableOpacity
                    key={area}
                    onPress={() => setLocationArea(area)}
                    style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {area}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue Name / Landmark *</Text>
            <TextInput
              value={venueName}
              onChangeText={setVenueName}
              placeholder="e.g. High Spirits Rooftop Terrace or Private Villa"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>

          {/* Privacy Switch */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={styles.switchTitle}>Hide exact address until RSVP approved</Text>
              <Text style={styles.switchSub}>Protects house party & private rooftop locations.</Text>
            </View>
            <Switch
              value={isPrivateAddress}
              onValueChange={setIsPrivateAddress}
              trackColor={{ false: colors.backgroundSurface3, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={styles.navButtonsRow}>
            <Button title="Back" variant="secondary" onPress={() => setStep(1)} style={{ flex: 1 }} />
            <Button title="Next: Access & Pricing" onPress={handleNext} style={{ flex: 2 }} />
          </View>
        </View>
      )}

      {/* STEP 3: PRICING & SCREENING */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Entry Price per person (₹ INR)</Text>
            <TextInput
              value={priceInr}
              onChangeText={setPriceInr}
              placeholder="0 for Free RSVP"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              style={styles.input}
            />
            <Text style={styles.helperText}>Enter 0 if the experience is free.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Maximum Capacity (Total Spots)</Text>
            <TextInput
              value={capacity}
              onChangeText={setCapacity}
              placeholder="e.g. 40"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Guest Screening Approval */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1, marginRight: spacing.md }}>
              <Text style={styles.switchTitle}>Require Host Approval</Text>
              <Text style={styles.switchSub}>You review guest profiles before tickets are confirmed.</Text>
            </View>
            <Switch
              value={requiresApproval}
              onValueChange={setRequiresApproval}
              trackColor={{ false: colors.backgroundSurface3, true: colors.primary }}
              thumbColor={colors.textPrimary}
            />
          </View>

          <View style={styles.navButtonsRow}>
            <Button title="Back" variant="secondary" onPress={() => setStep(2)} style={{ flex: 1 }} />
            <Button title="Preview Experience" onPress={handleNext} style={{ flex: 2 }} />
          </View>
        </View>
      )}

      {/* STEP 4: PREVIEW & PUBLISH */}
      {step === 4 && (
        <View style={styles.stepContainer}>
          <View style={styles.previewCard}>
            <Badge label={locationArea} variant="primary" size="sm" style={{ marginBottom: 6 }} />
            <Text style={styles.previewTitle}>{title}</Text>
            <Text style={styles.previewTagline}>{tagline || description.slice(0, 80)}</Text>

            <View style={styles.previewDivider} />

            <View style={styles.previewMetaRow}>
              <Text style={styles.previewMeta}>📅 {date} · {time}</Text>
              <Text style={styles.previewMeta}>📍 {venueName} {isPrivateAddress ? '(🔒 Private)' : ''}</Text>
            </View>

            <View style={styles.previewFooterRow}>
              <Text style={styles.previewPrice}>
                {parseInt(priceInr, 10) === 0 ? 'FREE RSVP' : `₹${priceInr} / person`}
              </Text>
              <Text style={styles.previewCapacity}>{capacity} Capacity</Text>
            </View>
          </View>

          <Text style={styles.publishNotice}>
            ✓ Once published, your experience appears live on The Spot Pune feed and in your Host Dashboard for guest approvals.
          </Text>

          <View style={styles.navButtonsRow}>
            <Button title="Edit" variant="secondary" onPress={() => setStep(3)} style={{ flex: 1 }} />
            <Button title="Publish Experience 🚀" variant="primary" onPress={handlePublish} style={{ flex: 2 }} />
          </View>
        </View>
      )}
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  stepIndicatorRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.base,
    justifyContent: 'center',
  },
  stepDot: {
    height: 4,
    borderRadius: radius.full,
    flex: 1,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotInactive: {
    backgroundColor: colors.backgroundSurface3,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseDanger,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.base,
  },
  errorText: {
    color: colors.roseDanger,
    fontSize: typography.fontSize.xs,
    marginLeft: 6,
    flex: 1,
  },
  stepContainer: {
    gap: spacing.base,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 4,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  chipTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSurface2,
    padding: spacing.base,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  switchTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  switchSub: {
    fontSize: typography.fontSize.xxs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.base,
  },
  previewCard: {
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
  },
  previewTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  previewTagline: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  previewDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.md,
  },
  previewMetaRow: {
    gap: 4,
    marginBottom: spacing.md,
  },
  previewMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  previewFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.heavy,
    color: colors.secondary,
  },
  previewCapacity: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  publishNotice: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
