// Paleta de colores Kinal Gourmet — tono naranja/gastronómico
export const COLORS = {
  // Marca principal
  primary:      '#EA580C', // orange-600
  primaryDark:  '#C2410C', // orange-700
  primaryLight: '#FED7AA', // orange-200
  primaryBg:    '#FFF7ED', // orange-50

  // Secundarios
  accent:       '#F97316', // orange-500
  accentDark:   '#92400E', // orange-900 (dark overlay)

  // Semánticos
  success:      '#16A34A',
  successLight: '#DCFCE7',
  danger:       '#DC2626',
  dangerLight:  '#FEE2E2',
  warning:      '#D97706',
  warningLight: '#FEF3C7',

  // Neutros
  white:   '#FFFFFF',
  black:   '#111827',
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Fondo de pantallas oscuras (auth)
  darkBg:      '#1C0A00',
  darkBgMid:   '#2D1000',
  darkBgLight: '#3D1800',
};

export const FONTS = {
  regular: 'System',
  medium:  'System',
  bold:    'System',
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  orange: {
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
};
