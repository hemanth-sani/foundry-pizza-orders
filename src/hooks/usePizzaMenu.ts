import { useEffect, useState } from "react";
import client from "../client";
import { HemanthPizzaMenu, HemanthPizzaType } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";
import { Pizza } from "../model/CartContext";

type GroupedMenu = Record<string, Pizza[]>;

export default function usePizzaMenu() {
  const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menuItems: Osdk.Instance<HemanthPizzaMenu>[] = [];
        for await (const item of client(HemanthPizzaMenu).asyncIter()) {
          menuItems.push(item);
        }

        const typeIds = Array.from(
          new Set(menuItems.map((item) => item.pizzaTypeId).filter(Boolean))
        );

        const typeMap = new Map<string, Osdk.Instance<HemanthPizzaType>>();
        for (const typeId of typeIds) {
          const pizzaType = await client(HemanthPizzaType).fetchOne(typeId as string);
          typeMap.set(typeId as string, pizzaType);
        }

        const grouped: GroupedMenu = {};
        menuItems.forEach((item) => {
          const type = typeMap.get(item.pizzaTypeId || "undefined");
          const pizza: Pizza = {
            pizzaId: item.pizzaId,
            pizzaTypeId: item.pizzaTypeId || "undefined" ,
            name: type?.name || "Unnamed Pizza",
            ingredients: type?.ingredients || "No ingredients",
            size: item.size || "undefined",
            price: item.price || 0,
          };

          if (!grouped[pizza.name]) grouped[pizza.name] = [];
          grouped[pizza.name].push(pizza);
        });

        setGroupedMenu(grouped);
      } catch (err) {
        console.error("Error loading pizza menu", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  return { groupedMenu, isLoading, isError };
}
