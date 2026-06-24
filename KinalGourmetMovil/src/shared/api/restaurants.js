import restauranteClient from "./restauranteClient";

export const getRestaurantByIdRequest = (id) =>
  restauranteClient.get(`/restaurants/${id}`);