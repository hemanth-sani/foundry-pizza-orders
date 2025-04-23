import useSWR from "swr";
import client from "../client";
import { HemanthBestSellingPizza } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

export default function usePizzaMenu() {
  const { data, error, isLoading } = useSWR<Osdk.Instance<HemanthBestSellingPizza>[]>("pizzaMenu", async () => {
    const page = await client(HemanthBestSellingPizza).fetchPage({ 
      $orderBy: { totalRevenue: "desc" },
      $pageSize: 50 
    });
    return page.data;
  });

  return { pizzas: data, isLoading, isError: error };
}
