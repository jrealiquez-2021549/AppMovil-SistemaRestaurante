import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useOrderStore } from '../../../shared/store/useOrderStore';
import AppHeader from '../../../shared/components/AppHeader';

const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';
const WHITE  = '#FFFFFF';
const RED    = '#EF4444';

/* ── Filtros de estado ───────────────────────────────────────── */
const STATUS_FILTERS = [
  { value: 'TODOS',          label: 'Todos',      icon: 'list'       },
  { value: 'PENDIENTE',      label: 'Pendientes', icon: 'clock'      },
  { value: 'EN_PREPARACION', label: 'Preparando', icon: 'zap'        },
  { value: 'LISTO',          label: 'Listos',     icon: 'check'      },
  { value: 'EN_CAMINO',      label: 'En camino',  icon: 'navigation' },
  { value: 'ENTREGADO',      label: 'Entregados', icon: 'check-circle'},
  { value: 'CANCELADO',      label: 'Cancelados', icon: 'x-circle'   },
];

/* ── Tarjeta de pedido ───────────────────────────────────────── */
function OrderCard({
  order, getStatusLabel, getStatusColors, getStatusIcon,
  getOrderTypeLabel, onCancel, onPress,
}) {
  const colors    = getStatusColors(order.status);
  const canCancel = order.status === 'PENDIENTE';
  const date      = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-GT', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—';

  const visibleItems = order.details?.slice(0, 2) ?? [];
  const extra        = (order.details?.length ?? 0) - 2;

  return (
    <TouchableOpacity style={oc.card} onPress={onPress} activeOpacity={0.88}>

      {/* Barra de color por estado */}
      <View style={[oc.statusBar, { backgroundColor: colors.bg }]} />

      <View style={oc.inner}>
        {/* Cabecera */}
        <View style={oc.head}>
          <View style={oc.headLeft}>
            <Text style={oc.orderType}>{getOrderTypeLabel(order.orderType)}</Text>
            <Text style={oc.restaurantName} numberOfLines={1}>
              {order.restaurant?.name ?? 'Restaurante'}
            </Text>
            <View style={oc.dateRow}>
              <Feather name="calendar" size={10} color={MUTED} />
              <Text style={oc.date}>{date}</Text>
            </View>
          </View>

          <View style={[oc.statusPill, { backgroundColor: colors.bg }]}>
            <Text style={oc.statusEmoji}>{getStatusIcon(order.status)}</Text>
            <Text style={[oc.statusLabel, { color: colors.text }]}>
              {getStatusLabel(order.status)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={oc.divider} />

        {/* Platillos */}
        <View style={oc.items}>
          {visibleItems.map((d, i) => (
            <View key={i} style={oc.itemRow}>
              <View style={oc.qtyBadge}>
                <Text style={oc.itemQty}>{d.quantity}</Text>
              </View>
              <Text style={oc.itemName} numberOfLines={1}>
                {d.dish?.name ?? d.dishName ?? 'Platillo'}
              </Text>
            </View>
          ))}
          {extra > 0 && (
            <Text style={oc.itemExtra}>
              +{extra} más en este pedido
            </Text>
          )}
        </View>

        {/* Pie */}
        <View style={oc.foot}>
          <View>
            <Text style={oc.totalLabel}>Total</Text>
            <Text style={oc.totalAmount}>Q{Number(order.totalPrice).toFixed(2)}</Text>
          </View>

          <View style={oc.footActions}>
            {canCancel && (
              <TouchableOpacity
                style={oc.cancelBtn}
                onPress={(e) => { e.stopPropagation?.(); onCancel(order._id); }}
                activeOpacity={0.8}
              >
                <Feather name="x" size={12} color={RED} />
                <Text style={oc.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            )}
            <View style={oc.arrowBtn}>
              <Feather name="arrow-right" size={14} color={WHITE} />
            </View>
          </View>
        </View>
      </View>

    </TouchableOpacity>
  );
}

const oc = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  statusBar: { height: 4, width: '100%' },
  inner:     { padding: 16 },

  /* Head */
  head:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headLeft: { flex: 1, marginRight: 12 },
  orderType: {
    fontSize: 9, fontWeight: '900', color: ORANGE,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3,
  },
  restaurantName: { fontSize: 17, fontWeight: '800', color: DARK, letterSpacing: -0.3, marginBottom: 4 },
  dateRow:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date:     { fontSize: 10, color: MUTED, fontWeight: '600' },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 20, paddingVertical: 6, paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  statusEmoji: { fontSize: 12 },
  statusLabel: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Divider */
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },

  /* Items */
  items:    { gap: 7, marginBottom: 14 },
  itemRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBadge: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: '#FFF0E8', alignItems: 'center', justifyContent: 'center',
  },
  itemQty:   { fontSize: 11, fontWeight: '900', color: ORANGE },
  itemName:  { fontSize: 13, fontWeight: '600', color: DARK, flex: 1 },
  itemExtra: { fontSize: 10, fontWeight: '700', color: MUTED, marginLeft: 36, marginTop: 2 },

  /* Foot */
  foot: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CREAM, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  totalLabel:  { fontSize: 9, fontWeight: '800', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  totalAmount: { fontSize: 20, fontWeight: '900', color: DARK, letterSpacing: -0.5, marginTop: 1 },
  footActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1.5, borderColor: '#FECACA', borderRadius: 12,
    paddingVertical: 7, paddingHorizontal: 12, backgroundColor: '#FEF2F2',
  },
  cancelText: { fontSize: 9, fontWeight: '900', color: RED, textTransform: 'uppercase', letterSpacing: 0.4 },
  arrowBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center',
  },
});

/* ── Modal confirmar cancelación ─────────────────────────────── */
function CancelConfirmModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={cm.overlay} onPress={onCancel}>
        <Pressable onPress={() => {}}>
          <View style={cm.box}>
            <View style={cm.iconWrap}>
              <Feather name="alert-circle" size={28} color={RED} />
            </View>
            <Text style={cm.title}>¿Cancelar pedido?</Text>
            <Text style={cm.sub}>
              Esta acción notificará al restaurante y no podrá revertirse.
            </Text>
            <View style={cm.actions}>
              <TouchableOpacity style={cm.keepBtn} onPress={onCancel} activeOpacity={0.8}>
                <Text style={cm.keepText}>Mantener</Text>
              </TouchableOpacity>
              <TouchableOpacity style={cm.yesBtn} onPress={onConfirm} activeOpacity={0.85}>
                <Text style={cm.yesText}>Sí, cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const cm = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  box: {
    backgroundColor: WHITE, borderRadius: 28, padding: 28,
    width: '100%', maxWidth: 360, gap: 10,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center',
  },
  title:   { fontSize: 20, fontWeight: '900', color: DARK, letterSpacing: -0.4 },
  sub:     { fontSize: 12, color: MUTED, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  keepBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center',
  },
  keepText: { fontSize: 10, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: 0.4 },
  yesBtn:   { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: RED, alignItems: 'center' },
  yesText:  { fontSize: 10, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.4 },
});

/* ═══════════════════════════════════════════════════════════════
   PANTALLA PRINCIPAL
═══════════════════════════════════════════════════════════════ */
export default function MyOrdersScreen({ navigation }) {
  const {
    orders, loading, error,
    fetchOrders, cancelOrder,
    getStatusLabel, getStatusColors, getStatusIcon, getOrderTypeLabel,
    clearError,
  } = useOrderStore();

  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [refreshing,   setRefreshing]   = useState(false);

  useFocusEffect(
    useCallback(() => { fetchOrders(); }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try { await cancelOrder(cancelTarget); } finally { setCancelTarget(null); }
  };

  const filtered = filterStatus === 'TODOS'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  /* Conteo por estado para el badge */
  const countByStatus = (status) =>
    status === 'TODOS'
      ? orders.length
      : orders.filter((o) => o.status === status).length;

  return (
    <View style={s.screen}>
      <AppHeader navigation={navigation} />

      {/* ── HERO compacto ───────────────────────────────────── */}
      <View style={s.hero}>
        <View>
          <Text style={s.heroTitle}>
            Tus <Text style={s.heroAccent}>Pedidos</Text>
          </Text>
          <Text style={s.heroSub}>Toca un pedido para ver sus detalles</Text>
        </View>
        <View style={s.heroCount}>
          <Text style={s.heroCountNum}>{orders.length}</Text>
          <Text style={s.heroCountLabel}>total</Text>
        </View>
      </View>

      {/* ── Filtros de estado ───────────────────────────────── */}
      <View style={s.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersRow}
        >
          {STATUS_FILTERS.map(({ value, label, icon }) => {
            const count  = countByStatus(value);
            const active = filterStatus === value;
            return (
              <TouchableOpacity
                key={value}
                style={[s.filterBtn, active && s.filterBtnActive]}
                onPress={() => setFilterStatus(value)}
                activeOpacity={0.8}
              >
                <Feather name={icon} size={11} color={active ? WHITE : MUTED} />
                <Text style={[s.filterText, active && s.filterTextActive]}>
                  {label}
                </Text>
                {count > 0 && (
                  <View style={[s.filterBadge, active && s.filterBadgeActive]}>
                    <Text style={[s.filterBadgeText, active && s.filterBadgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Error ───────────────────────────────────────────── */}
      {error && (
        <View style={s.errorBanner}>
          <Feather name="alert-circle" size={14} color={RED} />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Feather name="x" size={14} color={RED} />
          </TouchableOpacity>
        </View>
      )}

      {/* ── Contenido ───────────────────────────────────────── */}
      {loading && !refreshing ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={s.loadingText}>Cargando pedidos...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            s.list,
            filtered.length === 0 && s.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={ORANGE}
              colors={[ORANGE]}
            />
          }
        >
          {filtered.length === 0 ? (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Feather name="shopping-bag" size={30} color={MUTED} />
              </View>
              <Text style={s.emptyTitle}>
                {filterStatus === 'TODOS' ? 'Sin pedidos aún' : 'Nada aquí'}
              </Text>
              <Text style={s.emptySub}>
                {filterStatus === 'TODOS'
                  ? 'Cuando hagas tu primer pedido aparecerá aquí.'
                  : 'No hay órdenes con este estado por ahora.'}
              </Text>
              {filterStatus === 'TODOS' && (
                <TouchableOpacity
                  style={s.emptyBtn}
                  onPress={() => navigation.navigate('Inicio')}
                  activeOpacity={0.85}
                >
                  <Feather name="compass" size={14} color={WHITE} />
                  <Text style={s.emptyBtnText}>Explorar menú</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <Text style={s.resultsLabel}>
                {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
              </Text>
              {filtered.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  getStatusLabel={getStatusLabel}
                  getStatusColors={getStatusColors}
                  getStatusIcon={getStatusIcon}
                  getOrderTypeLabel={getOrderTypeLabel}
                  onCancel={setCancelTarget}
                  onPress={() =>
                    navigation.navigate('OrderDetail', { orderId: order._id })
                  }
                />
              ))}
            </>
          )}
        </ScrollView>
      )}

      <CancelConfirmModal
        visible={!!cancelTarget}
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}

/* ── StyleSheet pantalla ─────────────────────────────────────── */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREAM },

  /* Hero */
  hero: {
    backgroundColor: DARK,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitle:  { fontSize: 26, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
  heroAccent: { color: ORANGE, fontStyle: 'italic' },
  heroSub:    { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 },
  heroCount: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10,
  },
  heroCountNum:   { fontSize: 26, fontWeight: '900', color: ORANGE, lineHeight: 28 },
  heroCountLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Filtros */
  filtersWrap: {
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 10,
  },
  filtersRow: { paddingHorizontal: 14, gap: 8, alignItems: 'center' },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#F3F4F6',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  filterBtnActive: { backgroundColor: DARK, borderColor: DARK },
  filterText:      { fontSize: 10, fontWeight: '800', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.3 },
  filterTextActive: { color: WHITE },
  filterBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8, minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  filterBadgeActive:     { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterBadgeText:       { fontSize: 9, fontWeight: '900', color: MUTED },
  filterBadgeTextActive: { color: WHITE },

  /* Error */
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', margin: 14, borderRadius: 14,
    padding: 12, borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { flex: 1, fontSize: 11, fontWeight: '700', color: RED },

  /* Lista */
  list:      { padding: 14, paddingBottom: 36 },
  listEmpty: { flex: 1, justifyContent: 'center' },
  resultsLabel: {
    fontSize: 10, fontWeight: '800', color: MUTED,
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 12, marginLeft: 2,
  },

  /* Loading */
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Empty */
  empty: { alignItems: 'center', gap: 10, paddingVertical: 48 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  emptyTitle: { fontSize: 17, fontWeight: '900', color: DARK, letterSpacing: -0.3 },
  emptySub:   { fontSize: 12, color: MUTED, textAlign: 'center', maxWidth: 220, lineHeight: 18 },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ORANGE, borderRadius: 20,
    paddingHorizontal: 24, paddingVertical: 12, marginTop: 6,
  },
  emptyBtnText: { fontSize: 11, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});