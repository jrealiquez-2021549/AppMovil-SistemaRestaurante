
export const { width, height } = Dimensions.get('window');

export const isSmall  = height < 668;   // SE 1ra gen, Moto G4, etc.
export const isMedium = height < 812;   // iPhone 8, Pixel 3a

export const GK = {
  bg:          '#1C0A00',
  bgMid:       '#2D1000',
  bgLight:     '#3D1800',
  orange:      '#EA580C',
  orangeLight: '#F97316',
  white:       '#FFFFFF',
  gray:        'rgba(255,255,255,0.5)',
  grayLight:   'rgba(255,255,255,0.15)',
  inputBg:     'rgba(255,255,255,0.07)',
  inputBorder: 'rgba(255,255,255,0.15)',
  error:       '#FCA5A5',
  errorBg:     'rgba(220,38,38,0.15)',
};

export const fs = {
  brandName:  isSmall ? 16 : isMedium ? 19 : 22,
  tagline:    isSmall ? 11 : 13,
  cardTitle:  isSmall ? 22 : isMedium ? 25 : 28,
  cardSub:    isSmall ? 12 : 14,
  forgot:     isSmall ? 11 : 13,
  btnText:    isSmall ? 12 : 14,
  trustValue: isSmall ? 13 : isMedium ? 14 : 16,
  trustLabel: isSmall ? 9  : 10,
};

export const sp = {
  paddingTop:   isSmall ? 32 : isMedium ? 44 : 56,
  brandBottom:  isSmall ? 16 : isMedium ? 24 : 32,
  logoSize:     isSmall ? 60 : isMedium ? 70 : 80,
  logoEmoji:    isSmall ? 24 : isMedium ? 28 : 34,
  logoMargin:   isSmall ? 8  : 14,
  cardPadding:  isSmall ? 16 : SPACING.lg,
  inputSpacing: isSmall ? 8  : SPACING.md,
};

export const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GK.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: width < 360 ? 14 : SPACING.lg,
    paddingTop: sp.paddingTop,
    paddingBottom: SPACING.xl,
  },

  // Blobs
  blob1: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(234,88,12,0.12)',
    top: -width * 0.2,
    right: -width * 0.2,
  },
  blob2: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(234,88,12,0.07)',
    bottom: 100,
    left: -width * 0.15,
  },

  // Marca
  brand: {
    alignItems: 'center',
    marginBottom: sp.brandBottom,
  },
  logoRing: {
    width: sp.logoSize,
    height: sp.logoSize,
    borderRadius: sp.logoSize / 2,
    borderWidth: 2,
    borderColor: 'rgba(234,88,12,0.4)',
    backgroundColor: GK.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sp.logoMargin,
  },
  logoEmoji: { fontSize: sp.logoEmoji },
  brandName: {
    fontSize: fs.brandName,
    fontWeight: '800',
    color: GK.white,
    letterSpacing: 4,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: fs.tagline,
    color: GK.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  // Tarjeta
  card: {
    backgroundColor: GK.bgMid,
    borderRadius: 20,
    padding: sp.cardPadding,
    borderWidth: 1,
    borderColor: GK.grayLight,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: fs.cardTitle,
    fontWeight: '800',
    color: GK.white,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: fs.cardSub,
    color: GK.gray,
    marginBottom: sp.inputSpacing,
  },
  divider: {
    height: 1,
    backgroundColor: GK.grayLight,
    marginBottom: sp.inputSpacing,
  },

  // Olvidé contraseña
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: sp.inputSpacing,
  },
  forgotText: {
    fontSize: fs.forgot,
    color: GK.orangeLight,
    fontWeight: '600',
  },

  // Error
  errorBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: GK.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.3)',
    borderRadius: BORDER_RADIUS.lg,
    padding: isSmall ? 10 : SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  errorIcon: { fontSize: 16, marginTop: 1 },
  errorTitle: {
    fontSize: isSmall ? 11 : 13,
    fontWeight: '700',
    color: GK.error,
    marginBottom: 2,
  },
  errorBody: {
    fontSize: isSmall ? 10 : 12,
    color: GK.gray,
    lineHeight: 18,
  },

  // Botón primario
  btnPrimary: {
    backgroundColor: GK.white,
    borderRadius: BORDER_RADIUS.xxl,
    marginBottom: SPACING.sm,
    minHeight: 48,        // área táctil mínima accesible
  },
  btnPrimaryText: {
    color: GK.bg,
    fontSize: fs.btnText,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // OR
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  orLine: { flex: 1, height: 1, backgroundColor: GK.grayLight },
  orText: { color: GK.gray, fontSize: 12, marginHorizontal: SPACING.sm },

  // Botón outline
  btnOutline: {
    borderColor: GK.grayLight,
    borderRadius: BORDER_RADIUS.xxl,
    minHeight: 48,        // área táctil mínima accesible
  },
  btnOutlineText: {
    color: GK.white,
    fontSize: fs.btnText,
    fontWeight: '600',
  },

  // Trust bar
  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: isSmall ? 10 : SPACING.md,
    borderWidth: 1,
    borderColor: GK.grayLight,
  },
  trustItem: { flex: 1, alignItems: 'center' },
  trustValue: { fontSize: fs.trustValue, fontWeight: '800', color: GK.white, marginBottom: 2 },
  trustLabel: { fontSize: fs.trustLabel, color: GK.gray, textAlign: 'center', letterSpacing: 0.3 },
  trustSep:   { width: 1, height: 26, backgroundColor: GK.grayLight },
});