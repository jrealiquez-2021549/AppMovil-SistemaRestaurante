import { StyleSheet } from 'react-native';

export const colors = {
  bg:          '#FFFFFF',
  cardSurface: '#FFFFFF',
  chipSurface: '#F5F5F5',

  inkDark:  '#111111',
  inkMid:   '#222222',
  muted:    '#888888',

  accent:     '#F97316',
  accentDark: '#EA6A0A',
  accentTint: '#FFF4ED',

  tagBg:     '#F5F5F5',
  tagText:   '#444444',
  tagBorder: 'rgba(0,0,0,0.08)',

  newBg:   '#FFF4ED',
  newText: '#F97316',

  priceColor: '#F97316',

  dotLit: '#F97316',
  dotOut: 'rgba(0,0,0,0.12)',

  border:    'rgba(0,0,0,0.08)',
  borderMid: 'rgba(0,0,0,0.12)',

  danger:  '#EF4444',
  success: '#22C55E',

  overlayTop:    'rgba(0,0,0,0)',
  overlayMid:    'rgba(0,0,0,0.45)',
  overlayBottom: 'rgba(0,0,0,0.75)',

  inkCoffee:      '#FFFFFF',
  cream:          '#111111',
  terracotta:     '#F97316',
  terracottaDark: '#EA6A0A',
  leather:        '#888888',
  surface:        '#FFFFFF',
  gold:           '#F97316',
  goldLight:      '#FFF4ED',
  goldDark:       '#EA6A0A',
  candleLit:      '#F97316',
  candleOut:      'rgba(0,0,0,0.12)',
  borderOnDark:   'rgba(0,0,0,0.12)',
};

export const fonts = {
  display:       'Fraunces_600SemiBold',
  displayItalic: 'Fraunces_500Medium_Italic',
  body:          'Inter_400Regular',
  bodyMedium:    'Inter_500Medium',
  bodySemiBold:  'Inter_600SemiBold',
  label:         'Inter_700Bold',
};

export const radii = {
  sm:   8,
  md:   12,
  lg:   16,
  pill: 999,
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
};

export const shadow = {
  card: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius:  6,
    elevation:     2,
  },
  chip: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius:  3,
    elevation:     1,
  },
};

export const FEATURE_MAP = {
  hasDelivery:            { label: 'Delivery',       icon: '🛵' },
  hasTakeout:             { label: 'Para llevar',    icon: '🥡' },
  acceptsReservations:    { label: 'Reservaciones',  icon: '📅' },
  hasParking:             { label: 'Parqueo',        icon: '🅿️' },
  hasOutdoorSeating:      { label: 'Terraza',        icon: '🌿' },
  hasWifi:                { label: 'Wifi',           icon: '📶' },
  isWheelchairAccessible: { label: 'Accesible',      icon: '♿' },
  allowsPets:             { label: 'Mascotas',       icon: '🐾' },
  hasLiveMusic:           { label: 'Música en vivo', icon: '🎵' },
  hasAirConditioning:     { label: 'A/C',            icon: '❄️' },
};

export const FEATURE_CHIPS = [
  { key: 'hasDelivery',         label: 'Delivery',      icon: '🛵' },
  { key: 'acceptsReservations', label: 'Reservaciones', icon: '📅' },
  { key: 'hasWifi',             label: 'Wifi',          icon: '📶' },
  { key: 'hasParking',          label: 'Parqueo',       icon: '🅿️' },
  { key: 'hasOutdoorSeating',   label: 'Terraza',       icon: '🌿' },
];

export const cardStyles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    backgroundColor: colors.cardSurface,
    borderRadius:    radii.lg,
    overflow:        'hidden',
    borderWidth:     0.5,
    borderColor:     colors.border,
  },

  imageWrap: {
    flexShrink:      0,
    backgroundColor: '#E5E5E5',
    position:        'relative',
  },
  catBadge: {
    position:          'absolute',
    top:               8,
    left:              8,
    backgroundColor:   'rgba(0,0,0,0.55)',
    paddingVertical:   3,
    paddingHorizontal: 8,
    borderRadius:      radii.pill,
    borderWidth:       0.5,
    borderColor:       'rgba(249,115,22,0.5)',
  },
  catBadgeText: {
    fontFamily:    fonts.label,
    fontSize:      9,
    letterSpacing: 0.4,
    color:         '#F97316',
  },

  body: {
    flex:              1,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.md,
    justifyContent:    'space-between',
    minWidth:          0,
  },
  bodyTop: {
    gap: 2,
  },

  newBadge: {
    alignSelf:         'flex-start',
    backgroundColor:   colors.newBg,
    paddingVertical:   2,
    paddingHorizontal: 8,
    borderRadius:      radii.pill,
    marginBottom:      3,
    borderWidth:       0.5,
    borderColor:       'rgba(249,115,22,0.3)',
  },
  newBadgeText: {
    fontFamily:    fonts.label,
    fontSize:      9,
    letterSpacing: 0.5,
    color:         colors.newText,
  },

  name: {
    fontFamily: fonts.display,
    fontSize:   15,
    color:      colors.inkMid,
  },
  address: {
    fontFamily: fonts.body,
    fontSize:   11,
    color:      colors.muted,
  },

  bodyBottom: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontFamily:    fonts.body,
    fontSize:      9,
    color:         colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  price: {
    fontFamily: fonts.display,
    fontSize:   18,
    color:      colors.accent,
  },

  rightInfo: {
    alignItems: 'flex-end',
  },
  tagRow: {
    flexDirection:  'row',
    gap:            4,
    flexWrap:       'wrap',
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor:   colors.tagBg,
    paddingVertical:   3,
    paddingHorizontal: 7,
    borderRadius:      radii.pill,
    borderWidth:       0.5,
    borderColor:       colors.tagBorder,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize:   10,
    color:      colors.tagText,
  },

  dotRow: {
    flexDirection: 'row',
    gap:           3,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  availLabel: {
    fontFamily: fonts.body,
    fontSize:   9,
    color:      colors.muted,
    marginTop:  3,
  },
  availWrap: {
    alignItems: 'flex-end',
  },
});

export const chipStyles = StyleSheet.create({
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    paddingVertical:   7,
    paddingHorizontal: 13,
    borderRadius:      radii.pill,
    backgroundColor:   colors.chipSurface,
    borderWidth:       0.5,
    borderColor:       colors.borderMid,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor:     colors.accent,
  },
  chipPressed: {
    opacity: 0.75,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontFamily:    fonts.label,
    fontSize:      11,
    letterSpacing: 0.5,
    color:         '#666666',
    textTransform: 'uppercase',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});

export const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.bg,
  },

  header: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.lg,
    paddingBottom:     spacing.md,
    backgroundColor:  '#FFFFFF',
  },
  title: {
    fontFamily: fonts.display,
    fontSize:   26,
    color:      '#111111',
    lineHeight: 32,
  },
  titleSmall: {
    fontSize:   22,
    lineHeight: 28,
  },
  titleAccent: {
    fontFamily: fonts.displayItalic,
    color:      colors.accent,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize:   13,
    color:      '#888888',
    marginTop:  4,
  },

  chipRow: {
    paddingHorizontal: spacing.md,
    gap:               6,
    paddingBottom:     spacing.sm,
  },
  chipScroll: {
    marginBottom: spacing.xs,
  },

  list: {
    paddingHorizontal: spacing.md,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.xxl,
    gap:               spacing.sm,
  },

  grid:    {},
  gridRow: {},

  centerFill: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: spacing.xl,
    gap:               spacing.sm,
  },
  errorText: {
    fontFamily: fonts.body,
    color:      colors.danger,
    textAlign:  'center',
    fontSize:   14,
  },
  emptyIcon: {
    fontSize:     32,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily:   fonts.display,
    fontSize:     18,
    color:        '#111111',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize:   13,
    color:      colors.muted,
    textAlign:  'center',
  },
  resultCount: {
    fontFamily:        fonts.body,
    fontSize:          12,
    color:             colors.muted,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.xs,
  },
});

export const authStyles = StyleSheet.create({
  loginButton: {
    marginTop:         spacing.lg,
    backgroundColor:   colors.accent,
    paddingVertical:   12,
    paddingHorizontal: 24,
    borderRadius:      radii.pill,
  },
  loginButtonText: {
    fontFamily:    fonts.label,
    fontSize:      12,
    letterSpacing: 0.6,
    color:         '#FFFFFF',
  },
});