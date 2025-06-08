import { createContext } from "react";

export type Pizza = {
  pizzaId: string;
  pizzaTypeId: string;
  name: string;
  size: string;
  price: number;
  ingredients: string;
};

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (pizza: Pizza) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
