/**
 * The Spot - Bottom Navigation Bar Component
 * 5 primary tabs: Home, Explore, Create (+), Inbox, Profile
 * Features the signature Spotlight motif on the elevated Create button and active indicators
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Icon, IconName } from '../common/Icon';
import { Spotlight } from '../common/Spotlight';

export type MainTabType = 'home' | 'explore' | 'create' | 'inbox' | 'profile';

interface BottomNavProps {
  currentTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onCreatePress: () => void;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onCreatePress,
  unreadMessagesCount = 3,
}) => {
  const tabs: Array<{ id: MainTabType; label: string; icon: IconName }> = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'explore', label: 'Explore', icon: 'compass' },
    { id: 'create', label: 'Create', icon: 'plus' },
    { id: 'inbox', label: 'Inbox', icon: 'message-square' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map(tab => {
          if (tab.id === 'create') {
            return (
              <View key={tab.id} style={styles.createBtnWrapper}>
                {/* Spotlight Glowing Ring around Create button */}
                <View style={styles.createSpotlightRing} />
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onCreatePress}
                  style={styles.createBtn}
                >
                  <Icon name="plus" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            );
          }

          const isActive = currentTab === tab.id;
          const isInbox = tab.id === 'inbox';

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.75}
              onPress={() => onSelectTab(tab.id)}
              style={styles.tabBtn}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name={tab.icon}
                  size={20}
                  color={isActive ? colors.secondary : colors.textMuted}
                />
                {isInbox && unreadMessagesCount > 0 && (
                  <View style={styles.unreadDot} />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View style={styles.activeSpotlightDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: typography.fontSize.xxs,
    marginTop: 3,
    fontWeight: typography.fontWeight.semibold,
  },
  tabLabelActive: {
    color: colors.secondary,
  },
  tabLabelInactive: {
    color: colors.textMuted,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  activeSpotlightDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.secondary,
    marginTop: 2,
    shadowColor: colors.secondary,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  createBtnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    marginTop: -24,
    position: 'relative',
  },
  createSpotlightRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(214, 91, 255, 0.25)',
  },
  createBtn: {
    width: 50,
    height: 50,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
});
