import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    RefreshControl, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useReservationStore } from '../../../shared/store/useReservationStore';
import AppHeader from '../../../shared/components/AppHeader';

const ORANGE = '#E8650A';
const DARK = '#1A1A1A';
const CREAM = '#F5F3EF';
const MUTED = '#8A8680';
const WHITE = '#FFFFFF';
const RED = '#EF4444';

/* ── Filtros de estado ───────────────────────────────────────── */
const STATUS_FILTERS = [
    { value: 'TODOS', label: 'Todas', icon: 'list' },
    { value: 'PENDIENTE', label: 'Pendientes', icon: 'clock' },
    { value: 'CONFIRMADA', label: 'Confirmadas', icon: 'check' },
    { value: 'COMPLETADA', label: 'Completadas', icon: 'check-circle' },
    { value: 'CANCELADA', label: 'Canceladas', icon: 'x-circle' },
];

/* ── Tarjeta de reservación ──────────────────────────────────── */
function ReservationCard({ reservation, getStatusLabel, getStatusColors, getStatusIcon, onCancel, onPress }) {
    const colors = getStatusColors(reservation.status);
    const canCancel = reservation.status === 'PENDIENTE' || reservation.status === 'CONFIRMADA';

    const dateStr = reservation.date
        ? new Date(reservation.date).toLocaleDateString('es-GT', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
        })
        : '—';

    return (
        <TouchableOpacity style={rc.card} onPress={onPress} activeOpacity={0.88}>
            <View style={[rc.statusBar, { backgroundColor: colors.bg }]} />
            <View style={rc.inner}>

                {/* Cabecera */}
                <View style={rc.head}>
                    <View style={rc.headLeft}>
                        <Text style={rc.restaurantName} numberOfLines={1}>
                            {reservation.restaurant?.name ?? 'Restaurante'}
                        </Text>
                        <View style={rc.infoRow}>
                            <Feather name="calendar" size={10} color={MUTED} />
                            <Text style={rc.infoText}>{dateStr}</Text>
                        </View>
                        <View style={rc.infoRow}>
                            <Feather name="clock" size={10} color={MUTED} />
                            <Text style={rc.infoText}>{reservation.time ?? '—'}</Text>
                        </View>
                    </View>

                    <View style={[rc.statusPill, { backgroundColor: colors.bg }]}>
                        <Text style={rc.statusEmoji}>{getStatusIcon(reservation.status)}</Text>
                        <Text style={[rc.statusLabel, { color: colors.text }]}>
                            {getStatusLabel(reservation.status)}
                        </Text>
                    </View>
                </View>

                <View style={rc.divider} />

                {/* Detalles */}
                <View style={rc.detailsRow}>
                    <View style={rc.detailItem}>
                        <Feather name="users" size={12} color={MUTED} />
                        <Text style={rc.detailText}>
                            {reservation.numberOfGuests} comensal{reservation.numberOfGuests !== 1 ? 'es' : ''}
                        </Text>
                    </View>
                    {/* Campo `number` del modelo (no `tableNumber`) */}
                    {reservation.table?.number && (
                        <View style={rc.detailItem}>
                            <Feather name="grid" size={12} color={MUTED} />
                            <Text style={rc.detailText}>Mesa {reservation.table.number}</Text>
                        </View>
                    )}
                    {reservation.specialRequests ? (
                        <View style={[rc.detailItem, { flex: 1 }]}>
                            <Feather name="message-square" size={12} color={MUTED} />
                            <Text style={[rc.detailText, { flex: 1 }]} numberOfLines={1}>
                                {reservation.specialRequests}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* Botón cancelar */}
                {canCancel && (
                    <TouchableOpacity
                        style={rc.cancelBtn}
                        onPress={() => onCancel(reservation)}
                        activeOpacity={0.8}
                    >
                        <Feather name="x-circle" size={12} color={RED} />
                        <Text style={rc.cancelBtnText}>Cancelar reservación</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

/* ── Modal de confirmación de cancelación ────────────────────── */
function CancelConfirmModal({ visible, reservation, onCancel, onConfirm }) {
    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
            <Pressable style={cm.backdrop} onPress={onCancel}>
                <Pressable style={cm.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={cm.iconWrap}>
                        <Feather name="alert-triangle" size={26} color={RED} />
                    </View>
                    <Text style={cm.title}>¿Cancelar reservación?</Text>
                    <Text style={cm.sub}>
                        {reservation
                            ? `Reservación en ${reservation.restaurant?.name ?? 'el restaurante'} el ${new Date(reservation.date).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })} a las ${reservation.time}`
                            : ''}
                    </Text>
                    <Text style={cm.warn}>Esta acción no se puede deshacer.</Text>
                    <View style={cm.actions}>
                        <TouchableOpacity style={cm.btnSecondary} onPress={onCancel} activeOpacity={0.8}>
                            <Text style={cm.btnSecondaryText}>Mantener</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={cm.btnDanger} onPress={onConfirm} activeOpacity={0.8}>
                            <Feather name="x" size={14} color={WHITE} />
                            <Text style={cm.btnDangerText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function MyReservationsScreen({ navigation }) {
    const {
        reservations, loading, error,
        fetchReservations, cancelReservation, clearError,
        getStatusLabel, getStatusColors, getStatusIcon,
    } = useReservationStore();

    const [filterStatus, setFilterStatus] = useState('TODOS');
    const [refreshing, setRefreshing] = useState(false);
    const [cancelTarget, setCancelTarget] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchReservations();
        }, [])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchReservations();
        setRefreshing(false);
    }, []);

    const handleConfirmCancel = async () => {
        if (!cancelTarget) return;
        await cancelReservation(cancelTarget._id);
        setCancelTarget(null);
    };

    const filtered = filterStatus === 'TODOS'
        ? reservations
        : reservations.filter((r) => r.status === filterStatus);

    const countByStatus = (val) =>
        val === 'TODOS'
            ? reservations.length
            : reservations.filter((r) => r.status === val).length;

    return (
        <View style={s.screen}>
            <AppHeader navigation={navigation} />

            {/* ── Hero ── */}
            <View style={s.hero}>
                <View>
                    <Text style={s.heroTitle}>
                        Mis <Text style={s.heroAccent}>Reservaciones</Text>
                    </Text>
                    <Text style={s.heroSub}>Historial de tus reservas en restaurantes</Text>
                </View>
                <View style={s.heroCount}>
                    <Text style={s.heroCountNum}>{reservations.length}</Text>
                    <Text style={s.heroCountLabel}>Total</Text>
                </View>
            </View>

            {/* ── Filtros ── */}
            <View style={s.filtersWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.filtersRow}
                >
                    {STATUS_FILTERS.map(({ value, label, icon }) => {
                        const active = filterStatus === value;
                        const count = countByStatus(value);
                        return (
                            <TouchableOpacity
                                key={value}
                                style={[s.filterBtn, active && s.filterBtnActive]}
                                onPress={() => setFilterStatus(value)}
                                activeOpacity={0.8}
                            >
                                <Feather name={icon} size={11} color={active ? WHITE : MUTED} />
                                <Text style={[s.filterText, active && s.filterTextActive]}>{label}</Text>
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

            {/* ── Error ── */}
            {error && (
                <View style={s.errorBanner}>
                    <Feather name="alert-circle" size={14} color={RED} />
                    <Text style={s.errorText}>{error}</Text>
                    <TouchableOpacity onPress={clearError}>
                        <Feather name="x" size={14} color={RED} />
                    </TouchableOpacity>
                </View>
            )}

            {/* ── Contenido ── */}
            {loading && !refreshing ? (
                <View style={s.center}>
                    <ActivityIndicator size="large" color={ORANGE} />
                    <Text style={s.loadingText}>Cargando reservaciones...</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[s.list, filtered.length === 0 && s.listEmpty]}
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
                                <Feather name="calendar" size={30} color={MUTED} />
                            </View>
                            <Text style={s.emptyTitle}>
                                {filterStatus === 'TODOS' ? 'Sin reservaciones aún' : 'Nada aquí'}
                            </Text>
                            <Text style={s.emptySub}>
                                {filterStatus === 'TODOS'
                                    ? 'Cuando hagas tu primera reservación aparecerá aquí.'
                                    : 'No hay reservaciones con este estado por ahora.'}
                            </Text>
                            {filterStatus === 'TODOS' && (
                                <TouchableOpacity
                                    style={s.emptyBtn}
                                    onPress={() => navigation.navigate('Inicio')}
                                    activeOpacity={0.85}
                                >
                                    <Feather name="compass" size={14} color={WHITE} />
                                    <Text style={s.emptyBtnText}>Explorar restaurantes</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <>
                            <Text style={s.resultsLabel}>
                                {filtered.length} reservación{filtered.length !== 1 ? 'es' : ''}
                            </Text>
                            {filtered.map((r) => (
                                <ReservationCard
                                    key={r._id}
                                    reservation={r}
                                    getStatusLabel={getStatusLabel}
                                    getStatusColors={getStatusColors}
                                    getStatusIcon={getStatusIcon}
                                    onCancel={setCancelTarget}
                                    onPress={() =>
                                        navigation.navigate('ReservationDetail', { reservationId: r._id })
                                    }
                                />
                            ))}
                        </>
                    )}
                </ScrollView>
            )}

            <CancelConfirmModal
                visible={!!cancelTarget}
                reservation={cancelTarget}
                onCancel={() => setCancelTarget(null)}
                onConfirm={handleConfirmCancel}
            />
        </View>
    );
}

/* ── Tarjeta styles ──────────────────────────────────────────── */
const rc = StyleSheet.create({
    card: { backgroundColor: WHITE, borderRadius: 20, marginBottom: 14, overflow: 'hidden', flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
    statusBar: { width: 5 },
    inner: { flex: 1, padding: 14 },
    head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headLeft: { flex: 1, marginRight: 10 },
    restaurantName: { fontSize: 15, fontWeight: '900', color: DARK, letterSpacing: -0.3, marginBottom: 4 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
    infoText: { fontSize: 11, color: MUTED, fontWeight: '600' },
    statusPill: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, gap: 3 },
    statusEmoji: { fontSize: 14 },
    statusLabel: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.4 },
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 10 },
    detailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    detailText: { fontSize: 11, color: DARK, fontWeight: '700' },
    cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
    cancelBtnText: { fontSize: 11, fontWeight: '800', color: RED },
});

/* ── Modal styles ────────────────────────────────────────────── */
const cm = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
    sheet: { backgroundColor: WHITE, borderRadius: 24, padding: 24, width: '85%', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
    iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    title: { fontSize: 18, fontWeight: '900', color: DARK, letterSpacing: -0.3, textAlign: 'center' },
    sub: { fontSize: 12, color: MUTED, textAlign: 'center', lineHeight: 18 },
    warn: { fontSize: 11, color: RED, fontWeight: '700', textAlign: 'center' },
    actions: { flexDirection: 'row', gap: 10, marginTop: 8, width: '100%' },
    btnSecondary: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 13, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)' },
    btnSecondaryText: { fontSize: 13, fontWeight: '800', color: DARK },
    btnDanger: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 13, borderRadius: 16, backgroundColor: RED },
    btnDangerText: { fontSize: 13, fontWeight: '800', color: WHITE },
});

/* ── Screen styles ───────────────────────────────────────────── */
const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CREAM },

    hero: { backgroundColor: DARK, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroTitle: { fontSize: 26, fontWeight: '900', color: WHITE, letterSpacing: -0.5 },
    heroAccent: { color: ORANGE, fontStyle: 'italic' },
    heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 },
    heroCount: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 },
    heroCountNum: { fontSize: 26, fontWeight: '900', color: ORANGE, lineHeight: 28 },
    heroCountLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5 },

    filtersWrap: { backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', paddingVertical: 10 },
    filtersRow: { paddingHorizontal: 14, gap: 8, alignItems: 'center' },
    filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: 'transparent' },
    filterBtnActive: { backgroundColor: DARK, borderColor: DARK },
    filterText: { fontSize: 10, fontWeight: '800', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.3 },
    filterTextActive: { color: WHITE },
    filterBadge: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
    filterBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
    filterBadgeText: { fontSize: 9, fontWeight: '900', color: MUTED },
    filterBadgeTextActive: { color: WHITE },

    errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', margin: 14, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#FECACA' },
    errorText: { flex: 1, fontSize: 11, fontWeight: '700', color: RED },

    list: { padding: 14, paddingBottom: 36 },
    listEmpty: { flex: 1, justifyContent: 'center' },
    resultsLabel: { fontSize: 10, fontWeight: '800', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginLeft: 2 },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },

    empty: { alignItems: 'center', gap: 10, paddingVertical: 48 },
    emptyIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    emptyTitle: { fontSize: 17, fontWeight: '900', color: DARK, letterSpacing: -0.3 },
    emptySub: { fontSize: 12, color: MUTED, textAlign: 'center', maxWidth: 220, lineHeight: 18 },
    emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12, marginTop: 6 },
    emptyBtnText: { fontSize: 11, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});