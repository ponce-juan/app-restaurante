import { Order } from "./order.model";

export interface Table {
  id?: number;
  number: number;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  location: 'INDOOR' | 'OUTDOOR';
  order?: Order;
}
