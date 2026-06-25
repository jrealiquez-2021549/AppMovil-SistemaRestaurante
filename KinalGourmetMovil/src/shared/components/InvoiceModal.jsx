/**
 * InvoiceModal — KinalGourmetMovil
 * Adaptación del InvoiceModal.jsx del frontend web.
 *
 * Flujo multi-paso:
 *   Paso "delivery" (solo DOMICILIO): dirección + teléfono de entrega
 *   Paso "billing":  NIT, nombre, email, método de pago → envío al backend
 *
 * Uso en CartDrawer:
 *   import InvoiceModal from './InvoiceModal';
 *   <InvoiceModal
 *     visible={invoiceVisible}
 *     onClose={() => setInvoiceVisible(false)}
 *     onConfirm={handleConfirm}
 *   />
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator,
  Platform, KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '../store/useCartStore';
import { useNavigation } from '@react-navigation/native';
import restauranteClient from '../api/restauranteClient';

/* ── Tokens ─────────────────────────────────────────────────── */
const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';
const WHITE  = '#FFFFFF';
const GREEN  = '#16A34A';
const RED    = '#EF4444';
const GRAY   = '#F3F4F6';

/* ── Métodos de pago ─────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { value: 'EFECTIVO',      label: 'Efectivo',      icon: 'dollar-sign' },
  { value: 'TARJETA',       label: 'Tarjeta',        icon: 'credit-card' },
  { value: 'TRANSFERENCIA', label: 'Transferencia',  icon: 'repeat' },
  { value: 'WALLET',        label: 'Wallet',         icon: 'smartphone' },
];

/* ── Campo de texto reutilizable ─────────────────────────────── */
function Field({ label, error, ...inputProps }) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        style={[f.input, error ? f.inputError : null]}
        placeholderTextColor={MUTED}
        {...inputProps}
      />
      {error ? <Text style={f.error}>{error}</Text> : null}
    </View>
  );
}
const f = StyleSheet.create({
  wrap:       { gap: 6 },
  label:      { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 },
  input:      {
    backgroundColor: GRAY,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 13,
    fontWeight: '700',
    color: DARK,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: { borderColor: RED, backgroundColor: '#FEF2F2' },
  error:      { fontSize: 9, fontWeight: '700', color: RED, marginLeft: 4 },
});

/* ── Resumen de items ────────────────────────────────────────── */
function OrderSummary({ items, subtotal, discountAmount, finalTotal, orderType, orderTypeLabel }) {
  return (
    <View style={os.wrap}>
      <Text style={os.title}>Tu Pedido</Text>
      <View style={os.bar} />
      <Text style={os.orderTypeBadge}>{orderTypeLabel}</Text>

      <ScrollView style={os.list} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.dishId} style={os.itemRow}>
            <View style={os.badge}>
              <Text style={os.badgeText}>{item.quantity}</Text>
            </View>
            <View style={os.itemInfo}>
              <Text style={os.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={os.itemUnit}>Q{Number(item.unitPrice).toFixed(2)} c/u</Text>
            </View>
            <Text style={os.itemTotal}>Q{(item.quantity * item.unitPrice).toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Totales */}
      <View style={os.totals}>
        <View style={os.totalRow}>
          <Text style={os.totalLabel}>Subtotal</Text>
          <Text style={os.totalValue}>Q{(subtotal).toFixed(2)}</Text>
        </View>
        {discountAmount > 0 && (
          <View style={os.totalRow}>
            <Text style={[os.totalLabel, { color: RED }]}>Descuento</Text>
            <Text style={[os.totalValue, { color: RED }]}>−Q{discountAmount.toFixed(2)}</Text>
          </View>
        )}
        <View style={[os.totalRow, os.totalFinalRow]}>
          <Text style={os.totalFinalLabel}>Total a Pagar</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
            <Text style={os.totalFinalQ}>Q</Text>
            <Text style={os.totalFinalAmount}>{finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const os = StyleSheet.create({
  wrap:            { backgroundColor: CREAM, borderRadius: 20, padding: 20, marginBottom: 16, gap: 10 },
  title:           { fontSize: 20, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: -0.5 },
  bar:             { width: 36, height: 3, backgroundColor: ORANGE, borderRadius: 2 },
  orderTypeBadge:  { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },
  list:            { maxHeight: 160 },
  itemRow:         { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  badge:           { width: 22, height: 22, borderRadius: 11, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  badgeText:       { fontSize: 9, fontWeight: '900', color: WHITE },
  itemInfo:        { flex: 1 },
  itemName:        { fontSize: 12, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: -0.2 },
  itemUnit:        { fontSize: 9, fontWeight: '700', color: MUTED, textTransform: 'uppercase', marginTop: 1 },
  itemTotal:       { fontSize: 12, fontWeight: '900', color: DARK },
  totals:          { gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)' },
  totalRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:      { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  totalValue:      { fontSize: 10, fontWeight: '900', color: MUTED },
  totalFinalRow:   { marginTop: 6 },
  totalFinalLabel: { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  totalFinalQ:     { fontSize: 14, fontWeight: '900', color: ORANGE },
  totalFinalAmount:{ fontSize: 32, fontWeight: '900', color: DARK, letterSpacing: -1, lineHeight: 36 },
});

/* ── PASO 1: Dirección de domicilio ──────────────────────────── */
function StepDelivery({ localAddress, setLocalAddress, localPhone, setLocalPhone,
                         notes, setNotes, error, onNext, onCancel }) {
  return (
    <View style={sd.wrap}>
      <View style={sd.heading}>
        <Text style={sd.title}>Dirección{'\n'}de Entrega</Text>
        <Text style={sd.sub}>¿Dónde llevamos tu pedido?</Text>
      </View>

      <View style={sd.fields}>
        <Field
          label="Dirección completa"
          value={localAddress}
          onChangeText={setLocalAddress}
          placeholder="Ej: 5a Avenida 12-34, Zona 1"
          autoCapitalize="words"
          returnKeyType="next"
        />
        <Field
          label="Teléfono de contacto"
          value={localPhone}
          onChangeText={setLocalPhone}
          placeholder="Ej: 5555-1234"
          keyboardType="phone-pad"
          returnKeyType="next"
        />
        <Field
          label="Indicaciones adicionales (opcional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Ej: Apartamento 3B, tocar timbre"
          returnKeyType="done"
        />
        {error ? (
          <View style={sd.errorBox}>
            <Feather name="alert-circle" size={12} color={RED} />
            <Text style={sd.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <View style={sd.actions}>
        <TouchableOpacity style={sd.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
          <Text style={sd.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sd.nextBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={sd.nextText}>Continuar →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const sd = StyleSheet.create({
  wrap:      { gap: 20 },
  heading:   { gap: 4 },
  title:     { fontSize: 26, fontWeight: '900', color: DARK, letterSpacing: -0.8, textTransform: 'uppercase', lineHeight: 28 },
  sub:       { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },
  fields:    { gap: 12 },
  errorBox:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 12, padding: 10 },
  errorText: { fontSize: 10, fontWeight: '700', color: RED, flex: 1 },
  actions:   { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  cancelText:{ fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  nextBtn:   { flex: 2, backgroundColor: DARK, borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  nextText:  { fontSize: 10, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});

/* ── PASO 2: Facturación ─────────────────────────────────────── */
function StepBilling({ invoiceData, setInvoiceData, nitError, setNitError,
                        apiError, isLoading, finalTotal, restaurantName,
                        orderType, onBack, onCancel, onSubmit,
                        deliveryAddress, deliveryPhone, onEditDelivery }) {

  const handleNitChange = (value) => {
    const upper = value.toUpperCase();
    if (upper === '' || upper === 'C' || upper === 'CF') {
      setNitError('');
      setInvoiceData({ ...invoiceData, nit: upper });
      return;
    }
    const onlyNums = upper.replace(/[^0-9]/g, '');
    if (onlyNums.length <= 13) {
      setInvoiceData({ ...invoiceData, nit: onlyNums });
      setNitError(onlyNums.length > 0 && onlyNums.length < 13 ? 'El NIT debe tener 13 dígitos' : '');
    }
  };

  return (
    <View style={sb.wrap}>
      <View style={sb.heading}>
        <Text style={sb.title}>Detalles de{'\n'}Facturación</Text>
        <Text style={sb.sub}>Comprando en: <Text style={{ color: DARK }}>{restaurantName}</Text></Text>
      </View>

      <View style={sb.fields}>
        {/* NIT + Nombre — en fila */}
        <View style={sb.row}>
          <View style={{ flex: 1 }}>
            <Field
              label="NIT / Identificación"
              value={invoiceData.nit}
              onChangeText={handleNitChange}
              placeholder="CF o 13 dígitos"
              autoCapitalize="characters"
              keyboardType="default"
              returnKeyType="next"
              error={nitError}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Nombre Factura"
              value={invoiceData.name}
              onChangeText={(v) => setInvoiceData({ ...invoiceData, name: v })}
              placeholder="Nombre completo"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Email */}
        <Field
          label="Correo Electrónico"
          value={invoiceData.email}
          onChangeText={(v) => setInvoiceData({ ...invoiceData, email: v })}
          placeholder="Para enviar tu factura"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
        />

        {/* Método de pago */}
        <View style={sb.payWrap}>
          <Text style={sb.payLabel}>Método de Pago</Text>
          <View style={sb.payGrid}>
            {PAYMENT_METHODS.map(({ value, label, icon }) => (
              <TouchableOpacity
                key={value}
                style={[sb.payBtn, invoiceData.paymentMethod === value && sb.payBtnActive]}
                onPress={() => setInvoiceData({ ...invoiceData, paymentMethod: value })}
                activeOpacity={0.8}
              >
                <Feather
                  name={icon}
                  size={16}
                  color={invoiceData.paymentMethod === value ? WHITE : MUTED}
                />
                <Text style={[sb.payText, invoiceData.paymentMethod === value && sb.payTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info de domicilio (solo si aplica y estamos en billing) */}
        {orderType === 'DOMICILIO' && deliveryAddress ? (
          <View style={sb.deliveryCard}>
            <Text style={sb.deliveryCardLabel}>📍 Dirección de entrega</Text>
            <Text style={sb.deliveryCardAddr}>{deliveryAddress}</Text>
            <Text style={sb.deliveryCardPhone}>📞 {deliveryPhone}</Text>
            <TouchableOpacity onPress={onEditDelivery} activeOpacity={0.7}>
              <Text style={sb.deliveryCardEdit}>Cambiar dirección</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Error de API */}
        {apiError ? (
          <View style={sb.errorBox}>
            <Feather name="alert-circle" size={14} color={RED} />
            <Text style={sb.errorText}>{apiError}</Text>
          </View>
        ) : null}
      </View>

      {/* Acciones */}
      <View style={sb.actions}>
        <TouchableOpacity
          style={sb.backBtn}
          onPress={orderType === 'DOMICILIO' ? onBack : onCancel}
          activeOpacity={0.7}
        >
          <Text style={sb.backText}>
            {orderType === 'DOMICILIO' ? '← Dirección' : 'Cancelar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[sb.submitBtn, (!!nitError || isLoading) && sb.submitBtnDisabled]}
          onPress={onSubmit}
          activeOpacity={0.85}
          disabled={!!nitError || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Text style={sb.submitText}>Pagar Q{finalTotal.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const sb = StyleSheet.create({
  wrap:             { gap: 18 },
  heading:          { gap: 4 },
  title:            { fontSize: 26, fontWeight: '900', color: DARK, letterSpacing: -0.8, textTransform: 'uppercase', lineHeight: 28 },
  sub:              { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },
  fields:           { gap: 12 },
  row:              { flexDirection: 'row', gap: 10 },
  payWrap:          { gap: 8 },
  payLabel:         { fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 },
  payGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  payBtn:           {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 2, borderColor: '#E5E7EB',
    backgroundColor: WHITE,
  },
  payBtnActive:     { backgroundColor: DARK, borderColor: DARK },
  payText:          { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase' },
  payTextActive:    { color: WHITE },
  deliveryCard:     { backgroundColor: '#FFF7ED', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#FED7AA', gap: 4 },
  deliveryCardLabel:{ fontSize: 9, fontWeight: '900', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.5 },
  deliveryCardAddr: { fontSize: 13, fontWeight: '700', color: DARK },
  deliveryCardPhone:{ fontSize: 11, color: MUTED },
  deliveryCardEdit: { fontSize: 9, fontWeight: '900', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  errorBox:         { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#FECACA' },
  errorText:        { fontSize: 11, fontWeight: '700', color: RED, flex: 1 },
  actions:          { flexDirection: 'row', gap: 10, marginTop: 4 },
  backBtn:          { flex: 1, paddingVertical: 16, alignItems: 'center' },
  backText:         { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  submitBtn:        { flex: 2, backgroundColor: ORANGE, borderRadius: 20, paddingVertical: 16, alignItems: 'center' },
  submitBtnDisabled:{ opacity: 0.4 },
  submitText:       { fontSize: 11, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});

/* ── PANTALLA DE ÉXITO ───────────────────────────────────────── */
function StepSuccess({ finalTotal, onClose }) {
  return (
    <View style={ss.wrap}>
      <View style={ss.iconWrap}>
        <Feather name="check-circle" size={52} color={GREEN} />
      </View>
      <Text style={ss.title}>¡Orden Confirmada!</Text>
      <Text style={ss.sub}>Tu pedido ha sido procesado exitosamente.</Text>
      <View style={ss.amountWrap}>
        <Text style={ss.amountLabel}>Total pagado</Text>
        <Text style={ss.amount}>Q{finalTotal.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={ss.btn} onPress={onClose} activeOpacity={0.85}>
        <Text style={ss.btnText}>Ver Mis Pedidos</Text>
      </TouchableOpacity>
    </View>
  );
}
const ss = StyleSheet.create({
  wrap:       { alignItems: 'center', gap: 14, paddingVertical: 20 },
  iconWrap:   { width: 100, height: 100, borderRadius: 34, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' },
  title:      { fontSize: 24, fontWeight: '900', color: DARK, textTransform: 'uppercase', letterSpacing: -0.5 },
  sub:        { fontSize: 12, color: MUTED, textAlign: 'center', maxWidth: 220, lineHeight: 18 },
  amountWrap: { alignItems: 'center', backgroundColor: CREAM, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32 },
  amountLabel:{ fontSize: 9, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },
  amount:     { fontSize: 36, fontWeight: '900', color: DARK, letterSpacing: -1 },
  btn:        { backgroundColor: DARK, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 40 },
  btnText:    { fontSize: 11, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});

/* ══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════ */
export default function InvoiceModal({ visible, onClose, onConfirm }) {
  const navigation = useNavigation();
  const {
    items, restaurantName,
    getFinalTotal, getTotalPrice,
    discountAmount, orderType,
    deliveryAddress, deliveryPhone,
    setDeliveryAddress, setDeliveryPhone,
    clearCart,
  } = useCartStore();

  /* ── Estado del paso ─────────────────────────────────────── */
  const [step, setStep] = useState('billing'); // 'delivery' | 'billing' | 'success'

  // Reinicia el paso cada vez que el modal se abre
  useEffect(() => {
    if (visible) {
      setStep(orderType === 'DOMICILIO' ? 'delivery' : 'billing');
      setApiError('');
      setNitError('');
    }
  }, [visible, orderType]);

  /* ── Estado del formulario de domicilio ──────────────────── */
  const [localAddress, setLocalAddress] = useState(deliveryAddress || '');
  const [localPhone,   setLocalPhone]   = useState(deliveryPhone   || '');
  const [deliveryError, setDeliveryError] = useState('');

  /* ── Estado del formulario de facturación ────────────────── */
  const [invoiceData, setInvoiceData] = useState({
    nit:           'CF',
    name:          '',
    email:         '',
    paymentMethod: 'EFECTIVO',
    notes:         '',
  });
  const [nitError,  setNitError]  = useState('');
  const [apiError,  setApiError]  = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ── Total final guardado para la pantalla de éxito ─────── */
  const [paidTotal, setPaidTotal] = useState(0);

  const subtotal   = getTotalPrice();
  const finalTotal = getFinalTotal();

  const orderTypeLabel = {
    PARA_LLEVAR: '🥡 Para llevar',
    DOMICILIO:   '🛵 Envío a domicilio',
  }[orderType] || orderType;

  /* ── Paso 1: validar y avanzar ───────────────────────────── */
  const handleDeliveryNext = () => {
    if (!localAddress.trim()) {
      setDeliveryError('La dirección es requerida para envío a domicilio');
      return;
    }
    if (!localPhone.trim()) {
      setDeliveryError('El teléfono de contacto es requerido');
      return;
    }
    setDeliveryError('');
    setDeliveryAddress(localAddress.trim());
    setDeliveryPhone(localPhone.trim());
    setStep('billing');
  };

  /* ── Paso 2: construir payload y enviar ──────────────────── */
  const handleSubmit = async () => {
    if (!invoiceData.name.trim()) {
      setApiError('El nombre de facturación es requerido');
      return;
    }
    if (!invoiceData.email.trim()) {
      setApiError('El correo electrónico es requerido');
      return;
    }
    if (invoiceData.nit !== 'CF' && invoiceData.nit.length !== 13) {
      setNitError('Por favor, ingrese un NIT válido (13 dígitos) o CF');
      return;
    }
    setApiError('');
    setIsLoading(true);

    try {
      const payload = {
        orderData: {
          restaurant: useCartStore.getState().restaurantId,
          orderType,
          details: items.map((i) => ({
            dish:      i.dishId,
            dishName:  i.name,
            quantity:  i.quantity,
            unitPrice: i.unitPrice,
          })),
          notes: invoiceData.notes || '',
          ...(orderType === 'DOMICILIO' && {
            deliveryAddress: { street: localAddress || deliveryAddress },
            deliveryPhone:   localPhone || deliveryPhone,
          }),
        },
        customerInfo: {
          name:  invoiceData.name,
          email: invoiceData.email,
          nit:   invoiceData.nit,
        },
        restaurantInfo: {
          name:    restaurantName,
          address: 'Ciudad de Guatemala',
        },
        paymentMethod: invoiceData.paymentMethod,
        amountPaid:    finalTotal,
        ...(useCartStore.getState().appliedCouponCode && {
          couponCode: useCartStore.getState().appliedCouponCode,
        }),
      };

      const response = await restauranteClient.post('/checkout/process', payload);

      if (response.data.success) {
        setPaidTotal(finalTotal);
        clearCart();          // limpia carrito inmediatamente
        setStep('success');
        if (onConfirm) onConfirm(response.data);
      } else {
        setApiError(response.data.message || 'Error al procesar el pago');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Cerrar y limpiar tras éxito ─────────────────────────── */
  const handleClose = () => {
    if (step === 'success') {
      clearCart();
      onClose();
      navigation.navigate('Mis Pedidos');
    } else {
      onClose();
    }
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={m.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Overlay tap-to-close */}
        <TouchableOpacity style={m.overlay} activeOpacity={1} onPress={handleClose} />

        {/* Panel principal */}
        <View style={m.sheet}>
          {/* Handle */}
          <View style={m.handle} />

          {/* Botón X (siempre visible salvo en loading) */}
          {!isLoading && (
            <TouchableOpacity style={m.closeBtn} onPress={handleClose} activeOpacity={0.8}>
              <Feather name="x" size={18} color={DARK} />
            </TouchableOpacity>
          )}

          <ScrollView
            contentContainerStyle={m.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Resumen del pedido (oculto en pantalla de éxito) */}
            {step !== 'success' && (
              <OrderSummary
                items={items}
                subtotal={subtotal}
                discountAmount={discountAmount}
                finalTotal={finalTotal}
                orderType={orderType}
                orderTypeLabel={orderTypeLabel}
              />
            )}

            {/* ── Paso 1: Domicilio ── */}
            {step === 'delivery' && (
              <StepDelivery
                localAddress={localAddress}
                setLocalAddress={setLocalAddress}
                localPhone={localPhone}
                setLocalPhone={setLocalPhone}
                notes={invoiceData.notes}
                setNotes={(v) => setInvoiceData({ ...invoiceData, notes: v })}
                error={deliveryError}
                onNext={handleDeliveryNext}
                onCancel={handleClose}
              />
            )}

            {/* ── Paso 2: Facturación ── */}
            {step === 'billing' && (
              <StepBilling
                invoiceData={invoiceData}
                setInvoiceData={setInvoiceData}
                nitError={nitError}
                setNitError={setNitError}
                apiError={apiError}
                isLoading={isLoading}
                finalTotal={finalTotal}
                restaurantName={restaurantName}
                orderType={orderType}
                deliveryAddress={localAddress || deliveryAddress}
                deliveryPhone={localPhone || deliveryPhone}
                onBack={() => setStep('delivery')}
                onCancel={handleClose}
                onEditDelivery={() => setStep('delivery')}
                onSubmit={handleSubmit}
              />
            )}

            {/* ── Pantalla de éxito ── */}
            {step === 'success' && (
              <StepSuccess
                finalTotal={paidTotal}
                onClose={handleClose}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ── Estilos del modal ───────────────────────────────────────── */
const m = StyleSheet.create({
  flex:    { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '95%',
    overflow: 'hidden',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 16, right: 20,
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: CREAM,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  scroll: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 4,
  },
});