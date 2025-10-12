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
  phone_number?: string | null;
  address?: string | null;
  role?: 'customer' | 'admin';
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'new' | 'accepted' | 'preparing' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_details?: {
    id?: string;
    full_name?: string | null;
    phone_number?: string | null;
    address?: string | null;
  } | null;
  profiles?: {
    id?: string;
    full_name: string | null;
    phone_number?: string | null;
    address?: string | null;
    role?: 'customer' | 'admin';
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
  user_id?: string | null;
  full_name?: string | null;
  address?: string | null;
}

export interface UpdateOrderStatusRequest {
  order_id: string;
  status: Order['status'];
}