import { useEffect, useState } from "react";
import client from "../client";
import {
  HemanthOrderDetails,

  HemanthPizzaMenu,
  HemanthPizzaType,
} from "@pizza-ordering-application/sdk";
import Layout from "../Layout";
import { Osdk } from "@osdk/client";
import css from "./StoreAnalytics.module.css";

/* ── types ──────────────────────────────── */
interface KPI { label: string; value: string; }

/* ── component ──────────────────────────── */
export default function StoreAnalytics() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);

  const [top, setTop] = useState<
    { name: string; size: string; profit: number; margin: number }[]
  >([]);

  useEffect(() => {
    (async () => {
      /* 1️⃣ Order-details rows */
      const det: Osdk.Instance<HemanthOrderDetails>[] = [];
      for await (const d of client(HemanthOrderDetails).asyncIter()) det.push(d);

      /* 2️⃣ KPI cards */
      const totCost   = det.reduce((s, d) => s + (d.cost ?? 0), 0);
      const totRev    = det.reduce((s, d) => s + (d.price ?? 0) * (d.quantity ?? 0), 0);
      const totProfit = det.reduce((s, d) => s + (d.profit ?? 0), 0);
      const margin    = totRev ? (totProfit / totRev) * 100 : 0;

      setKpis([
        { label: "Revenue", value: `$${totRev.toFixed(2)}` },
        { label: "Cost",    value: `$${totCost.toFixed(2)}` },
        { label: "Profit",  value: `$${totProfit.toFixed(2)}` },
        { label: "Margin",  value: `${margin.toFixed(1)}%` },
      ]);

    
      /* 4️⃣ Top-profit pizzas */
      const nameMap = new Map<string, { name: string; size: string }>();
      for await (const m of client(HemanthPizzaMenu).asyncIter()) {
        const t = await client(HemanthPizzaType).fetchOne(m.pizzaTypeId ?? "undefined");
        nameMap.set(m.pizzaId, { name: t.name ?? "undefined", size: m.size ?? "NA" });
      }
      const byPizza = new Map<string, { name: string; size: string; profit: number; rev: number }>();
      det.forEach((d) => {
        const meta = nameMap.get(d.pizzaId  ?? "undefined") ?? { name: "Unknown", size: "?" };
        const rec = byPizza.get(d.pizzaId ?? "undefined") ?? { ...meta, profit: 0, rev: 0 };
        rec.profit += Number(d.profit);
        rec.rev    += (d.price ?? 0) * (d.quantity ?? 0);
        byPizza.set(d.pizzaId ?? "undefined", rec);
      });
      const topRows = [...byPizza.values()]
        .map((r) => ({ ...r, margin: r.rev ? (r.profit / r.rev) * 100 : 0 }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 10);
      setTop(topRows);

      setLoading(false);
    })().catch(console.error);
  }, []);

  

  /* 6️⃣  Render */
  return (
    <Layout>
      <h2>📊 Store Analytics</h2>
      {loading ? (
        <p>Loading&nbsp;analytics…</p>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className={css.kpiGrid}>
            {kpis.map((k) => (
              <div key={k.label} className={css.kpiCard}>
                <div className={css.kpiLabel}>{k.label}</div>
                <div className={css.kpiVal}>{k.value}</div>
              </div>
            ))}
          </div>

         

          {/* TOP PIZZAS */}
          <h3 className={css.h3}>Top Profit Pizzas</h3>
          <table className={css.table}>
            <thead>
              <tr>
                <th>Pizza</th><th>Size</th>
                <th>Profit&nbsp;($)</th><th>Margin&nbsp;%</th>
              </tr>
            </thead>
            <tbody>
              {top.map((p) => (
                <tr key={p.name + p.size}>
                  <td>{p.name}</td>
                  <td>{p.size}</td>
                  <td>${p.profit.toFixed(2)}</td>
                  <td>{p.margin.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
}
