import { useState, ReactNode } from "react";
import { CartContext, CartItem, Pizza } from "./CartContext";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (pizza: Pizza) => {
    setCart((prev) => {
      const found = prev.find((c) => c.pizza.pizzaId === pizza.pizzaId);
      if (found) {
        return prev.map((c) =>
          c.pizza.pizzaId === pizza.pizzaId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { pizza, quantity: 1 }];
    });
  };

  /* ➕ new helper */
  const decrement = (pizzaId: string) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.pizza.pizzaId === pizzaId ? { ...c, quantity: c.quantity - 1 } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, decrement, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
