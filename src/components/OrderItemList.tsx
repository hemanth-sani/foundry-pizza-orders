import styles from "./OrderItemList.module.css";
import { HemanthOrderDetails } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

interface Props {
  items: Osdk.Instance<HemanthOrderDetails>[];
}

export default function OrderItemList({ items }: Props) {
  if (!items || items.length === 0) {
    return <p>No items to show.</p>;
  }

  return (
    <div className={styles.orderItemsWrapper}>
      <h4 className={styles.orderItemsTitle}>🧾 Order Items</h4>
      <ul className={styles.orderItemList}>
        {items.map((item) => (
          <li key={item.orderDetailsId} className={styles.orderItem}>
            🍕 <strong>Pizza ID:</strong> {item.pizzaId} &nbsp;<br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Qty:</strong> {item.quantity} <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Total:</strong> ${(item.price ?? 0) * (item.quantity ?? 0)}
          </li>
        ))}
      </ul>
    </div>
  );
}
