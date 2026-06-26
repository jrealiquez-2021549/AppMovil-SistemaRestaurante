import { Dimensions, StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from './theme';

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
  back:         isSmall ? 13 : 14,
  title:        isSmall ? 24 : isMedium ? 27 : 30,
  subtitle:     isSmall ? 13 : 14,
  btn:          isSmall ? 12 : 14,
  footer:       isSmall ? 13 : 14,
  errorText:    isSmall ? 11 : 13,
  successEmoji: isSmall ? 40 : 52,
  successTitle: isSmall ? 20 : 24,
  successBody:  isSmall ? 13 : 14,
};

export const sp = {
  paddingTop:   isSmall ? 28 : isMedium ? 38 : 48,
  backBottom:   isSmall ? SPACING.lg : SPACING.xl,
  iconSize:     isSmall ? 64 : isMedium ? 72 : 80,
  iconEmoji:    isSmall ? 26 : isMedium ? 30 : 34,
  iconBottom:   isSmall ? SPACING.md : SPACING.lg,
  titleBottom:  isSmall ? SPACING.lg : SPACING.xl,
  cardPadding:  isSmall ? 14 : SPACING.lg,
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

  // Blob
  blob1: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(234,88,12,0.08)',
    top: -width * 0.15,
    right: -width * 0.2,
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

  // Ícono
  iconBox: {
    width: sp.iconSize,
    height: sp.iconSize,
    borderRadius: sp.iconSize / 2,
    borderWidth: 2,
    borderColor: 'rgba(234,88,12,0.35)',
    backgroundColor: GK.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: sp.iconBottom,
  },
  iconEmoji: { fontSize: sp.iconEmoji },

  // Título
  titleBlock: {
    alignItems: 'center',
    marginBottom: sp.titleBottom,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: fs.title,
    fontWeight: '800',
    color: GK.white,
    textAlign: 'center',
    lineHeight: isSmall ? 30 : 36,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: fs.subtitle,
    color: GK.gray,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
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

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GK.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.3)',
    borderRadius: BORDER_RADIUS.lg,
    padding: isSmall ? 10 : SPACING.md,
    marginBottom: SPACING.md,
  },
  errorIcon: { fontSize: isSmall ? 14 : 16 },
  errorText: { flex: 1, fontSize: fs.errorText, color: GK.error, lineHeight: 18 },

  // Botón
  btn: {
    backgroundColor: GK.white,
    borderRadius: BORDER_RADIUS.xxl,
    minHeight: 48,
  },
  btnText: {
    color: GK.bg,
    fontSize: fs.btn,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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