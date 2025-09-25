export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  available: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'new' | 'accepted' | 'preparing' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
  };
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  products?: Product;
}

export interface CreateOrderRequest {
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
  total: number;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  order_id: string;
  status: Order['status'];
}