export interface Order {
  id?: number;
  type: OrderType;
  items: Item[];
  status: OrderStatus;
  total: number;
}

export interface OrderRequest {
  id?: number;
  type: OrderType;
  items: Item[];
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  total: number;
}

export interface Item {
  name: string;
  quantity: number;
  price: number;
}
export interface OrderStatus {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
}

export interface OrderType {
    id: number;
    type: "TAKE_AWAY" | "DELIVERY" | "DINE_IN";
}
