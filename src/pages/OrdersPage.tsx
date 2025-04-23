import  { useState } from "react";
import useOrders from "../hooks/useOrders";
import Layout from "../Layout";
import OrderItemList from "../components/OrderItemList";
import { Osdk } from "@osdk/client";
import { HemanthOrder, HemanthOrderItem } from "@pizza-ordering-application/sdk";

export default function OrdersPage() {
  const { orders, isLoading, fetchOrderItems } = useOrders();

  // Stores items per orderId
  const [itemsByOrder, setItemsByOrder] = useState<Record<
    string,
    Osdk.Instance<HemanthOrderItem>[]
  >>({});

  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  const handleViewItems = async (order: Osdk.Instance<HemanthOrder>) => {
    const orderId = order.orderId?.toString() ?? "unknown";

    // If already loaded, just toggle visibility
    if (itemsByOrder[orderId]) {
      setExpandedOrderIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(orderId)) newSet.delete(orderId);
        else newSet.add(orderId);
        return newSet;
      });
      return;
    }

    // Fetch and store
    const items = await fetchOrderItems(order);
    setItemsByOrder((prev) => ({
      ...prev,
      [orderId]: items,
    }));
    setExpandedOrderIds((prev) => new Set(prev).add(orderId));
  };

  return (
    <Layout>
      <h2>🧾 All Orders</h2>
      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          {orders?.map((order) => {
            const orderId = order.orderId?.toString() ?? "unknown";
            return (
              <div key={orderId} style={{ marginBottom: "1.5rem" }}>
                <strong>Order #{order.orderId}</strong> — {order.ordeDate}
                <br />
                <button onClick={() => handleViewItems(order)}>
                  {expandedOrderIds.has(orderId) ? "Hide Items" : "View Items"}
                </button>

                {expandedOrderIds.has(orderId) && itemsByOrder[orderId] && (
                  <OrderItemList items={itemsByOrder[orderId]} />
                )}
              </div>
            );
          })}
        </>
      )}
    </Layout>
  );
}
