/**
 * The Spot - The Signature Spotlight Motif Component
 * A glowing spotlight / pin / pulsing ring representing the living energy of tonight
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

export type SpotlightVariant = 'pin' | 'pulse' | 'dot' | 'radar_ping';

interface SpotlightProps {
  variant?: SpotlightVariant;
  color?: string;
  size?: number;
  glow?: boolean;
  style?: ViewStyle;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  variant = 'pulse',
  color = colors.secondary,
  size = 14,
  glow = true,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    if (variant === 'pulse' || variant === 'radar_ping') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 2.2,
              duration: 1600,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1600,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.75,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [variant, pulseAnim, opacityAnim]);

  if (variant === 'dot') {
    return (
      <View style={[styles.dotContainer, { width: size * 1.8, height: size * 1.8 }, style]}>
        {glow && (
          <View
            style={[
              styles.glowHalo,
              {
                width: size * 1.8,
                height: size * 1.8,
                borderRadius: size * 0.9,
                backgroundColor: color,
                opacity: 0.35,
              },
            ]}
          />
        )}
        <View
          style={[
            styles.coreDot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    );
  }

  if (variant === 'pin') {
    return (
      <View style={[styles.pinWrapper, style]}>
        <View
          style={[
            styles.pinHead,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              shadowColor: color,
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
          <View style={styles.pinInnerWhite} />
        </View>
        <View style={[styles.pinPoint, { borderTopColor: color }]} />
      </View>
    );
  }

  // Pulse & Radar Ping
  return (
    <View style={[styles.pulseContainer, { width: size * 2.5, height: size * 2.5 }, style]}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: size * 1.1,
            borderColor: color,
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
      <View
        style={[
          styles.pulseCore,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            shadowColor: color,
            shadowOpacity: 0.8,
            shadowRadius: 6,
            elevation: 4,
          },
        ]}
      >
        <View style={styles.coreHighlight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  pulseCore: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreHighlight: {
    width: '35%',
    height: '35%',
    borderRadius: 999,
    backgroundColor: '#FFF',
  },
  dotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
  },
  coreDot: {
    alignSelf: 'center',
  },
  pinWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinHead: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInnerWhite: {
    width: '40%',
    height: '40%',
    borderRadius: 999,
    backgroundColor: '#FFF',
  },
  pinPoint: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
