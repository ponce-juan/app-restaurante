import { Product } from "./products";

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
  order?: Order;
}

export interface Order {
  id: number;
  items: Item[];
  total: number;
}
export interface Item {
  name: string;
  quantity: number;
  price: number;
}