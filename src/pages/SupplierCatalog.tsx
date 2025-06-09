import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../Layout";
import client from "../client";
import { HemanthIngredientSupplierList } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";
import css from "./SupplierCatalog.module.css";

export default function SupplierCatalog() {
  const [params] = useSearchParams();
  const filter = params.get("ingredient");     // optional filter
  const [rows, setRows] = useState<Osdk.Instance<HemanthIngredientSupplierList>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list: Osdk.Instance<HemanthIngredientSupplierList>[] = [];
      for await (const s of client(HemanthIngredientSupplierList).asyncIter()) {
        if (!filter || s.ingredientsName === filter) list.push(s);
      }
      setRows(list);
      setLoading(false);
    })().catch(console.error);
  }, [filter]);

  return (
    <Layout>
      <h2>🚚 Suppliers {filter && <>for <em>{filter}</em></>}</h2>
      {loading ? <p>Loading…</p> : (
        <table className={css.table}>
          <thead>
            <tr>
              <th>Supplier</th><th>Ingredient</th><th>Unit Q-ty</th><th>Order</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.supplerId}>
                <td>{r.supplier}</td>
                <td>{r.ingredientsName}</td>
                <td>{r.quantity} {r.units}</td>
                <td>
                  <button className={css.order}>Place&nbsp;Order</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
