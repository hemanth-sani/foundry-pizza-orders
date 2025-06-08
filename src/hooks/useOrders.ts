import useSWR from "swr";
import { useCallback } from "react";
import client from "../client";
import {
  HemanthOrderStatus,
} from "@pizza-ordering-application/sdk";
import { Osdk, isOk } from "@osdk/client";

export default function useOrders() {
  /* ------- load latest 30 order-status rows ------- */
  const { data, isLoading, error, mutate } = useSWR(
    "orders",
    async () => {
      const page = await client(HemanthOrderStatus).fetchPageWithErrors({
        $orderBy: { orderTime: "desc" },
        $pageSize: 30,
      });
      return isOk(page) ? page.value.data : [];
    }
  );

  
  const fetchOrderItems = useCallback(
    async (order: Osdk.Instance<HemanthOrderStatus>) => {
      const page = await order.$link.hemanthOrderDetails.fetchPageWithErrors({
        $pageSize: 50,
      });
      return isOk(page) ? page.value.data : [];
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
