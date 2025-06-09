import client from "../client";
import {
  createHemanthOrderStatus,
  createHemanthOrderDetails,
} from "@pizza-ordering-application/sdk";
import { updateInventory } from "./useInventoryUpdate";
import { CartItem } from "../model/CartContext";

export async function placeOrder(cart: CartItem[]) {
  if (cart.length === 0) {
    return {
      orderStatus: "denied",
      orderId: "N/A",
      denialReason: "Cart is empty",
    };
  }

  let orderStatus: "fulfilled" | "denied" = "fulfilled";
  let denialReason: string | null = null;
  let createdOrderId: string | number | null = null;

  /* 1️⃣  Inventory check */
  for (const { pizza, quantity } of cart) {
    console.log(pizza, quantity);
    const ok = await updateInventory(pizza.pizzaTypeId, quantity);
    console.log(ok);
    if (!ok.success) {
      orderStatus = "denied";
      denialReason = ok.reason ?? null;
      break;
    }
  }

  /* 2️⃣  Create OrderStatus row */
  const statusRes = await client(createHemanthOrderStatus).applyAction(
    {
      order_status: orderStatus,
      order_time: new Date().toISOString(),
      denial_reason: denialReason ?? "",
    },
    { $returnEdits: true }
  );
  if (statusRes.type === "edits")
    createdOrderId = statusRes.addedObjects[0].primaryKey as string | number;

  /* 3️⃣  If fulfilled, create OrderDetails lines */
  if (orderStatus === "fulfilled" && createdOrderId) {
    console.log(createdOrderId);
    for (const { pizza, quantity } of cart) {
      const unitCost = pizza.cost ?? 0; // field from PizzaMenu
      const cost   = unitCost * quantity;
      const revenue = pizza.price * quantity;
      const profit = revenue - cost;

      const actionParams = {
        order_id: createdOrderId as string,
        pizza_id: pizza.pizzaId,
        quantity: Number(quantity),
        price: Number(pizza.price),
        cost: cost.toFixed(2),
        profit: profit.toFixed(2)
      };
      
     
      await client(HemanthCreateOrderDetails).applyAction({
        order_id: createdOrderId as string,
        pizza_id: pizza.pizzaId,
        quantity: quantity || 0,
        price: pizza.price || 0,
        cost: cost.toFixed(2) ,
        profit: profit.toFixed(2),
      });
    }
  }
  console.log("after",createdOrderId);
  return { createdOrderId, orderStatus, denialReason };
}
