import { useEffect, useState } from "react";
import Layout from "../Layout";
import client from "../client";
import {
  HemanthInventoryUsage,
  updatableInventory,
} from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";
import css from "./InventoryDashboard.module.css";
import { useNavigate } from "react-router-dom";

type Inv = Osdk.Instance<HemanthInventoryUsage>;

export default function InventoryDashboard() {
  const [rows, setRows] = useState<Inv[]>([]);
  const [editing, setEditing] = useState<Record<string, Partial<Inv>>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const nav = useNavigate();

  /* ── load once ──────────────────────────── */
  useEffect(() => {
    (async () => {
      const list: Inv[] = [];
      for await (const r of client(HemanthInventoryUsage).asyncIter()) list.push(r);
      setRows(list);
    })().catch(console.error);
  }, []);

  /* ── helpers ────────────────────────────── */
  const low = (r: Inv) => (r.currentQuantity ?? 0) < (r.reorderThreshold ?? 0);

  const startEdit = (r: Inv) =>
    setEditing({
      ...editing,
      [r.inventoryId]: {
        currentQuantity: r.currentQuantity,
        reorderThreshold: r.reorderThreshold,
        restockQuantity: r.restockQuantity,
      },
    });

    const cancel = (id: string) =>
      setEditing(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

  const onChange = (
    id: string,
    field: "currentQuantity" | "reorderThreshold" | "restockQuantity",
    val: string
  ) =>
    setEditing((e) => ({
      ...e,
      [id]: { ...e[id], [field]: Number(val) },
    }));

  const saveLine = async (r: Inv) => {
    const draft = editing[r.inventoryId];
    if (!draft) return;

    setSaving(r.inventoryId);
    try {
      await client(updatableInventory).applyAction({
        "hemanth_inventory_usage-151d57": r.inventoryId,
        current_quantity: draft.currentQuantity  ?? 0,
        reorder_threshold: draft.reorderThreshold  ?? 0,
        restock_quantity: draft.restockQuantity  ?? 0,
      });

      setRows((prev) =>
        prev.map((row) =>
          row.inventoryId === r.inventoryId
            ? ({
                ...row,
                currentQuantity: draft.currentQuantity,
                reorderThreshold: draft.reorderThreshold,
                restockQuantity: draft.restockQuantity,
              } as Inv)
            : row
        )
      );
      cancel(r.inventoryId);
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed – see console.");
    } finally {
      setSaving(null);
    }
  };

  const restockNow = async (r: Inv) => {
    const newQty = (r.currentQuantity ?? 0) + (r.restockQuantity ?? 0);
    setSaving(r.inventoryId);
    try {
      await client(updatableInventory).applyAction({
        "hemanth_inventory_usage-151d57": r.inventoryId,
        current_quantity: newQty,
        restock_quantity: r.restockQuantity ?? 0,
        reorder_threshold: r.reorderThreshold ?? 0,
      });
      setRows((prev) =>
        prev.map((row) =>
          row.inventoryId === r.inventoryId
            ? ({ ...row, currentQuantity: newQty } as Inv)
            : row
        )
      );
    } finally {
      setSaving(null);
    }
  };

  /* ── view ───────────────────────────────── */
  return (
    <Layout>
      <h2>📦 Inventory</h2>

      <table className={css.table}>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Threshold</th>
            <th>Restock</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const edit = editing[r.inventoryId];
            const disabled = saving === r.inventoryId;

            return (
              <tr key={r.inventoryId} className={low(r) ? css.low : ""}>
                <td>{r.ingredients}</td>

                {/* Quantity */}
                <td>
                  {edit ? (
                    <input
                      type="number"
                      value={edit.currentQuantity ?? ""}
                      onChange={(e) =>
                        onChange(r.inventoryId, "currentQuantity", e.target.value)
                      }
                      disabled={disabled}
                    />
                  ) : (
                    <span className={css.chip}>{r.currentQuantity}</span>
                  )}
                </td>

                <td>{r.units}</td>

                {/* Threshold */}
                <td>
                  {edit ? (
                    <input
                      type="number"
                      value={edit.reorderThreshold ?? ""}
                      onChange={(e) =>
                        onChange(r.inventoryId, "reorderThreshold", e.target.value)
                      }
                      disabled={disabled}
                    />
                  ) : (
                    <span className={css.chip}>{r.reorderThreshold}</span>
                  )}
                </td>

                {/* Restock */}
                <td>
                  {edit ? (
                    <input
                      type="number"
                      value={edit.restockQuantity ?? ""}
                      onChange={(e) =>
                        onChange(r.inventoryId, "restockQuantity", e.target.value)
                      }
                      disabled={disabled}
                    />
                  ) : (
                    <span className={css.chip}>{r.restockQuantity}</span>
                  )}
                </td>

                {/* Action buttons */}
                <td>
                  {edit ? (
                    <>
                      <button
                        className={css.save}
                        disabled={disabled}
                        onClick={() => saveLine(r)}
                      >
                        {disabled ? "Saving…" : "Save"}
                      </button>
                      <button
                        className={css.cancel}
                        disabled={disabled}
                        onClick={() => cancel(r.inventoryId)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className={css.edit} onClick={() => startEdit(r)}>
                        ✎ Edit
                      </button>
                      {low(r) && (
                        <>
                          <button className={css.restock} onClick={() => restockNow(r)}>
                            ↻ Auto Restock
                          </button>
                          <button className={css.order} onClick={() => nav(`/suppliers?ingredient=${encodeURIComponent(r.ingredients || "undefined")}`)}>
                            📦 Order
                          </button>
                        </>
                      )}

                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
}
