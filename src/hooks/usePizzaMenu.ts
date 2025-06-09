import { useEffect, useState } from "react";
import client from "../client";

import {
  HemanthPizzaMenu,
  HemanthPizzaType,
  HemanthPizzaRecipe,
  HemanthInventoryUsage,
} from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";
import { Pizza } from "../model/CartContext";

type GroupedMenu = Record<string, Pizza[]>;

export default function usePizzaMenu() {
  const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        /* ───────── 1. Load all Pizza-Menu rows ───────── */
        const menuRows: Osdk.Instance<HemanthPizzaMenu>[] = [];
        for await (const row of client(HemanthPizzaMenu).asyncIter()) {
          menuRows.push(row);
        }

        /* ───────── 2. Fetch PizzaType objects ───────── */
        const typeMap = new Map<string, Osdk.Instance<HemanthPizzaType>>();
        const typeIds = Array.from(new Set(menuRows.map(r => r.pizzaTypeId))) as string[];
        for (const id of typeIds) {
          try {
            const t = await client(HemanthPizzaType).fetchOne(id);
            typeMap.set(id, t);
          } catch (e) {
            console.warn("Missing PizzaType", id, e);
          }
        }

        /* ───────── 3. Build low-stock lookup ───────── */
        const lowSet = new Set<string>(); // inventoryIds that are below threshold
        const recipesByType: Record<string, Osdk.Instance<HemanthPizzaRecipe>[]> = {};

        // a) collect recipe lines
        for await (const rec of client(HemanthPizzaRecipe).asyncIter()) {
          (recipesByType[rec.pizzaTypeId || "undefined" ] ??= []).push(rec);
        }

        // b) check inventory for each recipe line
        for (const lines of Object.values(recipesByType)) {
          for (const line of lines) {
            try {
              const ing = await client(HemanthInventoryUsage).fetchOne(line.inventoryId || "undefined" );
              if ((ing.currentQuantity ?? 0) < (ing.reorderThreshold ?? 0)) {
                lowSet.add(line.inventoryId || "undefined" );
              }
            } catch (e) {
              console.warn("Missing InventoryUsage", line.inventoryId, e);
            }
          }
        }

        /* ───────── 4. Group into final Pizza objects ───────── */
        const grouped: GroupedMenu = {};
        for (const row of menuRows) {
          const type = typeMap.get(row.pizzaTypeId || "undefined" );

          const recipeLines = recipesByType[row.pizzaTypeId || "undefined" ] ?? [];
          const outOfStock = recipeLines.some(l => lowSet.has(l.inventoryId || "undefined" ));

          const pizza: Pizza = {
            pizzaId: row.pizzaId || "undefined" ,
            pizzaTypeId: row.pizzaTypeId || "undefined" ,
            name: type?.name ?? "Unknown",
            ingredients: type?.ingredients ?? "—",
            size: row.size ?? "N/A",
            price: row.price ?? 0,
            outOfStock,
            cost: row.cost ?? 0,
          };

          (grouped[pizza.name] ??= []).push(pizza);
        }

        setGroupedMenu(grouped);
      } catch (fatal) {
        console.error("Fatal error building menu", fatal);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { groupedMenu, isLoading, isError };
}

// import { useEffect, useState } from "react";
// import client from "../client";
// import {
//   HemanthPizzaMenu,
//   HemanthPizzaType,
// } from "@pizza-ordering-application/sdk";
// import { Osdk } from "@osdk/client";
// import { Pizza } from "../model/CartContext";

// type GroupedMenu = Record<string, Pizza[]>;

// export default function usePizzaMenu() {
//   const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         /* 1️⃣  Load every Pizza-Menu row */
//         const menuRows: Osdk.Instance<HemanthPizzaMenu>[] = [];
//         for await (const row of client(HemanthPizzaMenu).asyncIter()) {
//           menuRows.push(row);
//         }

//         /* 2️⃣  Collect unique pizza__type_id values */
//         const typeIds = Array.from(
//           new Set(menuRows.map((r) => r.pizzaTypeId).filter(Boolean))
//         );

//         /* 3️⃣  Fetch the matching Pizza-Type objects */
//         const typeMap = new Map<string, Osdk.Instance<HemanthPizzaType>>();
//         for (const tId of typeIds) {
//           try {
//             const t = await client(HemanthPizzaType).fetchOne(tId as string);
//             typeMap.set(tId as string, t);
//           } catch (e) {
//             console.warn("Missing PizzaType", tId);
//           }
//         }

//         /* 4️⃣  Build grouped structure <name → array of Pizza variants> */
//         const grouped: GroupedMenu = {};
//         for (const row of menuRows) {
//           const type = typeMap.get(row.pizzaTypeId || "undefined" );
//           const pizza: Pizza = {
//             pizzaId: row.pizzaId,
//             pizzaTypeId: row.pizzaTypeId || "undefined" ,
//             name: type?.name ?? "Unnamed Pizza",
//             ingredients: type?.ingredients ?? "No ingredients",
//             size: row.size ?? "N/A",
//             price: row.price ?? 0,
//           };

//           if (!grouped[pizza.name]) grouped[pizza.name] = [];
//           grouped[pizza.name].push(pizza);
//         }

//         setGroupedMenu(grouped);
//       } catch (err) {
//         console.error("❌ Error loading pizza menu", err);
//         setIsError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   return { groupedMenu, isLoading, isError };
// }
