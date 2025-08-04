'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  isActive: boolean;
  isSaleActive: boolean;
  category: {
    name: string;
  };
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: { items: CartItem[]; totalAmount: number; totalItems: number } }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
}

// Initial state
const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        totalAmount: action.payload.totalAmount,
        totalItems: action.payload.totalItems,
        isLoading: false,
        error: null,
      };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );
      
      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
        const newTotalAmount = updatedItems.reduce(
          (total, item) => total + (Number(item.product.price) * item.quantity), 0
        );
        const newTotalItems = updatedItems.reduce(
          (total, item) => total + item.quantity, 0
        );
        
        return {
          ...state,
          items: updatedItems,
          totalAmount: newTotalAmount,
          totalItems: newTotalItems,
          isLoading: false,
          error: null,
        };
      } else {
        // Add new item
        const newItems = [...state.items, action.payload];
        const newTotalAmount = newItems.reduce(
          (total, item) => total + (Number(item.product.price) * item.quantity), 0
        );
        const newTotalItems = newItems.reduce(
          (total, item) => total + item.quantity, 0
        );
        
        return {
          ...state,
          items: newItems,
          totalAmount: newTotalAmount,
          totalItems: newTotalItems,
          isLoading: false,
          error: null,
        };
      }
    
    case 'UPDATE_ITEM':
      const itemsAfterUpdate = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totalAfterUpdate = itemsAfterUpdate.reduce(
        (total, item) => total + (Number(item.product.price) * item.quantity), 0
      );
      const totalItemsAfterUpdate = itemsAfterUpdate.reduce(
        (total, item) => total + item.quantity, 0
      );
      
      return {
        ...state,
        items: itemsAfterUpdate,
        totalAmount: totalAfterUpdate,
        totalItems: totalItemsAfterUpdate,
        isLoading: false,
        error: null,
      };
    
    case 'REMOVE_ITEM':
      const itemsAfterRemove = state.items.filter(item => item.id !== action.payload);
      const totalAfterRemove = itemsAfterRemove.reduce(
        (total, item) => total + (Number(item.product.price) * item.quantity), 0
      );
      const totalItemsAfterRemove = itemsAfterRemove.reduce(
        (total, item) => total + item.quantity, 0
      );
      
      return {
        ...state,
        items: itemsAfterRemove,
        totalAmount: totalAfterRemove,
        totalItems: totalItemsAfterRemove,
        isLoading: false,
        error: null,
      };
    
    case 'CLEAR_CART':
      return {
        ...initialState,
      };
    
    default:
      return state;
  }
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  // Fetch cart data
  const fetchCart = async () => {
    if (status !== 'authenticated' || !session?.user) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch('/api/cart');
      const result = await response.json();
      
      if (result.success) {
        dispatch({
          type: 'SET_CART',
          payload: result.data
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to fetch cart' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
    }
  };

  // Add to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!session?.user) {
      dispatch({ type: 'SET_ERROR', payload: 'Please login to add items to cart' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: 'ADD_ITEM', payload: result.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to add item to cart' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
    }
  };

  // Update cart item
  const updateCartItem = async (cartItemId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: 'UPDATE_ITEM', payload: { id: cartItemId, quantity } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to update cart item' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to remove cart item' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error' });
    }
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Load cart on session change
  useEffect(() => {
    fetchCart();
  }, [session?.user, status]);

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 