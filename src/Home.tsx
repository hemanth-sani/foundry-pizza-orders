import Layout from "./Layout";
import { useEffect, useState } from "react";

import useOrders from "./hooks/useOrders";
import OrderItemList from "./components/OrderItemList";
import { Osdk } from "@osdk/client";
import { HemanthOrderStatus, HemanthOrderDetails, HemanthBestSellingPizza } from "@pizza-ordering-application/sdk";
import css from "./Home.module.css";
import client from "./client";

export default function Home() {
  const [bestSellingPizzas, setBestSellingPizzas] = useState<Osdk.Instance<HemanthBestSellingPizza>[]>([]);
  const [pizzaLoading, setPizzaLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pizzaError, setPizzaError] = useState(false);
  const { orders, isLoading: orderLoading, fetchOrderItems } = useOrders();
  const [items, setItems] = useState<Osdk.Instance<HemanthOrderDetails>[]>([]);

  const showItems = async (order: Osdk.Instance<HemanthOrderStatus>) => {
    const list = await fetchOrderItems(order);
    setItems(list);
  };
  useEffect(() => {
    async function loadBestSellingPizzas() {
      try {
        setPizzaLoading(true);
        
        // Fetch best selling pizzas
        const pizzas: Osdk.Instance<HemanthBestSellingPizza>[] = [];
        for await (const pizza of client(HemanthBestSellingPizza).asyncIter()) {
          pizzas.push(pizza);
        }
        
        // Sort by total revenue (descending)
        const sortedPizzas = [...pizzas].sort((a, b) => {
          return (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0);
        });
        
        setBestSellingPizzas(sortedPizzas);
        setPizzaLoading(false);
      } catch (error) {
        console.error("Failed to load best selling pizzas:", error);
        setPizzaError(true);
        setPizzaLoading(false);
      }
    }

    loadBestSellingPizzas();
  }, []);

  return (
    <Layout>
      <h1>🍕 Hemanth’s Pizza Dashboard</h1>

      <section className={css.section}>
        <h2>Top 3 Pizzas</h2>
        {pizzaLoading ? (
          <p>Loading...</p>
        ) : pizzaError ? (
          <p className={css.error}>⚠️ Failed to load best selling pizzas.</p>
        ) : (
          <ul className={css.list}>
            {bestSellingPizzas?.slice(0, 3).map((pizza) => (
              <li key={pizza.pizzaId}>
                <strong>{pizza.name}</strong> – {pizza.size} – ${pizza.price}
              </li>
            ))}
          </ul>
        )}
      </section>


      <section className={css.section}>
    <h2>Recent Orders</h2>
    {orderLoading ? (
      <p>Loading orders…</p>
    ) : (
      <>
        {orders?.slice(0, 3).map((o) => (
          <div key={o.orderId} className={css.order}>
            <strong>Order #{o.orderId}</strong> — {o.orderTime}
            <br />
            <button className={css.button} onClick={() => showItems(o)}>
              View Items
            </button>
          </div>
        ))}
        <OrderItemList items={items} />
      </>
    )}
  </section>
    </Layout>
  );
}

