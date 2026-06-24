import restauranteClient from "./restauranteClient";

export const getReviewsByRestaurantRequest = (restaurantId, page = 1) =>
  restauranteClient.get(`/reviews/restaurant/${restaurantId}?page=${page}`);

export const createReviewRequest = (data) =>
  restauranteClient.post("/reviews/create", data);

export const updateReviewRequest = (id, data) =>
  restauranteClient.put(`/reviews/${id}`, data);

export const deleteReviewRequest = (id) =>
  restauranteClient.delete(`/reviews/${id}`);