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

export interface OrderType {
    id: number;
    type: "TAKE_AWAY" | "DELIVERY" | "DINE_IN";
}
