import { useCart } from "../hooks/useCart";
import { Pizza } from "../model/CartContext";
import styles from "./PizzaMenu.module.css";

interface Props {
  name: string;
  variants: Pizza[];
}

export default function PizzaCard({ name, variants }: Props) {
  const { cart, addToCart, decrement } = useCart();
  const ingredients = variants[0].ingredients;

  return (
    <div className={styles.pizzaCard}>
      <h3 className={styles.pizzaTitle}>
        🍕 {name}
        {variants.every(v => v.outOfStock) && (
          <span className={styles.oosBadge}>Out&nbsp;of&nbsp;Stock</span>
        )}
      </h3>

      <p className={styles.pizzaIngredients}>
        <strong>Ingredients:</strong> {ingredients}
      </p>

      <ul className={styles.pizzaList}>
        {variants.map(pizza => {
          const qty = cart.find(c => c.pizza.pizzaId === pizza.pizzaId)?.quantity ?? 0;
          return (
            <li key={pizza.pizzaId} className={styles.pizzaVariant}>
              {pizza.size} — ${pizza.price}
              {pizza.outOfStock ? (
                <span className={styles.oosText}>Out&nbsp;of&nbsp;Stock</span>
              ) : qty === 0 ? (
                <button className={styles.addButton} onClick={() => addToCart(pizza)}>
                  Add
                </button>
              ) : (
                <span className={styles.qtyControls}>
                  <button onClick={() => decrement(pizza.pizzaId)}>-</button>
                  <span className={styles.qty}>{qty}</span>
                  <button onClick={() => addToCart(pizza)}>+</button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
