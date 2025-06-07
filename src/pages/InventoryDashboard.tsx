import { useEffect, useState } from "react";
import client from "../client";
import Layout from "../Layout";
import { HemanthInventoryUsage, updatableInventory } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";
import styles from "./InventoryDashboard.module.css";

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState<Osdk.Instance<HemanthInventoryUsage>[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      const items: Osdk.Instance<HemanthInventoryUsage>[] = [];
      for await (const item of client(HemanthInventoryUsage).asyncIter()) {
        items.push(item);
      }
      setInventory(items);
    };

    fetchInventory().catch(console.error);
  }, []);

  const handleRestock = async (item: Osdk.Instance<HemanthInventoryUsage>) => {
    const updatedQty = (item.currentQuantity ?? 0) + (item.restockQuantity ?? 0);

    await client(updatableInventory).applyAction({
      "hemanth_inventory_usage-151d57": item.inventoryId!,
      current_quantity: updatedQty,
      restock_quantity: item.restockQuantity ?? 0,
      reorder_threshold: item.reorderThreshold ?? 0,
    });

    // Refresh inventory
    const items: Osdk.Instance<HemanthInventoryUsage>[] = [];
    for await (const i of client(HemanthInventoryUsage).asyncIter()) {
      items.push(i);
    }
    setInventory(items);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h2>📦 Inventory Dashboard</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Reorder Threshold</th>
              <th>Restock Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const lowStock =
                (item.currentQuantity ?? 0) < (item.reorderThreshold ?? 0);

              return (
                <tr
                  key={item.inventoryId}
                  className={lowStock ? styles.lowStock : ""}
                >
                  <td>{item.ingredients}</td>
                  <td>{item.currentQuantity}</td>
                  <td>{item.units}</td>
                  <td>{item.reorderThreshold}</td>
                  <td>{item.restockQuantity}</td>
                  <td>
                    {lowStock && (
                      <button
                        className={styles.button}
                        onClick={() => handleRestock(item)}
                      >
                        Restock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
