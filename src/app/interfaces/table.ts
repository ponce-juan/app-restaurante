export interface Table {
  id: number;
  // name: string;
  number: number;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  location: 'INDOOR' | 'OUTDOOR';
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