/**
 * The Spot - Create Gaming Session Modal
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../context/AppContext';
import { GamingFormat, GamingPlatform, SkillLevel } from '../../types/gaming';
import { ModalSheet } from '../../components/common/ModalSheet';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface CreateGamingModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const gamesList = [
  'Valorant',
  'EA Sports FC 25',
  'Turf Box Cricket',
  'BGMI (Custom Rooms)',
  'Settlers of Catan',
  'CS2',
  'Rocket League',
  'D&D Campaign',
];

const platformsList: GamingPlatform[] = [
  'PC',
  'PlayStation 5',
  'Physical / In-Person',
  'Mobile',
  'Xbox',
];

const formatsList: Array<{ id: GamingFormat; label: string }> = [
  { id: 'lan_cafe', label: 'LAN Cafe (Respawn/Mariplex)' },
  { id: 'turf', label: 'Turf Arena (Box Cricket/Football)' },
  { id: 'online', label: 'Online / Discord Server' },
  { id: 'boardgame_cafe', label: 'Board Game Cafe' },
];

export const CreateGamingModal: React.FC<CreateGamingModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { addNewGamingSession } = useApp();

  const [gameTitle, setGameTitle] = useState('Valorant');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<GamingPlatform>('PC');
  const [format, setFormat] = useState<GamingFormat>('lan_cafe');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('competitive');
  const [locationArea, setLocationArea] = useState('Baner');
  const [venueDetails, setVenueDetails] = useState('Respawn Gaming Lounge, Baner');
  const [totalSlots, setTotalSlots] = useState('5');
  const [date, setDate] = useState('Tonight');
  const [time, setTime] = useState('9:00 PM - 12:00 AM');
  const [description, setDescription] = useState('');
  const [entryFeeInr, setEntryFeeInr] = useState('200');

  const [errorMsg, setErrorMsg] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      setErrorMsg('Please give your gaming lobby a title.');
      return;
    }
    const slots = parseInt(totalSlots, 10);
    if (isNaN(slots) || slots < 2) {
      setErrorMsg('Please specify at least 2 slots.');
      return;
    }

    addNewGamingSession({
      title: title.trim(),
      gameTitle,
      category: format === 'turf' ? 'turf_sports' : format === 'boardgame_cafe' ? 'tabletop' : 'pc_esports',
      categoryLabel: format === 'turf' ? 'Turf Sports' : 'PC Esports',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      format,
      formatLabel: formatsList.find(f => f.id === format)?.label || 'Gaming Cafe',
      platform,
      skillLevel,
      date,
      time,
      locationArea,
      venueDetails: venueDetails.trim(),
      totalSlots: slots,
      description: description.trim() || `Join our ${gameTitle} squad session in Pune!`,
      voiceChatRequired: true,
      entryFeeInr: parseInt(entryFeeInr, 10) || 0,
      tags: [platform, skillLevel.toUpperCase(), locationArea],
      isTrending: true,
    });

    onClose();
    if (onCreated) onCreated();
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Create Gaming Session"
      subtitle="Gather your squad for LAN, turf, or online play"
      maxHeightRatio={0.92}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Icon name="alert-circle" size={14} color={colors.roseDanger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Game Title Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Game *</Text>
          <View style={styles.chipsRow}>
            {gamesList.map(g => {
              const isSelected = gameTitle === g;
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGameTitle(g)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Lobby Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Session / Lobby Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. 5v5 Competitive Premier Ranked Grind (Ascendant+)"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        {/* Format */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Playing Format</Text>
          <View style={styles.chipsRow}>
            {formatsList.map(f => {
              const isSelected = format === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setFormat(f.id)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Platform */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Platform</Text>
          <View style={styles.chipsRow}>
            {platformsList.map(p => {
              const isSelected = platform === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPlatform(p)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date, Time & Slots */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>When</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="Tonight or Sat"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Total Slots</Text>
            <TextInput
              value={totalSlots}
              onChangeText={setTotalSlots}
              placeholder="e.g. 5"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        {/* Venue Details */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Venue / Cafe Name & Area</Text>
          <TextInput
            value={venueDetails}
            onChangeText={setVenueDetails}
            placeholder="e.g. Respawn Cafe High Street Baner or Deccan Turf"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <Button
          title="Publish Gaming Lobby 🎮"
          onPress={handleCreate}
          size="lg"
          variant="primary"
          fullWidth
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: spacing.base,
    paddingBottom: spacing.base,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseDanger,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.roseDanger,
    marginLeft: 6,
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.cyanGaming,
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
});
