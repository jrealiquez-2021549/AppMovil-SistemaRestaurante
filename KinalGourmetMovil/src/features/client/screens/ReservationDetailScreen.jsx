import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useReservationStore } from '../../../shared/store/useReservationStore';

const ORANGE = '#E8650A';
const DARK = '#1A1A1A';
const CREAM = '#F5F3EF';
const MUTED = '#8A8680';
const WHITE = '#FFFFFF';
const RED = '#EF4444';

/* ── Fila de info ────────────────────────────────────────────── */
const InfoRow = ({ icon, label, value }) => (
    <View style={s.infoRow}>
        <View style={s.infoIconWrap}>
            <Feather name={icon} size={14} color={ORANGE} />
        </View>
        <View style={s.infoTexts}>
            <Text style={s.infoLabel}>{label}</Text>
            <Text style={s.infoValue}>{value ?? '—'}</Text>
        </View>
    </View>
);

/* ── Modal cancelar ──────────────────────────────────────────── */
function CancelConfirmModal({ visible, onCancel, onConfirm }) {
    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
            <Pressable style={cm.backdrop} onPress={onCancel}>
                <Pressable style={cm.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={cm.iconWrap}>
                        <Feather name="alert-triangle" size={26} color={RED} />
                    </View>
                    <Text style={cm.title}>¿Cancelar reservación?</Text>
                    <Text style={cm.sub}>Esta acción no se puede deshacer.</Text>
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
export default function ReservationDetailScreen({ route, navigation }) {
    const { reservationId } = route.params ?? {};

    const {
        selectedReservation: reservation,
        loading, error,
        fetchReservationById, cancelReservation,
        clearSelectedReservation, clearError,
        getStatusLabel, getStatusColors, getStatusIcon,
    } = useReservationStore();

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (reservationId) fetchReservationById(reservationId);
        return () => clearSelectedReservation();
    }, [reservationId]);

    const handleCancel = async () => {
        setCancelling(true);
        const result = await cancelReservation(reservationId);
        setCancelling(false);
        setShowCancelModal(false);
        if (result.success) navigation.goBack();
    };

    const colors = reservation ? getStatusColors(reservation.status) : {};
    const canCancel = reservation?.status === 'PENDIENTE' || reservation?.status === 'CONFIRMADA';

    const dateStr = reservation?.date
        ? new Date(reservation.date).toLocaleDateString('es-GT', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        })
        : '—';

    if (loading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color={ORANGE} />
                <Text style={s.loadingText}>Cargando reservación...</Text>
            </View>
        );
    }

    if (error || !reservation) {
        return (
            <View style={s.center}>
                <Feather name="alert-circle" size={36} color={RED} />
                <Text style={s.errorTitle}>Error al cargar</Text>
                <Text style={s.errorSub}>{error ?? 'No se encontró la reservación.'}</Text>
                <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={14} color={WHITE} />
                    <Text style={s.backBtnText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={s.screen}>

            {/* ── Header ── */}
            <View style={s.header}>
                <TouchableOpacity style={s.headerBack} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={18} color={WHITE} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Detalle de Reservación</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

                {/* ── Estado ── */}
                <View style={[s.statusCard, { backgroundColor: colors.bg }]}>
                    <Text style={s.statusEmoji}>{getStatusIcon(reservation.status)}</Text>
                    <View>
                        <Text style={s.statusTitle}>Reservación {getStatusLabel(reservation.status)}</Text>
                        <Text style={[s.statusSub, { color: colors.text }]}>
                            {reservation.restaurant?.name ?? 'Restaurante'}
                        </Text>
                    </View>
                </View>

                {/* ── Info ── */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>Información</Text>
                    <InfoRow icon="map-pin" label="Restaurante" value={reservation.restaurant?.name} />
                    <InfoRow icon="calendar" label="Fecha" value={dateStr} />
                    <InfoRow icon="clock" label="Hora" value={reservation.time} />
                    <InfoRow icon="users" label="Comensales" value={String(reservation.numberOfGuests)} />
                    {/* Campo `number` (no `tableNumber`) según el modelo del backend */}
                    {reservation.table?.number && (
                        <InfoRow icon="grid" label="Mesa" value={`Mesa ${reservation.table.number}`} />
                    )}
                    {reservation.table?.location && (
                        <InfoRow icon="map" label="Ubicación" value={reservation.table.location} />
                    )}
                    {reservation.table?.capacity && (
                        <InfoRow icon="users" label="Capacidad mesa" value={`${reservation.table.capacity} personas`} />
                    )}
                </View>

                {/* ── Peticiones especiales ── */}
                {reservation.specialRequests ? (
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>Peticiones especiales</Text>
                        <View style={s.specialBox}>
                            <Feather name="message-square" size={14} color={MUTED} style={{ marginTop: 1 }} />
                            <Text style={s.specialText}>{reservation.specialRequests}</Text>
                        </View>
                    </View>
                ) : null}

                {/* ── Registro ── */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>Registro</Text>
                    <InfoRow
                        icon="plus-circle"
                        label="Creada el"
                        value={reservation.createdAt
                            ? new Date(reservation.createdAt).toLocaleString('es-GT')
                            : '—'}
                    />
                    <InfoRow
                        icon="refresh-cw"
                        label="Actualizada"
                        value={reservation.updatedAt
                            ? new Date(reservation.updatedAt).toLocaleString('es-GT')
                            : '—'}
                    />
                </View>

                {/* ── Cancelar ── */}
                {canCancel && (
                    <TouchableOpacity
                        style={s.cancelBtn}
                        onPress={() => setShowCancelModal(true)}
                        activeOpacity={0.85}
                        disabled={cancelling}
                    >
                        {cancelling
                            ? <ActivityIndicator size="small" color={WHITE} />
                            : <Feather name="x-circle" size={16} color={WHITE} />}
                        <Text style={s.cancelBtnText}>Cancelar reservación</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <CancelConfirmModal
                visible={showCancelModal}
                onCancel={() => setShowCancelModal(false)}
                onConfirm={handleCancel}
            />
        </View>
    );
}

/* ── Modal styles ────────────────────────────────────────────── */
const cm = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
    sheet: { backgroundColor: WHITE, borderRadius: 24, padding: 24, width: '85%', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
    iconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    title: { fontSize: 18, fontWeight: '900', color: DARK, letterSpacing: -0.3, textAlign: 'center' },
    sub: { fontSize: 12, color: MUTED, textAlign: 'center', lineHeight: 18 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 8, width: '100%' },
    btnSecondary: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 13, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)' },
    btnSecondaryText: { fontSize: 13, fontWeight: '800', color: DARK },
    btnDanger: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 13, borderRadius: 16, backgroundColor: RED },
    btnDangerText: { fontSize: 13, fontWeight: '800', color: WHITE },
});

/* ── Screen styles ───────────────────────────────────────────── */
const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CREAM },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: CREAM },
    content: { padding: 16, paddingBottom: 40, gap: 14 },

    header: { backgroundColor: DARK, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
    headerBack: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '900', color: WHITE, letterSpacing: -0.2 },

    statusCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 20, padding: 18 },
    statusEmoji: { fontSize: 36 },
    statusTitle: { fontSize: 17, fontWeight: '900', color: DARK, letterSpacing: -0.3 },
    statusSub: { fontSize: 12, fontWeight: '700', marginTop: 2 },

    section: { backgroundColor: WHITE, borderRadius: 20, padding: 16, gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
    sectionTitle: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },

    infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
    infoIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF4ED', alignItems: 'center', justifyContent: 'center' },
    infoTexts: { flex: 1 },
    infoLabel: { fontSize: 10, fontWeight: '800', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4 },
    infoValue: { fontSize: 14, fontWeight: '700', color: DARK, marginTop: 1 },

    specialBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12 },
    specialText: { flex: 1, fontSize: 13, color: DARK, lineHeight: 20 },

    cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: RED, borderRadius: 20, paddingVertical: 16, marginTop: 6 },
    cancelBtnText: { fontSize: 13, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },

    loadingText: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
    errorTitle: { fontSize: 17, fontWeight: '900', color: DARK },
    errorSub: { fontSize: 12, color: MUTED, textAlign: 'center', maxWidth: 240 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
    backBtnText: { fontSize: 12, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});