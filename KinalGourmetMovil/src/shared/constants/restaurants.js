import { StyleSheet } from "react-native";
export const colors = {
  inkCoffee:   '#1A1410', 
  cream:       '#FAF6F0', 
  cardSurface: '#FFFFFF',

  terracotta:    '#C9622A', 
  terracottaDark:'#A84E1E',
  olive:         '#2E3B2F', 
  gold:          '#D4A24C', 
  leather:       '#6B4226', 

  candleLit:   '#F2B33D', 
  candleOut:   'rgba(255,255,255,0.28)', 
  success:     '#3E7B4F',
  danger:      '#B23B3B',
  overlayTop:    'rgba(26,20,16,0)',
  overlayBottom: 'rgba(33,18,8,0.92)',
  overlayMid:    'rgba(60,30,14,0.55)',

  border:      'rgba(26,20,16,0.08)',
  borderOnDark:'rgba(255,255,255,0.18)',
};

export const fonts = {
  display: 'Fraunces_600SemiBold', 
  displayItalic: 'Fraunces_500Medium_Italic',
  body:    'Inter_400Regular', 
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  label:   'Inter_700Bold', 
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const shadow = {
  card: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  chip: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    fontFamily: fonts.label,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.terracotta,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.inkCoffee,
  },

  chipRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },

  grid: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  gridRow: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontFamily: fonts.body,
    color: colors.danger,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.inkCoffee,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.leather,
    textAlign: 'center',
  },
});