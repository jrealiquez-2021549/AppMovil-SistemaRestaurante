import restauranteClient from "./restauranteClient";

export const getDishesRequest = () =>
  restauranteClient.get("/dishes/");