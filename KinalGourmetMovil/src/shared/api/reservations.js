import restauranteClient from './restauranteClient';

export const getReservationsRequest = (params = {}) =>
    restauranteClient.get('/reservations/', { params });

export const getReservationByIdRequest = (id) =>
    restauranteClient.get(`/reservations/${id}`);

export const createReservationRequest = (data) =>
    restauranteClient.post('/reservations/create', data);

export const cancelReservationRequest = (id) =>
    restauranteClient.patch(`/reservations/${id}/status`, { status: 'CANCELADA' });

export const getAvailableTablesRequest = (restaurantId) =>
    restauranteClient.get('/tables/', {
        params: { restaurant: restaurantId, status: 'AVAILABLE', limit: 50 },
    });