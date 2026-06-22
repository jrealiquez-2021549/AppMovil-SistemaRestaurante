import { StyleSheet } from 'react-native';
export const colors = {
  bg:          '#111111',  
  cardSurface: '#1C1C1C',   
  chipSurface: '#232323',   

  inkDark:  '#FFFFFF',      
  inkMid:   '#F0F0F0',       
  muted:    '#888888',       

  accent:     '#F97316',
  accentDark: '#EA6A0A',
  accentTint: '#2D1A0A',    

  tagBg:     '#242424',
  tagText:   '#CCCCCC',
  tagBorder: 'rgba(255,255,255,0.1)',

  newBg:   '#2D1A0A',
  newText: '#F97316',

  priceColor: '#F97316',

  dotLit: '#F97316',
  dotOut: 'rgba(255,255,255,0.15)',

  border:    'rgba(255,255,255,0.07)',
  borderMid: 'rgba(255,255,255,0.12)',

  danger:  '#EF4444',
  success: '#22C55E',

  overlayTop:    'rgba(0,0,0,0)',
  overlayMid:    'rgba(0,0,0,0.55)',
  overlayBottom: 'rgba(0,0,0,0.88)',

  inkCoffee:      '#111111',
  cream:          '#FFFFFF',
  terracotta:     '#F97316',
  terracottaDark: '#EA6A0A',
  leather:        '#AAAAAA',
  surface:        '#111111',
  gold:           '#F97316',
  goldLight:      '#2D1A0A',
  goldDark:       '#EA6A0A',
  candleLit:      '#F97316',
  candleOut:      'rgba(255,255,255,0.15)',
  borderOnDark:   'rgba(255,255,255,0.12)',
};

export const fonts = {
  display:      'Fraunces_600SemiBold',
  displayItalic:'Fraunces_500Medium_Italic',
  body:         'Inter_400Regular',
  bodyMedium:   'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  label:        'Inter_700Bold',
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
    shadowColor:   '#F97316',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius:  8,
    elevation:     4,
  },
  chip: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius:  3,
    elevation:     2,
  },
};

export const FEATURE_MAP = {
  hasDelivery:           { label: 'Delivery',       icon: '🛵' },
  hasTakeout:            { label: 'Para llevar',    icon: '🥡' },
  acceptsReservations:   { label: 'Reservaciones',  icon: '📅' },
  hasParking:            { label: 'Parqueo',        icon: '🅿️' },
  hasOutdoorSeating:     { label: 'Terraza',        icon: '🌿' },
  hasWifi:               { label: 'Wifi',           icon: '📶' },
  isWheelchairAccessible:{ label: 'Accesible',      icon: '♿' },
  allowsPets:            { label: 'Mascotas',       icon: '🐾' },
  hasLiveMusic:          { label: 'Música en vivo', icon: '🎵' },
  hasAirConditioning:    { label: 'A/C',            icon: '❄️' },
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
    height:          112,
    backgroundColor: colors.cardSurface,
    borderRadius:    radii.lg,
    overflow:        'hidden',
    borderWidth:     0.5,
    borderColor:     colors.border,
  },

  imageWrap: {
    width:           112,
    flexShrink:      0,
    backgroundColor: '#0A0A0A',
    position:        'relative',
  },
  catBadge: {
    position:          'absolute',
    top:               8,
    left:              8,
    backgroundColor:   'rgba(0,0,0,0.75)',
    paddingVertical:   3,
    paddingHorizontal: 8,
    borderRadius:      radii.pill,
    borderWidth:       0.5,
    borderColor:       'rgba(249,115,22,0.4)',
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
    backgroundColor: colors.tagBg,
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
    color:         colors.muted,
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
    paddingTop:        spacing.sm,
    paddingBottom:     spacing.md,
  },
  eyebrow: {
    fontFamily:    fonts.label,
    fontSize:      11,
    letterSpacing: 1,
    color:         colors.accent,
    marginBottom:  4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.display,
    fontSize:   24,
    color:      colors.inkDark,
  },

  chipRow: {
    paddingHorizontal: spacing.lg,
    gap:               spacing.sm,
    paddingBottom:     spacing.sm,
  },
  chipScroll: {
    marginBottom: spacing.xs,
  },

  list: {
    paddingHorizontal: spacing.lg,
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
    color:        colors.inkDark,
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