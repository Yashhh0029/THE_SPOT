/**
 * The Spot - Premium Design System Color Tokens
 * Premium dark-mode social entertainment palette + Spotlight & Radar motifs
 */

export const colors = {
  // Base Backgrounds
  background: '#090711',
  backgroundElevated: '#171126',
  backgroundSurface2: '#211836',
  backgroundSurface3: '#2D204A',
  backgroundCard: '#150F24',
  backgroundCardHover: '#1E1633',
  backgroundCardElevated: '#1C142E',

  // Overlays & Glass Depth
  overlay30: 'rgba(9, 7, 17, 0.3)',
  overlay50: 'rgba(9, 7, 17, 0.5)',
  overlay80: 'rgba(9, 7, 17, 0.8)',
  glassDark: 'rgba(23, 17, 38, 0.88)',
  glassLight: 'rgba(245, 241, 255, 0.08)',
  glassBorder: 'rgba(214, 91, 255, 0.22)',
  glassBorderCyan: 'rgba(0, 240, 255, 0.25)',
  glassBorderCoral: 'rgba(255, 122, 89, 0.25)',

  // Accent Colors
  primary: '#8B3DFF', // Electric Violet
  primaryHover: '#9B54FF',
  primaryGlow: 'rgba(139, 61, 255, 0.35)',
  primaryLight: 'rgba(139, 61, 255, 0.15)',

  secondary: '#D65BFF', // Neon Orchid
  secondaryHover: '#DE74FF',
  secondaryGlow: 'rgba(214, 91, 255, 0.35)',
  secondaryLight: 'rgba(214, 91, 255, 0.15)',

  accent: '#FF7A59', // Sunset Coral (Gaming & Energy)
  accentHover: '#FF8D70',
  accentGlow: 'rgba(255, 122, 89, 0.35)',
  accentLight: 'rgba(255, 122, 89, 0.15)',

  // Complementary Gaming & Vibe Accents
  cyanGaming: '#00F0FF',
  cyanGamingLight: 'rgba(0, 240, 255, 0.15)',
  emeraldSuccess: '#10B981',
  emeraldLight: 'rgba(16, 185, 129, 0.15)',
  amberWarning: '#F59E0B',
  amberLight: 'rgba(245, 158, 11, 0.15)',
  roseDanger: '#FF4E78',
  roseLight: 'rgba(255, 78, 120, 0.15)',

  // Typography
  textPrimary: '#F5F1FF',
  textSecondary: '#AAA4B8',
  textMuted: '#716B82',
  textDisabled: '#4B455A',
  textInverse: '#090711',

  // Borders & Dividers
  borderSubtle: '#251D38',
  borderDefault: '#32274D',
  borderActive: '#8B3DFF',
  borderHighlight: 'rgba(214, 91, 255, 0.4)',

  // Spotlight Signature Motif Tokens
  spotlightCore: '#F5F1FF',
  spotlightGlow: 'rgba(214, 91, 255, 0.45)',
  spotlightRing: 'rgba(139, 61, 255, 0.3)',
  
  // Radar Nearby Tokens
  radarBackground: '#0D091B',
  radarGrid: 'rgba(139, 61, 255, 0.15)',
  radarRing: 'rgba(214, 91, 255, 0.25)',
  radarSweep: 'rgba(214, 91, 255, 0.12)',
  radarParty: '#D65BFF',
  radarGaming: '#00F0FF',
  radarChill: '#FF7A59',

  // Ticket Moment Holographic Tokens
  holographicBorder: 'rgba(214, 91, 255, 0.6)',
  holographicEdge: 'rgba(0, 240, 255, 0.4)',
  ticketPerforation: '#090711',

  // Tonight Mode Tokens
  tonightAccent: '#FF4E78',
  tonightGlow: 'rgba(255, 78, 120, 0.35)',

  // Gradients (Represented as array pairs for linear gradients / fallbacks)
  gradients: {
    primary: ['#8B3DFF', '#D65BFF'],
    energy: ['#FF7A59', '#FF4E78'],
    gaming: ['#8B3DFF', '#00F0FF'],
    chill: ['#FF7A59', '#8B3DFF'],
    darkCard: ['#171126', '#0E0B1A'],
    glass: ['rgba(33, 24, 54, 0.9)', 'rgba(23, 17, 38, 0.95)'],
    heroGlow: ['rgba(139, 61, 255, 0.25)', 'transparent'],
    spotlightBeam: ['rgba(214, 91, 255, 0.35)', 'rgba(139, 61, 255, 0.05)', 'transparent'],
  },
} as const;

export type ColorToken = keyof typeof colors;
