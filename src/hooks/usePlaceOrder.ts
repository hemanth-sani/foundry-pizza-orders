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
  let createdOrderId: string | number | null = null;

  try {
    for (const { pizza, quantity } of cart) {
      console.log(pizza.pizzaTypeId, quantity)
      const result = await updateInventory(pizza.pizzaTypeId, quantity);
      
      if (!result.success) {
        orderStatus = "denied";
        
        denialReason = result.reason ?? null;
        break;
      }
    }

    // 🚨 Important: Ensure this object uses the correct schema keys as per your Ontology action
    console.log(orderId,orderStatus,denialReason)
    try {
      const result = await client(createHemanthOrderStatus).applyAction({
        order_status: orderStatus,
        order_time: new Date().toISOString(),
        denial_reason: denialReason ?? "",
      }, {
        $returnEdits: true // Return the created object with its generated primary key
      });
     
    
      
      if (result && result.type === "edits") {
        // Get the primary key of the first added object
        createdOrderId = result.addedObjects[0].primaryKey as string | number;
      }
    } catch (error) {
      console.error("Failed to create order status:", error);
    }

    console.log("hello",cart)
    if (orderStatus === "fulfilled" && createdOrderId) {
      for (const { pizza, quantity } of cart) {
        if (pizza.price === undefined) {
          console.error("Pizza price is undefined");
          continue;
        }

        const totalPrice = pizza.price * quantity;
        const cost = (totalPrice * 0.6).toFixed(2);
        const profit = (totalPrice * 0.4).toFixed(2);
        
        await client(createHemanthOrderDetails).applyAction({
          order_id: createdOrderId as string,
          pizza_id: pizza.pizzaId,
          quantity,
          price: pizza.price,
          cost,
          profit,
        });
      
    }
    }

    return { createdOrderId, orderStatus, denialReason };
  } catch (err) {
    console.error("🔥 placeOrder failed:", err);
    return {
      orderStatus: "denied",
      orderId: "N/A",
      denialReason: "Unhandled error during order placement",
    };
  }
}
