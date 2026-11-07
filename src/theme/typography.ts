/**
 * The Spot - Typography Design System Tokens
 */

import { TextStyle } from 'react-native';

export const typography = {
  // Font Families (falls back gracefully to system sans-serif / monospace)
  fontFamily: {
    heading: 'System',
    body: 'System',
    mono: 'monospace',
  },

  // Font Sizes
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    displaySm: 28,
    displayMd: 34,
    displayLg: 40,
  },

  // Line Heights
  lineHeight: {
    tight: 1.15,
    snug: 1.25,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Predefined Text Presets
  presets: {
    hero: {
      fontSize: 34,
      fontWeight: '800' as TextStyle['fontWeight'],
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h1: {
      fontSize: 26,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 32,
      letterSpacing: -0.3,
    },
    h2: {
      fontSize: 20,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 26,
      letterSpacing: -0.2,
    },
    h3: {
      fontSize: 17,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 22,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 16,
    },
    button: {
      fontSize: 15,
      fontWeight: '600' as TextStyle['fontWeight'],
      letterSpacing: 0.2,
    },
    tag: {
      fontSize: 11,
      fontWeight: '700' as TextStyle['fontWeight'],
      letterSpacing: 0.5,
      textTransform: 'uppercase' as TextStyle['textTransform'],
    },
  },
} as const;
