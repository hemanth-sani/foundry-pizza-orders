import { createContext } from "react";
import { HemanthBestSellingPizza } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

export type Pizza = Osdk.Instance<HemanthBestSellingPizza>;

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
