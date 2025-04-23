import { HemanthBestSellingPizza } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";
import { useCart } from "../hooks/useCart";
import styles from "./PizzaMenu.module.css";

interface Props {
  name: string;
  variants: Osdk.Instance<HemanthBestSellingPizza>[];
}

export default function PizzaCard({ name, variants }: Props) {
  const { addToCart } = useCart();
  const ingredients = variants[0]?.ingredients ?? "Not listed";

  return (
    <div className={styles.pizzaCard}>
      <h3 className={styles.pizzaTitle}>🍕 {name}</h3>
      <p className={styles.pizzaIngredients}>
        <strong>Ingredients:</strong> {ingredients}
      </p>

      <ul className={styles.pizzaList}>
        {variants.map((variant) => (
          <li key={variant.pizzaId} className={styles.pizzaVariant}>
            {variant.size} — ${variant.price}
            <button
              className={styles.addButton}
              onClick={() => addToCart(variant)}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
