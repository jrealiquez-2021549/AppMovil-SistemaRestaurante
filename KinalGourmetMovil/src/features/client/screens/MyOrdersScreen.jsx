/**
 * MyOrdersScreen — KinalGourmetMovil
 * Lista los pedidos del usuario autenticado con filtros por estado.
 * Conexión provisional: al confirmar en InvoiceModal se navega aquí
 * y se hace fetchOrders() automáticamente.
 *
 * Ruta en ClientTabs: "Mis Pedidos"
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useOrderStore } from '../../../shared/store/useOrderStore';
import AppHeader from '../../../shared/components/AppHeader';

/* ── Tokens ─────────────────────────────────────────────────── */
const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';
const WHITE  = '#FFFFFF';
const RED    = '#EF4444';

/* ── Filtros de estado ───────────────────────────────────────── */
const STATUS_FILTERS = [
  { value: 'TODOS',          label: 'Todos'          },
  { value: 'PENDIENTE',      label: 'Pendientes'     },
  { value: 'EN_PREPARACION', label: 'Preparando'     },
  { value: 'LISTO',          label: 'Listos'         },
  { value: 'EN_CAMINO',      label: 'En camino'      },
  { value: 'ENTREGADO',      label: 'Entregados'     },
  { value: 'CANCELADO',      label: 'Cancelados'     },
];

/* ── Tarjeta de pedido ───────────────────────────────────────── */
function OrderCard({ order, getStatusLabel, getStatusColors, getStatusIcon, getOrderTypeLabel, onCancel }) {
  const colors  = getStatusColors(order.status);
  const canCancel = order.status === 'PENDIENTE';
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const visibleItems = order.details?.slice(0, 2) ?? [];
  const extra        = (order.details?.length ?? 0) - 2;

  return (
    <View style={oc.card}>
      {/* Header de la tarjeta */}
      <View style={oc.cardHead}>
        <View style={oc.cardHeadLeft}>
          <Text style={oc.orderType}>{getOrderTypeLabel(order.orderType)}</Text>
          <Text style={oc.restaurantName} numberOfLines={1}>
            {order.restaurant?.name ?? 'Restaurante'}
          </Text>
          <Text style={oc.date}>{date}</Text>
        </View>

        {/* Badge de estado */}
        <View style={[oc.statusBadge, { backgroundColor: colors.bg }]}>
          <Text style={oc.statusIcon}>{getStatusIcon(order.status)}</Text>
          <Text style={[oc.statusLabel, { color: colors.text }]}>
            {getStatusLabel(order.status)}
          </Text>
        </View>
      </View>

      {/* Items del pedido */}
      <View style={oc.items}>
        {visibleItems.map((d, i) => (
          <View key={i} style={oc.itemRow}>
            <Text style={oc.itemQty}>{d.quantity}x</Text>
            <Text style={oc.itemName} numberOfLines={1}>
              {d.dish?.name ?? d.dishName ?? 'Platillo'}
            </Text>
          </View>
        ))}
        {extra > 0 && (
          <Text style={oc.itemExtra}>+ {extra} producto{extra > 1 ? 's' : ''} más</Text>
        )}
      </View>

      {/* Footer: total + acciones */}
      <View style={oc.cardFoot}>
        <View>
          <Text style={oc.totalLabel}>Total pagado</Text>
          <Text style={oc.totalAmount}>Q{Number(order.totalPrice).toFixed(2)}</Text>
        </View>
        {canCancel && (
          <TouchableOpacity
            style={oc.cancelBtn}
            onPress={() => onCancel(order._id)}
            activeOpacity={0.8}
          >
            <Feather name="x-circle" size={14} color={RED} />
            <Text style={oc.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const oc = StyleSheet.create({
  card:          { backgroundColor: WHITE, borderRadius: 24, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  cardHead:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  cardHeadLeft:  { flex: 1, marginRight: 10 },
  orderType:     { fontSize: 9, fontWeight: '900', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  restaurantName:{ fontSize: 16, fontWeight: '900', color: DARK, letterSpacing: -0.3 },
  date:          { fontSize: 10, color: MUTED, fontWeight: '600', marginTop: 2 },
  statusBadge:   { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10 },
  statusIcon:    { fontSize: 12 },
  statusLabel:   { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  items:         { gap: 6, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  itemRow:       { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: CREAM, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12 },
  itemQty:       { fontSize: 11, fontWeight: '900', color: ORANGE, minWidth: 24 },
  itemName:      { fontSize: 11, fontWeight: '700', color: DARK, flex: 1 },
  itemExtra:     { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, paddingLeft: 12 },
  cardFoot:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel:    { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  totalAmount:   { fontSize: 22, fontWeight: '900', color: DARK, letterSpacing: -0.5 },
  cancelBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: '#FECACA', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#FEF2F2' },
  cancelText:    { fontSize: 10, fontWeight: '900', color: RED, textTransform: 'uppercase', letterSpacing: 0.4 },
});

/* ── Modal de confirmación de cancelación ────────────────────── */
function CancelConfirmModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={cm.overlay} onPress={onCancel}>
        <Pressable onPress={() => {}}>
          <View style={cm.box}>
            <View style={cm.iconWrap}>
              <Feather name="alert-circle" size={32} color={RED} />
            </View>
            <Text style={cm.title}>¿Cancelar pedido?</Text>
            <Text style={cm.sub}>Esta acción notificará al restaurante y no podrá revertirse.</Text>
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  box:     { backgroundColor: WHITE, borderRadius: 28, padding: 28, width: '100%', maxWidth: 360, gap: 12 },
  iconWrap:{ width: 60, height: 60, borderRadius: 20, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 20, fontWeight: '900', color: DARK, letterSpacing: -0.4 },
  sub:     { fontSize: 12, color: MUTED, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  keepBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center' },
  keepText:{ fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4 },
  yesBtn:  { flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: RED, alignItems: 'center' },
  yesText: { fontSize: 10, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.4 },
});

/* ══════════════════════════════════════════════════════════════
   PANTALLA PRINCIPAL
══════════════════════════════════════════════════════════════ */
export default function MyOrdersScreen({ navigation }) {
  const {
    orders, loading, error,
    fetchOrders, cancelOrder,
    getStatusLabel, getStatusColors, getStatusIcon, getOrderTypeLabel,
    clearError,
  } = useOrderStore();

  const [filterStatus,  setFilterStatus]  = useState('TODOS');
  const [cancelTarget,  setCancelTarget]  = useState(null); // id del pedido a cancelar
  const [refreshing,    setRefreshing]    = useState(false);

  // Recarga al entrar a la pantalla (clave para mostrar el pedido recién creado)
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
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

  return (
    <View style={s.screen}>
      <AppHeader navigation={navigation} />

      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroTitle}>Tus{'\n'}<Text style={s.heroAccent}>Pedidos</Text></Text>
        <Text style={s.heroSub}>Sigue el estado de tus platillos favoritos.</Text>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filtersRow}
        style={s.filtersWrap}
      >
        {STATUS_FILTERS.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[s.filterBtn, filterStatus === value && s.filterBtnActive]}
            onPress={() => setFilterStatus(value)}
            activeOpacity={0.8}
          >
            <Text style={[s.filterText, filterStatus === value && s.filterTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Error banner */}
      {error && (
        <View style={s.errorBanner}>
          <Feather name="alert-circle" size={14} color={RED} />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Feather name="x" size={14} color={RED} />
          </TouchableOpacity>
        </View>
      )}

      {/* Contenido */}
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
            /* Estado vacío */
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Feather name="file-text" size={32} color={MUTED} />
              </View>
              <Text style={s.emptyTitle}>
                {filterStatus === 'TODOS' ? 'Sin pedidos aún' : 'Nada por aquí'}
              </Text>
              <Text style={s.emptySub}>
                {filterStatus === 'TODOS'
                  ? 'Cuando hagas tu primer pedido aparecerá aquí.'
                  : 'No hay órdenes con este estado actualmente.'}
              </Text>
              {filterStatus === 'TODOS' && (
                <TouchableOpacity
                  style={s.emptyBtn}
                  onPress={() => navigation.navigate('Inicio')}
                  activeOpacity={0.85}
                >
                  <Text style={s.emptyBtnText}>Explorar Menú</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                getStatusLabel={getStatusLabel}
                getStatusColors={getStatusColors}
                getStatusIcon={getStatusIcon}
                getOrderTypeLabel={getOrderTypeLabel}
                onCancel={setCancelTarget}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Modal cancelación */}
      <CancelConfirmModal
        visible={!!cancelTarget}
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}

/* ── Estilos ─────────────────────────────────────────────────── */
const s = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: '#FAFAFA' },

  /* Hero */
  hero:            { backgroundColor: DARK, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  heroTitle:       { fontSize: 36, fontWeight: '900', color: WHITE, letterSpacing: -1, lineHeight: 38 },
  heroAccent:      { color: ORANGE, fontStyle: 'italic' },
  heroSub:         { fontSize: 12, color: MUTED, marginTop: 8, lineHeight: 18 },

  /* Filtros */
  filtersWrap:     { maxHeight: 60, backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  filtersRow:      { paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: 'center' },
  filterBtn:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: 'transparent' },
  filterBtnActive: { backgroundColor: DARK, borderColor: DARK },
  filterText:      { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4 },
  filterTextActive:{ color: WHITE },

  /* Error */
  errorBanner:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', margin: 16, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#FECACA' },
  errorText:       { flex: 1, fontSize: 11, fontWeight: '700', color: RED },

  /* Lista */
  list:            { padding: 16, paddingBottom: 32 },
  listEmpty:       { flex: 1, justifyContent: 'center' },

  /* Loading */
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText:     { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Vacío */
  empty:           { alignItems: 'center', gap: 10, paddingVertical: 40 },
  emptyIcon:       { width: 80, height: 80, borderRadius: 28, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  emptyTitle:      { fontSize: 18, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: -0.3 },
  emptySub:        { fontSize: 12, color: MUTED, textAlign: 'center', maxWidth: 220, lineHeight: 18 },
  emptyBtn:        { backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 12, marginTop: 6 },
  emptyBtnText:    { fontSize: 10, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});