import client from "../client";
import {
  HemanthInventoryUsage,
  HemanthPizzaRecipe,
  updatableInventory,
} from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

export async function updateInventory(pizzaTypeId?: string, quantity: number = 1) {
  if (!pizzaTypeId) {
    return { success: false, reason: "Pizza Type ID is required." };
  }

  const pizzaRecipes: Osdk.Instance<HemanthPizzaRecipe>[] = [];
  let count = 0;
  const limit = 50;

  for await (const recipe of client(HemanthPizzaRecipe).asyncIter()) {
    if (recipe.pizzaTypeId === pizzaTypeId) {
      pizzaRecipes.push(recipe);
      count++;
      if (count >= limit) break;
    }
  }

  if (pizzaRecipes.length === 0) {
    return { success: false, reason: "No recipe found for given pizza." };
  }

  for (const r of pizzaRecipes) {
    if (!r.inventoryId) {
      return { success: false, reason: "Missing inventoryId in recipe." };
    }

    const ingredient = await client(HemanthInventoryUsage).fetchOne(r.inventoryId);
    const currentQty = ingredient.currentQuantity ?? 0;
    const requiredQty = (r.quantityRequired ?? 0) * quantity;

    if (currentQty < requiredQty) {
      return {
        success: false,
        reason: `${ingredient.ingredients ?? "Ingredient"} is insufficient.`,
      };
    }
  }

  for (const r of pizzaRecipes) {
    const ingredient = await client(HemanthInventoryUsage).fetchOne(r.inventoryId!);
    const updatedQty = (ingredient.currentQuantity ?? 0) - ((r.quantityRequired ?? 0) * quantity);

    await client(updatableInventory).applyAction({
      "hemanth_inventory_usage-151d57": r.inventoryId!,
      current_quantity: updatedQty,
      restock_quantity: ingredient.restockQuantity ?? 0,
      reorder_threshold: ingredient.reorderThreshold ?? 0,
    });
  }

  return { success: true };
}
