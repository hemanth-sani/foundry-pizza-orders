import { useState, ReactNode } from "react";
import { CartContext, CartItem, Pizza } from "./CartContext";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (pizza: Pizza) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.pizza.pizzaId === pizza.pizzaId);
      if (existing) {
        return prev.map((item) =>
          item.pizza.pizzaId === pizza.pizzaId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { pizza, quantity: 1 }];
      }
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
