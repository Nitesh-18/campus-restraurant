'use client';

import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import { CartItem } from '@/types';

const CART_STORAGE_KEY = 'campus-restaurant-cart';

type CartContextType = {
  cart: CartItem[];
  isLoaded: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: (taxRate?: number) => number;
  getTotal: (taxRate?: number) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Debounced save cart to localStorage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }, 500); // Increased debounce for smoother UI
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.product_id === item.product_id);

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity }];
    });
  }, []);


  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getItemCount = useMemo(() => () => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const getSubtotal = useMemo(() => () => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);
  const getTax = useMemo(() => (taxRate: number = 0.08) => getSubtotal() * taxRate, [getSubtotal]);
  const getTotal = useMemo(() => (taxRate: number = 0.08) => getSubtotal() + getTax(taxRate), [getSubtotal, getTax]);

  const value = useMemo<CartContextType>(() => ({
    cart,
    isLoaded,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    getSubtotal,
    getTax,
    getTotal,
  }), [cart, isLoaded, addToCart, updateQuantity, removeFromCart, clearCart, getItemCount, getSubtotal, getTax, getTotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}