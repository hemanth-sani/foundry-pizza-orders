import { useCart } from "../hooks/useCart";
import { placeOrder } from "../hooks/usePlaceOrder";
import Layout from "../Layout";
import css from "./CartPage.module.css";
import { useState } from "react";

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const [orderMsg, setOrderMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOrder = async () => {
    if (cart.length === 0) {
      setOrderMsg("⚠️ Your cart is empty!");
      return;
    }

    setIsLoading(true);
    try {
       console.log("Cart before placing order:", cart); // Add this
  const result = await placeOrder(cart);
  console.log("Place order result:", result);

      if (result.orderStatus === "fulfilled") {
        setOrderMsg("✅ Order placed successfully!");
        clearCart();
      } else {
        setOrderMsg(`❌ Order Denied: ${result.denialReason || "Unknown reason"}`);
      }
    } catch (error) {
      setOrderMsg("❌ Something went wrong while placing the order.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <h2>🛒 Cart</h2>

      {cart.length === 0 && <p>No pizzas in cart.</p>}

      {cart.map((item) => (
        <div key={item.pizza.pizzaId}>
          🍕 <strong>{item.pizza.name}</strong> ({item.pizza.size}) × {item.quantity}
        </div>
      ))}

      <button className={css.clearButton} onClick={handleOrder} disabled={isLoading}>
        {isLoading ? "Placing Order..." : "🚀 Place Order"}
      </button>

      {orderMsg && <p>{orderMsg}</p>}
    </Layout>
  );
}



// 1. step placeOrder(cart) it should also get updated in the orders page and get updated to the ontology object type.
// 2.your checking but when the recipe is used then subtract the quantity from the inventory and get updated in the ontology object type and UI.
// 3. where is it displayed 
// 4