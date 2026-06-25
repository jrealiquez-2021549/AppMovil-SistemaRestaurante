import restauranteClient from "./restauranteClient";

export const getDishesRequest = (restaurantId) =>
  restauranteClient.get(`/dishes/`, {
    params: restaurantId ? { restaurant: restaurantId } : {},
  });