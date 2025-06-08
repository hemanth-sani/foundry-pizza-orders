import { useState } from "react";
import useOrders from "../hooks/useOrders";
import Layout from "../Layout";
import OrderItemList from "../components/OrderItemList";
import { Osdk } from "@osdk/client";
import {
  HemanthOrderStatus,
  HemanthOrderDetails,
} from "@pizza-ordering-application/sdk";
import css from "./OrderPage.module.css";

export default function OrdersPage() {
  const { orders, isLoading, isError, fetchOrderItems, refreshOrders } = useOrders();

  const [details, setDetails] = useState<
    Record<string, Osdk.Instance<HemanthOrderDetails>[]>
  >({});
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = async (order: Osdk.Instance<HemanthOrderStatus>) => {
    const id = order.orderId;
    if (open.has(id)) {
      setOpen((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }
    if (!details[id]) {
      const rows = await fetchOrderItems(order);
      setDetails((prev) => ({ ...prev, [id]: rows }));
    }
    setOpen((prev) => new Set(prev).add(id));
  };

  return (
    <Layout>
      <header className={css.header}>
        <h2>🧾 Orders</h2>
        <button onClick={() => refreshOrders()} className={css.refresh}>
          ⟳ Refresh
        </button>
      </header>

      {isLoading && <p>Loading orders…</p>}
      {isError && <p>Could not load orders.</p>}

      <div className={css.grid}>
        {orders?.map((o) => {
          const id = o.orderId;
          const isOpen = open.has(id);
          const denied = o.orderStatus === "denied";
          return (
            <article key={id} className={css.card}>
              <div
                className={css.summary}
                onClick={() => toggle(o)}
                role="button"
                tabIndex={0}
              >
                <div>
                  <strong>#{id}</strong>
                  <span className={css.time}>— {o.orderTime}</span>
                </div>

                <span
                  className={`${css.badge} ${
                    denied ? css.denied : css.fulfilled
                  }`}
                  title={denied ? o.denialReason : "Fulfilled"}
                >
                  {o.orderStatus}
                </span>
              </div>

              {isOpen && (
                <div className={css.items}>
                  <OrderItemList items={details[id] ?? []} />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </Layout>
  );
}
