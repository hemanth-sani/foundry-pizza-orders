import { HemanthOrderItem } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

interface Props {
  items: Osdk.Instance<HemanthOrderItem>[];
}

export default function OrderItemList({ items }: Props) {
  if (!items || items.length === 0) {
    return <p>No items to show.</p>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <h4>🧾 Order Items</h4>
      <ul>
        {items.map((item) => (
          <li key={item.orderAndPizzaId}>
            🍕 Pizza ID: <strong>{item.pizzaId}</strong> — Qty: {item.quantity} — 💰 ${item.totalRevenue}
          </li>
        ))}
      </ul>
    </div>
  );
}
