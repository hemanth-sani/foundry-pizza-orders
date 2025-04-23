import { useCart } from "../hooks/useCart";
import Layout from "../Layout";
import css from "./CartPage.module.css";

export default function CartPage() {
  const { cart, clearCart } = useCart();

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.pizza.price),
    0
  );

  return (
    <Layout>
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={css.cartContainer}>
          <ul className={css.cartList}>
            {cart.map((item) => (
              <li key={item.pizza.pizzaId} className={css.cartItem}>
                <strong>{item.pizza.name}</strong> ({item.pizza.size})<br />
                {item.quantity} × ${Number(item.pizza.price).toFixed(2)} ={" "}
                <strong>${(item.quantity * Number(item.pizza.price)).toFixed(2)}</strong>
              </li>
            ))}
          </ul>

          <div className={css.summary}>
            <p><strong>Total Items:</strong> {totalQuantity}</p>
            <p><strong>Total Price:</strong> ${totalCost.toFixed(2)}</p>
            <button className={css.clearButton} onClick={clearCart}>
              🧹 Clear Cart
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
