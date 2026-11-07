/**
 * The Spot - Reusable Avatar & AvatarGroup Components
 */

import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { User } from '../../types/user';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  isOnline?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = 'User',
  size = 40,
  isOnline = false,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <View style={[{ width: size, height: size }, styles.wrapper, style]}>
      {uri && !imageError ? (
        <Image
          source={{ uri }}
          onError={() => setImageError(true)}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize: size * 0.38, lineHeight: size * 0.42 },
            ]}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}

      {isOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: Math.max(8, size * 0.25),
              height: Math.max(8, size * 0.25),
              borderRadius: Math.max(4, size * 0.125),
              borderWidth: size > 40 ? 2 : 1.5,
            },
          ]}
        />
      )}
    </View>
  );
};

interface AvatarGroupProps {
  users: Array<{ avatar?: string; name: string }>;
  maxVisible?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  maxVisible = 3,
  size = 28,
  style,
}) => {
  const visible = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  return (
    <View style={[styles.groupContainer, style]}>
      {visible.map((u, i) => (
        <Avatar
          key={`avg_${i}`}
          uri={u.avatar}
          name={u.name}
          size={size}
          style={[
            styles.groupedAvatar,
            {
              marginLeft: i === 0 ? 0 : -size * 0.32,
              borderColor: colors.backgroundElevated,
              borderWidth: 2,
            },
          ]}
        />
      ))}

      {remaining > 0 && (
        <View
          style={[
            styles.remainingCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.32,
              borderColor: colors.backgroundElevated,
              borderWidth: 2,
            },
          ]}
        >
          <Text style={[styles.remainingText, { fontSize: size * 0.36 }]}>
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: colors.backgroundSurface2,
  },
  fallback: {
    backgroundColor: colors.backgroundSurface3,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.emeraldSuccess,
    borderColor: colors.background,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupedAvatar: {
    borderRadius: radius.full,
  },
  remainingCircle: {
    backgroundColor: colors.backgroundSurface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
  },
});
