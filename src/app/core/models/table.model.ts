import { OrderType } from "./order.types.model";

export interface Table {
  id?: number;
  number: number;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  location: 'INDOOR' | 'OUTDOOR';
  order?: Order;
}

export interface Order {
  id: number;
  client?: string;
  type: OrderType;
  items: Item[];
  total: number;
}
export interface Item {
  name: string;
  quantity: number;
  price: number;
}