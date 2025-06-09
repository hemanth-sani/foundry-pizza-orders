import client from "../client";
import {
  HemanthPizzaRecipe,
  HemanthInventoryUsage,
  updatableInventory
} from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

// This function updates inventory for a given pizza type and quantity
export async function updateInventory(pizzaTypeId?: string, quantity: number = 1) {
 
  if (!pizzaTypeId) {
    return { success: false, reason: "Missing pizzaTypeId" };
  }

  // Step 1: Get all recipes for this pizza type
  const recipeLines: Osdk.Instance<HemanthPizzaRecipe>[] = [];
 
  for await (const recipe of client(HemanthPizzaRecipe).asyncIter()) {
  
    if (recipe.pizzaTypeId === pizzaTypeId) {
      recipeLines.push(recipe);
    }
  }


  if (recipeLines.length === 0) {
    return { success: false, reason: "No recipe found for this pizza type." };
  }

  // Step 2: Check if all ingredients are available in required quantity
  for (const recipe of recipeLines) {
    const ingredientId = recipe.inventoryId;
    const requiredQty = (recipe.quantityRequired ?? 0) * quantity;
    
    if (!ingredientId) {
      return { success: false, reason: "Missing inventoryId in recipe." };
    }

    const ingredient = await client(HemanthInventoryUsage).fetchOne(ingredientId);
    const availableQty = ingredient.currentQuantity ?? 0;
   
    if (availableQty < requiredQty) {
      return {
        success: false,
        reason: `${ingredient.ingredients ?? "Ingredient"} is insufficient.`,
      };
    }
   
  }

  // Step 3: Deduct quantities for each ingredient and update
  for (const recipe of recipeLines) {
    const ingredient = await client(HemanthInventoryUsage).fetchOne(recipe.inventoryId!);
    const usedQty = (recipe.quantityRequired ?? 0) * quantity;
    const newQty = (ingredient.currentQuantity ?? 0) - usedQty;

    await client(updatableInventory).applyAction({
      "hemanth_inventory_usage-151d57": recipe.inventoryId!,
      current_quantity: newQty,
      restock_quantity: ingredient.restockQuantity ?? 0,
      reorder_threshold: ingredient.reorderThreshold ?? 0,
    });
  }

  return { success: true };
}
