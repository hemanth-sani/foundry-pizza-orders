import usePizzaMenu from "../hooks/usePizzaMenu";
import PizzaCard from "../components/PizzaCard";
import Layout from "../Layout";

export default function PizzaMenu() {
  const { pizzas, isLoading } = usePizzaMenu();

  const handleAdd = (pizzaId: string) => {
    alert(`Add pizza ${pizzaId} to an order`);
  };

  return (
    <Layout>
      <h2>🍕 Full Pizza Menu</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {pizzas?.map((pizza) => (
            <PizzaCard key={pizza.pizzaId} pizza={pizza} onAdd={handleAdd} />
          ))}
        </div>
      )}
    </Layout>
  );
}
