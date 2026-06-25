import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  TextInput, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../../shared/store/authStore';
import { useReviewStore } from '../../../shared/store/useReviewStore';
import { useCartStore } from '../../../shared/store/useCartStore';
import { getRestaurantByIdRequest } from '../../../shared/api/restaurants';
import { getDishesRequest } from '../../../shared/api/dishes';
import AppHeader from '../../../shared/components/AppHeader';

/* ── TOKENS ─────────────────────────────────────────────────── */
const ORANGE = '#E8650A';
const DARK   = '#1A1A1A';
const CREAM  = '#F5F3EF';
const MUTED  = '#8A8680';
const WHITE  = '#FFFFFF';

/* ── HELPERS ─────────────────────────────────────────────────── */
const parsePrice = (price) => {
  if (price == null) return '0.00';
  if (typeof price === 'object' && price.$numberDecimal)
    return Number(price.$numberDecimal).toFixed(2);
  const n = Number(price);
  return isNaN(n) ? '0.00' : n.toFixed(2);
};

const DISH_TYPES = [
  { value: 'TODOS',        label: 'Todos' },
  { value: 'ENTRADA',      label: 'Entradas' },
  { value: 'PLATO_FUERTE', label: 'Fuertes' },
  { value: 'POSTRE',       label: 'Postres' },
  { value: 'BEBIDA',       label: 'Bebidas' },
  { value: 'GUARNICION',   label: 'Extras' },
];

const TYPE_LABELS = {
  ENTRADA: 'Entrada', PLATO_FUERTE: 'Fuertes',
  POSTRE: 'Postre', BEBIDA: 'Bebida', GUARNICION: 'Extra',
};

/* ── STAR RATING ─────────────────────────────────────────────── */
const StarRating = ({ value, onChange, size = 22 }) => (
  <View style={{ flexDirection: 'row', gap: 4 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => onChange?.(star)}
        disabled={!onChange}
        activeOpacity={0.7}
      >
        <Feather
          name="star"
          size={size}
          color={star <= value ? ORANGE : '#E5E7EB'}
          style={star <= value ? { opacity: 1 } : { opacity: 0.5 }}
        />
      </TouchableOpacity>
    ))}
  </View>
);

/* ── DISH CARD ────────────────────────────────────────────────── */
const DishCard = ({ dish, restaurantId, restaurantName }) => {
  const { items, addItem, removeItem } = useCartStore();
  const cartItem = items.find((i) => i.dishId === dish._id);
  const quantity = cartItem?.quantity ?? 0;
  const isAvailable = dish.isAvailable !== false;

  return (
    <View style={[ds.card, !isAvailable && { opacity: 0.5 }]}>
      <View style={ds.imgWrap}>
        {dish.image ? (
          <Image source={{ uri: dish.image }} style={ds.img} resizeMode="cover" />
        ) : (
          <View style={[ds.img, ds.imgPlaceholder]}>
            <Feather name="coffee" size={28} color={MUTED} />
          </View>
        )}
        {dish.type && (
          <View style={ds.typeBadge}>
            <Text style={ds.typeBadgeText}>{TYPE_LABELS[dish.type] ?? dish.type}</Text>
          </View>
        )}
        {!isAvailable && (
          <View style={ds.unavailableOverlay}>
            <Text style={ds.unavailableText}>No disponible</Text>
          </View>
        )}
      </View>

      <View style={ds.info}>
        <Text style={ds.dishName} numberOfLines={1}>{dish.name}</Text>
        {dish.description ? (
          <Text style={ds.dishDesc} numberOfLines={2}>{dish.description}</Text>
        ) : null}

        <View style={ds.priceRow}>
          <Text style={ds.price}>Q{parsePrice(dish.price)}</Text>
          {isAvailable && (
            quantity === 0 ? (
              <TouchableOpacity
                style={ds.addBtn}
                onPress={() => addItem(dish, restaurantId, restaurantName)}
                activeOpacity={0.8}
              >
                <Text style={ds.addBtnText}>+ Agregar</Text>
              </TouchableOpacity>
            ) : (
              <View style={ds.qtyRow}>
                <TouchableOpacity style={ds.qtyBtn} onPress={() => removeItem(dish._id)}>
                  <Feather name="minus" size={14} color={DARK} />
                </TouchableOpacity>
                <Text style={ds.qtyNum}>{quantity}</Text>
                <TouchableOpacity
                  style={[ds.qtyBtn, ds.qtyBtnActive]}
                  onPress={() => addItem(dish, restaurantId, restaurantName)}
                >
                  <Feather name="plus" size={14} color={WHITE} />
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
};

const ds = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    marginBottom: 10,
    overflow: 'hidden',
  },
  imgWrap: { height: 130, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: { backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  typeBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700', color: DARK },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  unavailableText: { color: WHITE, fontWeight: '700', fontSize: 12 },
  info: { padding: 12 },
  dishName: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 2 },
  dishDesc: { fontSize: 11, color: MUTED, lineHeight: 16, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 15, fontWeight: '800', color: DARK },
  addBtn: {
    backgroundColor: ORANGE, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  addBtnText: { color: WHITE, fontSize: 12, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  qtyNum: { fontSize: 13, fontWeight: '800', color: DARK, minWidth: 16, textAlign: 'center' },
});

/* ── REVIEW CARD ─────────────────────────────────────────────── */
const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const isOwner = currentUserId &&
    (review.userId === currentUserId || review.userId?._id === currentUserId);
  const initial = (review.userInfo?.name || 'U').charAt(0).toUpperCase();
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <View style={rv.card}>
      <View style={rv.accent} />
      <View style={rv.header}>
        <View style={rv.avatarWrap}>
          <Text style={rv.avatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={rv.userName}>{review.userInfo?.name || 'Usuario'}</Text>
          <Text style={rv.date}>{dateStr}</Text>
        </View>
        <StarRating value={review.rating} size={13} />
      </View>
      <Text style={rv.comment}>{review.comment || 'Sin comentario'}</Text>
      {isOwner && (
        <View style={rv.actions}>
          <TouchableOpacity style={rv.editBtn} onPress={() => onEdit(review)}>
            <Text style={rv.editBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={rv.deleteBtn} onPress={() => onDelete(review._id)}>
            <Text style={rv.deleteBtnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const rv = StyleSheet.create({
  card: {
    backgroundColor: WHITE, borderRadius: 20, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute', top: 0, left: 0,
    width: 4, height: '100%', backgroundColor: 'rgba(232,101,10,0.15)',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatarWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: WHITE, fontWeight: '800', fontSize: 16 },
  userName: { fontSize: 13, fontWeight: '700', color: DARK },
  date: { fontSize: 10, color: MUTED, marginTop: 1 },
  comment: { fontSize: 13, color: '#444', lineHeight: 20, paddingLeft: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
  editBtn: {
    backgroundColor: '#EFF6FF', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  editBtnText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },
  deleteBtn: {
    backgroundColor: '#FEF2F2', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  deleteBtnText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
});

/* ── BOTTOM NAV ──────────────────────────────────────────────── */
// Replica visualmente el tab bar de ClientTabs para pantallas fuera del Tab navigator
const TABS = [
  { name: 'Inicio',      icon: 'home',      screen: 'Inicio' },
  { name: 'Mis Pedidos', icon: 'file-text', screen: 'Mis Pedidos' },
  { name: 'Perfil',      icon: 'user',      screen: 'Perfil' },
];

const BottomNav = ({ navigation }) => (
  <View style={nb.bar}>
    {TABS.map(({ name, icon, screen }) => (
      <TouchableOpacity
        key={name}
        style={nb.tab}
        onPress={() => navigation.navigate('ClientTabs', { screen })}
        activeOpacity={0.7}
      >
        <View style={nb.iconWrap}>
          <Feather name={icon} size={16} color={MUTED} />
        </View>
        <Text style={nb.label}>{name}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const nb = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderTopColor: 'rgba(0,0,0,0.07)',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: MUTED,
    letterSpacing: 0.3,
  },
});

/* ── PANTALLA PRINCIPAL ──────────────────────────────────────── */
export default function RestaurantDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const user = useAuthStore((s) => s.user);
  const { reviews, loading: loadingReviews, submitting, fetchReviews, createReview, updateReview, deleteReview } = useReviewStore();
  const { items, addItem, getTotalItems, openCart, restaurantId: cartRestId } = useCartStore();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeTab, setActiveTab]   = useState('menu');
  const [activeType, setActiveType] = useState('TODOS');
  const [searchDish, setSearchDish] = useState('');

  const [reviewRating,  setReviewRating]  = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [reviewMsg,     setReviewMsg]     = useState(null);

  /* Carga datos */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [restRes, dishRes] = await Promise.all([
          getRestaurantByIdRequest(id),
          getDishesRequest(id),
        ]);
        const restData  = restRes.data?.data ?? restRes.data?.restaurant ?? restRes.data;
        const allDishes = dishRes.data?.data ?? dishRes.data?.dishes ?? [];
        setRestaurant(restData);
        setDishes(allDishes);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el restaurante');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => { if (id) fetchReviews(id); }, [id]);

  const filteredDishes = dishes.filter((d) => {
    const matchType   = activeType === 'TODOS' || d.type === activeType;
    const matchSearch = d.name.toLowerCase().includes(searchDish.toLowerCase());
    return matchType && matchSearch;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const resetForm = () => { setReviewRating(0); setReviewComment(''); setEditingReview(null); };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      setReviewMsg({ type: 'error', text: 'Selecciona una calificación.' });
      setTimeout(() => setReviewMsg(null), 3000);
      return;
    }
    const result = editingReview
      ? await updateReview(editingReview._id, { rating: reviewRating, comment: reviewComment })
      : await createReview(id, { rating: reviewRating, comment: reviewComment });

    if (result.success) {
      setReviewMsg({ type: 'success', text: editingReview ? 'Reseña actualizada.' : '¡Reseña publicada!' });
      resetForm();
    } else {
      setReviewMsg({ type: 'error', text: result.message });
    }
    setTimeout(() => setReviewMsg(null), 3000);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment || '');
    setActiveTab('reviews');
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert('Eliminar reseña', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteReview(reviewId) },
    ]);
  };

  const totalItems = getTotalItems();
  const isCartHere = cartRestId === id;

  /* ── LOADING / ERROR ── */
  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={ORANGE} />
      <Text style={s.loadingText}>Preparando el menú...</Text>
    </View>
  );

  if (error || !restaurant) return (
    <View style={s.center}>
      <Feather name="alert-circle" size={48} color={MUTED} style={{ marginBottom: 12 }} />
      <Text style={s.errorTitle}>Restaurante no disponible</Text>
      <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
        <Text style={s.backBtnText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );

  /* ── RENDER ── */
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.root}>

        {/* ── 1. HEADER GLOBAL ─────────────────────────────── */}
        <AppHeader navigation={navigation} />

        {/* ── 2. CONTENIDO SCROLLABLE ──────────────────────── */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

          {/* HERO */}
          <View style={s.hero}>
            <Image
              source={{ uri: restaurant.photo || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg' }}
              style={s.heroImg}
              resizeMode="cover"
            />
            <View style={s.heroOverlay} />

            {/* Botón volver */}
            <TouchableOpacity style={s.backCircle} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={20} color={WHITE} />
            </TouchableOpacity>

            {/* Nombre */}
            <View style={s.heroBottom}>
              <View style={s.heroBadge}>
                <Text style={s.heroBadgeText}>Abierto ahora</Text>
              </View>
              <Text style={s.heroName}>{restaurant.name}.</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name="map-pin" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={s.heroAddr}>{restaurant.address}</Text>
              </View>
            </View>
          </View>

          {/* INFO CARDS */}
          <View style={s.infoRow}>
            {[
              { icon: 'star',        label: 'Rating',   value: avgRating ?? (restaurant.averageRating?.toFixed(1) || 'Nuevo') },
              { icon: 'dollar-sign', label: 'Precio',   value: restaurant.averagePrice != null ? `Q${Number(restaurant.averagePrice).toFixed(0)}` : 'N/D' },
              { icon: 'clock',       label: 'Horario',  value: restaurant.openingHours ? `${restaurant.openingHours}-${restaurant.closingHours}` : 'N/D' },
              { icon: 'phone',       label: 'Contacto', value: restaurant.phone || 'N/D' },
            ].map(({ icon, label, value }) => (
              <View key={label} style={s.infoCard}>
                <Feather name={icon} size={14} color={ORANGE} />
                <Text style={s.infoLabel}>{label}</Text>
                <Text style={s.infoValue} numberOfLines={1}>{value}</Text>
              </View>
            ))}
          </View>

          {/* TABS MENÚ / RESEÑAS */}
          <View style={s.tabRow}>
            {[
              { key: 'menu',    label: 'Menú' },
              { key: 'reviews', label: `Reseñas${reviews.length > 0 ? ` (${reviews.length})` : ''}` },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[s.tab, activeTab === key && s.tabActive]}
                onPress={() => setActiveTab(key)}
                activeOpacity={0.8}
              >
                <Text style={[s.tabText, activeTab === key && s.tabTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── TAB: MENÚ ── */}
          {activeTab === 'menu' ? (
            <View style={{ padding: 16, paddingBottom: 100 }}>

              {/* Búsqueda */}
              <View style={s.searchBar}>
                <Feather name="search" size={14} color={MUTED} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Buscar platillo..."
                  placeholderTextColor={MUTED}
                  value={searchDish}
                  onChangeText={setSearchDish}
                />
              </View>

              {/* Chips de tipo */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {DISH_TYPES.map(({ value, label }) => (
                    <TouchableOpacity
                      key={value}
                      style={[s.typeChip, activeType === value && s.typeChipActive]}
                      onPress={() => setActiveType(value)}
                      activeOpacity={0.75}
                    >
                      <Text style={[s.typeChipText, activeType === value && s.typeChipTextActive]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Platillos */}
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => (
                  <DishCard
                    key={dish._id}
                    dish={dish}
                    restaurantId={id}
                    restaurantName={restaurant.name}
                  />
                ))
              ) : (
                <View style={s.emptyDishes}>
                  <Feather name="coffee" size={36} color={MUTED} style={{ marginBottom: 10 }} />
                  <Text style={s.emptyText}>Sin platillos en esta categoría</Text>
                </View>
              )}
            </View>

          ) : (
            /* ── TAB: RESEÑAS ── */
            <View style={{ padding: 16, paddingBottom: 100 }}>

              {/* Resumen rating */}
              {reviews.length > 0 && avgRating && (
                <View style={s.ratingBox}>
                  <Text style={s.ratingNum}>{avgRating}</Text>
                  <StarRating value={Math.round(parseFloat(avgRating))} size={18} />
                  <Text style={s.ratingCount}>{reviews.length} experiencias</Text>
                </View>
              )}

              {/* Formulario */}
              {user ? (
                <View style={s.reviewForm}>
                  <Text style={s.formTitle}>{editingReview ? 'Editar reseña' : 'Tu experiencia'}</Text>

                  {reviewMsg && (
                    <View style={[s.msgBox, reviewMsg.type === 'success' ? s.msgSuccess : s.msgError]}>
                      <Text style={[s.msgText, reviewMsg.type === 'success' ? s.msgTextSuccess : s.msgTextError]}>
                        {reviewMsg.text}
                      </Text>
                    </View>
                  )}

                  <View style={s.starsWrap}>
                    <Text style={s.formLabel}>Calificación</Text>
                    <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
                  </View>

                  <Text style={[s.formLabel, { marginBottom: 6 }]}>Comentario</Text>
                  <TextInput
                    style={s.textarea}
                    placeholder="¿Qué tal estuvo la comida?"
                    placeholderTextColor={MUTED}
                    value={reviewComment}
                    onChangeText={setReviewComment}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    style={s.submitBtn}
                    onPress={handleSubmitReview}
                    disabled={submitting}
                    activeOpacity={0.85}
                  >
                    <Text style={s.submitBtnText}>
                      {submitting ? 'Enviando...' : editingReview ? 'Guardar cambios' : 'Publicar reseña'}
                    </Text>
                  </TouchableOpacity>

                  {editingReview && (
                    <TouchableOpacity style={s.cancelBtn} onPress={resetForm}>
                      <Text style={s.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={s.loginPrompt}>
                  <Feather name="lock" size={28} color={MUTED} style={{ marginBottom: 8 }} />
                  <Text style={s.loginPromptTitle}>¿Te gustó el lugar?</Text>
                  <Text style={s.loginPromptSub}>Inicia sesión para dejar una reseña</Text>
                  <TouchableOpacity style={s.loginPromptBtn} onPress={() => navigation.navigate('Login')}>
                    <Text style={s.loginPromptBtnText}>Identificarse</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Lista de reseñas */}
              <Text style={s.reviewsTitle}>Comentarios recientes</Text>
              {loadingReviews ? (
                <ActivityIndicator color={ORANGE} style={{ marginTop: 20 }} />
              ) : reviews.length === 0 ? (
                <View style={s.emptyDishes}>
                  <Text style={s.emptyText}>Sin reseñas aún — ¡sé el primero!</Text>
                </View>
              ) : (
                reviews.map((r) => (
                  <ReviewCard
                    key={r._id}
                    review={r}
                    currentUserId={user?.id || user?._id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
                ))
              )}
            </View>
          )}

        </ScrollView>

        {/* ── 3. BOTÓN FLOTANTE CARRITO ────────────────────── */}
        {isCartHere && totalItems > 0 && (
          <TouchableOpacity style={s.cartFab} onPress={openCart} activeOpacity={0.9}>
            <Text style={s.cartFabText}>Ver mi orden</Text>
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ── 4. NAVBAR INFERIOR ───────────────────────────── */}
        <BottomNav navigation={navigation} />

      </View>
    </KeyboardAvoidingView>
  );
}

/* ── ESTILOS ─────────────────────────────────────────────────── */
const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: CREAM },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: CREAM },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: '600', color: MUTED },
  errorTitle:  { fontSize: 16, fontWeight: '700', color: DARK, marginBottom: 16 },
  backBtn:     { backgroundColor: DARK, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  backBtnText: { color: WHITE, fontWeight: '700', fontSize: 14 },

  /* Hero */
  hero:        { height: 240, position: 'relative' },
  heroImg:     { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  backCircle:  {
    position: 'absolute', top: 16, left: 16,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBottom:  { position: 'absolute', bottom: 16, left: 16, right: 16 },
  heroBadge:   {
    backgroundColor: ORANGE, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 6,
  },
  heroBadgeText: { color: WHITE, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  heroName:    { fontSize: 26, fontWeight: '900', color: WHITE, letterSpacing: -0.5, marginBottom: 4 },
  heroAddr:    { fontSize: 11, color: 'rgba(255,255,255,0.7)' },

  /* Info cards */
  infoRow:  { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  infoCard: {
    flex: 1, backgroundColor: WHITE, borderRadius: 12,
    padding: 10, alignItems: 'center', gap: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
  },
  infoLabel: { fontSize: 8, fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 11, fontWeight: '800', color: DARK, textAlign: 'center' },

  /* Tabs menú/reseñas */
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4 },
  tab:        { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: CREAM },
  tabActive:  { backgroundColor: DARK },
  tabText:    { fontSize: 12, fontWeight: '700', color: MUTED },
  tabTextActive: { color: WHITE },

  /* Search */
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: WHITE, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
  },
  searchInput: { flex: 1, fontSize: 13, color: DARK, padding: 0 },

  /* Type chips */
  typeChip:         { backgroundColor: WHITE, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  typeChipActive:   { backgroundColor: DARK, borderColor: DARK },
  typeChipText:     { fontSize: 11, fontWeight: '700', color: MUTED },
  typeChipTextActive: { color: WHITE },

  /* Empty */
  emptyDishes: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 48, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
    borderStyle: 'dashed', backgroundColor: WHITE,
  },
  emptyText: { fontSize: 13, color: MUTED, fontWeight: '600' },

  /* Rating box */
  ratingBox:   { backgroundColor: DARK, borderRadius: 20, padding: 20, alignItems: 'center', gap: 8, marginBottom: 16 },
  ratingNum:   { fontSize: 48, fontWeight: '900', color: WHITE, lineHeight: 52 },
  ratingCount: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },

  /* Review form */
  reviewForm:  { backgroundColor: WHITE, borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)' },
  formTitle:   { fontSize: 18, fontWeight: '900', color: DARK, marginBottom: 12, letterSpacing: -0.3 },
  formLabel:   { fontSize: 10, fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  starsWrap:   { marginBottom: 16 },
  textarea: {
    backgroundColor: CREAM, borderRadius: 12,
    padding: 12, fontSize: 13, color: DARK,
    minHeight: 90, marginBottom: 14,
  },
  submitBtn:     { backgroundColor: DARK, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  submitBtnText: { color: WHITE, fontWeight: '800', fontSize: 13, letterSpacing: 0.3 },
  cancelBtn:     { backgroundColor: CREAM, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { color: MUTED, fontWeight: '700', fontSize: 13 },

  /* Feedback */
  msgBox:         { borderRadius: 10, padding: 10, marginBottom: 12 },
  msgSuccess:     { backgroundColor: '#F0FDF4' },
  msgError:       { backgroundColor: '#FEF2F2' },
  msgText:        { fontSize: 12, fontWeight: '700' },
  msgTextSuccess: { color: '#16A34A' },
  msgTextError:   { color: '#DC2626' },

  /* Login prompt */
  loginPrompt:      { backgroundColor: WHITE, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.1)' },
  loginPromptTitle: { fontSize: 15, fontWeight: '800', color: DARK, marginBottom: 4 },
  loginPromptSub:   { fontSize: 12, color: MUTED, marginBottom: 16 },
  loginPromptBtn:   { backgroundColor: DARK, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 10 },
  loginPromptBtnText: { color: WHITE, fontWeight: '700', fontSize: 13 },

  /* Reviews title */
  reviewsTitle: { fontSize: 11, fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },

  /* Cart FAB */
  cartFab: {
    position: 'absolute', bottom: 80, left: 40, right: 40,
    backgroundColor: DARK, borderRadius: 30,
    flexDirection: 'row', alignItems: 'center',
    paddingLeft: 24, paddingRight: 6, paddingVertical: 6,
    justifyContent: 'space-between',
    shadowColor: DARK, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 8,
  },
  cartFabText:  { color: WHITE, fontWeight: '800', fontSize: 13, letterSpacing: 0.3 },
  cartBadge:    { width: 40, height: 40, borderRadius: 20, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: WHITE, fontWeight: '900', fontSize: 15 },
});