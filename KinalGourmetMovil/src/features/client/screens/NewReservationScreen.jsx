import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useReservationStore } from '../../../shared/store/useReservationStore';

const ORANGE = '#E8650A';
const DARK = '#1A1A1A';
const CREAM = '#F5F3EF';
const MUTED = '#8A8680';
const WHITE = '#FFFFFF';
const BORDER = 'rgba(0,0,0,0.1)';
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const LOCATION_LABELS = {
    INTERIOR: 'Interior',
    TERRAZA: 'Terraza',
    VIP: 'VIP',
    BAR: 'Bar',
    PRIVADO: 'Privado',
};

const ChipSelector = ({ options, selected, onSelect, label, keyExtractor, labelExtractor }) => (
    <View style={cs.wrap}>
        <Text style={cs.label}>{label}</Text>
        <View style={cs.row}>
            {options.map((opt) => {
                const key = keyExtractor ? keyExtractor(opt) : String(opt);
                const display = labelExtractor ? labelExtractor(opt) : String(opt);
                const active = selected === key;
                return (
                    <TouchableOpacity
                        key={key}
                        style={[cs.chip, active && cs.chipActive]}
                        onPress={() => onSelect(key)}
                        activeOpacity={0.8}
                    >
                        <Text style={[cs.chipText, active && cs.chipTextActive]}>{display}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
);

/* ── Formatear fecha ─────────────────────────────────────────── */
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Seleccionar fecha';
    const [y, m, d] = dateStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d))
        .toLocaleDateString('es-GT', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
};

/* ── Próximos 30 días ────────────────────────────────────────── */
const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 1; i <= 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
};

/* ── Generador Dinámico de Horas ────────────────────────────── */
const generateTimeSlots = (opening, closing) => {
    // Si no vienen horarios válidos, devolvemos un fallback seguro
    if (!opening || !closing) return [];

    const slots = [];
    const startHour = parseInt(opening.split(':')[0], 10);
    const endHour = parseInt(closing.split(':')[0], 10);

    // Regla: Desde la hora en que abre hasta una hora ANTES de que cierre
    for (let hour = startHour; hour < endHour; hour++) {
        const formattedHour = String(hour).padStart(2, '0');
        slots.push(`${formattedHour}:00`);
        slots.push(`${formattedHour}:30`);
    }
    return slots;
};

/* ═══════════════════════════════════════════════════════════════ */
export default function NewReservationScreen({ route, navigation }) {
    const { restaurantId, restaurantName, openingHours, closingHours } = route.params ?? {};

    const {
        createReservation, submitting,
        tables, loadingTables, fetchAvailableTables, clearTables,
    } = useReservationStore();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [selectedTableId, setSelectedTableId] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [showDates, setShowDates] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const availableDates = getAvailableDates();
    const timeSlots = generateTimeSlots(openingHours || '12:00', closingHours || '22:00');
    useEffect(() => {
        if (restaurantId) fetchAvailableTables(restaurantId);
        return () => clearTables();
    }, [restaurantId]);

    const selectedTable = tables.find((t) => t._id === selectedTableId);
    const isFormFilled = selectedDate && selectedTime && numberOfGuests && selectedTableId;
    const isCapacityValid = selectedTable ? Number(numberOfGuests) <= selectedTable.capacity : true;
    const canSubmit = isFormFilled && isCapacityValid;

    /* ── Submit Modificado ── */
    const handleSubmit = async () => {
        if (!isFormFilled) {
            Alert.alert(
                'Campos requeridos',
                'Por favor selecciona fecha, hora, número de comensales y una mesa.'
            );
            return;
        }

        if (!isCapacityValid && selectedTable) {
            Alert.alert(
                'Mesa insuficiente 🪑',
                `La mesa seleccionada (Mesa ${selectedTable.number}) sólo permite un máximo de ${selectedTable.capacity} personas.`
            );
            return;
        }

        const payload = {
            restaurant: restaurantId,
            table: selectedTableId,
            date: selectedDate,
            time: selectedTime,
            numberOfGuests: Number(numberOfGuests),
            ...(specialRequests.trim() ? { specialRequests: specialRequests.trim() } : {}),
        };

        const result = await createReservation(payload);

        if (result.success) {
            setIsSuccess(true);

            setTimeout(() => {
                navigation.navigate('ClientTabs', { screen: 'Mis Reservaciones' });
            }, 3000);

        } else {
            Alert.alert('Error', result.message ?? 'No se pudo crear la reservación. Intenta de nuevo.');
        }
    };

    // Si la reservación fue un éxito, se muestra esta interfaz limpia antes de redirigir automáticamente
    if (isSuccess) {
        return (
            <View style={[s.screen, { justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: DARK }]}>
                <View style={{ alignItems: 'center', gap: 16 }}>
                    <Feather name="check-circle" size={80} color={ORANGE} />
                    <Text style={{ fontSize: 24, fontWeight: '900', color: WHITE, textAlign: 'center' }}>
                        ¡Reservación Creada!
                    </Text>
                    <Text style={{ fontSize: 14, color: CREAM, textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 }}>
                        Tu mesa para el día <Text style={{ color: ORANGE, fontWeight: '800' }}>{formatDateDisplay(selectedDate)}</Text> a las <Text style={{ color: ORANGE, fontWeight: '800' }}>{selectedTime} hrs</Text> ha sido registrada correctamente.
                    </Text>
                    <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <ActivityIndicator size="small" color={ORANGE} />
                        <Text style={{ fontSize: 12, color: MUTED, fontWeight: '600' }}>
                            Redirigiendo a mis reservaciones...
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // Si no ha terminado, se sigue mostrando el formulario normal de reservación
    return (
        <View style={s.screen}>

            {/* ── Header ── */}
            <View style={s.header}>
                <TouchableOpacity style={s.headerBack} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={18} color={WHITE} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={s.headerTitle}>Nueva Reservación</Text>
                    {restaurantName ? (
                        <Text style={s.headerSub} numberOfLines={1}>{restaurantName}</Text>
                    ) : null}
                </View>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                contentContainerStyle={s.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >

                {/* ── Fecha ── */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>
                        <Feather name="calendar" size={12} color={MUTED} />{'  '}Fecha
                    </Text>
                    <TouchableOpacity
                        style={[s.dateBtn, selectedDate && s.dateBtnSelected]}
                        onPress={() => setShowDates(!showDates)}
                        activeOpacity={0.8}
                    >
                        <Feather name="calendar" size={16} color={selectedDate ? ORANGE : MUTED} />
                        <Text style={[s.dateBtnText, selectedDate && s.dateBtnTextSelected]}>
                            {selectedDate ? formatDateDisplay(selectedDate) : 'Seleccionar fecha'}
                        </Text>
                        <Feather name={showDates ? 'chevron-up' : 'chevron-down'} size={14} color={MUTED} />
                    </TouchableOpacity>

                    {showDates && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.dateRow}
                        >
                            {availableDates.map((d) => {
                                const [y, m, day] = d.split('-');
                                const date = new Date(Number(y), Number(m) - 1, Number(day));
                                const dayName = date.toLocaleDateString('es-GT', { weekday: 'short' });
                                const dayNum = date.getDate();
                                const monthName = date.toLocaleDateString('es-GT', { month: 'short' });
                                const active = selectedDate === d;
                                return (
                                    <TouchableOpacity
                                        key={d}
                                        style={[s.dateChip, active && s.dateChipActive]}
                                        onPress={() => { setSelectedDate(d); setShowDates(false); }}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[s.dateChipDay, active && s.dateChipTextActive]}>{dayName}</Text>
                                        <Text style={[s.dateChipNum, active && s.dateChipNumActive]}>{dayNum}</Text>
                                        <Text style={[s.dateChipMonth, active && s.dateChipTextActive]}>{monthName}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>

                {/* ── Hora Dinámica ── */}
                <ChipSelector
                    label="Hora"
                    options={timeSlots}
                    selected={selectedTime}
                    onSelect={setSelectedTime}
                    keyExtractor={(t) => t}
                    labelExtractor={(t) => t}
                />

                {/* ── Comensales ── */}
                <ChipSelector
                    label="Número de comensales"
                    options={GUEST_OPTIONS}
                    selected={numberOfGuests}
                    onSelect={setNumberOfGuests}
                    keyExtractor={(n) => String(n)}
                    labelExtractor={(n) => `${n} ${n === 1 ? 'persona' : 'personas'}`}
                />

                {/* ── Selector de mesa ── */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>
                        <Feather name="grid" size={12} color={MUTED} />{'  '}Mesa
                    </Text>

                    {loadingTables ? (
                        <View style={s.tablesLoading}>
                            <ActivityIndicator size="small" color={ORANGE} />
                            <Text style={s.tablesLoadingText}>Cargando mesas disponibles...</Text>
                        </View>
                    ) : tables.length === 0 ? (
                        <View style={s.tablesEmpty}>
                            <Feather name="alert-circle" size={18} color={MUTED} />
                            <Text style={s.tablesEmptyText}>
                                No hay mesas disponibles en este restaurante por ahora.
                            </Text>
                        </View>
                    ) : (
                        <View style={s.tablesGrid}>
                            {tables.map((table) => {
                                const active = selectedTableId === table._id;
                                return (
                                    <TouchableOpacity
                                        key={table._id}
                                        style={[s.tableCard, active && s.tableCardActive]}
                                        onPress={() => setSelectedTableId(table._id)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[s.tableIconWrap, active && s.tableIconWrapActive]}>
                                            <Feather name="grid" size={16} color={active ? WHITE : MUTED} />
                                        </View>
                                        <Text style={[s.tableNum, active && s.tableNumActive]}>
                                            Mesa {table.number}
                                        </Text>
                                        <Text style={[s.tableCap, active && s.tableCapActive]}>
                                            Máx {table.capacity} {table.capacity === 1 ? 'persona' : 'personas'}
                                        </Text>
                                        {table.location && (
                                            <Text style={[s.tableLoc, active && s.tableLocActive]}>
                                                {LOCATION_LABELS[table.location] ?? table.location}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* ── Peticiones especiales ── */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>
                        <Feather name="message-square" size={12} color={MUTED} />{'  '}
                        Peticiones especiales (opcional)
                    </Text>
                    <TextInput
                        style={s.textarea}
                        value={specialRequests}
                        onChangeText={setSpecialRequests}
                        placeholder="Alergias, celebraciones, preferencias..."
                        placeholderTextColor={MUTED}
                        multiline
                        numberOfLines={3}
                        maxLength={500}
                        textAlignVertical="top"
                    />
                    <Text style={s.charCount}>{specialRequests.length}/500</Text>
                </View>

                {/* ── Resumen y advertencias visuales de capacidad ── */}
                {isFormFilled && (
                    <View style={[s.summaryCard, !isCapacityValid && s.summaryCardWarning]}>
                        <Text style={[s.summaryTitle, !isCapacityValid && s.summaryTitleWarning]}>
                            {isCapacityValid ? 'Resumen de tu reservación' : '⚠️ Capacidad Excedida'}
                        </Text>

                        {!isCapacityValid ? (
                            <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600', marginBottom: 4 }}>
                                Elegiste {numberOfGuests} personas para una mesa de {selectedTable?.capacity}.
                            </Text>
                        ) : null}

                        <View style={s.summaryRow}>
                            <Feather name="calendar" size={13} color={isCapacityValid ? ORANGE : '#DC2626'} />
                            <Text style={s.summaryText}>{formatDateDisplay(selectedDate)}</Text>
                        </View>
                        <View style={s.summaryRow}>
                            <Feather name="clock" size={13} color={isCapacityValid ? ORANGE : '#DC2626'} />
                            <Text style={s.summaryText}>{selectedTime} hrs</Text>
                        </View>
                        <View style={s.summaryRow}>
                            <Feather name="users" size={13} color={isCapacityValid ? ORANGE : '#DC2626'} />
                            <Text style={s.summaryText}>
                                {numberOfGuests} {Number(numberOfGuests) === 1 ? 'comensal' : 'comensales'}
                            </Text>
                        </View>
                        {selectedTable && (
                            <View style={s.summaryRow}>
                                <Feather name="grid" size={13} color={isCapacityValid ? ORANGE : '#DC2626'} />
                                <Text style={s.summaryText}>
                                    Mesa {selectedTable.number}
                                    {selectedTable.location
                                        ? ` · ${LOCATION_LABELS[selectedTable.location] ?? selectedTable.location}`
                                        : ''}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* ── Botón confirmar ── */}
                <TouchableOpacity
                    style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={!canSubmit || submitting}
                    activeOpacity={0.85}
                >
                    {submitting
                        ? <ActivityIndicator size="small" color={WHITE} />
                        : <Feather name="check-circle" size={18} color={WHITE} />}
                    <Text style={s.submitBtnText}>
                        {submitting ? 'Creando reservación...' : 'Confirmar Reservación'}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

/* ── Estilos correspondientes (Se añadieron variaciones para advertencias) ── */
const cs = StyleSheet.create({
    wrap: { backgroundColor: WHITE, borderRadius: 20, padding: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
    label: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: 'transparent' },
    chipActive: { backgroundColor: ORANGE, borderColor: ORANGE },
    chipText: { fontSize: 12, fontWeight: '700', color: MUTED },
    chipTextActive: { color: WHITE, fontWeight: '900' },
});

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: CREAM },
    content: { padding: 16, paddingBottom: 40, gap: 14 },
    header: { backgroundColor: DARK, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
    headerBack: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '900', color: WHITE, letterSpacing: -0.2, textAlign: 'center' },
    headerSub: { fontSize: 10, color: ORANGE, textAlign: 'center', fontWeight: '700' },
    section: { backgroundColor: WHITE, borderRadius: 20, padding: 16, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
    sectionTitle: { fontSize: 10, fontWeight: '900', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8 },
    dateBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
    dateBtnSelected: { borderColor: ORANGE, backgroundColor: '#FFF4ED' },
    dateBtnText: { flex: 1, fontSize: 13, color: MUTED, fontWeight: '600' },
    dateBtnTextSelected: { color: DARK, fontWeight: '800' },
    dateRow: { paddingVertical: 4, gap: 8 },
    dateChip: { alignItems: 'center', justifyContent: 'center', width: 60, paddingVertical: 10, borderRadius: 16, backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: 'transparent' },
    dateChipActive: { backgroundColor: ORANGE, borderColor: ORANGE },
    dateChipDay: { fontSize: 9, fontWeight: '700', color: MUTED, textTransform: 'uppercase' },
    dateChipNum: { fontSize: 20, fontWeight: '900', color: DARK },
    dateChipMonth: { fontSize: 9, fontWeight: '700', color: MUTED },
    dateChipTextActive: { color: 'rgba(255,255,255,0.8)' },
    dateChipNumActive: { color: WHITE },
    tablesLoading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
    tablesLoadingText: { fontSize: 12, color: MUTED, fontWeight: '600' },
    tablesEmpty: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FEF9C3', borderRadius: 12, padding: 14 },
    tablesEmptyText: { flex: 1, fontSize: 12, color: '#A16207', fontWeight: '600' },
    tablesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    tableCard: { width: '47%', alignItems: 'center', gap: 4, borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: BORDER, backgroundColor: '#F9FAFB' },
    tableCardActive: { borderColor: ORANGE, backgroundColor: '#FFF4ED' },
    tableIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
    tableIconWrapActive: { backgroundColor: ORANGE },
    tableNum: { fontSize: 13, fontWeight: '900', color: DARK },
    tableNumActive: { color: ORANGE },
    tableCap: { fontSize: 10, fontWeight: '700', color: MUTED },
    tableCapActive: { color: DARK },
    tableLoc: { fontSize: 9, fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 },
    tableLocActive: { color: ORANGE },
    textarea: { borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, padding: 12, minHeight: 80, fontSize: 13, color: DARK, lineHeight: 20 },
    charCount: { fontSize: 10, color: MUTED, textAlign: 'right' },

    /* Resúmenes (Con soporte a Alertas de Validación) */
    summaryCard: { backgroundColor: '#FFF4ED', borderRadius: 20, padding: 16, gap: 8, borderWidth: 1.5, borderColor: 'rgba(232,101,10,0.2)' },
    summaryCardWarning: { backgroundColor: '#FEF2F2', borderColor: 'rgba(220,38,38,0.2)' },
    summaryTitle: { fontSize: 12, fontWeight: '900', color: ORANGE, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    summaryTitleWarning: { color: '#DC2626' },
    summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    summaryText: { fontSize: 13, fontWeight: '700', color: DARK },

    /* Submit */
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: ORANGE, borderRadius: 20, paddingVertical: 18, marginTop: 4, shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
    submitBtnDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0 },
    submitBtnText: { fontSize: 14, fontWeight: '900', color: WHITE, textTransform: 'uppercase', letterSpacing: 0.5 },
});