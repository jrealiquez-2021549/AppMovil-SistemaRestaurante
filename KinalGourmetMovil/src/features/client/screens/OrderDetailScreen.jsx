import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useOrderStore } from '../../../shared/store/useOrderStore';
import AppHeader from '../../../shared/components/AppHeader';

const ORANGE = '#E8650A';
const DARK = '#1A1A1A';
const CREAM = '#F5F3EF';
const MUTED = '#8A8680';
const WHITE = '#FFFFFF';
const RED = '#EF4444';
const GREEN = '#16A34A';

const STATUS_STEPS = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREPARACION',
  'LISTO',
  'EN_CAMINO',
  'ENTREGADO',
];

const STEP_LABELS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREPARACION: 'Preparando',
  LISTO: 'Listo',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
};

function DishRow({ detail }) {
  const name = detail.dish?.name ?? detail.dishName ?? 'Platillo';
  const unit = Number(detail.unitPrice ?? 0).toFixed(2);
  const subtotal = Number(
    detail.subtotal ?? (detail.quantity * (detail.unitPrice ?? 0))
  ).toFixed(2);

  return (
    <View style={d.row}>
      <View style={d.badge}>
        <Text style={d.badgeText}>{detail.quantity}</Text>
      </View>
      <View style={d.info}>
        <Text style={d.name} numberOfLines={2}>{name}</Text>
        <Text style={d.unit}>Q{unit} c/u</Text>
        {detail.specialInstructions ? (
          <Text style={d.note}>📝 {detail.specialInstructions}</Text>
        ) : null}
      </View>
      <Text style={d.subtotal}>Q{subtotal}</Text>
    </View>
  );
}

const d = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  badge: { width: 36, height: 36, borderRadius: 12, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 13, fontWeight: '900', color: WHITE },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: '800', color: DARK, letterSpacing: -0.2 },
  unit: { fontSize: 10, fontWeight: '700', color: MUTED, marginTop: 2 },
  note: { fontSize: 10, fontWeight: '600', color: MUTED, marginTop: 2, fontStyle: 'italic' },
  subtotal: { fontSize: 14, fontWeight: '900', color: DARK },
});

function InfoRow({ icon, label, value }) {
  return (
    <View style={ir.row}>
      <View style={ir.iconWrap}>
        <Feather name={icon} size={14} color={ORANGE} />
      </View>
      <View style={ir.texts}>
        <Text style={ir.label}>{label}</Text>
        <Text style={ir.value}>{value}</Text>
      </View>
    </View>
  );
}

const ir = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  iconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF4ED', alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
  label: { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  value: { fontSize: 13, fontWeight: '700', color: DARK },
});

function CancelModal({ visible, loading, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={mc.overlay} onPress={onCancel}>
        <Pressable onPress={() => { }}>
          <View style={mc.box}>
            <View style={mc.iconWrap}>
              <Text style={{ fontSize: 32 }}>⚠️</Text>
            </View>
            <Text style={mc.title}>¿Detener pedido?</Text>
            <Text style={mc.sub}>
              Si cancelas ahora, tu comida no llegará y el restaurante será notificado.
            </Text>
            <View style={mc.actions}>
              <TouchableOpacity style={mc.keepBtn} onPress={onCancel} activeOpacity={0.8}>
                <Text style={mc.keepText}>Mantener</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[mc.yesBtn, loading && { opacity: 0.6 }]}
                onPress={onConfirm}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator size="small" color={WHITE} />
                  : <Text style={mc.yesText}>Sí, cancelar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const mc = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  box: { backgroundColor: WHITE, borderRadius: 28, padding: 28, width: '100%', maxWidth: 360, gap: 12 },
  iconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: DARK, letterSpacing: -0.4 },
  sub: { fontSize: 12, color: MUTED, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  keepBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center' },
  keepText: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4 },
  yesBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: RED, alignItems: 'center' },
  yesText: { fontSize: 10, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.4 },
});

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;

  const {
    selectedOrder, loading, error,
    fetchOrderById, clearSelectedOrder, cancelOrder,
    getStatusLabel, getStatusColors, getStatusIcon, getOrderTypeLabel,
    clearError,
  } = useOrderStore();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderById(orderId);
    return () => clearSelectedOrder();
  }, [orderId]);

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      await cancelOrder(orderId);
      setShowCancelModal(false);
    } catch (_) {
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <View style={s.screen}>
        <AppHeader navigation={navigation} />
        <View style={s.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={s.loadingText}>Rastreando pedido...</Text>
        </View>
      </View>
    );
  }

  if (error || !selectedOrder) {
    return (
      <View style={s.screen}>
        <AppHeader navigation={navigation} />
        <View style={s.center}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>😕</Text>
          <Text style={s.errorTitle}>No se pudo cargar el pedido</Text>
          {error && <Text style={s.errorSub}>{error}</Text>}
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => { clearError(); navigation.goBack(); }}
          >
            <Text style={s.backBtnText}>Volver a mis pedidos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const order = selectedOrder;
  const colors = getStatusColors(order.status);
  const isCancelled = order.status === 'CANCELADO';
  const canCancel = order.status === 'PENDIENTE';

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-GT', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
    : '—';
  const time = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString('es-GT', {
      hour: '2-digit', minute: '2-digit',
    })
    : '';

  const shortId = order._id?.slice(-6).toUpperCase() ?? '—';

  const details = order.details ?? [];
  const subtotal = details.reduce(
    (acc, item) => acc + Number(item.subtotal ?? item.quantity * (item.unitPrice ?? 0)),
    0
  );
  const discount = Number(order.discount ?? 0);
  const deliveryFee = Number(order.deliveryFee ?? 0);
  const total = Number(order.totalPrice ?? 0);

  return (
    <View style={s.screen}>
      <AppHeader navigation={navigation} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.hero}>
          {/* Botón volver */}
          <TouchableOpacity style={s.backCircle} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Feather name="arrow-left" size={18} color={WHITE} />
          </TouchableOpacity>

          <View style={s.heroMeta}>
            <View style={[s.statusBadge, { backgroundColor: colors.bg }]}>
              <Text style={s.statusIcon}>{getStatusIcon(order.status)}</Text>
              <Text style={[s.statusLabel, { color: colors.text }]}>
                {getStatusLabel(order.status)}
              </Text>
            </View>
            <Text style={s.shortId}>ID #{shortId}</Text>
          </View>

          <Text style={s.heroTitle}>
            Detalle del <Text style={s.heroAccent}>Pedido.</Text>
          </Text>
          <Text style={s.heroDate}>{date} · {time}</Text>
        </View>

        {!isCancelled && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Estado del rastreo</Text>
            <View style={tl.container}>
              {/* Línea de fondo */}
              <View style={tl.lineBack} />
              {currentStepIndex >= 0 && (
                <View
                  style={[
                    tl.lineFront,
                    {
                      width: currentStepIndex === 0
                        ? '0%'
                        : `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                    },
                  ]}
                />
              )}

              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <View key={step} style={tl.step}>
                    <View style={[
                      tl.dot,
                      isDone && tl.dotDone,
                      isCurrent && tl.dotCurrent,
                    ]}>
                      {isDone
                        ? <Text style={tl.dotText}>{isCurrent ? getStatusIcon(step) : '✓'}</Text>
                        : <Text style={tl.dotTextMuted}>{i + 1}</Text>
                      }
                    </View>
                    <Text style={[tl.label, isDone && tl.labelDone]} numberOfLines={2}>
                      {STEP_LABELS[step]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>Tu orden ({details.length} platillo{details.length !== 1 ? 's' : ''})</Text>
          {details.map((item, i) => (
            <DishRow key={i} detail={item} />
          ))}
        </View>

        <View style={s.sectionDark}>
          <Text style={s.sectionTitleLight}>Resumen de pago</Text>

          <View style={s.payRow}>
            <Text style={s.payLabel}>Subtotal</Text>
            <Text style={s.payValue}>Q{subtotal.toFixed(2)}</Text>
          </View>

          {deliveryFee > 0 && (
            <View style={s.payRow}>
              <Text style={s.payLabel}>Envío</Text>
              <Text style={s.payValue}>Q{deliveryFee.toFixed(2)}</Text>
            </View>
          )}

          {discount > 0 && (
            <View style={s.payRow}>
              <Text style={[s.payLabel, { color: '#4ADE80' }]}>Descuento</Text>
              <Text style={[s.payValue, { color: '#4ADE80' }]}>−Q{discount.toFixed(2)}</Text>
            </View>
          )}

          <View style={s.payDivider} />

          <View style={s.payTotalRow}>
            <Text style={s.payTotalLabel}>Total Final</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
              <Text style={s.payTotalQ}>Q</Text>
              <Text style={s.payTotalAmount}>{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Información del pedido</Text>

          <InfoRow
            icon="home"
            label="Restaurante"
            value={order.restaurant?.name ?? '—'}
          />
          <InfoRow
            icon="package"
            label="Tipo de entrega"
            value={getOrderTypeLabel(order.orderType)}
          />
          {order.orderType === 'DOMICILIO' && order.deliveryAddress?.street && (
            <InfoRow
              icon="map-pin"
              label="Dirección"
              value={[
                order.deliveryAddress.street,
                order.deliveryAddress.zone,
                order.deliveryAddress.city,
              ].filter(Boolean).join(', ')}
            />
          )}
          {order.orderType === 'DOMICILIO' && order.deliveryPhone && (
            <InfoRow icon="phone" label="Teléfono de entrega" value={order.deliveryPhone} />
          )}
          {order.notes && (
            <InfoRow icon="file-text" label="Nota del cliente" value={order.notes} />
          )}
        </View>

        {order.statusHistory?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Historial de estados</Text>
            {order.statusHistory.map((h, i) => {
              const c = getStatusColors(h.status);
              const hDate = h.timestamp
                ? new Date(h.timestamp).toLocaleString('es-GT', {
                  day: '2-digit', month: 'short',
                  hour: '2-digit', minute: '2-digit',
                })
                : '';
              return (
                <View key={i} style={sh.row}>
                  <View style={[sh.dot, { backgroundColor: c.text }]} />
                  <View style={sh.info}>
                    <Text style={[sh.status, { color: c.text }]}>
                      {getStatusIcon(h.status)} {getStatusLabel(h.status)}
                    </Text>
                    {hDate ? <Text style={sh.date}>{hDate}</Text> : null}
                    {h.notes ? <Text style={sh.note}>{h.notes}</Text> : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {canCancel && (
          <TouchableOpacity
            style={s.cancelBigBtn}
            onPress={() => setShowCancelModal(true)}
            activeOpacity={0.85}
          >
            <Feather name="x-circle" size={16} color={RED} />
            <Text style={s.cancelBigText}>Cancelar este pedido</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={s.goBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Feather name="arrow-left" size={14} color={WHITE} />
          <Text style={s.goBackBtnText}>Volver a mis pedidos</Text>
        </TouchableOpacity>

      </ScrollView>

      <CancelModal
        visible={showCancelModal}
        loading={cancelling}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}

const sh = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  info: { flex: 1 },
  status: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  date: { fontSize: 10, color: MUTED, fontWeight: '600', marginTop: 2 },
  note: { fontSize: 10, color: MUTED, fontStyle: 'italic', marginTop: 2 },
});

const tl = StyleSheet.create({
  container: { position: 'relative', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 4 },
  lineBack: { position: 'absolute', top: 18, left: 0, right: 0, height: 3, backgroundColor: '#F3F4F6', zIndex: 0 },
  lineFront: { position: 'absolute', top: 18, left: 0, height: 3, backgroundColor: DARK, zIndex: 1 },
  step: { alignItems: 'center', flex: 1, zIndex: 2 },
  dot: { width: 36, height: 36, borderRadius: 10, borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: DARK, borderColor: DARK },
  dotCurrent: { backgroundColor: ORANGE, borderColor: ORANGE, transform: [{ scale: 1.2 }] },
  dotText: { fontSize: 12, fontWeight: '900', color: WHITE },
  dotTextMuted: { fontSize: 11, fontWeight: '900', color: '#D1D5DB' },
  label: { marginTop: 8, fontSize: 8, fontWeight: '700', color: MUTED, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.2, maxWidth: 50 },
  labelDone: { color: DARK, fontWeight: '900' },
});

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  loadingText: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  errorTitle: { fontSize: 18, fontWeight: '900', color: DARK, textAlign: 'center' },
  errorSub: { fontSize: 12, color: MUTED, textAlign: 'center', lineHeight: 18 },
  backBtn: { backgroundColor: DARK, borderRadius: 16, paddingHorizontal: 28, paddingVertical: 14, marginTop: 12 },
  backBtnText: { fontSize: 11, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },

  hero: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 8,
  },
  backCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 12, paddingVertical: 7, paddingHorizontal: 12 },
  statusIcon: { fontSize: 14 },
  statusLabel: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  shortId: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: WHITE, letterSpacing: -0.8, lineHeight: 32 },
  heroAccent: { color: ORANGE },
  heroDate: { fontSize: 11, fontWeight: '600', color: MUTED, fontStyle: 'italic' },

  section: { backgroundColor: WHITE, marginHorizontal: 16, marginTop: 16, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },

  sectionDark: { backgroundColor: DARK, marginHorizontal: 16, marginTop: 16, borderRadius: 24, padding: 20 },
  sectionTitleLight: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, textAlign: 'center' },

  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  payLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 },
  payValue: { fontSize: 12, fontWeight: '700', color: WHITE },
  payDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 10 },
  payTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 4 },
  payTotalLabel: { fontSize: 10, fontWeight: '900', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.5 },
  payTotalQ: { fontSize: 16, fontWeight: '900', color: WHITE },
  payTotalAmount: { fontSize: 34, fontWeight: '900', color: WHITE, letterSpacing: -1, lineHeight: 38 },

  cancelBigBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 16, borderRadius: 20, paddingVertical: 16, borderWidth: 2, borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  cancelBigText: { fontSize: 11, fontWeight: '900', color: RED, textTransform: 'uppercase', letterSpacing: 0.5 },

  goBackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: DARK, marginHorizontal: 16, marginTop: 12, borderRadius: 20, paddingVertical: 16 },
  goBackBtnText: { fontSize: 11, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});