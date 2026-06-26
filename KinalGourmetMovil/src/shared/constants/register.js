export const { width, height } = Dimensions.get('window');

export const isSmall  = height < 668;
export const isMedium = height < 812;

export const GK = {
  bg:          '#1C0A00',
  bgMid:       '#2D1000',
  bgLight:     '#3D1800',
  orange:      '#EA580C',
  orangeLight: '#F97316',
  white:       '#FFFFFF',
  gray:        'rgba(255,255,255,0.5)',
  grayLight:   'rgba(255,255,255,0.15)',
  success:     '#86EFAC',
  successBg:   'rgba(22,163,74,0.15)',
  error:       '#FCA5A5',
  errorBg:     'rgba(220,38,38,0.15)',
};

export const fs = {
  brandName:    isSmall ? 15 : isMedium ? 18 : 20,
  tagline:      isSmall ? 11 : 12,
  cardTitle:    isSmall ? 20 : isMedium ? 23 : 26,
  cardSub:      isSmall ? 12 : 14,
  back:         isSmall ? 13 : 14,
  btn:          isSmall ? 12 : 14,
  verify:       isSmall ? 11 : 12,
  footer:       isSmall ? 13 : 14,
  successEmoji: isSmall ? 40 : 52,
  successTitle: isSmall ? 22 : 26,
  successBody:  isSmall ? 13 : 14,
};

export const sp = {
  paddingTop:   isSmall ? 28 : isMedium ? 38 : 48,
  logoSize:     isSmall ? 56 : isMedium ? 64 : 70,
  logoEmoji:    isSmall ? 22 : isMedium ? 26 : 30,
  logoMargin:   isSmall ? 8 : 12,
  headerBottom: isSmall ? 16 : isMedium ? 22 : 28,
  cardPadding:  isSmall ? 14 : SPACING.lg,
  backBottom:   isSmall ? 16 : 24,
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
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    backgroundColor: 'rgba(234,88,12,0.1)',
    top: -width * 0.15,
    left: -width * 0.15,
  },
  blob2: {
    position: 'absolute',
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    backgroundColor: 'rgba(234,88,12,0.06)',
    bottom: 60,
    right: -width * 0.1,
  },

  // Volver
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: sp.backBottom,
    paddingVertical: 4,
  },
  backText: {
    color: GK.orangeLight,
    fontSize: fs.back,
    fontWeight: '600',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: sp.headerBottom,
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
    marginBottom: isSmall ? 10 : SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: GK.grayLight,
    marginBottom: isSmall ? 10 : SPACING.lg,
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
  errorIcon:  { fontSize: isSmall ? 14 : 18, marginTop: 1 },
  errorTitle: { fontSize: isSmall ? 11 : 13, fontWeight: '700', color: GK.error, marginBottom: 2 },
  errorBody:  { fontSize: isSmall ? 10 : 12, color: GK.gray, lineHeight: 18 },

  // Botón primario
  btnPrimary: {
    backgroundColor: GK.white,
    borderRadius: BORDER_RADIUS.xxl,
    marginBottom: isSmall ? 10 : SPACING.md,
    minHeight: 48,
  },
  btnPrimaryText: {
    color: GK.bg,
    fontSize: fs.btn,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Nota verificación
  verifyNote: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.lg,
    padding: isSmall ? 8 : SPACING.sm,
    borderWidth: 1,
    borderColor: GK.grayLight,
  },
  verifyNoteText: {
    fontSize: fs.verify,
    color: GK.gray,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  footerText: { fontSize: fs.footer, color: GK.gray },
  footerLink: { fontSize: fs.footer, color: GK.orangeLight, fontWeight: '700' },

  // Éxito
  successBox: {
    backgroundColor: GK.bgMid,
    borderRadius: 20,
    padding: isSmall ? SPACING.lg : SPACING.xl,
    borderWidth: 1,
    borderColor: GK.grayLight,
    alignItems: 'center',
  },
  successEmoji: { fontSize: fs.successEmoji, marginBottom: SPACING.md },
  successTitle: {
    fontSize: fs.successTitle,
    fontWeight: '800',
    color: GK.white,
    marginBottom: SPACING.sm,
  },
  successBody: {
    fontSize: fs.successBody,
    color: GK.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});