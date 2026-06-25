/**
 * CartDrawer — KinalGourmetMovil
 * Adaptación del CartDrawer.jsx del frontend web.
 * Se muestra como un panel deslizable desde abajo usando un Modal de React Native.
 *
 * Uso: colócalo en el componente raíz (App.jsx o AppNavigator.jsx) para que
 * esté siempre disponible sin importar en qué pantalla esté el usuario:
 *
 *   import CartDrawer from '../shared/components/CartDrawer';
 *   // Dentro del return:
 *   <CartDrawer />
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView,
  Image, Animated, Dimensions, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '../store/useCartStore';

const { height: SCREEN_H } = Dimensions.get('window');
const DRAWER_H = SCREEN_H * 0.85;

/* ── Tokens ───────────────────────────────────────────────────── */
const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';
const WHITE  = '#FFFFFF';

/* ── CartItem ────────────────────────────────────────────────── */
const CartItem = ({ item, onAdd, onRemove, onDelete }) => {
  const price    = Number(item.unitPrice || 0);
  const qty      = Number(item.quantity  || 0);
  const subtotal = qty * price;

  return (
    <View style={ci.row}>
      {/* Imagen */}
      <View style={ci.imgWrap}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={ci.img} resizeMode="cover" />
        ) : (
          <View style={[ci.img, ci.imgFallback]}>
            <Feather name="coffee" size={18} color={MUTED} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={ci.info}>
        <Text style={ci.name} numberOfLines={1}>{item.name}</Text>
        <Text style={ci.unit}>Q{price.toFixed(2)} c/u</Text>

        <View style={ci.controls}>
          <View style={ci.qtyRow}>
            <TouchableOpacity style={ci.qtyBtn} onPress={onRemove} activeOpacity={0.7}>
              <Feather name="minus" size={12} color={DARK} />
            </TouchableOpacity>
            <Text style={ci.qtyNum}>{qty}</Text>
            <TouchableOpacity style={[ci.qtyBtn, ci.qtyBtnActive]} onPress={onAdd} activeOpacity={0.7}>
              <Feather name="plus" size={12} color={WHITE} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onDelete} activeOpacity={0.7}>
            <Text style={ci.delete}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtotal */}
      <Text style={ci.subtotal}>Q{subtotal.toFixed(2)}</Text>
    </View>
  );
};

const ci = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  imgWrap:    { width: 64, height: 64, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)' },
  img:        { width: '100%', height: '100%' },
  imgFallback:{ backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  info:       { flex: 1 },
  name:       { fontSize: 13, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: -0.3 },
  unit:       { fontSize: 10, fontWeight: '700', color: MUTED, marginTop: 2, textTransform: 'uppercase' },
  controls:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  qtyRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, padding: 4, gap: 4 },
  qtyBtn:     { width: 24, height: 24, borderRadius: 12, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center' },
  qtyBtnActive: { backgroundColor: ORANGE },
  qtyNum:     { width: 28, textAlign: 'center', fontSize: 11, fontWeight: '900', color: DARK },
  delete:     { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  subtotal:   { fontSize: 13, fontWeight: '900', color: DARK },
});

/* ── ORDER TYPE selector ─────────────────────────────────────── */
const ORDER_TYPES = [
  { value: 'PARA_LLEVAR', label: 'Llevar',  icon: 'package' },
  { value: 'DOMICILIO',   label: 'Envío',   icon: 'truck' },
];

/* ── CartDrawer principal ────────────────────────────────────── */
export default function CartDrawer() {
  const {
    isCartOpen, closeCart,
    items, restaurantName, restaurantId,
    addItem, removeItem, deleteItem, clearCart,
    orderType, setOrderType,
    getTotalItems, getTotalPrice,
  } = useCartStore();

  const slideAnim = useRef(new Animated.Value(DRAWER_H)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue:      isCartOpen ? 0 : DRAWER_H,
      useNativeDriver: true,
      bounciness:   4,
      speed:        16,
    }).start();
  }, [isCartOpen]);

  const subtotal  = getTotalPrice();
  const totalQty  = getTotalItems();

  return (
    <Modal
      visible={isCartOpen}
      transparent
      animationType="none"
      onRequestClose={closeCart}
      statusBarTranslucent
    >
      {/* Overlay */}
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeCart} />

      {/* Panel deslizable */}
      <Animated.View style={[s.drawer, { transform: [{ translateY: slideAnim }] }]}>

        {/* Handle */}
        <View style={s.handle} />

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>Carrito</Text>
            {restaurantName ? (
              <View style={s.restRow}>
                <View style={s.restDot} />
                <Text style={s.restName}>{restaurantName}</Text>
              </View>
            ) : null}
          </View>
          <TouchableOpacity style={s.closeBtn} onPress={closeCart} activeOpacity={0.8}>
            <Feather name="x" size={18} color={DARK} />
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          /* ── Carrito vacío ── */
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Feather name="shopping-cart" size={32} color={MUTED} />
            </View>
            <Text style={s.emptyTitle}>Carrito Vacío</Text>
            <Text style={s.emptyText}>Aún no has elegido ningún platillo.</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={closeCart} activeOpacity={0.85}>
              <Text style={s.emptyBtnText}>Explorar Menú</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ── Lista de items ── */}
            <ScrollView
              style={s.list}
              contentContainerStyle={{ padding: 20, paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item) => (
                <CartItem
                  key={item.dishId}
                  item={item}
                  onAdd={() => addItem(
                    { _id: item.dishId, name: item.name, price: item.unitPrice, image: item.image },
                    restaurantId,
                    restaurantName
                  )}
                  onRemove={() => removeItem(item.dishId)}
                  onDelete={() => deleteItem(item.dishId)}
                />
              ))}
            </ScrollView>

            {/* ── Footer ── */}
            <View style={s.footer}>

              {/* Tipo de orden */}
              <Text style={s.sectionLabel}>¿Cómo recibes tu orden?</Text>
              <View style={s.orderTypeRow}>
                {ORDER_TYPES.map(({ value, label, icon }) => (
                  <TouchableOpacity
                    key={value}
                    style={[s.orderTypeBtn, orderType === value && s.orderTypeBtnActive]}
                    onPress={() => setOrderType(value)}
                    activeOpacity={0.8}
                  >
                    <Feather name={icon} size={16} color={orderType === value ? DARK : MUTED} />
                    <Text style={[s.orderTypeTxt, orderType === value && s.orderTypeTxtActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {orderType === 'DOMICILIO' && (
                <Text style={s.orderTypeHint}>📍 Se pedirá tu dirección al confirmar</Text>
              )}
              {orderType === 'PARA_LLEVAR' && (
                <Text style={s.orderTypeHint}>🥡 Pasarás a recoger tu pedido en el restaurante</Text>
              )}

              {/* Total */}
              <View style={s.totalRow}>
                <View>
                  <Text style={s.totalLabel}>Total a pagar</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                    <Text style={s.totalCurrency}>Q</Text>
                    <Text style={s.totalAmount}>{subtotal.toFixed(2)}</Text>
                  </View>
                </View>
                <Text style={s.itemCount}>{totalQty} items</Text>
              </View>

              {/* Botón confirmar */}
              <TouchableOpacity style={s.confirmBtn} activeOpacity={0.85}>
                <Text style={s.confirmBtnText}>Confirmar Orden →</Text>
              </TouchableOpacity>

              {/* Vaciar */}
              <TouchableOpacity style={s.clearBtn} onPress={clearCart} activeOpacity={0.7}>
                <Text style={s.clearBtnText}>Vaciar Carrito</Text>
              </TouchableOpacity>

            </View>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

/* ── Estilos ─────────────────────────────────────────────────── */
const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: DRAWER_H,
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  title:   { fontSize: 22, fontWeight: '900', color: DARK, letterSpacing: -0.5, textTransform: 'uppercase' },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  restDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ORANGE },
  restName:{ fontSize: 10, fontWeight: '800', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  closeBtn:{
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center',
  },

  /* Vacío */
  empty:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { width: 80, height: 80, borderRadius: 28, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle:{ fontSize: 18, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: -0.3, marginBottom: 6 },
  emptyText: { fontSize: 12, color: MUTED, textAlign: 'center', marginBottom: 24, maxWidth: 200, lineHeight: 18 },
  emptyBtn:  { backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 12 },
  emptyBtnText: { color: WHITE, fontWeight: '800', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Lista */
  list: { flex: 1 },

  /* Footer */
  footer: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#FAFAFA',
    gap: 12,
  },
  sectionLabel: { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },

  /* Tipo de orden */
  orderTypeRow:     { flexDirection: 'row', gap: 8, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 4 },
  orderTypeBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12 },
  orderTypeBtnActive: { backgroundColor: WHITE },
  orderTypeTxt:     { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  orderTypeTxtActive: { color: DARK },
  orderTypeHint:    { fontSize: 9, fontWeight: '700', color: MUTED },

  /* Total */
  totalRow:     { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 },
  totalLabel:   { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  totalCurrency:{ fontSize: 14, fontWeight: '900', color: ORANGE },
  totalAmount:  { fontSize: 36, fontWeight: '900', color: DARK, letterSpacing: -1, lineHeight: 38 },
  itemCount:    { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase' },

  /* Botones */
  confirmBtn:    { backgroundColor: DARK, borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  confirmBtnText:{ color: WHITE, fontWeight: '900', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  clearBtn:      { alignItems: 'center', paddingVertical: 4 },
  clearBtnText:  { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
});