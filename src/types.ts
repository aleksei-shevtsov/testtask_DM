export interface IRestaurantJSON {
  address1: string;
  address2: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export interface IPizzaJSON {
  category: string;
  price: number;
  id: number;
  rank?: number;
  name: string;
}

export interface IRestaurant {
  value: string;
  label: string;
  id: number;
}

export interface IPizza {
  label: string;
  value: string;
  price: number;
}

export interface IOrder {
  restaurant: IRestaurant;
  product: IPizza;
  id: string;
}
