import useSWR from "swr";
import { useCallback } from "react";
import client from "../client";
import { HemanthOrder } from "@pizza-ordering-application/sdk";
import { Osdk, isOk } from "@osdk/client";

export default function useOrders() {
  const { data, isLoading, error, mutate } = useSWR("orders", async () => {
    const result = await client(HemanthOrder).fetchPageWithErrors({ $pageSize: 30 });
    return isOk(result) ? result.value.data : [];
  });

  const fetchOrderItems = useCallback(
    async (order: Osdk.Instance<HemanthOrder>) => {
      const result = await order.$link.hemanthOrderItems.fetchPageWithErrors({ $pageSize: 30 });
      return isOk(result) ? result.value.data : [];
    },
    []
  );

  return {
    orders: data,
    isLoading,
    isError: error,
    fetchOrderItems,
    refreshOrders: mutate,
  };
}
