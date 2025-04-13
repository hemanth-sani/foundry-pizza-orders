import { HemanthPizza } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

interface Props {
  pizza: Osdk.Instance<HemanthPizza>; 
  onAdd: (id: string) => void;
}

export default function PizzaCard({ pizza, onAdd }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>{pizza.name}</h3>
      <p>Size: {pizza.size}</p>
      <p>Category: {pizza.category}</p>
      
      <button onClick={() => onAdd(pizza.pizzaId)}>Add to Order</button>
    </div>
  );
}
