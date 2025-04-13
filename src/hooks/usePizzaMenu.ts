import useSWR from "swr";
import client from "../client";
import { HemanthPizza } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

export default function usePizzaMenu() {
  const { data, error, isLoading } = useSWR<Osdk.Instance<HemanthPizza>[]>("pizzaMenu", async () => {
    const page = await client(HemanthPizza).fetchPage({ $pageSize: 50 });
    return page.data;
  });

  return { pizzas: data, isLoading, isError: error };
}
