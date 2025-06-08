import { useCart } from "../hooks/useCart";
import { Pizza } from "../model/CartContext";
import styles from "./PizzaMenu.module.css";

interface Props {
  name: string;
  variants: Pizza[];
}

export default function PizzaCard({ name, variants }: Props) {
  const { addToCart } = useCart();
  const ingredients = variants[0].ingredients;

  return (
    <div className={styles.pizzaCard}>
      <h3 className={styles.pizzaTitle}>🍕 {name}</h3>
      <p className={styles.pizzaIngredients}>
        <strong>Ingredients:</strong> {ingredients}
      </p>

      <ul className={styles.pizzaList}>
        {variants.map((pizza) => (
          <li key={pizza.pizzaId} className={styles.pizzaVariant}>
            {pizza.size} — ${pizza.price}
            <button
              className={styles.addButton}
              onClick={() => addToCart(pizza)}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
