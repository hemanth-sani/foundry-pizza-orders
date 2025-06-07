import client from "../client";
import {
  createHemanthOrderStatus,
  createHemanthOrderDetails
} from "@pizza-ordering-application/sdk";
import { updateInventory } from "./useInventoryUpdate";
import { CartItem } from "../model/CartContext";

export async function placeOrder(cart: CartItem[]) {
  if (!cart.length) {
    return {
      orderStatus: "denied",
      orderId: "N/A",
      denialReason: "Cart is empty",
    };
  }

  const orderId = crypto.randomUUID();
  let orderStatus: "fulfilled" | "denied" = "fulfilled";
  let denialReason: string | null = null;

  try {
    for (const { pizza, quantity } of cart) {
      const result = await updateInventory(pizza.pizzaTypeId, quantity);
      if (!result.success) {
        orderStatus = "denied";
        denialReason = result.reason ?? null;
        break;
      }
    }

    // 🚨 Important: Ensure this object uses the correct schema keys as per your Ontology action
    await client(createHemanthOrderStatus).applyAction({
      order_id: orderId,
      order_time: new Date().toISOString(),
      order_status: orderStatus,
      denial_reason: denialReason ?? "",
    });

    if (orderStatus === "fulfilled") {
      for (const { pizza, quantity } of cart) {
        if (pizza.price === undefined) {
          console.error("Pizza price is undefined");
          continue;
        }

        const totalPrice = pizza.price * quantity;
        const cost = (totalPrice * 0.6).toFixed(2);
        const profit = (totalPrice * 0.4).toFixed(2);

        await client(createHemanthOrderDetails).applyAction({
          order_id: orderId,
          pizza_id: pizza.pizzaId,
          quantity,
          price: pizza.price,
          cost,
          profit,
        });
      }
    }

    return { orderId, orderStatus, denialReason };
  } catch (err) {
    console.error("🔥 placeOrder failed:", err);
    return {
      orderStatus: "denied",
      orderId: "N/A",
      denialReason: "Unhandled error during order placement",
    };
  }
}
