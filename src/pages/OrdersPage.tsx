import  { useState } from "react";
import useOrders from "../hooks/useOrders";
import Layout from "../Layout";
import OrderItemList from "../components/OrderItemList";
import { Osdk } from "@osdk/client";
import { HemanthOrder, HemanthOrderItem } from "@pizza-ordering-application/sdk";

export default function OrdersPage() {
  const { orders, isLoading, fetchOrderItems } = useOrders();
  const [items, setItems] = useState<Osdk.Instance<HemanthOrderItem>[]>([]);

  const handleViewItems = async (order: Osdk.Instance<HemanthOrder>) => {
    const result = await fetchOrderItems(order);
    setItems(result);
  };

  return (
    <Layout>
      <h2>🧾 All Orders</h2>
      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          {orders?.map((order) => (
            <div key={order.orderId} style={{ marginBottom: "1rem" }}>
              <strong>Order #{order.orderId}</strong> — {order.ordeDate}
              <br />
              <button onClick={() => handleViewItems(order)}>View Items</button>
            </div>
          ))}

       
          <OrderItemList items={items} />
        </>
      )}
    </Layout>
  );
}
