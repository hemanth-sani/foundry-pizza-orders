import Layout from "./Layout";
import { useState } from "react";
import usePizzaMenu from "./hooks/usePizzaMenu";
import useOrders from "./hooks/useOrders";
import OrderItemList from "./components/OrderItemList";
import { Osdk } from "@osdk/client";
import { HemanthOrder, HemanthOrderItem } from "@pizza-ordering-application/sdk";

export default function Home() {
  const { pizzas, isLoading: pizzaLoading } = usePizzaMenu();
  const { orders, isLoading: orderLoading, fetchOrderItems } = useOrders();
  const [items, setItems] = useState<Osdk.Instance<HemanthOrderItem>[]>([]);

  const handleViewItems = async (order: Osdk.Instance<HemanthOrder>) => {
    const result = await fetchOrderItems(order);
    setItems(result);
  };
  return (
    <Layout>
      <h1>🍕 Plato’s Pizza Dashboard</h1>

      <section>
        <h2>Top 3 Pizzas</h2>
        {pizzaLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {pizzas?.slice(0, 3).map((pizza) => (
              <li key={pizza.pizzaId}>
                {pizza.name} — {pizza.size} 
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Recent Orders</h2>
        {orderLoading ? (
          <p>Loading orders...</p>
        ) : (
          <>
            {orders?.slice(0, 3).map((order) => (
              <div key={order.orderId}>
                <strong>Order #{order.orderId}</strong> — {order.ordeDate}
                <br />
                <button onClick={() => handleViewItems(order)}>View Items</button>
              </div>
            ))}
            <OrderItemList items={items} />
          </>
        )}
      </section>
    </Layout>
  );
}

